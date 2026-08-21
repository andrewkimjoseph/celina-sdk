/**
 * Celo governance: on-chain proposals with optional CGP markdown metadata from GitHub,
 * LockedGold locking/unlocking, and governance voting.
 */
import { encodeFunctionData, isAddress, parseEther } from "viem";
import { CELO_CORE_CONTRACTS } from "../config/celo-core-contracts.js";
import { accountsAbi } from "../abis/accounts.js";
import { lockedGoldAbi } from "../abis/locked-gold.js";
import {
  governanceAbi,
  proposalStageName,
  voteValueToInt,
  type ProposalStageName,
  type VoteValueName,
} from "../abis/governance.js";
import type { CeloClientFactory } from "../clients/celo-client.js";
import { appendCelinaCalldataTag } from "../config/celina-tag.js";
import { CHAIN } from "../config/chains.js";
import {
  type PreparedFlow,
  type PreparedTx,
  serializePreparedFlow,
  type SerializedPreparedFlow,
} from "../types/prepared.js";
import { assertCeloAccountRegistered } from "../utils/celo-account.js";
import { formatCeloAmount } from "../utils/celo-format.js";
import {
  isGovernanceDequeueReady,
  lesserAndGreaterAfterRevokeUpvote,
  lesserAndGreaterAfterUpvote,
  proposalIdsNextToDequeue,
  type GovernanceDequeueSchedule,
  type GovernanceQueueEntry,
} from "../utils/governance-queue.js";

const STAGE_EXPIRY_MS: Partial<Record<ProposalStageName, number>> = {
  Queued: 4 * 24 * 60 * 60 * 1000,
  Approval: 24 * 60 * 60 * 1000,
  Referendum: 4 * 24 * 60 * 60 * 1000,
  Execution: 24 * 60 * 60 * 1000,
};

/** Pagination and metadata options for governance proposal lists. */
export interface GovernanceProposalsOptions {
  /** Include expired, rejected, and withdrawn proposals (default `true`). */
  includeInactive?: boolean;
  /** Fetch CGP frontmatter from GitHub (default `true`). */
  includeMetadata?: boolean;
  /** Page number (1-based); used with `pageSize` when set. */
  page?: number;
  /** Proposals per page when using `page` (1–20, default 10). */
  pageSize?: number;
  /** Zero-based offset into the proposal id list. */
  offset?: number;
  /** Max proposals when using `offset` (capped at 100). */
  limit?: number;
}

/** Options for reading governance votes cast by an address. */
export interface GovernanceVotesOptions {
  /** When set, return only votes for this proposal ID. */
  proposalId?: number;
}

/** Options for revoking a governance queue upvote. */
export interface GovernanceRevokeUpvoteOptions {
  /** When set, assert the active upvote matches this proposal ID. */
  proposalId?: number;
}

function extractCgpFromUrl(url: string): number | null {
  const match = url.match(/cgp-(\d+)/i);
  return match ? Number(match[1]) : null;
}

function parseCgpFrontmatter(content: string): Record<string, unknown> | null {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return null;

  const yaml = match[1];
  const result: Record<string, unknown> = {};
  for (const line of yaml.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value: unknown = line.slice(idx + 1).trim();
    if (typeof value === "string") {
      value = value.replace(/^["']|["']$/g, "");
    }
    result[key] = value;
  }
  return result;
}

async function fetchCgpMetadata(cgpNumber: number) {
  const url = `https://raw.githubusercontent.com/celo-org/governance/main/CGPs/cgp-${String(cgpNumber).padStart(4, "0")}.md`;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!response.ok) return null;
    const raw = await response.text();
    const frontmatter = parseCgpFrontmatter(raw);
    const content = raw.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, "");
    return { frontmatter, content };
  } catch {
    return null;
  }
}

function getExpiryTimestamp(stage: ProposalStageName, timestampMs: number) {
  const expiry = STAGE_EXPIRY_MS[stage];
  return expiry ? timestampMs + expiry : null;
}

interface RawProposal {
  id: number;
  stage: number;
  timestamp: number;
  expiryTimestamp: number | null;
  url: string;
  proposer: string;
  deposit: string;
  numTransactions: number;
  networkWeight: string;
  isApproved: boolean;
  upvotes: number;
  votes: { yes: string; no: string; abstain: string };
}

const ACTIONABLE_PROPOSAL_SCAN_LIMIT = 120;

interface ProposalSnapshot {
  stageName: ProposalStageName;
  url: string;
}

interface ActionableDiscovery {
  queueEntries: GovernanceQueueEntry[];
  dequeueEntries: Array<{ index: number; proposalId: number }>;
  snapshots: Map<number, ProposalSnapshot>;
  dequeueSchedule: GovernanceDequeueSchedule;
  dequeueReady: boolean;
  nextDequeueProposalIds: number[];
}

/** Celo on-chain governance proposal reads, CGP enrichment, and LockedGold writes. */
export class GovernanceService {
  private readonly attributionTags?: string[];

  constructor(private readonly clientFactory: CeloClientFactory) {
    this.attributionTags = clientFactory.getConfig().attributionTags;
  }

  private getClient() {
    return this.clientFactory.getClients().public;
  }

