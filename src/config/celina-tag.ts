import { concat, stringToHex } from "viem";

/** Calldata suffix appended to prepared transactions for on-chain Celina attribution. */
export const CELINA_DATA_SUFFIX = stringToHex("CELINA");

/** Append CELINA suffix to calldata; no-op when empty or already tagged. */
export function appendCelinaCalldataTag(data: `0x${string}`): `0x${string}` {
  if (!data || data === "0x") return data;
  const suffix = CELINA_DATA_SUFFIX.slice(2);
  if (data.toLowerCase().endsWith(suffix.toLowerCase())) return data;
  return concat([data, CELINA_DATA_SUFFIX]);
}
