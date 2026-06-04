import { z } from "zod";
import { optionalWalletAddressSchema } from "../schemas/common.js";
import type { ToolDefinition } from "../types.js";
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
];
