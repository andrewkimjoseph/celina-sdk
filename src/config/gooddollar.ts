/** GoodDollar IdentityV4 contract on Celo mainnet. */
export const GOODDOLLAR_IDENTITY_ADDRESS =
  "0xC361A6E67822a0EDc17D899227dd9FC50BD62F42" as const;

/** GoodDollar UBISchemeV2 contract on Celo mainnet. */
export const GOODDOLLAR_UBI_SCHEME_ADDRESS =
  "0x43d72Ff17701B2DA814620735C39C620Ce0ea4A1" as const;

/** GoodDollar G$ token on Celo mainnet (SuperGoodDollar). */
export const GOODDOLLAR_TOKEN_ADDRESS =
  "0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A" as const;

/** MentoBroker proxy — user-facing entry for G$ reserve swaps on Celo. */
export const GOODDOLLAR_MENTO_BROKER =
  "0x88de45906D4F5a57315c133620cfa484cB297541" as const;

/** GoodDollar MentoExchangeProvider on Celo mainnet. */
export const GOODDOLLAR_MENTO_EXCHANGE_PROVIDER =
  "0x2fFBB49055d487DdBBb0C052Cd7c2a02A7971e41" as const;

/** Exchange pool id for G$ ↔ USDm (CUSD in GoodProtocol deployment). */
export const GOODDOLLAR_CUSD_EXCHANGE_ID =
  "0xba77f5c7bb3317643c6d81d1ef3f9913561741d92095f88efa402faf2cbe9124" as const;

/** Reserve collateral token (USDm / cUSD) for the G$ pool on Celo. */
export const GOODDOLLAR_RESERVE_COLLATERAL =
  "0x765DE816845861e75A25fCA122bb6898B8B1282a" as const;

const GOODDOLLAR_SYMBOLS = new Set(["gooddollar", "g$"]);
const RESERVE_COLLATERAL_SYMBOLS = new Set(["usdm", "cusd"]);

/** Whether both tokens form a supported GoodDollar reserve pair (G$ ↔ USDm). */
export function isGoodDollarUsdReservePair(tokenIn: string, tokenOut: string): boolean {
  const a = tokenIn.trim().toLowerCase();
  const b = tokenOut.trim().toLowerCase();
  return (
    (GOODDOLLAR_SYMBOLS.has(a) && RESERVE_COLLATERAL_SYMBOLS.has(b)) ||
    (GOODDOLLAR_SYMBOLS.has(b) && RESERVE_COLLATERAL_SYMBOLS.has(a))
  );
}
