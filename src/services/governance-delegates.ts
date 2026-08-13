import { z } from "zod";
import type { PublicClient } from "viem";
import { lockedGoldAbi } from "../abis/locked-gold.js";
import { CELO_CORE_CONTRACTS } from "../config/celo-core-contracts.js";
import { formatCeloAmount } from "../utils/celo-format.js";
import { fromFixidity } from "../utils/fixidity.js";

export const CELO_MONDO_DELEGATES_URL =
  "https://raw.githubusercontent.com/celo-org/celo-mondo/main/src/config/delegates.json";

const DIRECTORY_NOTE =
  "Curated Celo Mondo delegate directory (off-chain). Not an on-chain registry — any address can receive governance delegation via LockedGold.";

const CACHE_TTL_MS = 10 * 60 * 1000;

const DelegateeLinksSchema = z
  .object({
    website: z.string().optional(),
    twitter: z.string().optional(),
  })
  .passthrough();

const DelegateeMetadataSchema = z.object({
  name: z.string().min(1),
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  logoUri: z.string().min(1),
  date: z.string(),
  links: DelegateeLinksSchema,
  interests: z.array(z.string().min(1)).min(1),
  description: z.string().min(1),
  stCELO: z.boolean().optional(),
});

const DelegateeMetadataMapSchema = z.record(z.string(), DelegateeMetadataSchema);

export type GovernanceDelegateMetadata = z.infer<typeof DelegateeMetadataSchema>;

export type GovernanceDelegate = GovernanceDelegateMetadata & {
  address: `0x${string}`;
  votingPower?: string;
  votingPowerFormatted?: string;
  delegatedToBalance?: string;
  delegatedToBalanceFormatted?: string;
  delegatedByPercent?: string;
};

export type GetGovernanceDelegatesOptions = {
  search?: string;
  limit?: number;
  offset?: number;
  includeStats?: boolean;
};

export type GovernanceDelegatesResult = {
  network: "mainnet";
  source: "celo-mondo";
  sourceUrl: string;
  directoryNote: string;
  delegates: GovernanceDelegate[];
  pagination: {
    total: number;
    offset: number;
    limit: number;
    hasMore: boolean;
  };
};

export type GovernanceDelegateDetailsResult = {
  network: "mainnet";
  address: `0x${string}`;
  inMondoDirectory: boolean;
  source: "celo-mondo";
  sourceUrl: string;
  directoryNote: string;
  metadata: GovernanceDelegateMetadata | null;
  votingPower: string;
  votingPowerFormatted: string;
  delegatedToBalance: string;
  delegatedToBalanceFormatted: string;
  delegatedByPercent: string;
  totalLocked: string;
  totalLockedFormatted: string;
  nonvotingLocked: string;
  nonvotingLockedFormatted: string;
};

type CachedMetadata = {
  fetchedAt: number;
  entries: GovernanceDelegateMetadata[];
};

let metadataCache: CachedMetadata | null = null;

/** @internal Test hook — clears in-memory Mondo metadata cache. */
export function clearGovernanceDelegatesCacheForTests(): void {
  metadataCache = null;
}

