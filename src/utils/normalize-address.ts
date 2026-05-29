import { getAddress } from "viem";

/**
 * Normalize a hex address to EIP-55 checksum form.
 * @param address - Hex address string
 * @param label - Used in error messages when invalid (default `"address"`)
 * @throws When the string is not a valid hex address
 */
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
