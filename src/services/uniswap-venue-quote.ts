/**
 * Pick the better of the best Uniswap v3 path and the best Uniswap v4 path.
 * A quote simulates at most MAX_QUOTE_PATHS paths across both venues.
 */
import type { PublicClient } from "viem";
import type { UniswapProtocol } from "../config/uniswap.js";
import { getUniswapV3PoolIndex } from "./uniswap-v3-pool-discovery.js";
import {
  countV3CandidatePaths,
  findBestV3Route,
  type UniswapV3SwapRoute,
} from "./uniswap-v3-path-router.js";
import { getUniswapPoolIndex } from "./uniswap-pool-discovery.js";
import {
  countV4CandidatePaths,
  findBestUniswapRoute,
  MAX_QUOTE_PATHS,
  splitQuoteBudget,
  type UniswapSwapRoute,
} from "./uniswap-path-router.js";

export type UniswapQuotedRoute =
  | {
      protocol: "uniswap_v4";
      amountOut: bigint;
      indexSource: string;
      hops: number;
      route: UniswapSwapRoute;
    }
  | {
      protocol: "uniswap_v3";
      amountOut: bigint;
      indexSource: string;
      hops: number;
      route: UniswapV3SwapRoute;
    };

function prefer(
  current: UniswapQuotedRoute | null,
  next: UniswapQuotedRoute | null,
): UniswapQuotedRoute | null {
  if (!next) return current;
  if (!current) return next;
  if (next.amountOut > current.amountOut) return next;
  if (next.amountOut < current.amountOut) return current;
  // Equal output: v3 needs at most one approval, v4 can need two.
  if (next.protocol === "uniswap_v3" && current.protocol === "uniswap_v4") {
    return next;
  }
  return current;
}

/**
 * Quote v3 and v4, or only the pinned venue.
 * @returns The winning route, or null when every attempted venue has no liquidity
 */
export async function findBestUniswapQuote(
  client: PublicClient,
  currencyIn: `0x${string}`,
  currencyOut: `0x${string}`,
  amountIn: bigint,
  options?: { protocol?: UniswapProtocol },
): Promise<UniswapQuotedRoute | null> {
  const pinned = options?.protocol;

  if (pinned === "uniswap_v4") {
    const found = await findBestUniswapRoute(
      client,
      currencyIn,
      currencyOut,
      amountIn,
      MAX_QUOTE_PATHS,
    );
    if (!found) return null;
    return {
      protocol: "uniswap_v4",
      amountOut: found.amountOut,
      indexSource: found.indexSource,
      hops: found.route.hops,
      route: found.route,
    };
  }

  if (pinned === "uniswap_v3") {
    const found = await findBestV3Route(
      client,
      currencyIn,
      currencyOut,
      amountIn,
      MAX_QUOTE_PATHS,
    );
    if (!found) return null;
    return {
      protocol: "uniswap_v3",
      amountOut: found.amountOut,
      indexSource: found.indexSource,
      hops: found.route.hops,
      route: found.route,
    };
  }

  const [v4IndexResult, v3IndexResult] = await Promise.allSettled([
    getUniswapPoolIndex(client),
    getUniswapV3PoolIndex(client),
  ]);

  const v4Index = v4IndexResult.status === "fulfilled" ? v4IndexResult.value : null;
  const v3Index = v3IndexResult.status === "fulfilled" ? v3IndexResult.value : null;
  if (!v4Index && !v3Index) {
    throw v4IndexResult.status === "rejected"
      ? v4IndexResult.reason
      : v3IndexResult.status === "rejected"
        ? v3IndexResult.reason
        : new Error("Uniswap pool index unavailable.");
  }

  const caps = splitQuoteBudget(
    v4Index ? countV4CandidatePaths(v4Index, currencyIn, currencyOut) : 0,
    v3Index ? countV3CandidatePaths(v3Index, currencyIn, currencyOut) : 0,
  );

  const [v4Result, v3Result] = await Promise.allSettled([
    v4Index
      ? findBestUniswapRoute(
          client,
          currencyIn,
          currencyOut,
          amountIn,
          caps.first,
          v4Index,
        )
      : Promise.reject(
          v4IndexResult.status === "rejected"
            ? v4IndexResult.reason
            : new Error("Uniswap v4 pool index unavailable."),
        ),
    v3Index
      ? findBestV3Route(
          client,
          currencyIn,
          currencyOut,
          amountIn,
          caps.second,
          v3Index,
        )
      : Promise.reject(
          v3IndexResult.status === "rejected"
            ? v3IndexResult.reason
            : new Error("Uniswap v3 pool index unavailable."),
        ),
  ]);

  let best: UniswapQuotedRoute | null = null;
  const failures: unknown[] = [];

  if (v4Result.status === "fulfilled") {
    if (v4Result.value) {
      best = prefer(best, {
        protocol: "uniswap_v4",
        amountOut: v4Result.value.amountOut,
        indexSource: v4Result.value.indexSource,
        hops: v4Result.value.route.hops,
        route: v4Result.value.route,
      });
    }
  } else {
    failures.push(v4Result.reason);
  }

  if (v3Result.status === "fulfilled") {
    if (v3Result.value) {
      best = prefer(best, {
        protocol: "uniswap_v3",
        amountOut: v3Result.value.amountOut,
        indexSource: v3Result.value.indexSource,
        hops: v3Result.value.route.hops,
        route: v3Result.value.route,
      });
    }
  } else {
    failures.push(v3Result.reason);
  }

  if (best) {
    return best;
  }
  if (failures.length > 0) {
    throw failures[0];
  }
  return null;
}
