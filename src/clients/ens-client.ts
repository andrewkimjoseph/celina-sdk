import { createPublicClient, http, type PublicClient } from "viem";
import { mainnet } from "viem/chains";
import type { SdkConfig } from "../config/sdk-config.js";

export const DEFAULT_ETH_RPC_URL = "https://ethereum.publicnode.com";

export const ENS_CCIP_GATEWAY = "https://ccip.ens.xyz";

export class EnsClientFactory {
  private client: PublicClient | null = null;

  constructor(private readonly config: SdkConfig) {}

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
