import {
  createPublicClient,
  http,
  type PublicClient,
} from "viem";
import type { SdkConfig } from "../config/sdk-config.js";
import { CHAIN, DEFAULT_RPC_URL } from "../config/chains.js";

export interface CeloClients {
  public: PublicClient;
}

export class CeloClientFactory {
  private clients: CeloClients | null = null;

  constructor(private readonly config: SdkConfig) {}

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
