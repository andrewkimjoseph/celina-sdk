import { z } from "zod";
import {
  goodDollarReserveQuoteSchema,
  goodDollarReserveWalletSchema,
  optionalWalletAddressSchema,
} from "../schemas/common.js";
import type { ToolDefinition } from "../types.js";
import { normalizeRegistryTokenInput } from "../utils/normalize-token.js";
import { resolveWalletFromRuntime } from "../utils/wallet.js";

const readOnly = {
  readOnlyHint: true,
  idempotentHint: true,
} as const;

export const gooddollarToolDefinitions: ToolDefinition[] = [
  {
    name: "get_gooddollar_whitelisting_info",
    description: "Check GoodDollar IdentityV4 whitelist status for a wallet.",
    inputSchema: z.object({
      address: optionalWalletAddressSchema,
    }),
    families: ["read"],
    mcp: { title: "Get GoodDollar Whitelisting Info", annotations: readOnly },
    handler: async (runtime, input) => {
      const target = resolveWalletFromRuntime(runtime, {
        address: input.address as string | undefined,
      });
      return runtime.celina.gooddollar.getWhitelistingInfo(target);
    },
  },
  {
    name: "get_gooddollar_ubi_entitlement",
    description:
      "Daily GoodDollar UBI claim eligibility: whitelist root, claimable G$, already claimed.",
    inputSchema: z.object({
      address: optionalWalletAddressSchema,
    }),
    families: ["read"],
    mcp: { title: "Get GoodDollar UBI Entitlement", annotations: readOnly },
    handler: async (runtime, input) => {
      const target = resolveWalletFromRuntime(runtime, {
        address: input.address as string | undefined,
      });
      return runtime.celina.gooddollar.getUbiClaimEligibility(target);
    },
  },
  {
    name: "claim_daily_gooddollar_ubi",
    description:
      "Claim today's GoodDollar UBI for the MCP server wallet. Requires CELO_PRIVATE_KEY.",
    inputSchema: z.object({}),
    families: ["execute"],
    surfaces: ["mcp"],
    mcp: {
      title: "Claim Daily GoodDollar UBI",
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    handler: async (runtime) => {
      const write = runtime.executors?.gooddollarWrite;
      if (!write) {
        throw new Error("GoodDollar write executor not configured.");
      }
      return write.claimDailyUbi();
    },
  },
  {
    name: "prepare_claim_daily_gooddollar_ubi",
    description:
      "Prepare unsigned GoodDollar daily UBI claim. User must sign in wallet.",
    inputSchema: z.object({
      from: optionalWalletAddressSchema,
    }),
    families: ["prepare"],
    surfaces: ["browser"],
    handler: async (runtime, input) => {
      const sender = resolveWalletFromRuntime(runtime, {
        from: input.from as string | undefined,
      });
      return runtime.celina.gooddollar.prepareClaimUbi(sender);
    },
  },
  {
    name: "get_gooddollar_reserve_quote",
    description:
      "GoodDollar reserve quote for G$ ↔ USDm on Celo (MentoBroker bonding curve).",
    inputSchema: goodDollarReserveQuoteSchema,
    families: ["read"],
    mcp: { title: "Get GoodDollar Reserve Quote", annotations: readOnly },
    handler: async (runtime, input) => {
      const from = input.from
        ? resolveWalletFromRuntime(runtime, { from: input.from as string })
        : undefined;
      return runtime.celina.gooddollar.getReserveQuote(
        normalizeRegistryTokenInput(input.token_in as string),
        normalizeRegistryTokenInput(input.token_out as string),
        input.amount as string,
        from,
      );
    },
  },
  {
    name: "prepare_gooddollar_reserve_swap",
    description:
      "Prepare unsigned GoodDollar reserve swap for G$ ↔ USDm. User must sign in wallet.",
    inputSchema: goodDollarReserveWalletSchema,
    families: ["prepare"],
    surfaces: ["browser"],
    handler: async (runtime, input) => {
      const sender = resolveWalletFromRuntime(runtime, {
        from: input.from as string | undefined,
      });
      return runtime.celina.gooddollar.prepareReserveSwap(
        sender,
        normalizeRegistryTokenInput(input.token_in as string),
        normalizeRegistryTokenInput(input.token_out as string),
        input.amount as string,
        {
          recipient: input.recipient as `0x${string}` | undefined,
          slippageTolerance: input.slippage_tolerance as number | undefined,
        },
      );
    },
  },
];
