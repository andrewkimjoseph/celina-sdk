/**
 * ENS resolution on Celo (coin type 42220) and Ethereum mainnet.
 */
import { toCoinType } from "viem";
import { celo } from "viem/chains";
import { getEnsAddress, normalize } from "viem/ens";
import {
  ENS_CCIP_GATEWAY,
  type EnsClientFactory,
} from "../clients/ens-client.js";

/** Chain used for ENS resolution. */
export type EnsResolveChain = "celo" | "ethereum";

const ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;

/** Address with optional ENS metadata when input was a name. */
export type ResolvedRecipient = {
  address: `0x${string}`;
  ens?: {
    name: string;
    normalizedName: string;
    /** Present when resolved on Celo (may fall back to Ethereum records). */
    resolvedVia?: "celo" | "ethereum";
  };
};

/** ENS name and address resolution for send/swap recipients. */
export class EnsService {
  constructor(private readonly ensClientFactory: EnsClientFactory) {}

  /**
   * Resolve an ENS name on Celo or Ethereum to an address.
   * @param name - ENS name (e.g. `andrewkimjoseph.celo.eth`)
   * @param chain - `"celo"` tries Celo coin type first, then Ethereum; `"ethereum"` uses ETH only
   * @throws When no address record exists for the name
   */
  async resolveEns(name: string, chain: EnsResolveChain = "celo") {
    const trimmedName = name.trim();
    const normalizedName = normalize(trimmedName);
    const client = this.ensClientFactory.getClient();
    const gatewayUrls = [ENS_CCIP_GATEWAY];

    if (chain === "ethereum") {
      const address = await getEnsAddress(client, {
        name: normalizedName,
        gatewayUrls,
      });

      if (!address) {
        throw new Error(
          `ENS name "${trimmedName}" has no Ethereum address record`,
        );
      }

      return {
        name: trimmedName,
        normalizedName,
        address,
        coinType: "60",
        chain: "ethereum" as const,
      };
    }

    const celoCoinType = toCoinType(celo.id);
    let address = await getEnsAddress(client, {
      name: normalizedName,
      coinType: celoCoinType,
      gatewayUrls,
    });

    let coinType = celoCoinType.toString();
    let resolvedVia: "celo" | "ethereum" = "celo";

    if (!address) {
      address = await getEnsAddress(client, {
        name: normalizedName,
        gatewayUrls,
      });
      coinType = "60";
      resolvedVia = "ethereum";
    }

    if (!address) {
      throw new Error(
        `ENS name "${trimmedName}" could not be resolved to an address`,
      );
    }

    return {
      name: trimmedName,
      normalizedName,
      address,
      coinType,
      chain: "celo" as const,
      resolvedVia,
    };
  }

  /**
   * Accept a raw `0x` address or ENS name; returns address plus optional ENS metadata.
   * @param input - Hex address or ENS name
   */
  async resolveAddressOrEns(input: string): Promise<ResolvedRecipient> {
    const trimmed = input.trim();

    if (ADDRESS_PATTERN.test(trimmed)) {
      return { address: trimmed as `0x${string}` };
    }

    const resolved = await this.resolveEns(trimmed);
    return {
      address: resolved.address as `0x${string}`,
      ens: {
        name: resolved.name,
        normalizedName: resolved.normalizedName,
        ...(resolved.chain === "celo"
          ? { resolvedVia: resolved.resolvedVia }
          : {}),
      },
    };
  }
}
