import { z } from "zod";
import {
  goodDollarReserveQuoteSchema,
  goodDollarReserveWalletSchema,
  optionalWalletAddressSchema,
} from "../schemas/common.js";
import type { ToolDefinition } from "../types.js";
import { normalizeRegistryTokenInput } from "../utils/normalize-token.js";
import { resolveWalletFromRuntime, useMcpServerExecutor } from "../utils/wallet.js";

const readOnly = {
  readOnlyHint: true,
  idempotentHint: true,
} as const;

function mapReserveWalletOptions(input: Record<string, unknown>) {
  return {
    recipient: input.recipient as `0x${string}` | undefined,
    slippageTolerance: input.slippage_tolerance as number | undefined,
  };
}

const NON_IDENTITY_RESERVE_NOTE =
  " Uses the literal signing wallet address for balances; does not resolve GoodDollar identity roots.";

export const gooddollarToolDefinitions: ToolDefinition[] = [
  {
    name: "get_gooddollar_whitelisting_info",
    description:
      "Check GoodDollar IdentityV4 whitelist status for a wallet. Connected wallets resolve to their verified root; returns isWhitelisted, whitelistedRoot, and checkedAddress.",
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
    name: "get_gooddollar_identity_link",
    description:
      "How a wallet links to GoodDollar IdentityV4: whitelisted root, connected-to root, and live whitelist status.",
    inputSchema: z.object({
      address: optionalWalletAddressSchema,
    }),
    families: ["read"],
    mcp: { title: "Get GoodDollar Identity Link", annotations: readOnly },
    handler: async (runtime, input) => {
      const target = resolveWalletFromRuntime(runtime, {
        address: input.address as string | undefined,
      });
      return runtime.celina.gooddollar.getIdentityLink(target);
    },
  },
  {
    name: "get_gooddollar_ubi_entitlement",
    description:
      "Daily GoodDollar UBI claim eligibility: whitelist root, claimable G$, already claimed. Nested identity.isWhitelisted reflects the resolved root.",
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
    requiresEnv: ["CELO_PRIVATE_KEY"],
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
      `GoodDollar reserve quote for G$ ↔ USDm on Celo (MentoBroker bonding curve).${NON_IDENTITY_RESERVE_NOTE}`,
    inputSchema: goodDollarReserveQuoteSchema,
    families: ["read"],
    mcp: { title: "Get GoodDollar Reserve Quote", annotations: readOnly },
    handler: async (runtime, input) =>
      runtime.celina.gooddollar.getReserveQuote(
        normalizeRegistryTokenInput(input.token_in as string),
        normalizeRegistryTokenInput(input.token_out as string),
        input.amount as string,
      ),
  },
  {
    name: "estimate_gooddollar_reserve_swap",
    description:
      `Estimate gas for a GoodDollar reserve swap (G$ ↔ USDm), including ERC-20 approval when needed.${NON_IDENTITY_RESERVE_NOTE}`,
    inputSchema: goodDollarReserveWalletSchema,
    families: ["read"],
    surfaces: ["mcp"],
    mcp: {
      title: "Estimate GoodDollar Reserve Swap",
      annotations: readOnly,
    },
    handler: async (runtime, input) => {
      const from = input.from as string | undefined;
      const sender = resolveWalletFromRuntime(runtime, { from });
      const tokenIn = normalizeRegistryTokenInput(input.token_in as string);
      const tokenOut = normalizeRegistryTokenInput(input.token_out as string);
      const amount = input.amount as string;
      const options = mapReserveWalletOptions(input);
      if (
        runtime.executors?.gooddollarWrite &&
        useMcpServerExecutor(runtime, from)
      ) {
        return runtime.executors.gooddollarWrite.estimateReserveSwap(
          tokenIn,
          tokenOut,
          amount,
          {
            ...options,
            recipient: options.recipient ?? sender,
          },
        );
      }
      return runtime.celina.gooddollar.estimateReserveSwap(
        sender,
        tokenIn,
        tokenOut,
        amount,
        options,
      );
    },
  },
  {
    name: "execute_gooddollar_reserve_swap",
    description:
      "Execute a GoodDollar reserve swap (G$ ↔ USDm) on mainnet. Requires CELO_PRIVATE_KEY.",
    inputSchema: goodDollarReserveWalletSchema,
    families: ["execute"],
    surfaces: ["mcp"],
    requiresEnv: ["CELO_PRIVATE_KEY"],
    mcp: {
      title: "Execute GoodDollar Reserve Swap",
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    handler: async (runtime, input) => {
      const write = runtime.executors?.gooddollarWrite;
      if (!write) {
        throw new Error("GoodDollar write executor not configured.");
      }
      return write.executeReserveSwap(
        normalizeRegistryTokenInput(input.token_in as string),
        normalizeRegistryTokenInput(input.token_out as string),
        input.amount as string,
        mapReserveWalletOptions(input),
      );
    },
  },
  {
    name: "prepare_gooddollar_reserve_swap",
    description:
      `Prepare unsigned GoodDollar reserve swap for G$ ↔ USDm. User must sign in wallet.${NON_IDENTITY_RESERVE_NOTE}`,
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
