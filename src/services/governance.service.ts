import { CELO_CORE_CONTRACTS } from "../config/celo-core-contracts.js";
import {
  governanceAbi,
  proposalStageName,
  type ProposalStageName,
} from "../abis/governance.js";
import type { CeloClientFactory } from "../clients/celo-client.js";

const STAGE_EXPIRY_MS: Partial<Record<ProposalStageName, number>> = {
  Queued: 4 * 24 * 60 * 60 * 1000,
  Approval: 24 * 60 * 60 * 1000,
  Referendum: 4 * 24 * 60 * 60 * 1000,
  Execution: 24 * 60 * 60 * 1000,
};

export interface GovernanceProposalsOptions {
  includeInactive?: boolean;
  includeMetadata?: boolean;
  page?: number;
  pageSize?: number;
  offset?: number;
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

export class GovernanceService {
  constructor(private readonly clientFactory: CeloClientFactory) {}

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
}
