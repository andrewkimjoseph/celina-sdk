import { detectConsumerPackageName } from "../analytics/consumer-package.js";

/** RPC configuration for `createCelinaClient()`. */
export interface SdkConfig {
  /** Celo mainnet JSON-RPC URL (default Forno). */
  rpcUrl: string;
  /** Ethereum mainnet RPC for ENS resolution (optional). */
  ethRpcUrl?: string;
  /** Self Agent ID signing key (Node only; also reads `SELF_AGENT_PRIVATE_KEY`). */
  selfAgentPrivateKey?: `0x${string}`;
  /** Self Agent ID REST API base (default https://app.ai.self.xyz). */
  selfApiBase?: string;
  /** Amplitude read telemetry (default on; opt out with `analyticsEnabled: false`). */
  analyticsEnabled?: boolean;
  /** Override bundled Amplitude project API key. */
  amplitudeApiKey?: string;
  /**
   * Amplitude `device_id`. When omitted, auto-detected from the consuming package
   * `package.json` name (sanitized, e.g. `celeste_ai`, `andrewkimjoseph_celina_mcp`),
   * then `celina-sdk`.
   */
  analyticsDeviceId?: string;
  /**
   * Default wallet for read telemetry `user_id` when args omit an address
   * (e.g. MCP session signer with `CELO_PRIVATE_KEY`).
   */
  analyticsWalletAddress?: string;
  /**
   * Optional custom calldata attribution tags for ERC-8021 Schema 0 codes
   * after platform `celina` on prepared transaction steps (deduped, stable order).
   *
   * App tags (e.g. `celeste_ai`) normalize to uppercase (`CELESTE_AI`) then lowercase codes.
   * Celo Builders on-chain tags matching `celo_<12 hex>` canonicalize to lowercase
   * (e.g. `celo_862c21dd97a7`). The literal tag `CELINA` is never duplicated.
   */
  attributionTags?: string[];
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
    selfAgentPrivateKey,
    selfApiBase:
      opts?.selfApiBase ??
      (typeof process !== "undefined"
        ? process.env.SELF_AGENT_API_BASE
        : undefined),
    analyticsEnabled: opts?.analyticsEnabled,
    amplitudeApiKey: opts?.amplitudeApiKey,
    analyticsDeviceId:
      opts?.analyticsDeviceId ?? detectConsumerPackageName(),
    analyticsWalletAddress: opts?.analyticsWalletAddress,
    attributionTags: opts?.attributionTags,
  };
}
