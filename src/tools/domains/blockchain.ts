import { z } from "zod";
import {
  blockIdSchema,
  optionalWalletAddressSchema,
} from "../schemas/common.js";
import type { ToolDefinition } from "../types.js";
import { resolveWalletFromRuntime } from "../utils/wallet.js";

const readOnly = {
  readOnlyHint: true,
  idempotentHint: true,
} as const;

export const blockchainToolDefinitions: ToolDefinition[] = [
  {
    name: "get_network_status",
    description: "Returns Celo mainnet chain ID, latest block, and gas price.",
    inputSchema: z.object({}),
    families: ["read"],
    mcp: { title: "Get Network Status", annotations: readOnly },
    handler: async (runtime) => runtime.celina.blockchain.getNetworkStatus(),
  },
  {
    name: "get_block",
    description: "Fetch a Celo mainnet block by number, hash, or latest.",
    inputSchema: z.object({
      block_id: blockIdSchema,
      include_transactions: z.boolean().optional(),
    }),
    families: ["read"],
    mcp: { title: "Get Block", annotations: readOnly },
    handler: async (runtime, input) =>
      runtime.celina.blockchain.getBlock(input.block_id as never, {
        includeTransactions: input.include_transactions as boolean | undefined,
      }),
  },
  {
    name: "get_latest_blocks",
    description: "Fetch the most recent blocks on Celo mainnet.",
    inputSchema: z.object({
      count: z.number().int().min(1).max(100).optional(),
      offset: z.number().int().min(0).optional(),
    }),
    families: ["read"],
    mcp: { title: "Get Latest Blocks", annotations: readOnly },
    handler: async (runtime, input) =>
      runtime.celina.blockchain.getLatestBlocks(
        (input.count as number | undefined) ?? 5,
        (input.offset as number | undefined) ?? 0,
      ),
  },
  {
    name: "get_transaction",
    description: "Fetch a transaction and receipt by hash on Celo mainnet.",
    inputSchema: z.object({
      hash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
    }),
    families: ["read"],
    mcp: { title: "Get Transaction", annotations: readOnly },
    handler: async (runtime, input) =>
      runtime.celina.blockchain.getTransaction(input.hash as `0x${string}`),
  },
  {
    name: "get_wallet_address",
    description:
      "Returns the wallet address derived from CELO_PRIVATE_KEY in the MCP server env.",
    inputSchema: z.object({}),
    families: ["read"],
    surfaces: ["mcp"],
    mcp: { title: "Get Wallet Address", annotations: readOnly },
    handler: async (runtime) => {
      if (!runtime.mcpWallet?.hasWallet) {
        throw new Error(
          "No wallet configured. Set CELO_PRIVATE_KEY in the server env.",
        );
      }
      return {
        wallet_address: runtime.mcpWallet.address,
        has_wallet: true,
        source: "CELO_PRIVATE_KEY",
      };
    },
  },
  {
    name: "get_account",
    description:
      "Returns native CELO balance, nonce, and whether the address is a contract.",
    inputSchema: z.object({
      address: optionalWalletAddressSchema,
    }),
    families: ["read"],
    mcp: { title: "Get Account", annotations: readOnly },
    handler: async (runtime, input) => {
      const target = resolveWalletFromRuntime(runtime, {
        address: input.address as string | undefined,
      });
      return runtime.celina.account.getAccount(target);
    },
  },
];
