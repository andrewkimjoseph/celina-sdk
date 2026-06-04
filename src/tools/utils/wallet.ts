import type { ToolRuntime, WalletInput } from "../types.js";

export function resolveWalletFromRuntime(
  runtime: ToolRuntime,
  input?: WalletInput,
): `0x${string}` {
  return runtime.resolveWallet(input);
}
