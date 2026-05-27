import {
  erc1155Abi,
  erc165Abi,
  erc721Abi,
  ERC1155_INTERFACE_ID,
  ERC721_INTERFACE_ID,
} from "../abis/nft.js";
import type { CeloClientFactory } from "../clients/celo-client.js";
import { normalizeAddress } from "../utils/normalize-address.js";

type NftStandard = "ERC721" | "ERC1155";

function rewriteIpfsUri(uri: string): string {
  if (uri.startsWith("ipfs://")) {
    return uri.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  return uri;
}

async function fetchMetadata(uri: string): Promise<Record<string, unknown> | null> {
  if (!uri) return null;

  try {
    const url = rewriteIpfsUri(uri);
    const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!response.ok) return null;
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export class NftService {
  constructor(private readonly clientFactory: CeloClientFactory) {}

  private async assertIsContract(address: `0x${string}`): Promise<void> {
    const { public: client } = this.clientFactory.getClients();
    const bytecode = await client.getBytecode({ address });
    if (!bytecode || bytecode === "0x") {
      throw new Error(
        `${address} is not an NFT contract on Celo mainnet (no contract bytecode). ` +
          "Verify the address is a deployed ERC-721 or ERC-1155 collection.",
      );
    }
  }

  private async detectStandard(
    contractAddress: `0x${string}`,
  ): Promise<NftStandard> {
    const { public: client } = this.clientFactory.getClients();

    try {
      const supports1155 = await client.readContract({
        address: contractAddress,
        abi: erc165Abi,
        functionName: "supportsInterface",
        args: [ERC1155_INTERFACE_ID],
      });
      if (supports1155) return "ERC1155";
    } catch {
      // fall through
    }

    try {
      const supports721 = await client.readContract({
        address: contractAddress,
        abi: erc165Abi,
        functionName: "supportsInterface",
        args: [ERC721_INTERFACE_ID],
      });
      if (supports721) return "ERC721";
    } catch {
      // fall through
    }

    throw new Error(
      `${contractAddress} does not implement ERC-721 or ERC-1155 (ERC-165 check failed).`,
    );
  }

  async getNftInfo(contractAddress: `0x${string}`, tokenId: string) {
    const contract = normalizeAddress(contractAddress, "contract address");

    const { public: client } = this.clientFactory.getClients();
    await this.assertIsContract(contract);
    const standard = await this.detectStandard(contract);
    const id = BigInt(tokenId);

    let name: string | undefined;
    let symbol: string | undefined;
    let totalSupply: string | undefined;
    let owner: `0x${string}` | null = null;
    let metadataUri: string | null = null;

    if (standard === "ERC721") {
      const [collectionName, collectionSymbol, supply] = await Promise.all([
        client
          .readContract({
            address: contract,
            abi: erc721Abi,
            functionName: "name",
          })
          .catch(() => undefined),
        client
          .readContract({
            address: contract,
            abi: erc721Abi,
            functionName: "symbol",
          })
          .catch(() => undefined),
        client
          .readContract({
            address: contract,
            abi: erc721Abi,
            functionName: "totalSupply",
          })
          .catch(() => undefined),
      ]);

      name = collectionName;
      symbol = collectionSymbol;
      totalSupply = supply?.toString();

      owner = await client
        .readContract({
          address: contract,
          abi: erc721Abi,
          functionName: "ownerOf",
          args: [id],
        })
        .catch(() => null);

      metadataUri = await client
        .readContract({
          address: contract,
          abi: erc721Abi,
          functionName: "tokenURI",
          args: [id],
        })
        .catch(() => null);
    } else {
      metadataUri = await client
        .readContract({
          address: contract,
          abi: erc1155Abi,
          functionName: "uri",
          args: [id],
        })
        .catch(() => null);
    }

    const metadata = metadataUri ? await fetchMetadata(metadataUri) : null;
    const image =
      typeof metadata?.image === "string"
        ? rewriteIpfsUri(metadata.image)
        : undefined;

    return {
      network: "mainnet" as const,
      contractAddress: contract,
      tokenId,
      standard,
      owner,
      collection: {
        name: name ?? `Unknown Collection (${contract.slice(0, 8)}...)`,
        symbol: symbol ?? "UNKNOWN",
        totalSupply,
      },
      name:
        (typeof metadata?.name === "string" ? metadata.name : undefined) ??
        `Token #${tokenId}`,
      description:
        typeof metadata?.description === "string"
          ? metadata.description
          : undefined,
      image,
      metadataUri,
      metadata,
      attributes: metadata?.attributes ?? [],
    };
  }

  async getNftBalance(
    contractAddress: `0x${string}`,
    ownerAddress: `0x${string}`,
    tokenId?: string,
  ) {
    const contract = normalizeAddress(contractAddress, "contract address");
    const owner = normalizeAddress(ownerAddress, "owner address");

    const { public: client } = this.clientFactory.getClients();
    await this.assertIsContract(contract);
    const standard = await this.detectStandard(contract);

    if (standard === "ERC721") {
      try {
        const balance = await client.readContract({
          address: contract,
          abi: erc721Abi,
          functionName: "balanceOf",
          args: [owner],
        });

        return {
          network: "mainnet" as const,
          contractAddress: contract,
          ownerAddress: owner,
          tokenId: tokenId ?? null,
          balance: balance.toString(),
          standard,
        };
      } catch (error) {
        throw new Error(
          `Could not read ERC-721 balance for ${contract}: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }

    if (!tokenId) {
      throw new Error("Token ID is required for ERC1155 balance queries");
    }

    const balance = await client.readContract({
      address: contract,
      abi: erc1155Abi,
      functionName: "balanceOf",
      args: [owner, BigInt(tokenId)],
    });

    return {
      network: "mainnet" as const,
      contractAddress: contract,
      ownerAddress: owner,
      tokenId,
      balance: balance.toString(),
      standard,
    };
  }
}
