/**
 * Shared swap-pair listing helpers for Mento FX and Uniswap v4.
 * Pair existence only — no quotes.
 */
import { findKnownToken, KNOWN_TOKENS, MENTO_CELO_ADDRESS } from "../config/chains.js";
import { toUniswapRoutingCurrency } from "../config/uniswap.js";
import type { UniswapPoolIndex } from "./uniswap-pool-discovery.js";

/** One unordered registry-token pair with hop count. */
export type SwapPair = {
  token_a: string;
  token_b: string;
  hops: number;
};

/** Mento FX or Uniswap v4 pair listing returned to tools and SDK callers. */
export type SwapPairsResult = {
  network: "mainnet";
  protocol: "mento_fx" | "uniswap_v4";
  token?: string;
  pairs: SwapPair[];
  counterparts?: string[];
  source?: "subgraph" | "onchain";
};

type MentoRouteLike = {
  tokens: readonly [{ address: string }, { address: string }];
  path: readonly unknown[];
};

function canonicalPair(a: string, b: string): { token_a: string; token_b: string } {
  return a < b ? { token_a: a, token_b: b } : { token_a: b, token_b: a };
}

function pairKey(a: string, b: string): string {
  const { token_a, token_b } = canonicalPair(a, b);
  return `${token_a}|${token_b}`;
}

function addPair(
  map: Map<string, SwapPair>,
  symbolA: string,
  symbolB: string,
  hops: number,
): void {
  if (symbolA === symbolB || hops < 1) {
    return;
  }
  const key = pairKey(symbolA, symbolB);
  const existing = map.get(key);
  if (existing && existing.hops <= hops) {
    return;
  }
  const { token_a, token_b } = canonicalPair(symbolA, symbolB);
  map.set(key, { token_a, token_b, hops });
}

function sortedPairs(map: Map<string, SwapPair>): SwapPair[] {
  return [...map.values()].sort((a, b) => {
    if (a.token_a !== b.token_a) {
      return a.token_a.localeCompare(b.token_a);
    }
    return a.token_b.localeCompare(b.token_b);
  });
}

/** Registry symbol for a token address, including WCELO / Mento CELO → CELO. */
export function registrySymbolForAddress(address: string): string | undefined {
  return findKnownToken(address)?.symbol;
}

/** Routing-address (lowercase) → canonical registry symbol. */
export function registrySymbolByRoutingAddress(): Map<string, string> {
  const map = new Map<string, string>();
  for (const token of KNOWN_TOKENS) {
    const routing = toUniswapRoutingCurrency(token.address);
    map.set(routing.toLowerCase(), token.symbol);
    if (token.address !== "native") {
      map.set(token.address.toLowerCase(), token.symbol);
    }
  }
  map.set(MENTO_CELO_ADDRESS.toLowerCase(), "CELO");
  return map;
}

/** Filter pairs to those involving `symbol` and derive sorted counterparts. */
export function filterPairsByToken(
  pairs: SwapPair[],
  symbol: string,
): { pairs: SwapPair[]; counterparts: string[] } {
  const filtered = pairs.filter(
    (pair) => pair.token_a === symbol || pair.token_b === symbol,
  );
  const counterparts = [
    ...new Set(
      filtered.map((pair) => (pair.token_a === symbol ? pair.token_b : pair.token_a)),
    ),
  ].sort((a, b) => a.localeCompare(b));
  return { pairs: filtered, counterparts };
}

/** Attach an optional token filter onto a full pair listing. */
export function withTokenFilter(
  result: SwapPairsResult,
  symbol?: string,
): SwapPairsResult {
  if (!symbol) {
    return result;
  }
  const filtered = filterPairsByToken(result.pairs, symbol);
  return {
    ...result,
    token: symbol,
    pairs: filtered.pairs,
    counterparts: filtered.counterparts,
  };
}

/** Build unordered registry pairs from Mento `routes.getRoutes()` results. */
export function buildPairsFromMentoRoutes(routes: readonly MentoRouteLike[]): SwapPair[] {
  const map = new Map<string, SwapPair>();
  for (const route of routes) {
    const [first, second] = route.tokens;
    const symbolA = registrySymbolForAddress(first.address);
    const symbolB = registrySymbolForAddress(second.address);
    if (!symbolA || !symbolB) {
      continue;
    }
    addPair(map, symbolA, symbolB, route.path.length);
  }
  return sortedPairs(map);
}

/**
 * Build unordered registry pairs from a Uniswap v4 pool index.
 * Direct pools are hops: 1; two-hop adjacency among registry tokens is hops: 2.
 */
export function buildPairsFromUniswapIndex(index: UniswapPoolIndex): SwapPair[] {
  const symbols = registrySymbolByRoutingAddress();
  const map = new Map<string, SwapPair>();

  for (const [key] of index.poolsByPair) {
    const [addrA, addrB] = key.split("|");
    if (!addrA || !addrB) {
      continue;
    }
    const symbolA = symbols.get(addrA);
    const symbolB = symbols.get(addrB);
    if (!symbolA || !symbolB) {
      continue;
    }
    addPair(map, symbolA, symbolB, 1);
  }

  for (const [addr, neighbors] of index.adjacency) {
    const symbolA = symbols.get(addr);
    if (!symbolA) {
      continue;
    }
    for (const mid of neighbors) {
      const midNeighbors = index.adjacency.get(mid);
      if (!midNeighbors) {
        continue;
      }
      for (const dest of midNeighbors) {
        const symbolB = symbols.get(dest);
        if (!symbolB) {
          continue;
        }
        addPair(map, symbolA, symbolB, 2);
      }
    }
  }

  return sortedPairs(map);
}
