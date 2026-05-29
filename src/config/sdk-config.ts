/** RPC configuration for `createCelinaClient()`. */
export interface SdkConfig {
  /** Celo mainnet JSON-RPC URL (default Forno). */
  rpcUrl: string;
  /** Ethereum mainnet RPC for ENS resolution (optional). */
  ethRpcUrl?: string;
}

/** Default Celo RPC when `rpcUrl` is omitted. */
export const DEFAULT_RPC_URL = "https://forno.celo.org";

/**
 * Merge partial options with SDK defaults.
 * @param opts - Optional RPC overrides from `createCelinaClient(opts)`
 */
export function resolveSdkConfig(opts?: Partial<SdkConfig>): SdkConfig {
  return {
    rpcUrl: opts?.rpcUrl ?? DEFAULT_RPC_URL,
    ethRpcUrl: opts?.ethRpcUrl,
  };
}
