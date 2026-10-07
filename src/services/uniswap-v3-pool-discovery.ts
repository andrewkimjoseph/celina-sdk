/**
 * Uniswap v3 pool discovery: on-chain hub probing via the Celo v3 factory.
 * Hub-to-hub pools only — there is no v3 subgraph in this SDK.
 */
import type { PublicClient } from "viem";
import { uniswapV3FactoryAbi, uniswapV3PoolAbi } from "../abis/uniswap-v3.js";
import {
  UNISWAP_HUB_CURRENCIES,
  UNISWAP_POOL_CACHE_TTL_MS,
  UNISWAP_V3,
  UNISWAP_V3_FEE_TIERS,
  UNISWAP_V4,
  type UniswapV3Pool,
} from "../config/uniswap.js";

/** One edge in the v3 pool routing graph. */
export type UniswapV3PoolEdge = {
  pool: UniswapV3Pool;
  tokenA: `0x${string}`;
  tokenB: `0x${string}`;
};

/** Cached routing graph of v3 hub pools on Celo mainnet. */
export type UniswapV3PoolIndex = {
  edges: UniswapV3PoolEdge[];
  adjacency: Map<string, Set<string>>;
  /** Sorted pair key (`tokenLo|tokenHi`) → pools across fee tiers. */
  poolsByPair: Map<string, UniswapV3Pool[]>;
  source: "onchain";
  fetchedAt: number;
};

const ZERO_ADDRESS = UNISWAP_V4.nativeCurrency.toLowerCase();
const MULTICALL_CHUNK_SIZE = 100;

let cachedIndex: UniswapV3PoolIndex | null = null;

function pairKey(a: string, b: string): string {
  const lo = a.toLowerCase();
  const hi = b.toLowerCase();
  return lo < hi ? `${lo}|${hi}` : `${hi}|${lo}`;
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function sortTokens(
  a: `0x${string}`,
  b: `0x${string}`,
): [`0x${string}`, `0x${string}`] {
  return a.toLowerCase() < b.toLowerCase() ? [a, b] : [b, a];
}

function buildPoolIndex(pools: UniswapV3Pool[]): UniswapV3PoolIndex {
  const edges: UniswapV3PoolEdge[] = [];
  const adjacency = new Map<string, Set<string>>();
  const poolsByPair = new Map<string, UniswapV3Pool[]>();

  for (const pool of pools) {
    const tokenA = pool.token0.toLowerCase() as `0x${string}`;
    const tokenB = pool.token1.toLowerCase() as `0x${string}`;
    edges.push({ pool, tokenA, tokenB });

    const key = pairKey(tokenA, tokenB);
    const existing = poolsByPair.get(key) ?? [];
    existing.push(pool);
    poolsByPair.set(key, existing);

    for (const [from, to] of [
      [tokenA, tokenB],
      [tokenB, tokenA],
    ] as const) {
      const neighbors = adjacency.get(from) ?? new Set<string>();
      neighbors.add(to);
      adjacency.set(from, neighbors);
    }
  }

  return {
    edges,
    adjacency,
    poolsByPair,
    source: "onchain",
    fetchedAt: Date.now(),
  };
}

async function probeHubPools(client: PublicClient): Promise<UniswapV3Pool[]> {
  const hubs = UNISWAP_HUB_CURRENCIES.filter(
    (currency) => currency.toLowerCase() !== ZERO_ADDRESS,
  );
  const candidates: { token0: `0x${string}`; token1: `0x${string}`; fee: number }[] = [];

  for (let i = 0; i < hubs.length; i++) {
    for (let j = i + 1; j < hubs.length; j++) {
      const [token0, token1] = sortTokens(hubs[i]!, hubs[j]!);
      for (const fee of UNISWAP_V3_FEE_TIERS) {
        candidates.push({ token0, token1, fee });
      }
    }
  }

  const discovered: { pool: UniswapV3Pool; address: `0x${string}` }[] = [];

  for (const batch of chunk(candidates, MULTICALL_CHUNK_SIZE)) {
    const results = await client.multicall({
      allowFailure: true,
      contracts: batch.map((candidate) => ({
        address: UNISWAP_V3.factory,
        abi: uniswapV3FactoryAbi,
        functionName: "getPool" as const,
        args: [candidate.token0, candidate.token1, candidate.fee] as const,
      })),
    });

    for (let i = 0; i < batch.length; i++) {
      const result = results[i];
      const candidate = batch[i]!;
      if (result?.status !== "success") {
        continue;
      }
      const address = result.result as `0x${string}`;
      if (address.toLowerCase() === ZERO_ADDRESS) {
        continue;
      }
      discovered.push({
        address,
        pool: {
          token0: candidate.token0,
          token1: candidate.token1,
          fee: candidate.fee,
        },
      });
    }
  }

  if (discovered.length === 0) {
    return [];
  }

  const withLiquidity: UniswapV3Pool[] = [];
  for (const batch of chunk(discovered, MULTICALL_CHUNK_SIZE)) {
    const results = await client.multicall({
      allowFailure: true,
      contracts: batch.map((entry) => ({
        address: entry.address,
        abi: uniswapV3PoolAbi,
        functionName: "liquidity" as const,
      })),
    });

    for (let i = 0; i < batch.length; i++) {
      const result = results[i];
      if (result?.status !== "success") {
        continue;
      }
      const liquidity = result.result as bigint;
      if (liquidity > 0n) {
        withLiquidity.push(batch[i]!.pool);
      }
    }
  }

  return withLiquidity;
}

/**
 * Load or refresh the v3 hub-pool index.
 * @param client - Celo public client for factory probing
 * @param options.forceRefresh - Bypass TTL cache when true
 */
export async function getUniswapV3PoolIndex(
  client: PublicClient,
  options?: { forceRefresh?: boolean },
): Promise<UniswapV3PoolIndex> {
  const now = Date.now();
  if (
    !options?.forceRefresh &&
    cachedIndex &&
    now - cachedIndex.fetchedAt < UNISWAP_POOL_CACHE_TTL_MS
  ) {
    return cachedIndex;
  }

  cachedIndex = buildPoolIndex(await probeHubPools(client));
  return cachedIndex;
}

/** All v3 pools connecting two tokens in a cached index. */
export function poolsBetweenV3(
  index: UniswapV3PoolIndex,
  tokenA: `0x${string}`,
  tokenB: `0x${string}`,
): UniswapV3Pool[] {
  return index.poolsByPair.get(pairKey(tokenA, tokenB)) ?? [];
}

/** Reset cached v3 index (for tests). */
export function resetUniswapV3PoolIndexCache(): void {
  cachedIndex = null;
}
