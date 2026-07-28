/**
 * Celo governance: on-chain proposals with optional CGP markdown metadata from GitHub,
 * LockedGold locking/unlocking, and governance voting.
 */
import { encodeFunctionData, isAddress, parseEther } from "viem";
import { CELO_CORE_CONTRACTS } from "../config/celo-core-contracts.js";
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

/** Celo on-chain governance proposal reads, CGP enrichment, and LockedGold writes. */
export class GovernanceService {
  private readonly attributionTags?: string[];

  constructor(private readonly clientFactory: CeloClientFactory) {
    this.attributionTags = clientFactory.getConfig().attributionTags;
  }

  private getClient() {
    return this.clientFactory.getClients().public;
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
  async getVotableProposals() {
    const entries = await this.getDequeueWithIndices();
    const votable = [];

    for (const entry of entries) {
      if (entry.proposalId === 0) continue;
      const proposal = await this.fetchProposal(entry.proposalId, 0, false);
      if (!proposal) continue;
      const stageName = proposalStageName(proposal.stage);
      if (stageName === "Referendum") {
        votable.push({
          proposalId: entry.proposalId,
          index: entry.index,
          stage: stageName,
          url: proposal.url,
        });
      }
    }

    return {
      network: "mainnet" as const,
      proposals: votable,
      message:
        votable.length > 0
          ? `${votable.length} proposal(s) in Referendum`
          : "No proposals currently in Referendum",
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
}
