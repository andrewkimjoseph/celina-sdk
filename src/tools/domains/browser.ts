import { z } from "zod";
import {
  getSwapQuoteWithFallback,
  prepareSwapWithFallback,
  type SwapProtocol,
} from "../swap-routing.js";
import {
  goodDollarReserveAmountSideSchema,
  uniswapWalletSchema,
} from "../schemas/common.js";
import type { ToolDefinition } from "../types.js";
import { normalizeRegistryTokenInput } from "../utils/normalize-token.js";
import { resolveWalletFromRuntime } from "../utils/wallet.js";

export const browserToolDefinitions: ToolDefinition[] = [
  {
    name: "get_swap_quote",
    description:
      "Best swap quote on Celo — tries Mento FX, GoodDollar reserve (G$ ↔ USDm), and Uniswap v4 in parallel.",
    inputSchema: z.object({
      token_in: z.string(),
      token_out: z.string(),
      amount: z.string(),
    }),
    families: ["read"],
    surfaces: ["browser"],
    handler: async (runtime, input) => {
      const from = resolveWalletFromRuntime(runtime, {});
      return getSwapQuoteWithFallback(
        runtime.celina,
        normalizeRegistryTokenInput(input.token_in as string),
        normalizeRegistryTokenInput(input.token_out as string),
        input.amount as string,
        from,
      );
    },
  },
  {
    name: "prepare_swap",
    description:
      "Prepare unsigned swap using the best route (Mento FX, GoodDollar reserve, or Uniswap v4).",
    inputSchema: uniswapWalletSchema.extend({
      protocol: z.enum(["mento_fx", "uniswap_v4", "gooddollar_reserve"]).optional(),
      amount_side: goodDollarReserveAmountSideSchema,
    }),
    families: ["prepare"],
    surfaces: ["browser"],
    handler: async (runtime, input) => {
      const sender = resolveWalletFromRuntime(runtime, {
        from: input.from as string | undefined,
      });
      const amountSide = input.amount_side === "out" ? "out" : "in";
      return prepareSwapWithFallback(
        runtime.celina,
        sender,
        normalizeRegistryTokenInput(input.token_in as string),
        normalizeRegistryTokenInput(input.token_out as string),
        input.amount as string,
        {
          recipient: input.recipient as `0x${string}` | undefined,
          slippageTolerance: input.slippage_tolerance as number | undefined,
          deadlineMinutes: input.deadline_minutes as number | undefined,
          amountSide,
        },
        input.protocol as SwapProtocol | undefined,
      );
    },
  },
];
