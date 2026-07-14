import { http, type Transport } from "viem";
import { entryPoint07Address } from "viem/account-abstraction";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import { CHAIN } from "../config/chains.js";
import type { GasSponsorshipConfig, GasSponsorshipProviderId } from "./types.js";

type PimlicoClient = ReturnType<typeof createPimlicoClient>;

/**
 * Provider-agnostic gas sponsorship wiring (bundler URL, paymaster, fees).
 * v1 supports `provider: "pimlico"`; add branches for future providers without renaming this type.
 */
export class GasSponsorshipService {
  readonly provider: GasSponsorshipProviderId;
  private readonly config: GasSponsorshipConfig;
  private readonly chainId: number;
  private pimlicoClient: PimlicoClient | null = null;

  constructor(config: GasSponsorshipConfig, chainId: number = CHAIN.id) {
    this.config = config;
    this.provider = config.provider;
    this.chainId = chainId;

    if (config.provider === "pimlico") {
      const key = config.pimlico.apiKey?.trim();
      if (!key) {
        throw new Error(
          "gasSponsorship.pimlico.apiKey is required when provider is \"pimlico\"",
        );
      }
    }
  }

  /** Bundler / paymaster JSON-RPC URL for the configured provider and chain. */
  getRpcUrl(chainId: number = this.chainId): string {
    if (this.config.provider === "pimlico") {
      const apiKey = this.config.pimlico.apiKey.trim();
      return `https://api.pimlico.io/v2/${chainId}/rpc?apikey=${apiKey}`;
    }
    const _exhaustive: never = this.config.provider;
    throw new Error(`Unsupported gas sponsorship provider: ${String(_exhaustive)}`);
  }

  /** viem transport pointed at the sponsorship backend RPC. */
  createBundlerTransport(): Transport {
    return http(this.getRpcUrl());
  }

  /** Provider client used as paymaster (and fee oracle in v1). */
  getPaymasterClient(): PimlicoClient {
    if (this.config.provider !== "pimlico") {
      const _exhaustive: never = this.config.provider;
      throw new Error(`Unsupported gas sponsorship provider: ${String(_exhaustive)}`);
    }
    if (!this.pimlicoClient) {
      this.pimlicoClient = createPimlicoClient({
        transport: this.createBundlerTransport(),
        entryPoint: {
          address: entryPoint07Address,
          version: "0.7",
        },
      });
    }
    return this.pimlicoClient;
  }

  /** Fee fields for UserOp construction. */
  async estimateFeesPerGas(): Promise<{
    maxFeePerGas: bigint;
    maxPriorityFeePerGas: bigint;
  }> {
    if (this.config.provider === "pimlico") {
      const prices = await this.getPaymasterClient().getUserOperationGasPrice();
      return prices.fast;
    }
    const _exhaustive: never = this.config.provider;
    throw new Error(`Unsupported gas sponsorship provider: ${String(_exhaustive)}`);
  }
}