  /** Resolve vote-signer EOA to the Celo account that holds vote records. */
  private async resolveGovernanceAccount(
    address: `0x${string}`,
  ): Promise<`0x${string}`> {
    const client = this.getClient();
    const accounts = CELO_CORE_CONTRACTS.accounts;

    const isRegistered = await client.readContract({
      address: accounts,
      abi: accountsAbi,
      functionName: "isAccount",
      args: [address],
    });

    if (isRegistered) {
      return address;
    }

    try {
      const account = await client.readContract({
        address: accounts,
        abi: accountsAbi,
        functionName: "voteSignerToAccount",
        args: [address],
      });
      if (account !== "0x0000000000000000000000000000000000000000") {
        return account;
      }
    } catch {
      // Not a vote signer; use address as-is.
    }

    return address;
  }

  private async fetchProposal(
    proposalId: number,
    upvotes = 0,
    includeVotes = true,
  ): Promise<RawProposal | null> {
    const client = this.getClient();
    const address = CELO_CORE_CONTRACTS.governance;

    try {
      const [proposalData, stage, voteTotals] = await Promise.all([
        client.readContract({
          address,
          abi: governanceAbi,
          functionName: "getProposal",
          args: [BigInt(proposalId)],
        }),
        client.readContract({
          address,
          abi: governanceAbi,
          functionName: "getProposalStage",
          args: [BigInt(proposalId)],
        }),
        includeVotes
          ? client.readContract({
              address,
              abi: governanceAbi,
              functionName: "getVoteTotals",
              args: [BigInt(proposalId)],
            })
          : Promise.resolve([0n, 0n, 0n] as const),
      ]);

      const [
        proposer,
        deposit,
        timestampSec,
        numTransactions,
        url,
        networkWeight,
        isApproved,
      ] = proposalData;

      if (
        proposer === "0x0000000000000000000000000000000000000000" &&
        deposit === 0n &&
        timestampSec === 0n
      ) {
        return null;
      }

      const timestamp = Number(timestampSec) * 1000;
      const stageName = proposalStageName(Number(stage));

      return {
        id: proposalId,
        stage: Number(stage),
        timestamp,
        expiryTimestamp: getExpiryTimestamp(stageName, timestamp),
        url,
        proposer,
        deposit: deposit.toString(),
        numTransactions: Number(numTransactions),
        networkWeight: networkWeight.toString(),
        isApproved,
        upvotes,
        votes: {
          yes: voteTotals[0].toString(),
          no: voteTotals[1].toString(),
          abstain: voteTotals[2].toString(),
        },
      };
    } catch {
      return null;
    }
  }

  private async listProposalIds(): Promise<Array<{ id: number; upvotes: number }>> {
    const client = this.getClient();
    const address = CELO_CORE_CONTRACTS.governance;

    const [queued, dequeued] = await Promise.all([
      client.readContract({
        address,
        abi: governanceAbi,
        functionName: "getQueue",
      }),
      client.readContract({
        address,
        abi: governanceAbi,
        functionName: "getDequeue",
      }),
    ]);

    const [queuedIds, queuedUpvotes] = queued;
    const entries: Array<{ id: number; upvotes: number }> = [];

    queuedIds.forEach((id, index) => {
      if (id !== 0n) {
        entries.push({
          id: Number(id),
          upvotes: Number(queuedUpvotes[index] ?? 0n),
        });
      }
    });

    for (const id of dequeued) {
      if (id !== 0n) {
        entries.push({ id: Number(id), upvotes: 0 });
      }
    }

    entries.sort((a, b) => b.id - a.id);
    return entries;
  }

  private async getGovernanceQueue(): Promise<GovernanceQueueEntry[]> {
    const client = this.getClient();
    const [queuedIds, queuedUpvotes] = (await client.readContract({
      address: CELO_CORE_CONTRACTS.governance,
      abi: governanceAbi,
      functionName: "getQueue",
    })) as readonly [readonly bigint[], readonly bigint[]];

    return queuedIds
      .map((id, index) => ({
        proposalId: Number(id),
        upvotes: queuedUpvotes[index] ?? 0n,
      }))
      .filter((entry) => entry.proposalId !== 0);
  }

  private async getDequeueSchedule(): Promise<GovernanceDequeueSchedule> {
    const client = this.getClient();
    const governance = CELO_CORE_CONTRACTS.governance;
    const [lastDequeue, dequeueFrequency, concurrentProposals] = await Promise.all([
      client.readContract({
        address: governance,
        abi: governanceAbi,
        functionName: "lastDequeue",
      }),
      client.readContract({
        address: governance,
        abi: governanceAbi,
        functionName: "dequeueFrequency",
      }),
      client.readContract({
        address: governance,
        abi: governanceAbi,
        functionName: "concurrentProposals",
      }),
    ]);

    return {
      lastDequeue: Number(lastDequeue),
      dequeueFrequency: Number(dequeueFrequency),
      concurrentProposals: Number(concurrentProposals),
      now: Math.floor(Date.now() / 1000),
    };
  }

  private formatDequeueSchedule(schedule: GovernanceDequeueSchedule, dequeueReady: boolean) {
    return {
      lastDequeue: schedule.lastDequeue,
      lastDequeueISO: new Date(schedule.lastDequeue * 1000).toISOString(),
      dequeueFrequencySeconds: schedule.dequeueFrequency,
      concurrentProposals: schedule.concurrentProposals,
      dequeueReady,
      secondsUntilDequeueReady: dequeueReady
        ? 0
        : Math.max(0, schedule.lastDequeue + schedule.dequeueFrequency - schedule.now),
    };
  }

