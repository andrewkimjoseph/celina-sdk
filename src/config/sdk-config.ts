export interface SdkConfig {
  rpcUrl: string;
  ethRpcUrl?: string;
}

export const DEFAULT_RPC_URL = "https://forno.celo.org";

export function resolveSdkConfig(opts?: Partial<SdkConfig>): SdkConfig {
  return {
    rpcUrl: opts?.rpcUrl ?? DEFAULT_RPC_URL,
    ethRpcUrl: opts?.ethRpcUrl,
  };
}
