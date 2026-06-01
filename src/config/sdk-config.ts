/** RPC configuration for `createCelinaClient()`. */
export interface SdkConfig {
  /** Celo mainnet JSON-RPC URL (default Forno). */
  rpcUrl: string;
  /** Ethereum mainnet RPC for ENS resolution (optional). */
  ethRpcUrl?: string;
  /** Carbon DeFi REST API base URL (default https://mcp.carbondefi.xyz). */
  carbonRestBaseUrl?: string;
  /** Enable @bancor/carbon-sdk fallback when REST fails (default true). */
  carbonSdkFallback?: boolean;
  /** Self Agent ID signing key (Node only; also reads `SELF_AGENT_PRIVATE_KEY`). */
  selfAgentPrivateKey?: `0x${string}`;
  /** Self Agent ID REST API base (default https://app.ai.self.xyz). */
  selfApiBase?: string;
  /** Amplitude read telemetry (default on; opt out with `false` or `CELINA_ANALYTICS_DISABLED=1`). */
  analyticsEnabled?: boolean;
  /** Override bundled Amplitude project API key. */
  amplitudeApiKey?: string;
  /** Amplitude `device_id` (default `celina-sdk`). */
  analyticsDeviceId?: string;
}

/** Default Celo RPC when `rpcUrl` is omitted. */
export const DEFAULT_RPC_URL = "https://forno.celo.org";

/**
 * Merge partial options with SDK defaults.
 * @param opts - Optional RPC overrides from `createCelinaClient(opts)`
 */
export function resolveSdkConfig(opts?: Partial<SdkConfig>): SdkConfig {
  const selfAgentPrivateKey =
    opts?.selfAgentPrivateKey ??
    (typeof process !== "undefined"
      ? (process.env.SELF_AGENT_PRIVATE_KEY as `0x${string}` | undefined)
      : undefined);

  return {
    rpcUrl: opts?.rpcUrl ?? DEFAULT_RPC_URL,
    ethRpcUrl: opts?.ethRpcUrl,
    carbonRestBaseUrl:
      opts?.carbonRestBaseUrl ??
      process.env.CARBON_API_BASE_URL ??
      "https://mcp.carbondefi.xyz",
    carbonSdkFallback: opts?.carbonSdkFallback ?? true,
    selfAgentPrivateKey,
    selfApiBase:
      opts?.selfApiBase ??
      (typeof process !== "undefined"
        ? process.env.SELF_AGENT_API_BASE
        : undefined),
    analyticsEnabled: opts?.analyticsEnabled,
    amplitudeApiKey: opts?.amplitudeApiKey,
    analyticsDeviceId: opts?.analyticsDeviceId,
  };
}