  private assertUpvoteNotBlockedByPendingDequeue(
    proposalId: number,
    queue: GovernanceQueueEntry[],
    schedule: GovernanceDequeueSchedule,
  ): void {
    if (!isGovernanceDequeueReady(schedule)) return;

    const nextIds = proposalIdsNextToDequeue(queue, schedule.concurrentProposals);
    if (!nextIds.includes(proposalId)) return;

    throw new Error(
      `Cannot upvote proposal ${proposalId}: governance dequeue is overdue. ` +
        `The next write (including upvote) runs dequeueProposalsIfReady first and would remove ` +
        `proposal(s) [${nextIds.join(", ")}] from the queue, then upvote reverts with ` +
        `"cannot upvote a proposal not in the queue". Call execute_dequeue_proposals_if_ready ` +
        `(or prepare_dequeue_proposals_if_ready) first; those proposals move to Approval, then vote in Referendum.`,
    );
  }

  private async getProposalSnapshots(
    proposalIds: number[],
  ): Promise<Map<number, ProposalSnapshot>> {
    const uniqueIds = Array.from(new Set(proposalIds)).filter((id) => id > 0);
    if (uniqueIds.length === 0) return new Map();

    const client = this.getClient();
    const governance = CELO_CORE_CONTRACTS.governance;

    const proposalCalls = uniqueIds.map((id) => ({
      address: governance,
      abi: governanceAbi,
      functionName: "getProposal" as const,
      args: [BigInt(id)] as const,
    }));
    const stageCalls = uniqueIds.map((id) => ({
      address: governance,
      abi: governanceAbi,
      functionName: "getProposalStage" as const,
      args: [BigInt(id)] as const,
    }));

    const [proposalResults, stageResults] = await Promise.all([
      client.multicall({ contracts: proposalCalls, allowFailure: true }),
      client.multicall({ contracts: stageCalls, allowFailure: true }),
    ]);

    const snapshots = new Map<number, ProposalSnapshot>();
    for (let i = 0; i < uniqueIds.length; i++) {
      const id = uniqueIds[i]!;
      const proposalResult = proposalResults[i];
      const stageResult = stageResults[i];

      if (
        !proposalResult ||
        proposalResult.status !== "success" ||
        !stageResult ||
        stageResult.status !== "success"
      ) {
        continue;
      }

      const [proposer, deposit, timestampSec, , url] = proposalResult.result as readonly [
        `0x${string}`,
        bigint,
        bigint,
        bigint,
        string,
        bigint,
        boolean,
      ];

      if (
        proposer === "0x0000000000000000000000000000000000000000" &&
        deposit === 0n &&
        timestampSec === 0n
      ) {
        continue;
      }

      snapshots.set(id, {
        stageName: proposalStageName(Number(stageResult.result)),
        url,
      });
    }

    return snapshots;
  }

  private async discoverActionableProposals(
    limit = ACTIONABLE_PROPOSAL_SCAN_LIMIT,
  ): Promise<ActionableDiscovery> {
    const [queueEntriesRaw, dequeueEntriesRaw, dequeueSchedule] = await Promise.all([
      this.getGovernanceQueue(),
      this.getDequeueWithIndices(),
      this.getDequeueSchedule(),
    ]);

    const queueEntries = queueEntriesRaw.filter((entry) => entry.proposalId !== 0);
    const dequeueEntries = dequeueEntriesRaw.filter((entry) => entry.proposalId !== 0);
    const dequeueReady = isGovernanceDequeueReady(dequeueSchedule);
    const nextDequeueProposalIds = dequeueReady
      ? proposalIdsNextToDequeue(queueEntries, dequeueSchedule.concurrentProposals)
      : [];

    const selectedIds = Array.from(
      new Set([
        ...queueEntries.map((entry) => entry.proposalId),
        ...dequeueEntries.map((entry) => entry.proposalId),
      ]),
    )
      .sort((a, b) => b - a)
      .slice(0, Math.max(limit, 1));

    const selected = new Set(selectedIds);
    const queueLimited = queueEntries
      .filter((entry) => selected.has(entry.proposalId))
      .sort((a, b) => b.proposalId - a.proposalId);
    const dequeueLimited = dequeueEntries
      .filter((entry) => selected.has(entry.proposalId))
      .sort((a, b) => b.proposalId - a.proposalId);

    const snapshots = await this.getProposalSnapshots(selectedIds);
    return {
      queueEntries: queueLimited,
      dequeueEntries: dequeueLimited,
      snapshots,
      dequeueSchedule,
      dequeueReady,
      nextDequeueProposalIds,
    };
  }

