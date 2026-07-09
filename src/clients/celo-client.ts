/**
 * Cached viem public client for Celo mainnet RPC reads.
 */
import {
  createPublicClient,
  http,
  type PublicClient,
} from "viem";
import type { SdkConfig } from "../config/sdk-config.js";
import { CHAIN, DEFAULT_RPC_URL } from "../config/chains.js";

/** viem public client bundle for Celo mainnet. */
export interface CeloClients {
  public: PublicClient;
}

/** Lazily constructs and caches a Celo mainnet public client from `SdkConfig`. */
export class CeloClientFactory {
  private clients: CeloClients | null = null;

  constructor(private readonly config: SdkConfig) {}

  /** Return resolved SDK config used by this factory. */
  getConfig(): Readonly<SdkConfig> {
    return this.config;
  }

  /** Return a shared public client (created on first call). */
  getClients(): CeloClients {
    if (this.clients) {
      return this.clients;
    }

    const rpcUrl = this.config.rpcUrl ?? DEFAULT_RPC_URL;
    const transport = http(rpcUrl);
    const publicClient = createPublicClient({
      chain: CHAIN,
      transport,
    }) as PublicClient;

    this.clients = { public: publicClient };
    return this.clients;
  }
}