async function fetchMondoDelegateMetadata(): Promise<GovernanceDelegateMetadata[]> {
  const now = Date.now();
  if (metadataCache && now - metadataCache.fetchedAt < CACHE_TTL_MS) {
    return metadataCache.entries;
  }

  let response: Response;
  try {
    response = await fetch(CELO_MONDO_DELEGATES_URL, {
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new Error(
      `Failed to fetch Celo Mondo delegate directory from ${CELO_MONDO_DELEGATES_URL}`,
    );
  }

  if (!response.ok) {
    throw new Error(
      `Celo Mondo delegate directory returned HTTP ${response.status} (${CELO_MONDO_DELEGATES_URL})`,
    );
  }

  const json: unknown = await response.json();
  const parsed = DelegateeMetadataMapSchema.parse(json);
  const entries = Object.values(parsed).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  metadataCache = { fetchedAt: now, entries };
  return entries;
}

function filterDelegatees(
  entries: GovernanceDelegateMetadata[],
  search?: string,
  offset = 0,
  limit = 20,
): { slice: GovernanceDelegateMetadata[]; total: number } {
  let filtered = entries;

  if (search?.trim()) {
    const q = search.trim().toLowerCase();
    filtered = entries.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.address.toLowerCase().includes(q) ||
        d.interests.some((i) => i.toLowerCase().includes(q)) ||
        d.description.toLowerCase().includes(q),
    );
  }

  const total = filtered.length;
  const safeOffset = Math.max(0, offset);
  const safeLimit = Math.min(Math.max(1, limit), 100);
  const slice = filtered.slice(safeOffset, safeOffset + safeLimit);

  return { slice, total };
}

function findMetadataByAddress(
  entries: GovernanceDelegateMetadata[],
  address: string,
): GovernanceDelegateMetadata | undefined {
  const normalized = address.toLowerCase();
  return entries.find((d) => d.address.toLowerCase() === normalized);
}

async function fetchDelegateOnChainStats(
  client: PublicClient,
  address: `0x${string}`,
): Promise<
  Pick<
    GovernanceDelegateDetailsResult,
    | "votingPower"
    | "votingPowerFormatted"
    | "delegatedToBalance"
    | "delegatedToBalanceFormatted"
    | "delegatedByPercent"
    | "totalLocked"
    | "totalLockedFormatted"
    | "nonvotingLocked"
    | "nonvotingLockedFormatted"
  >
> {
  const lockedGold = CELO_CORE_CONTRACTS.lockedGold;

  const [
    votingPower,
    delegatedFraction,
    delegatedToBalance,
    totalLocked,
    nonvotingLocked,
  ] = await Promise.all([
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
    client.readContract({
      address: lockedGold,
      abi: lockedGoldAbi,
      functionName: "totalDelegatedCelo",
      args: [address],
    }),
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
  ]);

  return {
    votingPower: votingPower.toString(),
    votingPowerFormatted: formatCeloAmount(votingPower),
    delegatedToBalance: delegatedToBalance.toString(),
    delegatedToBalanceFormatted: formatCeloAmount(delegatedToBalance),
    delegatedByPercent: (fromFixidity(delegatedFraction) * 100).toFixed(2),
    totalLocked: totalLocked.toString(),
    totalLockedFormatted: formatCeloAmount(totalLocked),
    nonvotingLocked: nonvotingLocked.toString(),
    nonvotingLockedFormatted: formatCeloAmount(nonvotingLocked),
  };
}

async function enrichDelegateesWithStats(
  client: PublicClient,
  metadata: GovernanceDelegateMetadata[],
): Promise<GovernanceDelegate[]> {
  if (metadata.length === 0) return [];

  const lockedGold = CELO_CORE_CONTRACTS.lockedGold;

  const votingPowerCalls = metadata.map(
    (d) =>
      ({
        address: lockedGold,
        abi: lockedGoldAbi,
        functionName: "getAccountTotalGovernanceVotingPower" as const,
        args: [d.address as `0x${string}`] as const,
      }) as const,
  );

  const delegatedFractionCalls = metadata.map(
    (d) =>
      ({
        address: lockedGold,
        abi: lockedGoldAbi,
        functionName: "getAccountTotalDelegatedFraction" as const,
        args: [d.address as `0x${string}`] as const,
      }) as const,
  );

  const delegatedToCalls = metadata.map(
    (d) =>
      ({
        address: lockedGold,
        abi: lockedGoldAbi,
        functionName: "totalDelegatedCelo" as const,
        args: [d.address as `0x${string}`] as const,
      }) as const,
  );

  const [votingPowerResults, delegatedFractionResults, delegatedToResults] =
    await Promise.all([
      client.multicall({ contracts: votingPowerCalls, allowFailure: true }),
      client.multicall({ contracts: delegatedFractionCalls, allowFailure: true }),
      client.multicall({ contracts: delegatedToCalls, allowFailure: true }),
    ]);

  return metadata.map((entry, index) => {
    const base: GovernanceDelegate = {
      ...entry,
      address: entry.address as `0x${string}`,
    };

    const votingPowerRes = votingPowerResults[index];
    const delegatedFractionRes = delegatedFractionResults[index];
    const delegatedToRes = delegatedToResults[index];

    if (
      votingPowerRes.status !== "success" ||
      delegatedFractionRes.status !== "success" ||
      delegatedToRes.status !== "success"
    ) {
      return base;
    }

    const votingPower = votingPowerRes.result as bigint;
    const delegatedByPercent = fromFixidity(delegatedFractionRes.result as bigint) * 100;
    const delegatedToBalance = delegatedToRes.result as bigint;

    return {
      ...base,
      votingPower: votingPower.toString(),
      votingPowerFormatted: formatCeloAmount(votingPower),
      delegatedToBalance: delegatedToBalance.toString(),
      delegatedToBalanceFormatted: formatCeloAmount(delegatedToBalance),
      delegatedByPercent: delegatedByPercent.toFixed(2),
    };
  });
}

export async function getGovernanceDelegates(
  client: PublicClient,
  options: GetGovernanceDelegatesOptions = {},
): Promise<GovernanceDelegatesResult> {
  const includeStats = options.includeStats !== false;
  const offset = options.offset ?? 0;
  const limit = options.limit ?? 20;

  const allMetadata = await fetchMondoDelegateMetadata();
  const { slice, total } = filterDelegatees(
    allMetadata,
    options.search,
    offset,
    limit,
  );

  const delegates = includeStats
    ? await enrichDelegateesWithStats(client, slice)
    : slice.map(
        (entry): GovernanceDelegate => ({
          ...entry,
          address: entry.address as `0x${string}`,
        }),
      );

  const safeOffset = Math.max(0, offset);
  const safeLimit = Math.min(Math.max(1, limit), 100);

  return {
    network: "mainnet",
    source: "celo-mondo",
    sourceUrl: CELO_MONDO_DELEGATES_URL,
    directoryNote: DIRECTORY_NOTE,
    delegates,
    pagination: {
      total,
      offset: safeOffset,
      limit: safeLimit,
      hasMore: safeOffset + safeLimit < total,
    },
  };
}

export async function getGovernanceDelegateDetails(
  client: PublicClient,
  address: `0x${string}`,
): Promise<GovernanceDelegateDetailsResult> {
  const allMetadata = await fetchMondoDelegateMetadata();
  const metadata = findMetadataByAddress(allMetadata, address) ?? null;
  const stats = await fetchDelegateOnChainStats(client, address);

  return {
    network: "mainnet",
    address,
    inMondoDirectory: metadata !== null,
    source: "celo-mondo",
    sourceUrl: CELO_MONDO_DELEGATES_URL,
    directoryNote: DIRECTORY_NOTE,
    metadata,
    ...stats,
  };
}