  /**
   * List governance proposals with pagination and optional CGP metadata.
   * @param options - Pagination (`page`/`pageSize` or `offset`/`limit`) and filters
   * @returns Proposals with stage names, vote totals, and optional CGP frontmatter
   */
  async getGovernanceProposals(options: GovernanceProposalsOptions = {}) {
    const includeInactive = options.includeInactive ?? true;
    const includeMetadata = options.includeMetadata ?? true;
    const pageSize = Math.min(Math.max(options.pageSize ?? 10, 1), 20);

    let offset: number;
    let limit: number;

    if (options.page !== undefined) {
      const page = Math.max(options.page, 1);
      offset = (page - 1) * pageSize;
      limit = pageSize;
    } else if (options.offset !== undefined) {
      offset = Math.max(options.offset, 0);
      limit = Math.min(options.limit ?? pageSize, 100);
    } else {
      offset = 0;
      limit = Math.min(options.limit ?? pageSize, 100);
    }

    const allIds = await this.listProposalIds();
    const slice = allIds.slice(offset, offset + limit);

    const proposals = (
      await Promise.all(
        slice.map(({ id, upvotes }) =>
          this.fetchProposal(id, upvotes, !includeMetadata),
        ),
      )
    ).filter((p): p is RawProposal => p !== null);

    const filtered = includeInactive
      ? proposals
      : proposals.filter((p) => {
          const stage = proposalStageName(p.stage);
          return !["Expiration", "Rejected", "Withdrawn"].includes(stage);
        });

    let enriched = filtered.map((p) => ({
      ...p,
      stageName: proposalStageName(p.stage),
      metadata: null as Record<string, unknown> | null,
    }));

    if (includeMetadata) {
      enriched = await Promise.all(
        enriched.map(async (proposal) => {
          const cgp = extractCgpFromUrl(proposal.url);
          if (!cgp) return proposal;
          const cgpData = await fetchCgpMetadata(cgp);
          return {
            ...proposal,
            metadata: cgpData?.frontmatter ?? null,
          };
        }),
      );
    }

    const total = allIds.length;
    const currentPage =
      options.page ?? Math.floor(offset / pageSize) + 1;
    const totalPages = Math.max(Math.ceil(total / pageSize), 1);

    return {
      network: "mainnet" as const,
      proposals: enriched,
      pagination: {
        total,
        page: currentPage,
        pageSize,
        totalPages,
        offset,
        limit,
        hasMore: offset + limit < total,
      },
    };
  }

  /**
   * Full details for a single proposal, including CGP markdown body when available.
   * @param proposalId - On-chain governance proposal id
   * @returns Proposal record, CGP content, or `{ proposal: null, error }` if missing
   */
  async getProposalDetails(proposalId: number) {
    const proposal = await this.fetchProposal(proposalId, 0, true);

    if (!proposal) {
      return {
        network: "mainnet" as const,
        proposal: null,
        content: null,
        error: `Proposal ${proposalId} not found`,
      };
    }

    const cgp = extractCgpFromUrl(proposal.url);
    let metadata: Record<string, unknown> | null = null;
    let content: string | null = null;

    if (cgp) {
      const cgpData = await fetchCgpMetadata(cgp);
      metadata = cgpData?.frontmatter ?? null;
      content = cgpData?.content ?? null;
    }

    return {
      network: "mainnet" as const,
      proposal: {
        ...proposal,
        stageName: proposalStageName(proposal.stage),
        metadata,
      },
      content,
      error: null,
    };
  }

  /** Raw getDequeue with positional indices preserved for Governance.vote(). */
  async getDequeueWithIndices() {
    const client = this.getClient();
    const dequeued = (await client.readContract({
      address: CELO_CORE_CONTRACTS.governance,
      abi: governanceAbi,
      functionName: "getDequeue",
    })) as readonly bigint[];

    return dequeued.map((id, index) => ({
      index,
      proposalId: Number(id),
    }));
  }

  /** Proposals currently in Referendum stage with their dequeue index. */
  async getVotableProposals(options: { limit?: number } = {}) {
    const { dequeueEntries, snapshots } = await this.discoverActionableProposals(
      options.limit ?? ACTIONABLE_PROPOSAL_SCAN_LIMIT,
    );
    const votable = dequeueEntries.flatMap((entry) => {
      const snapshot = snapshots.get(entry.proposalId);
      if (!snapshot || snapshot.stageName !== "Referendum") return [];
      return [
        {
          proposalId: entry.proposalId,
          index: entry.index,
          stage: snapshot.stageName,
          url: snapshot.url,
        },
      ];
    });

    return {
      network: "mainnet" as const,
      proposals: votable,
      message:
        votable.length > 0
          ? `${votable.length} proposal(s) in Referendum`
          : "No proposals currently in Referendum",
    };
  }

  /** Proposals currently in Queue stage with upvote weight. */
  async getQueuedProposals(options: { limit?: number } = {}) {
    const {
      queueEntries,
      snapshots,
      dequeueSchedule,
      dequeueReady,
      nextDequeueProposalIds,
    } = await this.discoverActionableProposals(
      options.limit ?? ACTIONABLE_PROPOSAL_SCAN_LIMIT,
    );
    const nextDequeueSet = new Set(nextDequeueProposalIds);
    const queued = queueEntries.flatMap((entry) => {
      const snapshot = snapshots.get(entry.proposalId);
      if (!snapshot || snapshot.stageName !== "Queued") return [];
      const upvoteable = !dequeueReady || !nextDequeueSet.has(entry.proposalId);
      return [
        {
          proposalId: entry.proposalId,
          upvotes: formatCeloAmount(entry.upvotes),
          stage: snapshot.stageName,
          url: snapshot.url,
          upvoteable,
        },
      ];
    });

    const schedule = this.formatDequeueSchedule(dequeueSchedule, dequeueReady);
    let message =
      queued.length > 0
        ? `${queued.length} proposal(s) in Queue`
        : "No proposals currently in Queue";
    if (dequeueReady && nextDequeueProposalIds.length > 0) {
      message += `. Dequeue overdue — next write will dequeue [${nextDequeueProposalIds.join(", ")}]; those are not upvoteable. Use execute_dequeue_proposals_if_ready.`;
    }

    return {
      network: "mainnet" as const,
      proposals: queued,
      ...schedule,
      nextDequeueProposalIds,
      message,
    };
  }

