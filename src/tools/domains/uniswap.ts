import {
  uniswapQuoteSchema,
  uniswapWalletSchema,
} from "../schemas/common.js";
import type { ToolDefinition } from "../types.js";
import { normalizeRegistryTokenInput } from "../utils/normalize-token.js";
import { resolveWalletFromRuntime } from "../utils/wallet.js";

function mapUniswapWalletOptions(input: Record<string, unknown>) {
  return {
    recipient: input.recipient as `0x${string}` | undefined,
    slippageTolerance: input.slippage_tolerance as number | undefined,
    deadlineMinutes: input.deadline_minutes as number | undefined,
  };
}

export const uniswapToolDefinitions: ToolDefinition[] = [
  {
    name: "get_uniswap_quote",
    description: "Uniswap v4 AMM quote for a token pair on Celo mainnet.",
    inputSchema: uniswapQuoteSchema,
    families: ["read"],
    mcp: { title: "Get Uniswap Quote", annotations: { readOnlyHint: true } },
    handler: async (runtime, input) => {
      const from = input.from
        ? resolveWalletFromRuntime(runtime, { from: input.from as string })
        : undefined;
      return runtime.celina.uniswap.getSwapQuote(
        normalizeRegistryTokenInput(input.token_in as string),
        normalizeRegistryTokenInput(input.token_out as string),
        input.amount as string,
        from,
      );
    },
  },
  {
    name: "estimate_uniswap_swap",
    description:
      "Estimate gas for a Uniswap v4 swap including ERC-20 and Permit2 approvals when needed.",
    inputSchema: uniswapWalletSchema,
    families: ["read"],
    mcp: { title: "Estimate Uniswap Swap", annotations: { readOnlyHint: true } },
    handler: async (runtime, input) => {
      const sender = resolveWalletFromRuntime(runtime, {
        from: input.from as string | undefined,
      });
      if (runtime.executors?.uniswap) {
        return runtime.executors.uniswap.estimate(
          normalizeRegistryTokenInput(input.token_in as string),
          normalizeRegistryTokenInput(input.token_out as string),
          input.amount as string,
          mapUniswapWalletOptions(input),
        );
      }
      return runtime.celina.uniswap.estimateSwap(
        sender,
        normalizeRegistryTokenInput(input.token_in as string),
        normalizeRegistryTokenInput(input.token_out as string),
        input.amount as string,
        mapUniswapWalletOptions(input),
      );
    },
  },
  {
    name: "execute_uniswap_swap",
    description: "Execute a Uniswap v4 swap on Celo mainnet. Requires CELO_PRIVATE_KEY.",
    inputSchema: uniswapWalletSchema,
    families: ["execute"],
    surfaces: ["mcp"],
    mcp: {
      title: "Execute Uniswap Swap",
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    handler: async (runtime, input) => {
      const uni = runtime.executors?.uniswap;
      if (!uni) throw new Error("Uniswap executor not configured.");
      return uni.execute(
        normalizeRegistryTokenInput(input.token_in as string),
        normalizeRegistryTokenInput(input.token_out as string),
        input.amount as string,
        mapUniswapWalletOptions(input),
      );
    },
  },
  {
    name: "prepare_uniswap_swap",
    description:
      "Prepare Uniswap v4 swap only. Prefer prepare_swap after get_swap_quote for automatic routing.",
    inputSchema: uniswapWalletSchema,
    families: ["prepare"],
    surfaces: ["browser"],
    handler: async (runtime, input) => {
      const sender = resolveWalletFromRuntime(runtime, {
        from: input.from as string | undefined,
      });
      return runtime.celina.uniswap.prepareSwap(
        sender,
        normalizeRegistryTokenInput(input.token_in as string),
        normalizeRegistryTokenInput(input.token_out as string),
        input.amount as string,
        mapUniswapWalletOptions(input),
      );
    },
  },
];
