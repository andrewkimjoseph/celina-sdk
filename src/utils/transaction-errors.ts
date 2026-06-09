const INSUFFICIENT_BALANCE_PATTERNS = [
  /transfer amount exceeds balance/i,
  /erc20:\s*transfer amount exceeds balance/i,
  /insufficient .+ balance/i,
  /insufficient funds/i,
  /exceeds balance/i,
];

/** True when a transfer gas simulation failed due to insufficient token balance. */
export function isInsufficientBalanceSimulationError(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message : typeof error === "string" ? error : "";
  return INSUFFICIENT_BALANCE_PATTERNS.some((pattern) => pattern.test(message));
}

export function insufficientBalanceEstimateMessage(token: string): string {
  return (
    `Insufficient ${token}. Transfer simulation failed — gas cannot be estimated ` +
    "without sufficient balance."
  );
}
