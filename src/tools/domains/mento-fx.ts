import {
  mentoFxQuoteSchema,
  mentoFxWalletSchema,
} from "../schemas/common.js";
import type { ToolDefinition } from "../types.js";
import { normalizeRegistryTokenInput } from "../utils/normalize-token.js";
import { resolveWalletFromRuntime, useMcpServerExecutor } from "../utils/wallet.js";

function mapMentoWalletOptions(input: Record<string, unknown>) {
  return {
    recipient: input.recipient as `0x${string}` | undefined,
    slippageTolerance: input.slippage_tolerance as number | undefined,
    deadlineMinutes: input.deadline_minutes as number | undefined,
  };
}

export const mentoFxToolDefinitions: ToolDefinition[] = [
  {
    name: "get_mento_fx_quote",
    description:
      "Mento FX oracle quote for a token pair on mainnet. Read-only.",
    inputSchema: mentoFxQuoteSchema,
    families: ["read"],
    mcp: { title: "Get Mento FX Quote", annotations: { readOnlyHint: true } },
    handler: async (runtime, input) =>
      runtime.celina.mentoFx.getFxQuote(
        normalizeRegistryTokenInput(input.token_in as string),
        normalizeRegistryTokenInput(input.token_out as string),
        input.amount as string,
      ),
  },
  {
    name: "estimate_mento_fx",
    description: "Estimate gas for a Mento FX conversion including approval if needed.",
    inputSchema: mentoFxWalletSchema,
    families: ["read"],
    mcp: { title: "Estimate Mento FX", annotations: { readOnlyHint: true } },
    handler: async (runtime, input) => {
      const from = input.from as string | undefined;
      const sender = resolveWalletFromRuntime(runtime, { from });
      if (runtime.executors?.mentoFx && useMcpServerExecutor(runtime, from)) {
        return runtime.executors.mentoFx.estimate(
          normalizeRegistryTokenInput(input.token_in as string),
          normalizeRegistryTokenInput(input.token_out as string),
          input.amount as string,
          { ...mapMentoWalletOptions(input), recipient: (input.recipient as `0x${string}` | undefined) ?? sender },
        );
      }
      return runtime.celina.mentoFx.estimateFx(
        sender,
        normalizeRegistryTokenInput(input.token_in as string),
        normalizeRegistryTokenInput(input.token_out as string),
        input.amount as string,
        mapMentoWalletOptions(input),
      );
    },
  },
  {
    name: "execute_mento_fx",
    description: "Execute a Mento FX conversion on mainnet. Requires CELO_PRIVATE_KEY.",
    inputSchema: mentoFxWalletSchema,
    families: ["execute"],
    surfaces: ["mcp"],
    requiresEnv: ["CELO_PRIVATE_KEY"],
    mcp: {
      title: "Execute Mento FX",
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    handler: async (runtime, input) => {
      const fx = runtime.executors?.mentoFx;
      if (!fx) throw new Error("Mento FX executor not configured.");
      return fx.execute(
        normalizeRegistryTokenInput(input.token_in as string),
        normalizeRegistryTokenInput(input.token_out as string),
        input.amount as string,
        mapMentoWalletOptions(input),
      );
    },
  },
  {
    name: "prepare_mento_fx",
    description:
      "Prepare Mento FX swap only. For general swaps after get_swap_quote, use prepare_swap.",
    inputSchema: mentoFxWalletSchema,
    families: ["prepare"],
    surfaces: ["browser"],
    handler: async (runtime, input) => {
      const sender = resolveWalletFromRuntime(runtime, {
        from: input.from as string | undefined,
      });
      return runtime.celina.mentoFx.prepareFx(
        sender,
        normalizeRegistryTokenInput(input.token_in as string),
        normalizeRegistryTokenInput(input.token_out as string),
        input.amount as string,
        mapMentoWalletOptions(input),
      );
    },
  },
];
