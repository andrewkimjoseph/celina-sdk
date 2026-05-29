import { formatUnits } from "viem";

/** Human-readable CELO amount from wei (18 decimals). */
export function formatCeloAmount(wei: bigint): string {
  return `${formatUnits(wei, 18)} CELO`;
}

/** Shorten a hex address for display (`0x1234…abcd`). */
export function formatAddress(address: string): string {
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/** Format validator score basis points as a percentage string. */
export function formatScorePercentage(score: bigint | number): string {
  const value = typeof score === "bigint" ? Number(score) : score;
  return `${(value / 100).toFixed(2)}%`;
}
