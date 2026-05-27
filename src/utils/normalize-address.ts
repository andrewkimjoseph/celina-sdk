import { getAddress } from "viem";

/** Normalize a hex address to EIP-55 checksum form. */
export function normalizeAddress(
  address: string,
  label = "address",
): `0x${string}` {
  try {
    return getAddress(address);
  } catch {
    throw new Error(`Invalid ${label}: ${address}`);
  }
}
