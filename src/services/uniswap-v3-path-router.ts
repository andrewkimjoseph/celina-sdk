/**
 * Uniswap v3 path routing: BFS over the hub-pool index and QuoterV2 selection.
 */
import { encodeFunctionData, encodePacked, type Hex, type PublicClient } from "viem";
import { swapRouter02Abi, v3QuoterAbi } from "../abis/uniswap-v3.js";
import { UNISWAP_V3, type UniswapV3Pool } from "../config/uniswap.js";
import {
  getUniswapV3PoolIndex,
  poolsBetweenV3,
  type UniswapV3PoolIndex,
} from "./uniswap-v3-pool-discovery.js";

/** Best quoted v3 route between two tokens. Pools are in hop order. */
export type UniswapV3SwapRoute = {
  tokenIn: `0x${string}`;
  tokenOut: `0x${string}`;
  pools: UniswapV3Pool[];
  hops: number;
};

const MAX_POOLS = 3;

/** Token on the other side of a canonical v3 pool. */
export function otherV3Token(
  pool: UniswapV3Pool,
  token: `0x${string}`,
): `0x${string}` {
  const current = token.toLowerCase();
  if (pool.token0.toLowerCase() === current) return pool.token1;
  if (pool.token1.toLowerCase() === current) return pool.token0;
  throw new Error("Token is not in the Uniswap v3 pool.");
}

/** Packed v3 path: token, fee, token, fee, token. */
export function encodeV3Path(tokenIn: `0x${string}`, pools: UniswapV3Pool[]): Hex {
  const types: ("address" | "uint24")[] = ["address"];
  const values: (`0x${string}` | number)[] = [tokenIn];
  let current = tokenIn;

  for (const pool of pools) {
    const out = otherV3Token(pool, current);
    types.push("uint24", "address");
    values.push(pool.fee, out);
    current = out;
  }

  return encodePacked(types, values);
}

/**
 * SwapRouter02 calldata. Single- and multi-hop swaps are wrapped in
 * `multicall(deadline, bytes[])` because exactInput has no deadline field.
 */
export function buildSwapRouter02Calldata(args: {
  tokenIn: `0x${string}`;
  recipient: `0x${string}`;
  amountIn: bigint;
  amountOutMin: bigint;
  deadline: bigint;
  pools: UniswapV3Pool[];
}): Hex {
  const { pools, tokenIn, recipient, amountIn, amountOutMin, deadline } = args;
  if (pools.length === 0) {
    throw new Error("Uniswap v3 route has no pools.");
  }

  const inner =
    pools.length === 1
      ? encodeFunctionData({
          abi: swapRouter02Abi,
          functionName: "exactInputSingle",
          args: [
            {
              tokenIn,
              tokenOut: otherV3Token(pools[0]!, tokenIn),
              fee: pools[0]!.fee,
              recipient,
              amountIn,
              amountOutMinimum: amountOutMin,
              sqrtPriceLimitX96: 0n,
            },
          ],
        })
      : encodeFunctionData({
          abi: swapRouter02Abi,
          functionName: "exactInput",
          args: [
            {
              path: encodeV3Path(tokenIn, pools),
              recipient,
              amountIn,
              amountOutMinimum: amountOutMin,
            },
          ],
        });

  return encodeFunctionData({
    abi: swapRouter02Abi,
    functionName: "multicall",
    args: [deadline, [inner]],
  });
}

export function enumerateV3Paths(
  index: UniswapV3PoolIndex,
  tokenIn: `0x${string}`,
  tokenOut: `0x${string}`,
): UniswapV3Pool[][] {
  const start = tokenIn.toLowerCase();
  const goal = tokenOut.toLowerCase();
  if (start === goal) {
    return [];
  }

  const results: UniswapV3Pool[][] = [];
  const queue: { token: string; pools: UniswapV3Pool[]; visited: Set<string> }[] = [
    { token: start, pools: [], visited: new Set([start]) },
  ];

  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node.pools.length >= MAX_POOLS) {
      continue;
    }

    const neighbors = index.adjacency.get(node.token);
    if (!neighbors) {
      continue;
    }

    for (const neighbor of neighbors) {
      if (node.visited.has(neighbor)) {
        continue;
      }

      for (const pool of poolsBetweenV3(
        index,
        node.token as `0x${string}`,
        neighbor as `0x${string}`,
      )) {
        const nextPools = [...node.pools, pool];
        if (neighbor === goal) {
          results.push(nextPools);
          continue;
        }
        if (nextPools.length < MAX_POOLS) {
          queue.push({
            token: neighbor,
            pools: nextPools,
            visited: new Set([...node.visited, neighbor]),
          });
        }
      }
    }
  }

  return results;
}

export function countV3CandidatePaths(
  index: UniswapV3PoolIndex,
  tokenIn: `0x${string}`,
  tokenOut: `0x${string}`,
): number {
  return enumerateV3Paths(index, tokenIn, tokenOut).length;
}

async function quoteV3Path(
  client: PublicClient,
  tokenIn: `0x${string}`,
  pools: UniswapV3Pool[],
  amountIn: bigint,
): Promise<bigint> {
  if (pools.length === 0) {
    return 0n;
  }

  if (pools.length === 1) {
    const pool = pools[0]!;
    const { result } = await client.simulateContract({
      address: UNISWAP_V3.quoterV2,
      abi: v3QuoterAbi,
      functionName: "quoteExactInputSingle",
      args: [
        {
          tokenIn,
          tokenOut: otherV3Token(pool, tokenIn),
          amountIn,
          fee: pool.fee,
          sqrtPriceLimitX96: 0n,
        },
      ],
    });
    return result[0];
  }

  const { result } = await client.simulateContract({
    address: UNISWAP_V3.quoterV2,
    abi: v3QuoterAbi,
    functionName: "quoteExactInput",
    args: [encodeV3Path(tokenIn, pools), amountIn],
  });
  return result[0];
}

/**
 * Quote candidate v3 paths and return the highest output.
 * @param maxPaths - Cap on simulateContract calls for this venue
 */
export async function findBestV3Route(
  client: PublicClient,
  tokenIn: `0x${string}`,
  tokenOut: `0x${string}`,
  amountIn: bigint,
  maxPaths: number,
  index?: UniswapV3PoolIndex,
): Promise<{ route: UniswapV3SwapRoute; amountOut: bigint; indexSource: "onchain" } | null> {
  const poolIndex = index ?? (await getUniswapV3PoolIndex(client));
  const candidatePaths = enumerateV3Paths(poolIndex, tokenIn, tokenOut)
    .sort((a, b) => a.length - b.length)
    .slice(0, Math.max(0, maxPaths));

  const quotes = await Promise.allSettled(
    candidatePaths.map(async (pools) => ({
      pools,
      amountOut: await quoteV3Path(client, tokenIn, pools, amountIn),
    })),
  );

  let best: { route: UniswapV3SwapRoute; amountOut: bigint } | null = null;
  for (const quote of quotes) {
    if (quote.status !== "fulfilled" || quote.value.amountOut <= 0n) {
      continue;
    }
    if (!best || quote.value.amountOut > best.amountOut) {
      best = {
        amountOut: quote.value.amountOut,
        route: {
          tokenIn,
          tokenOut,
          pools: quote.value.pools,
          hops: quote.value.pools.length,
        },
      };
    }
  }

  if (!best) {
    return null;
  }

  return { ...best, indexSource: poolIndex.source };
}
