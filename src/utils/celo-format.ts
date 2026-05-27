import { formatUnits } from "viem";

export function formatCeloAmount(wei: bigint): string {
  return `${formatUnits(wei, 18)} CELO`;
}

export function formatAddress(address: string): string {
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatScorePercentage(score: bigint | number): string {
  const value = typeof score === "bigint" ? Number(score) : score;
  return `${(value / 100).toFixed(2)}%`;
}
