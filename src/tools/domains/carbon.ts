import { z } from "zod";
import {
  carbonWriteSchema,
  optionalWalletAddressSchema,
} from "../schemas/common.js";
import type { CarbonWriteBody } from "../../services/carbon.service.js";
import type { ToolDefinition, ToolRuntime } from "../types.js";
import { runCarbonPrepare } from "../utils/carbon-prepare-handler.js";
import { resolveWalletFromRuntime } from "../utils/wallet.js";

const readOnly = { readOnlyHint: true } as const;
const tokenPairSchema = z.object({
  base_token: z.string(),
  quote_token: z.string(),
});

const CARBON_PREPARE_SUFFIX =
  " Returns unsigned steps (approvals + Carbon tx) and warnings. Prices are quote per base; buy budget in quote, sell budget in base.";

function carbonPrepare(
  name: string,
  title: string,
  description: string,
  prepareFn: (runtime: ToolRuntime, body: CarbonWriteBody) => Promise<unknown>,
  options?: { marketPriceFallback?: boolean; concentrated?: boolean },
): ToolDefinition {
  return {
    name,
    description: description + CARBON_PREPARE_SUFFIX,
    inputSchema: carbonWriteSchema,
    families: ["prepare"],
    mcp: { title, annotations: { openWorldHint: true } },
    handler: (runtime, input) =>
      runCarbonPrepare(
        runtime,
        name,
        (body) => prepareFn(runtime, body),
        input,
        options,
      ),
  };
}

