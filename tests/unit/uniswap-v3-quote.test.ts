/**
 * Venue selection, v3 calldata, and the shared quote-path budget.
 */
import { decodeFunctionData, encodePacked } from "viem";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { swapRouter02Abi } from "../../src/abis/uniswap-v3.js";
import { UNISWAP_V3, UNISWAP_V4 } from "../../src/config/uniswap.js";
import type { UniswapV3PoolIndex } from "../../src/services/uniswap-v3-pool-discovery.js";
import {
  buildSwapRouter02Calldata,
  encodeV3Path,
} from "../../src/services/uniswap-v3-path-router.js";
import type { UniswapPoolIndex } from "../../src/services/uniswap-pool-discovery.js";
import {
  MAX_QUOTE_PATHS,
  splitQuoteBudget,
} from "../../src/services/uniswap-path-router.js";

const A = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" as `0x${string}`;
const B = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb" as `0x${string}`;
const C = "0xcccccccccccccccccccccccccccccccccccccccc" as `0x${string}`;
const D = "0xdddddddddddddddddddddddddddddddddddddddd" as `0x${string}`;
const E = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" as `0x${string}`;
const ZERO = "0x0000000000000000000000000000000000000000" as `0x${string}`;

function pairKey(x: string, y: string): string {
  const lo = x.toLowerCase();
  const hi = y.toLowerCase();
  return lo < hi ? `${lo}|${hi}` : `${hi}|${lo}`;
}

function v4Pool(c0: `0x${string}`, c1: `0x${string}`, fee: number) {
  const [currency0, currency1] =
    c0.toLowerCase() < c1.toLowerCase() ? [c0, c1] : [c1, c0];
  return { currency0, currency1, fee, tickSpacing: 60, hooks: ZERO };
}

function v3Pool(c0: `0x${string}`, c1: `0x${string}`, fee: number) {
  const [token0, token1] =
    c0.toLowerCase() < c1.toLowerCase() ? [c0, c1] : [c1, c0];
  return { token0, token1, fee };
}

function graph<T>(
  edges: readonly (readonly [`0x${string}`, `0x${string}`])[],
  fees: number[],
  make: (a: `0x${string}`, b: `0x${string}`, fee: number) => T,
  source: "subgraph" | "onchain",
): { poolsByPair: Map<string, T[]>; adjacency: Map<string, Set<string>>; source: "subgraph" | "onchain"; edges: []; fetchedAt: number } {
  const poolsByPair = new Map<string, T[]>();
  const adjacency = new Map<string, Set<string>>();
  for (const [x, y] of edges) {
    poolsByPair.set(
      pairKey(x, y),
      fees.map((fee) => make(x, y, fee)),
    );
    for (const [src, dst] of [
      [x.toLowerCase(), y.toLowerCase()],
      [y.toLowerCase(), x.toLowerCase()],
    ] as const) {
      const set = adjacency.get(src) ?? new Set<string>();
      set.add(dst);
      adjacency.set(src, set);
    }
  }
  return { edges: [], adjacency, poolsByPair, source, fetchedAt: Date.now() };
}

const ONE_EDGE = [[A, B]] as const;
const DENSE_EDGES = [
  [A, B],
  [B, C],
  [B, D],
  [B, E],
  [C, D],
  [C, E],
  [D, E],
] as const;

vi.mock("../../src/services/uniswap-pool-discovery.js", () => ({
  getUniswapPoolIndex: vi.fn(),
  poolsBetween: (index: UniswapPoolIndex, a: `0x${string}`, b: `0x${string}`) => {
    const key = [a.toLowerCase(), b.toLowerCase()].sort().join("|");
    return index.poolsByPair.get(key) ?? [];
  },
}));

vi.mock("../../src/services/uniswap-v3-pool-discovery.js", () => ({
  getUniswapV3PoolIndex: vi.fn(),
  poolsBetweenV3: (
    index: UniswapV3PoolIndex,
    a: `0x${string}`,
    b: `0x${string}`,
  ) => {
    const key = [a.toLowerCase(), b.toLowerCase()].sort().join("|");
    return index.poolsByPair.get(key) ?? [];
  },
}));

import { getUniswapV3PoolIndex } from "../../src/services/uniswap-v3-pool-discovery.js";
import { getUniswapPoolIndex } from "../../src/services/uniswap-pool-discovery.js";
import { findBestUniswapQuote } from "../../src/services/uniswap-venue-quote.js";

function clientReturning(v3Out: bigint | Error, v4Out: bigint | Error) {
  const simulateContract = vi.fn(async (args: { address: string }) => {
    const out =
      args.address.toLowerCase() === UNISWAP_V3.quoterV2.toLowerCase() ? v3Out : v4Out;
    if (out instanceof Error) {
      throw out;
    }
    return { result: [out, 0n, 0, 0n] };
  });
  return { client: { simulateContract } as never, simulateContract };
}

describe("splitQuoteBudget", () => {
  it("gives each venue half when both are dense, and leftover to the larger one", () => {
    expect(splitQuoteBudget(20, 20)).toEqual({ first: 8, second: 8 });
    expect(splitQuoteBudget(2, 20)).toEqual({ first: 2, second: 14 });
    expect(splitQuoteBudget(20, 2)).toEqual({ first: 14, second: 2 });
    expect(splitQuoteBudget(3, 4)).toEqual({ first: 3, second: 4 });
  });
});

