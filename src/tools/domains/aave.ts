import { z } from "zod";
import {
  AAVE_SUPPORTED_SYMBOLS,
  resolveAaveAsset,
} from "../../config/aave.js";
import { optionalWalletAddressSchema, tokenSymbolSchema } from "../schemas/common.js";
import type { ToolDefinition } from "../types.js";
import { resolveWalletFromRuntime } from "../utils/wallet.js";

const supported = AAVE_SUPPORTED_SYMBOLS.join(", ");
const aaveTokenField = tokenSymbolSchema.describe(
  `Aave asset symbol on Celo (${supported}). Pass the symbol only.`,
);

export const aaveToolDefinitions: ToolDefinition[] = [
  {
    name: "supply_aave",
    description: `Supply tokens to Aave V3 on Celo. Supported: ${supported}. Requires CELO_PRIVATE_KEY.`,
    inputSchema: z.object({
      token: aaveTokenField,
      amount: z.string(),
    }),
    families: ["execute"],
    surfaces: ["mcp"],
    mcp: {
      title: "Supply Aave",
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    handler: async (runtime, input) => {
      const aave = runtime.executors?.aave;
      if (!aave) throw new Error("Aave executor not configured.");
      const asset = resolveAaveAsset(input.token as string);
      return aave.supply(asset.symbol, input.amount as string);
    },
  },
  {
    name: "withdraw_aave",
    description: `Withdraw tokens from Aave V3 on Celo. Supported: ${supported}. Requires CELO_PRIVATE_KEY.`,
    inputSchema: z.object({
      token: aaveTokenField,
      amount: z.string().optional(),
      withdraw_max: z.boolean().optional(),
    }),
    families: ["execute"],
    surfaces: ["mcp"],
    mcp: {
      title: "Withdraw Aave",
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    handler: async (runtime, input) => {
      const aave = runtime.executors?.aave;
      if (!aave) throw new Error("Aave executor not configured.");
      const asset = resolveAaveAsset(input.token as string);
      return aave.withdraw(
        asset.symbol,
        input.amount as string | undefined,
        input.withdraw_max as boolean | undefined,
      );
    },
  },
  {
    name: "prepare_aave_supply",
    description: "Prepare unsigned Aave V3 supply steps. User signs in wallet.",
    inputSchema: z.object({
      token: z.string(),
      amount: z.string(),
      from: optionalWalletAddressSchema,
    }),
    families: ["prepare"],
    surfaces: ["browser"],
    handler: async (runtime, input) => {
      const sender = resolveWalletFromRuntime(runtime, {
        from: input.from as string | undefined,
      });
      const asset = resolveAaveAsset(input.token as string);
      return runtime.celina.aave.prepareSupply(
        sender,
        asset.symbol,
        input.amount as string,
      );
    },
  },
  {
    name: "prepare_aave_withdraw",
    description: "Prepare unsigned Aave V3 withdraw. User signs in wallet.",
    inputSchema: z.object({
      token: z.string(),
      amount: z.string().optional(),
      withdraw_max: z.boolean().optional(),
      from: optionalWalletAddressSchema,
    }),
    families: ["prepare"],
    surfaces: ["browser"],
    handler: async (runtime, input) => {
      const sender = resolveWalletFromRuntime(runtime, {
        from: input.from as string | undefined,
      });
      const asset = resolveAaveAsset(input.token as string);
      return runtime.celina.aave.prepareWithdraw(
        sender,
        asset.symbol,
        input.amount as string | undefined,
        input.withdraw_max as boolean | undefined,
      );
    },
  },
];