function carbonExecute(
  name: string,
  title: string,
  description: string,
  executeKey: keyof NonNullable<
    import("../types.js").CarbonWriteExecutors
  >,
): ToolDefinition {
  return {
    name,
    description:
      description +
      " Requires CELO_PRIVATE_KEY in MCP server env. Signs and broadcasts locally.",
    inputSchema: z.object({}).passthrough(),
    families: ["execute"],
    surfaces: ["mcp"],
    mcp: {
      title,
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    handler: async (runtime, input) => {
      const write = runtime.executors?.carbonWrite;
      if (!write) throw new Error("Carbon write executor not configured.");
      const fn = write[executeKey];
      return fn(input);
    },
  };
}

export const carbonToolDefinitions: ToolDefinition[] = [
  {
    name: "get_carbon_strategies",
    description:
      "Fetch active Carbon DeFi maker strategies for a wallet on Celo.",
    inputSchema: z.object({
      wallet_address: optionalWalletAddressSchema,
    }),
    families: ["read"],
    mcp: { title: "Get Carbon Strategies", annotations: readOnly },
    handler: async (runtime, input) => {
      const wallet = resolveWalletFromRuntime(runtime, {
        wallet_address: input.wallet_address as string | undefined,
      });
      return runtime.celina.carbon.getStrategies(wallet);
    },
  },
  {
    name: "get_carbon_strategy",
    description: "Look up a Carbon strategy by ID on Celo.",
    inputSchema: z.object({
      strategy_id: z.string(),
    }),
    families: ["read"],
    mcp: { title: "Get Carbon Strategy", annotations: readOnly },
    handler: async (runtime, input) =>
      runtime.celina.carbon.getStrategy(input.strategy_id as string),
  },
  {
    name: "get_carbon_trade_quote",
    description: "Quote a taker swap against Carbon maker liquidity on Celo.",
    inputSchema: z
      .object({
        source_token: z.string(),
        target_token: z.string(),
        amount: z.string(),
        is_trade_by_target: z.boolean().optional(),
      })
      .passthrough(),
    families: ["read"],
    mcp: { title: "Get Carbon Trade Quote", annotations: readOnly },
    handler: async (runtime, input) =>
      runtime.celina.carbon.getTradeQuote(input),
  },
  {
    name: "explore_carbon_pair",
    description: "Market liquidity and top strategies for a token pair on Carbon.",
    inputSchema: tokenPairSchema,
    families: ["read"],
    mcp: { title: "Explore Carbon Pair", annotations: readOnly },
    handler: async (runtime, input) => runtime.celina.carbon.explorePair(input),
  },
  {
    name: "resolve_carbon_token",
    description: "Resolve a token symbol or name to its Celo contract address.",
    inputSchema: z.object({ token: z.string() }),
    families: ["read"],
    mcp: { title: "Resolve Carbon Token", annotations: readOnly },
    handler: async (runtime, input) =>
      runtime.celina.carbon.resolveToken(input.token as string),
  },
  {
    name: "get_carbon_activity",
    description: "Trade and event history for a wallet or strategy on Carbon.",
    inputSchema: z
      .object({
        wallet_address: optionalWalletAddressSchema,
        strategy_id: z.string().optional(),
      })
      .passthrough(),
    families: ["read"],
    mcp: { title: "Get Carbon Activity", annotations: readOnly },
    handler: async (runtime, input) => {
      const strategyId = input.strategy_id as string | undefined;
      const explicitWallet = input.wallet_address as string | undefined;
      if (strategyId) {
        return runtime.celina.carbon.getActivity({
          ...input,
          ...(explicitWallet ? { wallet_address: explicitWallet } : {}),
        });
      }
      const wallet_address = resolveWalletFromRuntime(runtime, {
        wallet_address: explicitWallet,
      });
      return runtime.celina.carbon.getActivity({ ...input, wallet_address });
    },
  },
  {
    name: "find_carbon_opportunities",
    description: "Find discount buys and premium sells vs market on a Carbon pair.",
    inputSchema: tokenPairSchema.passthrough(),
    families: ["read"],
    mcp: { title: "Find Carbon Opportunities", annotations: readOnly },
    handler: async (runtime, input) =>
      runtime.celina.carbon.findOpportunities(input),
  },
  {
    name: "get_carbon_protocol_stats",
    description: "Carbon protocol-wide TVL, volume, and fees on Celo.",
    inputSchema: z.object({}).passthrough(),
    families: ["read"],
    mcp: { title: "Get Carbon Protocol Stats", annotations: readOnly },
    handler: async (runtime, input) =>
      runtime.celina.carbon.getProtocolStats(input),
  },
  {
    name: "get_carbon_price_history",
    description: "Historical OHLC candles for a Carbon pair on Celo.",
    inputSchema: z.object({}).passthrough(),
    families: ["read"],
    mcp: { title: "Get Carbon Price History", annotations: readOnly },
    handler: async (runtime, input) =>
      runtime.celina.carbon.getPriceHistory(input),
  },
  {
    name: "simulate_carbon_strategy",
    description: "Backtest a Carbon strategy against historical prices.",
    inputSchema: z.object({}).passthrough(),
    families: ["read"],
    mcp: { title: "Simulate Carbon Strategy", annotations: readOnly },
    handler: async (runtime, input) =>
      runtime.celina.carbon.simulateStrategy(input),
  },
  {
    name: "carbon_help",
    description: "Per-tool guidance for Carbon DeFi operations on Celo.",
    inputSchema: z.object({ topic: z.string().optional() }),
    families: ["read"],
    mcp: { title: "Carbon Help", annotations: readOnly },
    handler: async (runtime, input) =>
      runtime.celina.carbon.help(input.topic as string | undefined),
  },
  {
    name: "carbon_learn",
    description: "Carbon DeFi protocol education topics on Celo.",
    inputSchema: z.object({ topic: z.string().optional() }),
    families: ["read"],
    mcp: { title: "Carbon Learn", annotations: readOnly },
    handler: async (runtime, input) =>
      runtime.celina.carbon.learn(input.topic as string | undefined),
  },
  carbonPrepare(
    "prepare_carbon_limit_order",
    "Prepare Carbon Limit Order",
    "Create a one-time Carbon limit order on Celo.",
    (runtime, body) => runtime.celina.carbon.prepareLimitOrder(body),
    { marketPriceFallback: true },
  ),
  carbonPrepare(
    "prepare_carbon_range_order",
    "Prepare Carbon Range Order",
    "Create a Carbon range order on Celo.",
    (runtime, body) => runtime.celina.carbon.prepareRangeOrder(body),
    { marketPriceFallback: true },
  ),
  carbonPrepare(
    "prepare_carbon_recurring_strategy",
    "Prepare Carbon Recurring Strategy",
    "Create a recurring buy/sell Carbon strategy on Celo.",
    (runtime, body) => runtime.celina.carbon.prepareRecurringStrategy(body),
    { marketPriceFallback: true },
  ),
  carbonPrepare(
    "prepare_carbon_concentrated_strategy",
    "Prepare Carbon Concentrated Strategy",
    "Create concentrated two-sided Carbon liquidity on Celo.",
    (runtime, body) => runtime.celina.carbon.prepareConcentratedStrategy(body),
    { concentrated: true, marketPriceFallback: true },
  ),
  carbonPrepare(
    "prepare_carbon_full_range_strategy",
    "Prepare Carbon Full Range Strategy",
    "Create full-range Carbon liquidity on Celo.",
    (runtime, body) => runtime.celina.carbon.prepareFullRangeStrategy(body),
    { marketPriceFallback: true },
  ),
  carbonPrepare(
    "prepare_carbon_reprice_strategy",
    "Prepare Carbon Reprice",
    "Update price ranges of an existing Carbon strategy on Celo.",
    (runtime, body) => runtime.celina.carbon.prepareRepriceStrategy(body),
  ),
  carbonPrepare(
    "prepare_carbon_edit_strategy",
    "Prepare Carbon Edit Strategy",
    "Edit prices and budgets of a Carbon strategy on Celo.",
    (runtime, body) => runtime.celina.carbon.prepareEditStrategy(body),
  ),
  carbonPrepare(
    "prepare_carbon_deposit_budget",
    "Prepare Carbon Deposit",
    "Add funds to a Carbon strategy on Celo.",
    (runtime, body) => runtime.celina.carbon.prepareDepositBudget(body),
  ),
  carbonPrepare(
    "prepare_carbon_withdraw_budget",
    "Prepare Carbon Withdraw",
    "Withdraw funds from a Carbon strategy on Celo.",
    (runtime, body) => runtime.celina.carbon.prepareWithdrawBudget(body),
  ),
  carbonPrepare(
    "prepare_carbon_pause_strategy",
    "Prepare Carbon Pause",
    "Pause a Carbon strategy on Celo.",
    (runtime, body) => runtime.celina.carbon.preparePauseStrategy(body),
  ),
  carbonPrepare(
    "prepare_carbon_resume_strategy",
    "Prepare Carbon Resume",
    "Resume a paused Carbon strategy on Celo.",
    (runtime, body) => runtime.celina.carbon.prepareResumeStrategy(body),
  ),
  carbonPrepare(
    "prepare_carbon_delete_strategy",
    "Prepare Carbon Delete",
    "Permanently close a Carbon strategy on Celo.",
    (runtime, body) => runtime.celina.carbon.prepareDeleteStrategy(body),
  ),
  carbonPrepare(
    "prepare_carbon_trade",
    "Prepare Carbon Trade",
    "Build an unsigned taker swap against Carbon liquidity on Celo.",
    (runtime, body) => runtime.celina.carbon.prepareTrade(body),
  ),
  carbonExecute(
    "execute_carbon_limit_order",
    "Execute Carbon Limit Order",
    "Create and broadcast a Carbon limit order on Celo.",
    "executeLimitOrder",
  ),
  carbonExecute(
    "execute_carbon_range_order",
    "Execute Carbon Range Order",
    "Create and broadcast a Carbon range order on Celo.",
    "executeRangeOrder",
  ),
  carbonExecute(
    "execute_carbon_recurring_strategy",
    "Execute Carbon Recurring Strategy",
    "Create and broadcast a recurring Carbon strategy on Celo.",
    "executeRecurringStrategy",
  ),
  carbonExecute(
    "execute_carbon_concentrated_strategy",
    "Execute Carbon Concentrated Strategy",
    "Create and broadcast concentrated Carbon liquidity on Celo.",
    "executeConcentratedStrategy",
  ),
  carbonExecute(
    "execute_carbon_full_range_strategy",
    "Execute Carbon Full Range Strategy",
    "Create and broadcast full-range Carbon liquidity on Celo.",
    "executeFullRangeStrategy",
  ),
  carbonExecute(
    "execute_carbon_reprice_strategy",
    "Execute Carbon Reprice",
    "Update price ranges of a Carbon strategy on Celo.",
    "executeRepriceStrategy",
  ),
  carbonExecute(
    "execute_carbon_edit_strategy",
    "Execute Carbon Edit Strategy",
    "Edit a Carbon strategy on Celo.",
    "executeEditStrategy",
  ),
  carbonExecute(
    "execute_carbon_deposit_budget",
    "Execute Carbon Deposit",
    "Add funds to a Carbon strategy on Celo.",
    "executeDepositBudget",
  ),
  carbonExecute(
    "execute_carbon_withdraw_budget",
    "Execute Carbon Withdraw",
    "Withdraw funds from a Carbon strategy on Celo.",
    "executeWithdrawBudget",
  ),
  carbonExecute(
    "execute_carbon_pause_strategy",
    "Execute Carbon Pause",
    "Pause a Carbon strategy on Celo.",
    "executePauseStrategy",
  ),
  carbonExecute(
    "execute_carbon_resume_strategy",
    "Execute Carbon Resume",
    "Resume a paused Carbon strategy on Celo.",
    "executeResumeStrategy",
  ),
  carbonExecute(
    "execute_carbon_delete_strategy",
    "Execute Carbon Delete",
    "Permanently close a Carbon strategy on Celo.",
    "executeDeleteStrategy",
  ),
  carbonExecute(
    "execute_carbon_trade",
    "Execute Carbon Trade",
    "Execute a taker swap against Carbon liquidity on Celo.",
    "executeTrade",
  ),
];
