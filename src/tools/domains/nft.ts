import { z } from "zod";
import {
  addressSchema,
  optionalWalletAddressSchema,
  tokenIdSchema,
} from "../schemas/common.js";
import type { ToolDefinition } from "../types.js";
import { resolveWalletFromRuntime } from "../utils/wallet.js";

const readOnly = {
  readOnlyHint: true,
  idempotentHint: true,
} as const;

export const nftToolDefinitions: ToolDefinition[] = [
  {
    name: "get_nft_info",
    description:
      "NFT token information including metadata for ERC-721 or ERC-1155.",
    inputSchema: z.object({
      contract_address: addressSchema,
      token_id: tokenIdSchema,
    }),
    families: ["read"],
    mcp: { title: "Get NFT Info", annotations: readOnly },
    handler: async (runtime, input) =>
      runtime.celina.nft.getNftInfo(
        input.contract_address as `0x${string}`,
        input.token_id as string,
      ),
  },
  {
    name: "get_nft_balance",
    description:
      "NFT balance for an address. Token ID required for ERC-1155.",
    inputSchema: z.object({
      contract_address: addressSchema,
      address: optionalWalletAddressSchema,
      token_id: tokenIdSchema.optional(),
    }),
    families: ["read"],
    mcp: { title: "Get NFT Balance", annotations: readOnly },
    handler: async (runtime, input) => {
      const target = resolveWalletFromRuntime(runtime, {
        address: input.address as string | undefined,
      });
      return runtime.celina.nft.getNftBalance(
        input.contract_address as `0x${string}`,
        target,
        input.token_id as string | undefined,
      );
    },
  },
];
