import { describe, expect, it } from "vitest";
import type { UniswapPoolIndex } from "../../src/services/uniswap-pool-discovery.js";
import {
  buildPairsFromMentoRoutes,
  buildPairsFromUniswapIndex,
  filterPairsByToken,
  withTokenFilter,
} from "../../src/services/swap-pairs.js";

const USDC = "0xceba9300f2b948710d2653dd7b07f33a8b32118c";
const USDT = "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e";
const EURm = "0xd8763cba276a3738e6de85b4b3bf5fded6d6ca73";
const WCELO = "0x471EcE3750Da237f93B8E339c536989b8978a438";
const USDm = "0x765de816845861e75a25fca122bb6898b8b1282a";

function pairKey(a: string, b: string): string {
  const lo = a.toLowerCase();
  const hi = b.toLowerCase();
  return lo < hi ? `${lo}|${hi}` : `${hi}|${lo}`;
}

describe("swap pair listing", () => {
  it("maps Mento routes to registry symbols and excludes non-routes", () => {
    const pairs = buildPairsFromMentoRoutes([
      {
        tokens: [{ address: USDm }, { address: EURm }],
        path: [{}],
      },
      {
        tokens: [{ address: USDm }, { address: USDC }],
        path: [{}, {}],
      },
    ]);

    expect(pairs).toEqual([
      { token_a: "EURm", token_b: "USDm", hops: 1 },
      { token_a: "USDC", token_b: "USDm", hops: 2 },
    ]);

    const eurm = filterPairsByToken(pairs, "EURm");
    expect(eurm.counterparts).toEqual(["USDm"]);
    expect(eurm.counterparts).not.toContain("CELO");
  });

  it("builds Uniswap 1-hop and 2-hop registry pairs from a pool index", () => {
    const poolsByPair = new Map([
      [pairKey(WCELO, USDC), [{} as never]],
      [pairKey(USDC, EURm), [{} as never]],
      [pairKey(USDC, USDT), [{} as never]],
    ]);
    const adjacency = new Map<string, Set<string>>([
      [WCELO.toLowerCase(), new Set([USDC.toLowerCase()])],
      [USDC.toLowerCase(), new Set([WCELO.toLowerCase(), EURm.toLowerCase(), USDT.toLowerCase()])],
      [EURm.toLowerCase(), new Set([USDC.toLowerCase()])],
      [USDT.toLowerCase(), new Set([USDC.toLowerCase()])],
    ]);
    const index: UniswapPoolIndex = {
      edges: [],
      adjacency,
      poolsByPair,
      source: "onchain",
      fetchedAt: Date.now(),
    };

    const pairs = buildPairsFromUniswapIndex(index);
    const byKey = Object.fromEntries(
      pairs.map((pair) => [`${pair.token_a}|${pair.token_b}`, pair.hops]),
    );

    expect(byKey["CELO|USDC"]).toBe(1);
    expect(byKey["EURm|USDC"]).toBe(1);
    expect(byKey["USDC|USDT"]).toBe(1);
    expect(byKey["CELO|EURm"]).toBe(2);
    expect(byKey["CELO|USDT"]).toBe(2);
    expect(byKey["EURm|USDT"]).toBe(2);

    const eurm = withTokenFilter(
      { network: "mainnet", protocol: "uniswap_v4", pairs, source: "onchain" },
      "EURm",
    );
    expect(eurm.token).toBe("EURm");
    expect(eurm.counterparts).toEqual(["CELO", "USDC", "USDT"]);
  });
});