describe("SwapRouter02 calldata", () => {
  const tokenIn = A;
  const tokenOut = B;
  const pool = v3Pool(tokenIn, tokenOut, 500);

  it("wraps exactInputSingle in multicall(deadline)", () => {
    const deadline = 1_700_000_000n;
    const data = buildSwapRouter02Calldata({
      tokenIn,
      recipient: tokenOut,
      amountIn: 1000n,
      amountOutMin: 900n,
      deadline,
      pools: [pool],
    });
    const decoded = decodeFunctionData({ abi: swapRouter02Abi, data });
    expect(decoded.functionName).toBe("multicall");
    const [decodedDeadline, calls] = decoded.args;
    expect(decodedDeadline).toBe(deadline);
    const inner = decodeFunctionData({
      abi: swapRouter02Abi,
      data: (calls as readonly `0x${string}`[])[0]!,
    });
    expect(inner.functionName).toBe("exactInputSingle");
  });

  it("encodes a 2-hop path as address, fee, address, fee, address", () => {
    const mid = v3Pool(A, C, 500);
    const last = v3Pool(C, B, 3000);
    const path = encodeV3Path(A, [mid, last]);
    expect(path).toBe(
      encodePacked(
        ["address", "uint24", "address", "uint24", "address"],
        [A, 500, C, 3000, B],
      ),
    );
    const data = buildSwapRouter02Calldata({
      tokenIn: A,
      recipient: B,
      amountIn: 10n,
      amountOutMin: 1n,
      deadline: 5n,
      pools: [mid, last],
    });
    const outer = decodeFunctionData({ abi: swapRouter02Abi, data });
    const inner = decodeFunctionData({
      abi: swapRouter02Abi,
      data: (outer.args[1] as readonly `0x${string}`[])[0]!,
    });
    expect(inner.functionName).toBe("exactInput");
  });
});

describe("findBestUniswapQuote", () => {
  beforeEach(() => {
    vi.mocked(getUniswapPoolIndex).mockResolvedValue(
      graph(ONE_EDGE, [3000], v4Pool, "subgraph") as UniswapPoolIndex,
    );
    vi.mocked(getUniswapV3PoolIndex).mockResolvedValue(
      graph(ONE_EDGE, [500], v3Pool, "onchain") as UniswapV3PoolIndex,
    );
  });

  it("selects v3 when it pays more", async () => {
    const { client } = clientReturning(500n, 100n);
    const quote = await findBestUniswapQuote(client, A, B, 1_000n);
    expect(quote?.protocol).toBe("uniswap_v3");
    expect(quote?.amountOut).toBe(500n);
  });

  it("selects v4 when it pays more", async () => {
    const { client } = clientReturning(100n, 900n);
    const quote = await findBestUniswapQuote(client, A, B, 1_000n);
    expect(quote?.protocol).toBe("uniswap_v4");
    expect(quote?.amountOut).toBe(900n);
  });

  it("prefers v3 when output is equal", async () => {
    const { client } = clientReturning(50n, 50n);
    const quote = await findBestUniswapQuote(client, A, B, 1_000n);
    expect(quote?.protocol).toBe("uniswap_v3");
  });

  it("keeps v4 when the v3 pool index fails", async () => {
    vi.mocked(getUniswapV3PoolIndex).mockRejectedValue(new Error("factory down"));
    const { client } = clientReturning(0n, 70n);
    const quote = await findBestUniswapQuote(client, A, B, 1_000n);
    expect(quote?.protocol).toBe("uniswap_v4");
    expect(quote?.amountOut).toBe(70n);
  });

  it("keeps v4 when the v3 quoter throws", async () => {
    const { client } = clientReturning(new Error("v3 down"), 80n);
    const quote = await findBestUniswapQuote(client, A, B, 1_000n);
    expect(quote?.protocol).toBe("uniswap_v4");
    expect(quote?.amountOut).toBe(80n);
  });

  it("returns null when both venues quote zero", async () => {
    const { client } = clientReturning(0n, 0n);
    const quote = await findBestUniswapQuote(client, A, B, 1_000n);
    expect(quote).toBeNull();
  });

  it("pins a venue even when the other pays more", async () => {
    const { client, simulateContract } = clientReturning(500n, 100n);
    const quote = await findBestUniswapQuote(client, A, B, 1_000n, {
      protocol: "uniswap_v4",
    });
    expect(quote?.protocol).toBe("uniswap_v4");
    expect(quote?.amountOut).toBe(100n);
    const addresses = simulateContract.mock.calls.map(
      (call) => (call[0] as { address: string }).address.toLowerCase(),
    );
    expect(addresses).not.toContain(UNISWAP_V3.quoterV2.toLowerCase());
    expect(addresses).toContain(UNISWAP_V4.v4Quoter.toLowerCase());
  });

  it(`caps combined simulateContract calls at MAX_QUOTE_PATHS (${MAX_QUOTE_PATHS})`, async () => {
    vi.mocked(getUniswapPoolIndex).mockResolvedValue(
      graph(DENSE_EDGES, [500, 3000, 10000], v4Pool, "subgraph") as UniswapPoolIndex,
    );
    vi.mocked(getUniswapV3PoolIndex).mockResolvedValue(
      graph(DENSE_EDGES, [500, 3000, 10000], v3Pool, "onchain") as UniswapV3PoolIndex,
    );
    const { client, simulateContract } = clientReturning(1n, 1n);
    await findBestUniswapQuote(client, A, E, 1_000n);
    expect(simulateContract.mock.calls.length).toBeLessThanOrEqual(MAX_QUOTE_PATHS);
    expect(simulateContract.mock.calls.length).toBe(MAX_QUOTE_PATHS);
  });
});
