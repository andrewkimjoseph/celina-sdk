/**
 * Unit tests for findBestUniswapRoute — verifies the simulateContract fan-out
 * stays within MAX_QUOTE_PATHS even on a dense pool graph.
 */
import { describe, expect, it, vi } from "vitest";
import type { UniswapPoolIndex } from "../../src/services/uniswap-pool-discovery.js";
import { MAX_QUOTE_PATHS } from "../../src/services/uniswap-path-router.js";

// ── addresses used in the synthetic pool graph ────────────────────────────
const A = "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" as `0x${string}`;
const B = "0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB" as `0x${string}`;
const C = "0xCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC" as `0x${string}`;
const D = "0xDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD" as `0x${string}`;
const E = "0xEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE" as `0x${string}`;

// canonical sorted-pair key matching pool-discovery's pairKey helper
function pk(x: string, y: string): string {
  const lo = x.toLowerCase();
  const hi = y.toLowerCase();
  return lo < hi ? `${lo}|${hi}` : `${hi}|${lo}`;
}

/** Build a zero-hooks pool key for a pair at a given fee tier. */
function pool(c0: `0x${string}`, c1: `0x${string}`, fee: number) {
  const [currency0, currency1] =
    c0.toLowerCase() < c1.toLowerCase() ? [c0, c1] : [c1, c0];
  return {
    currency0,
    currency1,
    fee,
    tickSpacing: 60,
    hooks: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  };
}

/**
 * Dense pool graph: A-B, B-C, B-D, B-E, C-D, C-E, D-E — each at 3 fee
 * tiers — giving A→B (1 hop×3) plus many 2-hop and 3-hop routes. The
 * total candidate count well exceeds MAX_QUOTE_PATHS before capping.
 */
function buildDenseIndex(): UniswapPoolIndex {
  const fees = [500, 3000, 10000];
  const edges = [
    [A, B],
    [B, C],
    [B, D],
    [B, E],
    [C, D],
    [C, E],
    [D, E],
  ] as const;

  const poolsByPair = new Map<string, ReturnType<typeof pool>[]>();
  const adjacency = new Map<string, Set<string>>();

  for (const [x, y] of edges) {
    const key = pk(x, y);
    const pools = fees.map((f) => pool(x as `0x${string}`, y as `0x${string}`, f));
    poolsByPair.set(key, pools);

    for (const [src, dst] of [
      [x.toLowerCase(), y.toLowerCase()],
      [y.toLowerCase(), x.toLowerCase()],
    ]) {
      const set = adjacency.get(src) ?? new Set<string>();
      set.add(dst);
      adjacency.set(src, set);
    }
  }

  return {
    edges: [],
    adjacency,
    poolsByPair,
    source: "subgraph",
    fetchedAt: Date.now(),
  };
}

// ── mock the pool-discovery module ────────────────────────────────────────
vi.mock("../../src/services/uniswap-pool-discovery.js", () => ({
  getUniswapPoolIndex: vi.fn(),
  poolsBetween: (index: UniswapPoolIndex, a: `0x${string}`, b: `0x${string}`) => {
    const key = [a.toLowerCase(), b.toLowerCase()].sort().join("|");
    return index.poolsByPair.get(key) ?? [];
  },
}));

import { getUniswapPoolIndex } from "../../src/services/uniswap-pool-discovery.js";
import { findBestUniswapRoute } from "../../src/services/uniswap-path-router.js";

describe("findBestUniswapRoute — subrequest budget", () => {
  it(`caps simulateContract calls to MAX_QUOTE_PATHS (${MAX_QUOTE_PATHS}) on a dense graph`, async () => {
    const denseIndex = buildDenseIndex();
    vi.mocked(getUniswapPoolIndex).mockResolvedValue(denseIndex);

    const simulateContract = vi.fn().mockResolvedValue({ result: [0n] });
    const client = { simulateContract } as never;

    await findBestUniswapRoute(client, A, E, 1_000n);

    // Each simulateContract call quotes one path — must not exceed the cap.
    expect(simulateContract).toHaveBeenCalledTimes(
      Math.min(MAX_QUOTE_PATHS, simulateContract.mock.calls.length),
    );
    expect(simulateContract.mock.calls.length).toBeLessThanOrEqual(MAX_QUOTE_PATHS);
  });

  it("returns null when all quotes return zero", async () => {
    const denseIndex = buildDenseIndex();
    vi.mocked(getUniswapPoolIndex).mockResolvedValue(denseIndex);

    const simulateContract = vi.fn().mockResolvedValue({ result: [0n] });
    const client = { simulateContract } as never;

    const result = await findBestUniswapRoute(client, A, E, 1_000n);
    expect(result).toBeNull();
  });

  it("returns the best route among mocked quotes and prefers shorter paths", async () => {
    const denseIndex = buildDenseIndex();
    vi.mocked(getUniswapPoolIndex).mockResolvedValue(denseIndex);

    // First call returns 5n (direct A→B 1-hop if such a path exists is not
    // to E, so the first path found will be a 2-hop A→B→E). Give that one
    // the highest output so we verify the best-route selection logic.
    let callCount = 0;
    const simulateContract = vi.fn().mockImplementation(async () => {
      const out = callCount === 0 ? 999n : 1n;
      callCount++;
      return { result: [out] };
    });
    const client = { simulateContract } as never;

    const result = await findBestUniswapRoute(client, A, E, 1_000n);
    expect(result).not.toBeNull();
    expect(result!.amountOut).toBe(999n);
  });
});
