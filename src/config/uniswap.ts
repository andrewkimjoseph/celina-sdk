/**
 * Uniswap v4 contract addresses and routing helpers for Celo mainnet.
 * @see https://docs.celo.org/tooling/contracts/uniswap-contracts
 */
import { MENTO_CELO_ADDRESS } from "./chains.js";

/** Uniswap v4 on Celo mainnet — https://docs.celo.org/tooling/contracts/uniswap-contracts */
export const UNISWAP_V4 = {
  poolManager: "0x288dc841A52FCA2707c6947B3A777c5E56cd87BC" as const,
  v4Quoter: "0x28566da1093609182dff2cb2a91cfd72e61d66cd" as const,
  stateView: "0xbc21f8720babf4b20d195ee5c6e99c52b76f2bfb" as const,
  universalRouter: "0xcb695bc5d3aa22cad1e6df07801b061a05a0233a" as const,
  permit2: "0x000000000022D473030F116dDEE9F6B43aC78BA3" as const,
  zeroHooks: "0x0000000000000000000000000000000000000000" as const,
  nativeCurrency: "0x0000000000000000000000000000000000000000" as const,
} as const;

export const UNISWAP_SUBGRAPH_URL =
  "https://api.studio.thegraph.com/query/111767/uniswap-v-4-celo/version/latest";

/** Pool index cache TTL in milliseconds (default 5 minutes). */
export const UNISWAP_POOL_CACHE_TTL_MS = 5 * 60 * 1000;

/** Common v4 fee tiers and default tick spacings (probed on-chain when building index). */
export const UNISWAP_FEE_TIERS = [100, 500, 3000, 10000, 30000] as const;

/** Default tick spacing per fee tier when probing pools on-chain. */
export const UNISWAP_DEFAULT_TICK_SPACING: Record<number, number> = {
  100: 1,
  500: 10,
  3000: 60,
  10000: 200,
  30000: 600,
};

/** Hub tokens for on-chain pool index fallback (Uniswap routing graph). */
export const UNISWAP_HUB_CURRENCIES: readonly `0x${string}`[] = [
  UNISWAP_V4.nativeCurrency,
  MENTO_CELO_ADDRESS,
  "0xceba9300f2b948710d2653dd7b07f33a8b32118c", // USDC
  "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e", // USDT
  "0xD221812de1BD094f35587EE8E174B07B6167D9Af", // WETH
  "0x765de816845861e75a25fca122bb6898b8b1282a", // USDm
  "0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A", // GoodDollar (G$)
];

/** Uniswap v4 pool key (sorted currencies, fee tier, tick spacing, hooks). */
export type UniswapPoolKey = {
  currency0: `0x${string}`;
  currency1: `0x${string}`;
  fee: number;
  tickSpacing: number;
  hooks: `0x${string}`;
};

/** Sort two currency addresses for canonical pool key ordering. */
export function sortUniswapCurrencies(
  a: `0x${string}`,
  b: `0x${string}`,
): [`0x${string}`, `0x${string}`] {
  return a.toLowerCase() < b.toLowerCase() ? [a, b] : [b, a];
}

/** Normalize a pool key so `currency0` sorts before `currency1`. */
export function normalizeUniswapPoolKey(poolKey: UniswapPoolKey): UniswapPoolKey {
  const [currency0, currency1] = sortUniswapCurrencies(
    poolKey.currency0,
    poolKey.currency1,
  );
  return { ...poolKey, currency0, currency1 };
}

/** Map registry token to Uniswap v4 currency address (native CELO → address(0)). */
export function toUniswapCurrency(
  address: `0x${string}` | "native",
): `0x${string}` {
  if (address === "native") {
    return UNISWAP_V4.nativeCurrency;
  }
  return address;
}

/**
 * Map registry token to the currency used for pool discovery / quoting.
 * Celo v4 liquidity is on WCELO pairs, not native address(0).
 */
export function toUniswapRoutingCurrency(
  address: `0x${string}` | "native",
): `0x${string}` {
  if (address === "native") {
    return MENTO_CELO_ADDRESS;
  }
  return address;
}

/** ERC-20 used as swap input when registry token is native CELO. */
export function uniswapInputTokenAddress(
  address: `0x${string}` | "native",
): `0x${string}` | "native" {
  if (address === "native") {
    return MENTO_CELO_ADDRESS;
  }
  return address;
}

/** Whether a v4 currency address is native CELO (`address(0)`). */
export function isNativeUniswapCurrency(currency: `0x${string}`): boolean {
  return currency.toLowerCase() === UNISWAP_V4.nativeCurrency;
}
