/**
 * Uniswap v4 pool discovery: subgraph index with on-chain hub fallback.
 */
import {
  encodeAbiParameters,
  keccak256,
  parseAbiParameters,
  type PublicClient,
} from "viem";
import { stateViewAbi } from "../abis/uniswap-state-view.js";
import {
  normalizeUniswapPoolKey,
  toUniswapRoutingCurrency,
  UNISWAP_DEFAULT_TICK_SPACING,
  UNISWAP_FEE_TIERS,
  UNISWAP_HUB_CURRENCIES,
  UNISWAP_POOL_CACHE_TTL_MS,
  UNISWAP_SUBGRAPH_URL,
  UNISWAP_V4,
  type UniswapPoolKey,
} from "../config/uniswap.js";

/** One edge in the v4 pool routing graph. */
export type UniswapPoolEdge = {
  poolKey: UniswapPoolKey;
  tokenA: `0x${string}`;
  tokenB: `0x${string}`;
};

/** Cached routing graph of v4 pools on Celo mainnet. */
export type UniswapPoolIndex = {
  edges: UniswapPoolEdge[];
  /** Currency address (lowercase) → neighbor currencies in the graph. */
  adjacency: Map<string, Set<string>>;
  /**
   * Sorted pair key (`tokenLo|tokenHi`, lowercase) → every pool connecting that
   * pair. A single token pair can have several pools across fee tiers, so the
   * router must consider all of them to find the best rate.
   */
  poolsByPair: Map<string, UniswapPoolKey[]>;
  /** Whether pools came from the v4 subgraph or on-chain hub probing. */
  source: "subgraph" | "onchain";
  fetchedAt: number;
};

let cachedIndex: UniswapPoolIndex | null = null;

/** Canonical lowercase key for the unordered pair `(a, b)`. */
function pairKey(a: string, b: string): string {
  const lo = a.toLowerCase();
  const hi = b.toLowerCase();
  return lo < hi ? `${lo}|${hi}` : `${hi}|${lo}`;
}

/**
 * Compute the Uniswap v4 pool id (keccak256 of sorted pool key fields).
 * @param poolKey - Pool key (normalized so currency0 sorts before currency1)
 */
export function computeUniswapPoolId(poolKey: UniswapPoolKey): `0x${string}` {
  const normalized = normalizeUniswapPoolKey(poolKey);
  return keccak256(
    encodeAbiParameters(
      parseAbiParameters(
        "address currency0, address currency1, uint24 fee, int24 tickSpacing, address hooks",
      ),
      [
        normalized.currency0,
        normalized.currency1,
        normalized.fee,
        normalized.tickSpacing,
        normalized.hooks,
      ],
    ),
  );
}

/**
 * Build a routing index from raw pool keys: dedup by pool id, then derive the
 * edge list, currency adjacency, and per-pair pool buckets.
 */
function buildPoolIndex(
  poolKeys: UniswapPoolKey[],
  source: "subgraph" | "onchain",
): UniswapPoolIndex {
  const edges: UniswapPoolEdge[] = [];
  const adjacency = new Map<string, Set<string>>();
  const poolsByPair = new Map<string, UniswapPoolKey[]>();
  const seen = new Set<string>();

  for (const key of poolKeys) {
    const normalized = normalizeUniswapPoolKey(key);
    const id = computeUniswapPoolId(normalized);
    if (seen.has(id)) {
      continue;
    }
    seen.add(id);

    const a = normalized.currency0.toLowerCase();
    const b = normalized.currency1.toLowerCase();

    edges.push({
      poolKey: normalized,
      tokenA: normalized.currency0,
      tokenB: normalized.currency1,
    });

    if (!adjacency.has(a)) adjacency.set(a, new Set());
    if (!adjacency.has(b)) adjacency.set(b, new Set());
    adjacency.get(a)!.add(b);
    adjacency.get(b)!.add(a);

    const pk = pairKey(a, b);
    const bucket = poolsByPair.get(pk);
    if (bucket) {
      bucket.push(normalized);
    } else {
      poolsByPair.set(pk, [normalized]);
    }
  }

  return { edges, adjacency, poolsByPair, source, fetchedAt: Date.now() };
}

/**
 * Map a subgraph token id to the currency used for routing. The subgraph may
 * index native CELO as `address(0)`, but v4 liquidity actually sits on WCELO
 * pairs (see `toUniswapRoutingCurrency`), so normalize here to keep
 * subgraph-sourced pools consistent with the on-chain fallback's graph.
 */
function normalizeSubgraphCurrency(tokenId: string): `0x${string}` {
  if (tokenId.toLowerCase() === UNISWAP_V4.nativeCurrency) {
    return toUniswapRoutingCurrency("native");
  }
  return tokenId as `0x${string}`;
}