  /** Queued and Referendum proposals you can upvote or vote on now. */
  async getActionableGovernanceProposals() {
    const {
      queueEntries,
      dequeueEntries,
      snapshots,
      dequeueSchedule,
      dequeueReady,
      nextDequeueProposalIds,
    } = await this.discoverActionableProposals();

    const nextDequeueSet = new Set(nextDequeueProposalIds);
    const queued = queueEntries.flatMap((entry) => {
      const snapshot = snapshots.get(entry.proposalId);
      if (!snapshot || snapshot.stageName !== "Queued") return [];
      const upvoteable = !dequeueReady || !nextDequeueSet.has(entry.proposalId);
      return [
        {
          proposalId: entry.proposalId,
          upvotes: formatCeloAmount(entry.upvotes),
          stage: snapshot.stageName,
          url: snapshot.url,
          upvoteable,
        },
      ];
    });

    const referendum = dequeueEntries.flatMap((entry) => {
      const snapshot = snapshots.get(entry.proposalId);
      if (!snapshot || snapshot.stageName !== "Referendum") return [];
      return [
        {
          proposalId: entry.proposalId,
          index: entry.index,
          stage: snapshot.stageName,
          url: snapshot.url,
        },
      ];
    });

    const upvoteableQueued = queued.filter((p) => p.upvoteable);
    const hasQueued = queued.length > 0;
    const hasUpvoteableQueued = upvoteableQueued.length > 0;
    const hasReferendum = referendum.length > 0;
    const hasAny = hasUpvoteableQueued || hasReferendum;

    const parts: string[] = [];
    if (hasQueued) {
      parts.push(
        `${queued.length} Queued (${upvoteableQueued.length} upvoteable)`,
      );
    }
    if (hasReferendum) {
      parts.push(`${referendum.length} Referendum`);
    }
    if (dequeueReady && nextDequeueProposalIds.length > 0) {
      parts.push(
        `dequeue overdue → [${nextDequeueProposalIds.join(", ")}] (use execute_dequeue_proposals_if_ready)`,
      );
    }

    const schedule = this.formatDequeueSchedule(dequeueSchedule, dequeueReady);

    return {
      network: "mainnet" as const,
      hasAny,
      hasQueued,
      hasUpvoteableQueued,
      hasReferendum,
      queued,
      referendum,
      ...schedule,
      nextDequeueProposalIds,
      message: parts.length > 0 ? parts.join(", ") : "No actionable proposals",
    };
  }

  /** Referendum votes and queue upvotes cast by an address on Celo governance. */
  async getGovernanceVotes(
    address: `0x${string}`,
    options: GovernanceVotesOptions = {},
  ) {
    if (!isAddress(address)) {
      throw new Error(`Invalid address: ${address}`);
    }

    const governanceAccount = await this.resolveGovernanceAccount(address);
    const client = this.getClient();
    const governance = CELO_CORE_CONTRACTS.governance;

    let entries = (await this.getDequeueWithIndices()).filter(
      (entry) => entry.proposalId !== 0,
    );
    if (options.proposalId !== undefined) {
      entries = entries.filter((entry) => entry.proposalId === options.proposalId);
    }

    const voteRecordCalls = entries.map((entry) => ({
      address: governance,
      abi: governanceAbi,
      functionName: "getVoteRecord" as const,
      args: [governanceAccount, BigInt(entry.index)] as const,
    }));

    const [voteResults, upvoteResult, goldUsed] = await Promise.all([
      voteRecordCalls.length > 0
        ? client.multicall({ contracts: voteRecordCalls, allowFailure: true })
        : Promise.resolve([]),
      client.readContract({
        address: governance,
        abi: governanceAbi,
        functionName: "getUpvoteRecord",
        args: [governanceAccount],
      }),
      client.readContract({
        address: governance,
        abi: governanceAbi,
        functionName: "getAmountOfGoldUsedForVoting",
        args: [governanceAccount],
      }),
    ]);

    const referendumVotes = [];
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i]!;
      const result = voteResults[i];
      if (!result || result.status !== "success") {
        continue;
      }

      const [recordProposalId, , , yesVotes, noVotes, abstainVotes] =
        result.result as readonly [bigint, bigint, bigint, bigint, bigint, bigint];

      const proposalId = Number(recordProposalId);
      if (proposalId === 0) {
        continue;
      }

      const totalWeight = yesVotes + noVotes + abstainVotes;
      if (totalWeight === 0n) {
        continue;
      }

      const stale = proposalId !== entry.proposalId;
      const proposal = await this.fetchProposal(proposalId, 0, false);

