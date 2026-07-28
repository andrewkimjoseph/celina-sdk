import { z } from "zod";
import {
  blockIdSchema,
  executeEnvRequirements,
  nonNegativeIntSchema,
  optionalBoundedPositiveIntRange,
  optionalSignerSchema,
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
      count: optionalBoundedPositiveIntRange(1, 100),
      offset: nonNegativeIntSchema.optional(),
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
    name: "verify_attribution_tag",
    description:
      "Decode ERC-8021 (celina, app codes) attribution from a Celo mainnet tx calldata. Optionally pass tag to check for a specific code.",
    inputSchema: z.object({
      hash: z
        .string()
        .regex(/^0x[a-fA-F0-9]{64}$/)
        .describe("Transaction hash (0x + 64 hex characters)."),
      tag: z
        .string()
        .min(1)
        .optional()
        .describe(
          "Optional attribution code to match (e.g. celo_862c21dd97a7, MY_APP). Omit to decode all tags.",
        ),
    }),
    families: ["read"],
    mcp: { title: "Verify Attribution Tag", annotations: readOnly },
    handler: async (runtime, input) =>
      runtime.celina.blockchain.verifyAttributionInTransaction(
        input.hash as `0x${string}`,
        input.tag as string | undefined,
      ),
  },
  {
    name: "check_attribution_tag",
    description:
      "List all ERC-8021 attribution tags on a Celo mainnet transaction in lowercase (same as erc8021.codes), or check whether a specific tag is present. Prefer this for \"what tags are on this tx?\"; use verify_attribution_tag for the raw layer.",
    inputSchema: z.object({
      hash: z
        .string()
        .regex(/^0x[a-fA-F0-9]{64}$/)
        .describe("Transaction hash (0x + 64 hex characters)."),
      tag: z
        .string()
        .min(1)
        .optional()
        .describe(
          "Optional attribution code to match (e.g. celo_862c21dd97a7, MY_APP). Omit to list all tags.",
        ),
    }),
    families: ["read"],
    mcp: { title: "Check Attribution Tag", annotations: readOnly },
    handler: async (runtime, input) =>
      runtime.celina.blockchain.checkAttributionInTransaction(
        input.hash as `0x${string}`,
        input.tag as string | undefined,
      ),
  },
  {
    name: "get_wallet_address",
    description:
      "Returns the wallet address derived from CELO_PRIVATE_KEY in the MCP server env.",
    inputSchema: z.object({}),
    families: ["read"],
    surfaces: ["mcp"],
    requiresEnv: ["CELO_PRIVATE_KEY"],
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
  {
    name: "get_celo_account_registration",
    description:
      "Whether an address is registered in the Celo Accounts contract (required before locking CELO).",
    inputSchema: z.object({ address: optionalWalletAddressSchema }),
    families: ["read"],
    mcp: { title: "Get Celo Account Registration", annotations: readOnly },
    handler: async (runtime, input) => {
      const target = resolveWalletFromRuntime(runtime, {
        address: input.address as string | undefined,
      });
      return runtime.celina.account.getAccountRegistration(target);
    },
  },
  {
    name: "execute_register_celo_account",
    description: "Register the MCP server wallet as a Celo account (Accounts.createAccount).",
    inputSchema: z.object({ signer: optionalSignerSchema }),
    families: ["execute"],
    surfaces: ["mcp"],
    requiresEnv: [...executeEnvRequirements],
    mcp: {
      title: "Register Celo Account",
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    handler: async (runtime, input) => {
      const write = runtime.executors?.accountWrite;
      if (!write) throw new Error("Account write executor not configured.");
      return write.registerAccount(input.signer as "celo" | "self_agent" | undefined);
    },
  },
  {
    name: "prepare_register_celo_account",
    description: "Prepare unsigned Celo account registration for wallet signing.",
    inputSchema: z.object({ from: optionalWalletAddressSchema }),
    families: ["prepare"],
    surfaces: ["browser"],
    handler: async (runtime, input) => {
      const from = resolveWalletFromRuntime(runtime, {
        from: input.from as string | undefined,
      });
      return runtime.celina.account.prepareRegisterAccount(from);
    },
  },
];