async function fetchSubgraphPools(): Promise<UniswapPoolKey[] | null> {
  try {
    const response = await fetch(UNISWAP_SUBGRAPH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `{
          pools(first: 500, orderBy: totalValueLockedUSD, orderDirection: desc) {
            feeTier
            tickSpacing
            hooks
            token0 { id }
            token1 { id }
          }
        }`,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const json = (await response.json()) as {
      data?: {
        pools?: Array<{
          feeTier: string;
          tickSpacing: string;
          hooks: string;
          token0: { id: string };
          token1: { id: string };
        }>;
      };
    };

    const pools = json.data?.pools;
    if (!pools?.length) {
      return null;
    }

    return pools.map((pool) => ({
      currency0: normalizeSubgraphCurrency(pool.token0.id),
      currency1: normalizeSubgraphCurrency(pool.token1.id),
      fee: Number(pool.feeTier),
      tickSpacing: Number(pool.tickSpacing),
      hooks: (pool.hooks || UNISWAP_V4.zeroHooks) as `0x${string}`,
    }));
  } catch {
    return null;
  }
}

/**
 * Contracts probed per `multicall` batch (2 reads per pool → up to 50 pools
 * per call). Keeps each on-chain round trip well under RPC call-size/gas
 * caps while still collapsing hundreds of individual `readContract` calls —
 * which blow past Cloudflare Workers' per-invocation subrequest ceiling —
 * into a small, fixed number of batched requests.
 */
const MULTICALL_CHUNK_SIZE = 100;

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

/**
 * Probe candidate pools for initialization (non-zero price + liquidity) via
 * batched `multicall` reads rather than one `readContract` per pool.
 * @param client - Celo public client for StateView probing
 * @param candidates - Pool keys and their precomputed pool ids to probe
 */
async function probePoolsOnChain(
  client: PublicClient,
  candidates: { poolKey: UniswapPoolKey; poolId: `0x${string}` }[],
): Promise<UniswapPoolKey[]> {
  if (candidates.length === 0) {
    return [];
  }

  const batches = chunk(candidates, MULTICALL_CHUNK_SIZE);

  const batchResults = await Promise.all(
    batches.map(async (batch) => {
      const contracts = batch.flatMap(({ poolId }) => [
        {
          address: UNISWAP_V4.stateView,
          abi: stateViewAbi,
          functionName: "getSlot0" as const,
          args: [poolId] as const,
        },
        {
          address: UNISWAP_V4.stateView,
          abi: stateViewAbi,
          functionName: "getLiquidity" as const,
          args: [poolId] as const,
        },
      ]);

      const results = await client.multicall({ contracts, allowFailure: true });

      const found: UniswapPoolKey[] = [];
      for (let i = 0; i < batch.length; i++) {
        const slot0Result = results[i * 2];
        const liquidityResult = results[i * 2 + 1];

        if (
          slot0Result?.status === "success" &&
          liquidityResult?.status === "success"
        ) {
          const slot0 = slot0Result.result as readonly [
            bigint,
            number,
            number,
            number,
          ];
          const liquidity = liquidityResult.result as bigint;

          if (slot0[0] > 0n && liquidity > 0n) {
            found.push(batch[i]!.poolKey);
          }
        }
      }
      return found;
    }),
  );

  return batchResults.flat();
}

async function buildOnChainIndex(client: PublicClient): Promise<UniswapPoolIndex> {
  const hubs = [...UNISWAP_HUB_CURRENCIES];
  const candidates: { poolKey: UniswapPoolKey; poolId: `0x${string}` }[] = [];

  for (let i = 0; i < hubs.length; i++) {
    for (let j = i + 1; j < hubs.length; j++) {
      const [currency0, currency1] =
        hubs[i].toLowerCase() < hubs[j].toLowerCase()
          ? [hubs[i], hubs[j]]
          : [hubs[j], hubs[i]];

      for (const fee of UNISWAP_FEE_TIERS) {
        const tickSpacing =
          UNISWAP_DEFAULT_TICK_SPACING[fee] ??
          UNISWAP_DEFAULT_TICK_SPACING[3000]!;

        const poolKey = normalizeUniswapPoolKey({
          currency0,
          currency1,
          fee,
          tickSpacing,
          hooks: UNISWAP_V4.zeroHooks,
        });

        candidates.push({ poolKey, poolId: computeUniswapPoolId(poolKey) });
      }
    }
  }

  const poolKeys = await probePoolsOnChain(client, candidates);

  return buildPoolIndex(poolKeys, "onchain");
}

/**
 * Load or refresh the v4 pool index (subgraph first, on-chain hub fallback).
 * @param client - Celo public client for StateView probing
 * @param options.forceRefresh - Bypass TTL cache when true
 */
export async function getUniswapPoolIndex(
  client: PublicClient,
  options?: { forceRefresh?: boolean },
): Promise<UniswapPoolIndex> {
  const now = Date.now();
  if (
    !options?.forceRefresh &&
    cachedIndex &&
    now - cachedIndex.fetchedAt < UNISWAP_POOL_CACHE_TTL_MS
  ) {
    return cachedIndex;
  }

  const subgraphPools = await fetchSubgraphPools();
  if (subgraphPools?.length) {
    cachedIndex = buildPoolIndex(subgraphPools, "subgraph");
    return cachedIndex;
  }

  cachedIndex = await buildOnChainIndex(client);
  return cachedIndex;
}

/**
 * All pools connecting two tokens in a cached index (one per fee tier / hooks).
 * @param index - Pool graph from `getUniswapPoolIndex`
 * @param tokenA - First currency address
 * @param tokenB - Second currency address
 */
export function poolsBetween(
  index: UniswapPoolIndex,
  tokenA: `0x${string}`,
  tokenB: `0x${string}`,
): UniswapPoolKey[] {
  return index.poolsByPair.get(pairKey(tokenA, tokenB)) ?? [];
}

/**
 * Find a pool key connecting two tokens in a cached index, if present.
 * @param index - Pool graph from `getUniswapPoolIndex`
 * @param tokenA - First currency address
 * @param tokenB - Second currency address
 */
export function findPoolBetween(
  index: UniswapPoolIndex,
  tokenA: `0x${string}`,
  tokenB: `0x${string}`,
): UniswapPoolKey | null {
  return poolsBetween(index, tokenA, tokenB)[0] ?? null;
}

/** Reset cached index (for tests). */
export function resetUniswapPoolIndexCache(): void {
  cachedIndex = null;
}
