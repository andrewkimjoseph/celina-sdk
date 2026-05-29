/**
 * Ethereum mainnet public client for ENS resolution (CCIP-read gateway).
 */
import { createPublicClient, http, type PublicClient } from "viem";
import { mainnet } from "viem/chains";
import type { SdkConfig } from "../config/sdk-config.js";

/** Default Ethereum RPC when `ethRpcUrl` is not set in `SdkConfig`. */
export const DEFAULT_ETH_RPC_URL = "https://ethereum.publicnode.com";

/** CCIP-read gateway used by viem ENS helpers. */
export const ENS_CCIP_GATEWAY = "https://ccip.ens.xyz";

/** Lazily constructs and caches an Ethereum mainnet client for ENS lookups. */
export class EnsClientFactory {
  private client: PublicClient | null = null;

  constructor(private readonly config: SdkConfig) {}

  /** Return a shared Ethereum public client (created on first call). */
  getClient(): PublicClient {
    if (this.client) {
      return this.client;
    }

    const rpcUrl = this.config.ethRpcUrl ?? DEFAULT_ETH_RPC_URL;
    this.client = createPublicClient({
      chain: mainnet,
      transport: http(rpcUrl, { timeout: 15_000 }),
    });

    return this.client;
  }
}
