/**
 * Uniswap v4 path routing: BFS over pool index and V4Quoter best-path selection.
 */
import type { PublicClient } from "viem";
import { v4QuoterAbi } from "../abis/uniswap-v4-quoter.js";
import {
  normalizeUniswapPoolKey,
  UNISWAP_V4,
  type UniswapPoolKey,
} from "../config/uniswap.js";
import {
  getUniswapPoolIndex,
  poolsBetween,
  type UniswapPoolIndex,
} from "./uniswap-pool-discovery.js";

/** Single hop descriptor in a Uniswap v4 multi-hop path. */
export type UniswapPathKey = {
  intermediateCurrency: `0x${string}`;
  fee: number;
  tickSpacing: number;
  hooks: `0x${string}`;
  hookData: `0x${string}`;
};

/** Best quoted route between two v4 currencies. */
export type UniswapSwapRoute = {
  currencyIn: `0x${string}`;
  currencyOut: `0x${string}`;
  pools: UniswapPoolKey[];
  pathKeys: UniswapPathKey[];
  hops: number;
};

/** Maximum pools in a route (2 intermediate currencies → 3 pools). */
const MAX_POOLS = 3;

function otherToken(
  poolKey: UniswapPoolKey,
  currency: `0x${string}`,
): `0x${string}` | null {
  const c = currency.toLowerCase();
  if (poolKey.currency0.toLowerCase() === c) return poolKey.currency1;
  if (poolKey.currency1.toLowerCase() === c) return poolKey.currency0;
  return null;
}

function buildPathKeys(
  pools: UniswapPoolKey[],
  currencyIn: `0x${string}`,
): UniswapPathKey[] {
  let current = currencyIn;
  const pathKeys: UniswapPathKey[] = [];

  for (const poolKey of pools) {
    const out = otherToken(poolKey, current);
    if (!out) {
      throw new Error("Invalid swap path for Uniswap v4 pools.");
    }

    pathKeys.push({
      intermediateCurrency: out,
      fee: poolKey.fee,
      tickSpacing: poolKey.tickSpacing,
      hooks: poolKey.hooks,
      hookData: "0x",
    });
    current = out;
  }

  return pathKeys;
}

function enumeratePaths(
  index: UniswapPoolIndex,
  currencyIn: `0x${string}`,
  currencyOut: `0x${string}`,
): UniswapPoolKey[][] {
  const start = currencyIn.toLowerCase();
  const goal = currencyOut.toLowerCase();
  if (start === goal) {
    return [];
  }

  const results: UniswapPoolKey[][] = [];
  const queue: { currency: string; pools: UniswapPoolKey[]; visited: Set<string> }[] =
    [{ currency: start, pools: [], visited: new Set([start]) }];

  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node.pools.length >= MAX_POOLS) {
      continue;
    }

    const neighbors = index.adjacency.get(node.currency);
    if (!neighbors) {
      continue;
    }

    for (const neighbor of neighbors) {
      if (node.visited.has(neighbor)) {
        continue;
      }

      // A pair can have several pools (different fee tiers); branch over each so
      // the quoter can pick the genuinely best-priced one.
      for (const poolKey of poolsBetween(
        index,
        node.currency as `0x${string}`,
        neighbor as `0x${string}`,
      )) {
        const nextPools = [...node.pools, poolKey];
        if (neighbor === goal) {
          results.push(nextPools);
          continue;
        }

        if (nextPools.length < MAX_POOLS) {
          queue.push({
            currency: neighbor,
            pools: nextPools,
            visited: new Set([...node.visited, neighbor]),
          });
        }
      }
    }
  }

  return results;
}

async function quotePath(
  client: PublicClient,
  currencyIn: `0x${string}`,
  pools: UniswapPoolKey[],
  amountIn: bigint,
): Promise<bigint> {
  if (pools.length === 0) {
    return 0n;
  }

  if (pools.length === 1) {
    const poolKey = normalizeUniswapPoolKey(pools[0]!);
    const zeroForOne =
      currencyIn.toLowerCase() === poolKey.currency0.toLowerCase();

    const { result } = await client.simulateContract({
      address: UNISWAP_V4.v4Quoter,
      abi: v4QuoterAbi,
      functionName: "quoteExactInputSingle",
      args: [
        {
          poolKey,
          zeroForOne,
          exactAmount: amountIn,
          hookData: "0x",
        },
      ],
    });

    return result[0];
  }

  const pathKeys = buildPathKeys(pools, currencyIn);
  const { result } = await client.simulateContract({
    address: UNISWAP_V4.v4Quoter,
    abi: v4QuoterAbi,
    functionName: "quoteExactInput",
    args: [
      {
        exactCurrency: currencyIn,
        path: pathKeys,
        exactAmount: amountIn,
      },
    ],
  });

  return result[0];
}

/**
 * Quote all candidate paths and return the highest-output Uniswap v4 route.
 * @param client - Celo public client for quoter simulation
 * @param currencyIn - Input currency address (native CELO maps to WCELO upstream)
 * @param currencyOut - Output currency address
 * @param amountIn - Input amount in base units
 * @returns Best route and quoter output, or `null` when no path quotes successfully
 */
export async function findBestUniswapRoute(
  client: PublicClient,
  currencyIn: `0x${string}`,
  currencyOut: `0x${string}`,
  amountIn: bigint,
): Promise<{ route: UniswapSwapRoute; amountOut: bigint; indexSource: string } | null> {
  const index = await getUniswapPoolIndex(client);
  const candidatePaths = enumeratePaths(index, currencyIn, currencyOut);

  // Quote every candidate path concurrently; failed quotes (e.g. uninitialized
  // pools or insufficient liquidity) are dropped rather than aborting the rest.
  const quotes = await Promise.allSettled(
    candidatePaths.map(async (pools) => ({
      pools,
      amountOut: await quotePath(client, currencyIn, pools, amountIn),
    })),
  );

  let best: { route: UniswapSwapRoute; amountOut: bigint } | null = null;

  for (const quote of quotes) {
    if (quote.status !== "fulfilled") {
      continue;
    }

    const { pools, amountOut } = quote.value;
    if (amountOut <= 0n) {
      continue;
    }

    if (!best || amountOut > best.amountOut) {
      best = {
        amountOut,
        route: {
          currencyIn,
          currencyOut,
          pools,
          pathKeys: buildPathKeys(pools, currencyIn),
          hops: pools.length,
        },
      };
    }
  }

  if (!best) {
    return null;
  }

  return {
    route: best.route,
    amountOut: best.amountOut,
    indexSource: index.source,
  };
}

/**
 * Apply slippage tolerance to a quoted output amount.
 * @param amountOut - Quoted output in base units
 * @param slippagePercent - Max slippage in percent (e.g. `0.5` for 0.5%)
 */
export function applySlippage(amountOut: bigint, slippagePercent: number): bigint {
  const bps = BigInt(Math.round(slippagePercent * 100));
  return (amountOut * (10000n - bps)) / 10000n;
}