      referendumVotes.push({
        proposalId,
        dequeueIndex: entry.index,
        yesVotes: yesVotes.toString(),
        noVotes: noVotes.toString(),
        abstainVotes: abstainVotes.toString(),
        totalWeight: totalWeight.toString(),
        totalWeightFormatted: formatCeloAmount(totalWeight),
        stale,
        stage: proposal ? proposalStageName(proposal.stage) : undefined,
        url: proposal?.url,
      });
    }

    const [upvoteProposalId, upvoteWeight] = upvoteResult as readonly [bigint, bigint];
    let upvote: {
      proposalId: number;
      weight: string;
      weightFormatted: string;
    } | null = null;

    if (Number(upvoteProposalId) !== 0) {
      const upvoteEntry = {
        proposalId: Number(upvoteProposalId),
        weight: upvoteWeight.toString(),
        weightFormatted: formatCeloAmount(upvoteWeight),
      };
      if (
        options.proposalId === undefined ||
        upvoteEntry.proposalId === options.proposalId
      ) {
        upvote = upvoteEntry;
      }
    }

    const parts: string[] = [];
    if (referendumVotes.length > 0) {
      parts.push(`${referendumVotes.length} referendum vote(s)`);
    }
    if (upvote) {
      parts.push("1 active upvote");
    }

    return {
      network: "mainnet" as const,
      address: governanceAccount,
      ...(governanceAccount !== address ? { queriedAddress: address } : {}),
      goldUsedForVoting: goldUsed.toString(),
      goldUsedForVotingFormatted: formatCeloAmount(goldUsed),
      upvote,
      referendumVotes,
      message:
        parts.length > 0
          ? parts.join(", ")
          : "No governance votes found for this address",
    };
  }

  /** Locked CELO balances and governance voting power for an address. */
  async getLockedCeloBalance(address: `0x${string}`) {
    if (!isAddress(address)) {
      throw new Error(`Invalid address: ${address}`);
    }

    const client = this.getClient();
    const lockedGold = CELO_CORE_CONTRACTS.lockedGold;

    const [totalLocked, nonvotingLocked, votingPower, delegatedFraction] =
      await Promise.all([
        client.readContract({
          address: lockedGold,
          abi: lockedGoldAbi,
          functionName: "getAccountTotalLockedGold",
          args: [address],
        }),
        client.readContract({
          address: lockedGold,
          abi: lockedGoldAbi,
          functionName: "getAccountNonvotingLockedGold",
          args: [address],
        }),
        client.readContract({
          address: lockedGold,
          abi: lockedGoldAbi,
          functionName: "getAccountTotalGovernanceVotingPower",
          args: [address],
        }),
        client.readContract({
          address: lockedGold,
          abi: lockedGoldAbi,
          functionName: "getAccountTotalDelegatedFraction",
          args: [address],
        }),
      ]);

    return {
      network: "mainnet" as const,
      address,
      totalLocked: totalLocked.toString(),
      totalLockedFormatted: formatCeloAmount(totalLocked),
      nonvotingLocked: nonvotingLocked.toString(),
      nonvotingLockedFormatted: formatCeloAmount(nonvotingLocked),
      governanceVotingPower: votingPower.toString(),
      governanceVotingPowerFormatted: formatCeloAmount(votingPower),
      delegatedFraction: delegatedFraction.toString(),
    };
  }

  /** Pending LockedGold withdrawals with maturity timestamps. */
  async getPendingWithdrawals(address: `0x${string}`) {
    if (!isAddress(address)) {
      throw new Error(`Invalid address: ${address}`);
    }

    const client = this.getClient();
    const lockedGold = CELO_CORE_CONTRACTS.lockedGold;

    const [pending, unlockingPeriod] = await Promise.all([
      client.readContract({
        address: lockedGold,
        abi: lockedGoldAbi,
        functionName: "getPendingWithdrawals",
        args: [address],
      }),
      client.readContract({
        address: lockedGold,
        abi: lockedGoldAbi,
        functionName: "unlockingPeriod",
      }),
    ]);

    const [values, timestamps] = pending;
    const nowSec = Math.floor(Date.now() / 1000);

    const withdrawals = values.map((value, index) => {
      const timestampSec = Number(timestamps[index] ?? 0n);
      return {
        index,
        value: value.toString(),
        valueFormatted: formatCeloAmount(value),
        availableAt: timestampSec,
        availableAtIso: new Date(timestampSec * 1000).toISOString(),
        isMature: nowSec >= timestampSec,
      };
    });

    return {
      network: "mainnet" as const,
      address,
      unlockingPeriodSeconds: Number(unlockingPeriod),
      withdrawals,
      matureCount: withdrawals.filter((w) => w.isMature).length,
    };
  }

  private buildStep(
    to: `0x${string}`,
    data: `0x${string}`,
    description: string,
    value?: bigint,
  ): PreparedTx {
    return {
      kind: value && value > 0n ? "native" : "contract",
      to,
      data,
      value: value && value > 0n ? value.toString() : undefined,
      description,
    };
  }

  private toPreparedFlow(
    from: `0x${string}`,
    steps: PreparedTx[],
    summary: string,
  ): SerializedPreparedFlow {
    const flow: PreparedFlow = {
      steps,
      summary,
      chainId: CHAIN.id,
      from,
    };
    return serializePreparedFlow(flow);
  }

  /** Lock CELO, relocking matured pending withdrawals first (reverse index order). */
  async prepareLockCelo(from: `0x${string}`, amount: string): Promise<SerializedPreparedFlow> {
    await assertCeloAccountRegistered(this.clientFactory, from);
    const amountWei = parseEther(amount);
    const pending = await this.getPendingWithdrawals(from);
    const steps: PreparedTx[] = [];
    let amountRemaining = amountWei;

    const sorted = [...pending.withdrawals]
      .filter((w) => w.isMature)
      .sort((a, b) => b.index - a.index);

    for (const withdrawal of sorted) {
      if (amountRemaining <= 0n) break;
      const txAmount =
        BigInt(withdrawal.value) <= amountRemaining
          ? BigInt(withdrawal.value)
          : amountRemaining;

      const data = appendCelinaCalldataTag(
        encodeFunctionData({
          abi: lockedGoldAbi,
          functionName: "relock",
          args: [BigInt(withdrawal.index), txAmount],
        }),
        this.attributionTags,
      );
      steps.push(
        this.buildStep(
          CELO_CORE_CONTRACTS.lockedGold,
          data,
          `Relock ${formatCeloAmount(txAmount)} from pending withdrawal #${withdrawal.index}`,
        ),
      );
      amountRemaining -= txAmount;
    }

    if (amountRemaining > 0n) {
      const data = appendCelinaCalldataTag(
        encodeFunctionData({
          abi: lockedGoldAbi,
          functionName: "lock",
        }),
        this.attributionTags,
      );
      steps.push(
        this.buildStep(
          CELO_CORE_CONTRACTS.lockedGold,
          data,
          `Lock ${formatCeloAmount(amountRemaining)} CELO`,
          amountRemaining,
        ),
      );
    }

    return this.toPreparedFlow(from, steps, `Lock ${amount} CELO for ${from}`);
  }

  async prepareUnlockCelo(from: `0x${string}`, amount: string): Promise<SerializedPreparedFlow> {
    await assertCeloAccountRegistered(this.clientFactory, from);
    const amountWei = parseEther(amount);
    const data = appendCelinaCalldataTag(
      encodeFunctionData({
        abi: lockedGoldAbi,
        functionName: "unlock",
        args: [amountWei],
      }),
      this.attributionTags,
    );

    return this.toPreparedFlow(
      from,
      [
        this.buildStep(
          CELO_CORE_CONTRACTS.lockedGold,
          data,
          `Unlock ${amount} CELO (starts ${formatCeloAmount(amountWei)} timelock)`,
        ),
      ],
      `Unlock ${amount} CELO from ${from}`,
    );
  }

  async prepareRelockCelo(
    from: `0x${string}`,
    index: number,
    amount: string,
  ): Promise<SerializedPreparedFlow> {
    await assertCeloAccountRegistered(this.clientFactory, from);
    const amountWei = parseEther(amount);
    const data = appendCelinaCalldataTag(
      encodeFunctionData({
        abi: lockedGoldAbi,
        functionName: "relock",
        args: [BigInt(index), amountWei],
      }),
      this.attributionTags,
    );

    return this.toPreparedFlow(
      from,
      [
        this.buildStep(
          CELO_CORE_CONTRACTS.lockedGold,
          data,
          `Relock ${amount} CELO from pending withdrawal #${index}`,
        ),
      ],
      `Relock ${amount} CELO for ${from}`,
    );
  }

  /** Withdraw all matured pending withdrawals. */
  async prepareWithdrawCelo(from: `0x${string}`): Promise<SerializedPreparedFlow> {
    await assertCeloAccountRegistered(this.clientFactory, from);
    const pending = await this.getPendingWithdrawals(from);
    const mature = pending.withdrawals.filter((w) => w.isMature);

    if (mature.length === 0) {
      throw new Error(
        "No matured pending withdrawals available. Unlock CELO and wait for the timelock.",
      );
    }

    const steps = mature.map((withdrawal) => {
      const data = appendCelinaCalldataTag(
        encodeFunctionData({
          abi: lockedGoldAbi,
          functionName: "withdraw",
          args: [BigInt(withdrawal.index)],
        }),
        this.attributionTags,
      );
      return this.buildStep(
        CELO_CORE_CONTRACTS.lockedGold,
        data,
        `Withdraw ${withdrawal.valueFormatted} from pending #${withdrawal.index}`,
      );
    });

    return this.toPreparedFlow(
      from,
      steps,
      `Withdraw ${mature.length} matured pending withdrawal(s) for ${from}`,
    );
  }

  async prepareVote(
    from: `0x${string}`,
    proposalId: number,
    vote: VoteValueName,
  ): Promise<SerializedPreparedFlow> {
    const entries = await this.getDequeueWithIndices();
    const match = entries.find((e) => e.proposalId === proposalId);
    if (!match) {
      throw new Error(
        `Proposal ${proposalId} is not in the dequeue. Use get_votable_proposals to find Referendum proposals.`,
      );
    }

    const details = await this.fetchProposal(proposalId, 0, false);
    if (!details || proposalStageName(details.stage) !== "Referendum") {
      throw new Error(`Proposal ${proposalId} is not in Referendum stage.`);
    }

    const voteInt = voteValueToInt(vote);
    const data = appendCelinaCalldataTag(
      encodeFunctionData({
        abi: governanceAbi,
        functionName: "vote",
        args: [BigInt(proposalId), BigInt(match.index), voteInt],
      }),
      this.attributionTags,
    );

    return this.toPreparedFlow(
      from,
      [
        this.buildStep(
          CELO_CORE_CONTRACTS.governance,
          data,
          `Vote ${vote} on proposal #${proposalId} (index ${match.index})`,
        ),
      ],
      `Vote ${vote} on governance proposal #${proposalId}`,
    );
  }

  /** Upvote a Queued governance proposal (one active queue upvote per account). */
  async prepareUpvote(
    from: `0x${string}`,
    proposalId: number,
  ): Promise<SerializedPreparedFlow> {
    const governanceAccount = await this.resolveGovernanceAccount(from);
    const client = this.getClient();
    const governance = CELO_CORE_CONTRACTS.governance;
    const [queue, dequeueSchedule] = await Promise.all([
      this.getGovernanceQueue(),
      this.getDequeueSchedule(),
    ]);

    if (!queue.some((entry) => entry.proposalId === proposalId)) {
      throw new Error(
        `Proposal ${proposalId} is not in the governance queue. Use get_queued_proposals to find Queued proposals.`,
      );
    }

    this.assertUpvoteNotBlockedByPendingDequeue(proposalId, queue, dequeueSchedule);

    const [existingUpvoteProposalId] = (await client.readContract({
      address: governance,
      abi: governanceAbi,
      functionName: "getUpvoteRecord",
      args: [governanceAccount],
    })) as readonly [bigint, bigint];

    const existingId = Number(existingUpvoteProposalId);
    if (existingId !== 0 && queue.some((entry) => entry.proposalId === existingId)) {
      throw new Error(
        `Account already has an active upvote on proposal ${existingId}. Revoke it with prepare_revoke_governance_upvote before upvoting another proposal.`,
      );
    }

    const lockedGold = (await client.readContract({
      address: CELO_CORE_CONTRACTS.lockedGold,
      abi: lockedGoldAbi,
      functionName: "getAccountTotalLockedGold",
      args: [governanceAccount],
    })) as bigint;

    if (lockedGold === 0n) {
      throw new Error(
        "Cannot upvote without locked CELO. Lock CELO first with execute_lock_celo.",
      );
    }

    const { lesser, greater } = lesserAndGreaterAfterUpvote(
      queue,
      proposalId,
      lockedGold,
    );

    const data = appendCelinaCalldataTag(
      encodeFunctionData({
        abi: governanceAbi,
        functionName: "upvote",
        args: [BigInt(proposalId), BigInt(lesser), BigInt(greater)],
      }),
      this.attributionTags,
    );

    return this.toPreparedFlow(
      from,
      [
        this.buildStep(
          governance,
          data,
          `Upvote proposal #${proposalId} with ${formatCeloAmount(lockedGold)} locked CELO`,
        ),
      ],
      `Upvote governance proposal #${proposalId}`,
    );
  }

  /**
   * Call Governance.dequeueProposalsIfReady (public; anyone can pay gas).
   * When overdue, moves up to concurrentProposals from the queue into Approval.
   */
  async prepareDequeueProposalsIfReady(
    from: `0x${string}`,
  ): Promise<SerializedPreparedFlow> {
    const [queue, dequeueSchedule] = await Promise.all([
      this.getGovernanceQueue(),
      this.getDequeueSchedule(),
    ]);
    const dequeueReady = isGovernanceDequeueReady(dequeueSchedule);
    const nextIds = dequeueReady
      ? proposalIdsNextToDequeue(queue, dequeueSchedule.concurrentProposals)
      : [];

    const data = appendCelinaCalldataTag(
      encodeFunctionData({
        abi: governanceAbi,
        functionName: "dequeueProposalsIfReady",
      }),
      this.attributionTags,
    );

    const summary = dequeueReady
      ? nextIds.length > 0
        ? `Dequeue overdue proposals [${nextIds.join(", ")}] into Approval`
        : "Call dequeueProposalsIfReady (queue empty)"
      : `Call dequeueProposalsIfReady (no-op until ${new Date((dequeueSchedule.lastDequeue + dequeueSchedule.dequeueFrequency) * 1000).toISOString()})`;

    return this.toPreparedFlow(
      from,
      [
        this.buildStep(
          CELO_CORE_CONTRACTS.governance,
          data,
          summary,
        ),
      ],
      summary,
    );
  }

  /** Revoke all active referendum votes for an account (bulk on-chain). */
  async prepareRevokeGovernanceVotes(
    from: `0x${string}`,
  ): Promise<SerializedPreparedFlow> {
    const governanceAccount = await this.resolveGovernanceAccount(from);
    const votes = await this.getGovernanceVotes(governanceAccount);

    if (votes.referendumVotes.length === 0) {
      throw new Error("No referendum votes to revoke for this address.");
    }

    const data = appendCelinaCalldataTag(
      encodeFunctionData({
        abi: governanceAbi,
        functionName: "revokeVotes",
      }),
      this.attributionTags,
    );

    return this.toPreparedFlow(
      from,
      [
        this.buildStep(
          CELO_CORE_CONTRACTS.governance,
          data,
          `Revoke ${votes.referendumVotes.length} referendum vote(s)`,
        ),
      ],
      `Revoke all governance referendum votes for ${governanceAccount}`,
    );
  }

  /** Revoke the account's active queue upvote. */
  async prepareRevokeGovernanceUpvote(
    from: `0x${string}`,
    options: GovernanceRevokeUpvoteOptions = {},
  ): Promise<SerializedPreparedFlow> {
    const governanceAccount = await this.resolveGovernanceAccount(from);
    const client = this.getClient();
    const governance = CELO_CORE_CONTRACTS.governance;

    const [upvoteProposalId, upvoteWeight] = (await client.readContract({
      address: governance,
      abi: governanceAbi,
      functionName: "getUpvoteRecord",
      args: [governanceAccount],
    })) as readonly [bigint, bigint];

    const proposalId = Number(upvoteProposalId);
    if (proposalId === 0) {
      throw new Error("No active governance upvote to revoke for this address.");
    }

    if (
      options.proposalId !== undefined &&
      options.proposalId !== proposalId
    ) {
      throw new Error(
        `Active upvote is on proposal ${proposalId}, not ${options.proposalId}.`,
      );
    }

    const queue = await this.getGovernanceQueue();
    const { lesser, greater } = lesserAndGreaterAfterRevokeUpvote(
      queue,
      proposalId,
      upvoteWeight,
    );

    const data = appendCelinaCalldataTag(
      encodeFunctionData({
        abi: governanceAbi,
        functionName: "revokeUpvote",
        args: [BigInt(lesser), BigInt(greater)],
      }),
      this.attributionTags,
    );

    return this.toPreparedFlow(
      from,
      [
        this.buildStep(
          governance,
          data,
          `Revoke upvote on proposal #${proposalId}`,
        ),
      ],
      `Revoke governance upvote on proposal #${proposalId}`,
    );
  }
}
