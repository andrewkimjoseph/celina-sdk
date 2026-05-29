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
  /** Whether pools came from the v4 subgraph or on-chain hub probing. */
  source: "subgraph" | "onchain";
  fetchedAt: number;
};

let cachedIndex: UniswapPoolIndex | null = null;

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

function addEdge(
  edges: UniswapPoolEdge[],
  adjacency: Map<string, Set<string>>,
  poolKey: UniswapPoolKey,
) {
  const normalized = normalizeUniswapPoolKey(poolKey);
  const a = normalized.currency0.toLowerCase();
  const b = normalized.currency1.toLowerCase();

  if (edges.some((edge) => edge.poolKey === normalized)) {
    return;
  }

  edges.push({
    poolKey: normalized,
    tokenA: normalized.currency0,
    tokenB: normalized.currency1,
  });

  if (!adjacency.has(a)) adjacency.set(a, new Set());
  if (!adjacency.has(b)) adjacency.set(b, new Set());
  adjacency.get(a)!.add(b);
  adjacency.get(b)!.add(a);
}

async function fetchSubgraphPools(): Promise<UniswapPoolEdge[] | null> {
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

    const edges: UniswapPoolEdge[] = [];
    const adjacency = new Map<string, Set<string>>();

    for (const pool of pools) {
      const poolKey: UniswapPoolKey = {
        currency0: pool.token0.id as `0x${string}`,
        currency1: pool.token1.id as `0x${string}`,
        fee: Number(pool.feeTier),
        tickSpacing: Number(pool.tickSpacing),
        hooks: (pool.hooks || UNISWAP_V4.zeroHooks) as `0x${string}`,
      };
      addEdge(edges, adjacency, poolKey);
    }

    return edges;
  } catch {
    return null;
  }
}

async function probePoolOnChain(
  client: PublicClient,
  currencyA: `0x${string}`,
  currencyB: `0x${string}`,
  fee: number,
  tickSpacing: number,
): Promise<UniswapPoolKey | null> {
  const poolKey = normalizeUniswapPoolKey({
    currency0: currencyA,
    currency1: currencyB,
    fee,
    tickSpacing,
    hooks: UNISWAP_V4.zeroHooks,
  });

  const poolId = computeUniswapPoolId(poolKey);

  try {
    const [slot0, liquidity] = await Promise.all([
      client.readContract({
        address: UNISWAP_V4.stateView,
        abi: stateViewAbi,
        functionName: "getSlot0",
        args: [poolId],
      }),
      client.readContract({
        address: UNISWAP_V4.stateView,
        abi: stateViewAbi,
        functionName: "getLiquidity",
        args: [poolId],
      }),
    ]);

    if (slot0[0] > 0n && liquidity > 0n) {
      return poolKey;
    }
  } catch {
    // pool not initialized
  }

  return null;
}

async function buildOnChainIndex(client: PublicClient): Promise<UniswapPoolIndex> {
  const edges: UniswapPoolEdge[] = [];
  const adjacency = new Map<string, Set<string>>();
  const hubs = [...UNISWAP_HUB_CURRENCIES];

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

        const poolKey = await probePoolOnChain(
          client,
          currency0,
          currency1,
          fee,
          tickSpacing,
        );

        if (poolKey) {
          addEdge(edges, adjacency, poolKey);
        }
      }
    }
  }

  return {
    edges,
    adjacency,
    source: "onchain",
    fetchedAt: Date.now(),
  };
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

  const subgraphEdges = await fetchSubgraphPools();
  if (subgraphEdges?.length) {
    const adjacency = new Map<string, Set<string>>();
    for (const edge of subgraphEdges) {
      const a = edge.tokenA.toLowerCase();
      const b = edge.tokenB.toLowerCase();
      if (!adjacency.has(a)) adjacency.set(a, new Set());
      if (!adjacency.has(b)) adjacency.set(b, new Set());
      adjacency.get(a)!.add(b);
      adjacency.get(b)!.add(a);
    }

    cachedIndex = {
      edges: subgraphEdges,
      adjacency,
      source: "subgraph",
      fetchedAt: now,
    };
    return cachedIndex;
  }

  cachedIndex = await buildOnChainIndex(client);
  return cachedIndex;
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
  const a = tokenA.toLowerCase();
  const b = tokenB.toLowerCase();

  for (const edge of index.edges) {
    const e0 = edge.tokenA.toLowerCase();
    const e1 = edge.tokenB.toLowerCase();
    if ((e0 === a && e1 === b) || (e0 === b && e1 === a)) {
      return edge.poolKey;
    }
  }

  return null;
}

/** Reset cached index (for tests). */
export function resetUniswapPoolIndexCache(): void {
  cachedIndex = null;
}
