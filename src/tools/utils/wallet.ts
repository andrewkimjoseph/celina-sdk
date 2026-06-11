import type { ToolRuntime, WalletInput } from "../types.js";

export function resolveWalletFromRuntime(
  runtime: ToolRuntime,
  input?: WalletInput,
): `0x${string}` {
  return runtime.resolveWallet(input);
}

/** Use MCP server signer for estimates only when a wallet is configured and no explicit from. */
export function useMcpServerExecutor(
  runtime: ToolRuntime,
  explicitFrom?: string,
): boolean {
  return Boolean(runtime.mcpWallet?.hasWallet && !explicitFrom);
}
