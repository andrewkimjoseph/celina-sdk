import type { OperationSpec } from "../types.js";
import { assertHasKeys } from "../../helpers/assert.js";

const CARBON_WALLET = "0x0000000000000000000000000000000000000001" as const;
const CELO = "0x471EcE3750Da237a93B120cEadFa0b8eA6E3E25";
const USDC = "0xcebA9300f2b948710d2653dd7D87747AdA2aA3b";

function carbonRead(
  id: string,
  tool: string,
  invoke: OperationSpec["sdk"]["invoke"],
  args: () => Record<string, unknown>,
  keys: string[],
): OperationSpec {
  return {
    id,
    domain: "carbon",
    layer: "read",
    sdk: { invoke },
    mcp: { tool, arguments: args },
    assert: (result) => assertHasKeys(result, keys),
  };
}

function carbonPrepare(
  id: string,
  tool: string,
  invoke: OperationSpec["sdk"]["invoke"],
  args: () => Record<string, unknown>,
): OperationSpec {
  return {
    id,
    domain: "carbon",
    layer: "prepare",
    sdk: { invoke },
    mcp: { tool, arguments: args },
    assert: (result) => assertHasKeys(result, ["status", "warnings"]),
    skip: () =>
      "Carbon prepare tools require valid strategy params; run manually with funded wallet",
  };
}

export const carbonOperations: OperationSpec[] = [
  carbonRead(
    "carbon.getStrategies",
    "get_carbon_strategies",
    (c) => c.carbon.getStrategies(CARBON_WALLET),
    () => ({ wallet_address: CARBON_WALLET }),
    ["status", "warnings"],
  ),
  {
    ...carbonRead(
      "carbon.getStrategy",
      "get_carbon_strategy",
      (c) => c.carbon.getStrategy("1"),
      () => ({ strategy_id: "1" }),
      ["status", "warnings"],
    ),
    skip: () =>
      "Requires an existing Carbon strategy id on Celo (set CELINA_CARBON_STRATEGY_ID)",
  },
  {
    ...carbonRead(
      "carbon.getTradeQuote",
      "get_carbon_trade_quote",
      (c) =>
        c.carbon.getTradeQuote({
          source_token: CELO,
          target_token: USDC,
          amount: 1,
          is_trade_by_target: false,
        }),
      () => ({
        source_token: CELO,
        target_token: USDC,
        amount: 1,
        is_trade_by_target: false,
      }),
      ["status", "warnings"],
    ),
    skip: () =>
      "Carbon get_trade_quote on Celo may fail upstream (ENS); run manually when API is healthy",
  },
  carbonRead(
    "carbon.explorePair",
    "explore_carbon_pair",
    (c) => c.carbon.explorePair({ base_token: CELO, quote_token: USDC }),
    () => ({ base_token: CELO, quote_token: USDC }),
    ["status", "chain"],
  ),
  carbonRead(
    "carbon.resolveToken",
    "resolve_carbon_token",
    (c) => c.carbon.resolveToken("USDC"),
    () => ({ token: "USDC" }),
    ["status", "warnings"],
  ),
  carbonRead(
    "carbon.getActivity",
    "get_carbon_activity",
    (c) => c.carbon.getActivity({ wallet_address: CARBON_WALLET }),
    () => ({ wallet_address: CARBON_WALLET }),
    ["status", "warnings"],
  ),
  {
    ...carbonRead(
      "carbon.findOpportunities",
      "find_carbon_opportunities",
      (c) => c.carbon.findOpportunities({ base_token: CELO, quote_token: USDC }),
      () => ({ base_token: CELO, quote_token: USDC }),
      ["status", "warnings"],
    ),
    skip: () =>
      "Carbon find_opportunities may require market data on Celo; run manually when API returns opportunities",
  },
  carbonRead(
    "carbon.getProtocolStats",
    "get_carbon_protocol_stats",
    (c) => c.carbon.getProtocolStats({ period_days: 7 }),
    () => ({ period_days: 7 }),
    ["status", "chain"],
  ),
  {
    ...carbonRead(
      "carbon.getPriceHistory",
      "get_carbon_price_history",
      (c) =>
        c.carbon.getPriceHistory({
          base_token: CELO,
          quote_token: USDC,
          period_days: 7,
        }),
      () => ({ base_token: CELO, quote_token: USDC, period_days: 7 }),
      ["status", "warnings"],
    ),
    skip: () =>
      "Carbon get_price_history may return 400 for some Celo pairs; run manually when API is healthy",
  },
  {
    ...carbonRead(
      "carbon.simulateStrategy",
      "simulate_carbon_strategy",
    (c) =>
      c.carbon.simulateStrategy({
        base_token: CELO,
        quote_token: USDC,
        days: 7,
        buy_price_low: 0.1,
        buy_price_high: 0.2,
        buy_budget: 10,
        sell_price_low: 0.3,
        sell_price_high: 0.4,
        sell_budget: 5,
      }),
    () => ({
      base_token: CELO,
      quote_token: USDC,
      days: 7,
      buy_price_low: 0.1,
      buy_price_high: 0.2,
      buy_budget: 10,
      sell_price_low: 0.3,
      sell_price_high: 0.4,
      sell_budget: 5,
    }),
    ["status", "warnings"],
    ),
    skip: () =>
      "Carbon simulate_strategy may return 400 upstream on Celo; run manually when API is healthy",
  },
  carbonRead(
    "carbon.help",
    "carbon_help",
    (c) => c.carbon.help("create_limit_order"),
    () => ({ topic: "create_limit_order" }),
    ["status"],
  ),
  carbonRead(
    "carbon.learn",
    "carbon_learn",
    (c) => c.carbon.learn("recurring_strategy"),
    () => ({ topic: "recurring_strategy" }),
    ["status"],
  ),
  carbonPrepare(
    "carbon.prepareLimitOrder",
    "prepare_carbon_limit_order",
    (c) =>
      c.carbon.prepareLimitOrder({
        wallet_address: CARBON_WALLET,
        base_token: CELO,
        quote_token: USDC,
        direction: "buy",
        price: 0.5,
        budget: 10,
      }),
    () => ({
      wallet_address: CARBON_WALLET,
      base_token: CELO,
      quote_token: USDC,
      direction: "buy",
      price: 0.5,
      budget: 10,
    }),
  ),
  carbonPrepare(
    "carbon.prepareRangeOrder",
    "prepare_carbon_range_order",
    (c) =>
      c.carbon.prepareRangeOrder({
        wallet_address: CARBON_WALLET,
        base_token: CELO,
        quote_token: USDC,
        direction: "buy",
        price_low: 0.4,
        price_high: 0.6,
        budget: 10,
      }),
    () => ({
      wallet_address: CARBON_WALLET,
      base_token: CELO,
      quote_token: USDC,
      direction: "buy",
      price_low: 0.4,
      price_high: 0.6,
      budget: 10,
    }),
  ),
  carbonPrepare(
    "carbon.prepareRecurringStrategy",
    "prepare_carbon_recurring_strategy",
    (c) =>
      c.carbon.prepareRecurringStrategy({
        wallet_address: CARBON_WALLET,
        base_token: CELO,
        quote_token: USDC,
        buy_price_low: 0.4,
        buy_price_high: 0.5,
        buy_budget: 10,
        sell_price_low: 0.6,
        sell_price_high: 0.7,
        sell_budget: 5,
      }),
    () => ({
      wallet_address: CARBON_WALLET,
      base_token: CELO,
      quote_token: USDC,
      buy_price_low: 0.4,
      buy_price_high: 0.5,
      buy_budget: 10,
      sell_price_low: 0.6,
      sell_price_high: 0.7,
      sell_budget: 5,
    }),
  ),
  carbonPrepare(
    "carbon.prepareConcentratedStrategy",
    "prepare_carbon_concentrated_strategy",
    (c) =>
      c.carbon.prepareConcentratedStrategy({
        wallet_address: CARBON_WALLET,
        base_token: CELO,
        quote_token: USDC,
        spread_percentage: 1,
        buy_budget: 10,
        sell_budget: 5,
      }),
    () => ({
      wallet_address: CARBON_WALLET,
      base_token: CELO,
      quote_token: USDC,
      spread_percentage: 1,
      buy_budget: 10,
      sell_budget: 5,
    }),
  ),
  carbonPrepare(
    "carbon.prepareFullRangeStrategy",
    "prepare_carbon_full_range_strategy",
    (c) =>
      c.carbon.prepareFullRangeStrategy({
        wallet_address: CARBON_WALLET,
        base_token: CELO,
        quote_token: USDC,
        spread_percentage: 5,
        buy_budget: 10,
        sell_budget: 5,
      }),
    () => ({
      wallet_address: CARBON_WALLET,
      base_token: CELO,
      quote_token: USDC,
      spread_percentage: 5,
      buy_budget: 10,
      sell_budget: 5,
    }),
  ),
  carbonPrepare(
    "carbon.prepareRepriceStrategy",
    "prepare_carbon_reprice_strategy",
    (c) =>
      c.carbon.prepareRepriceStrategy({
        wallet_address: CARBON_WALLET,
        strategy_id: "1",
        buy_price_low: 0.4,
        buy_price_high: 0.5,
      }),
    () => ({
      wallet_address: CARBON_WALLET,
      strategy_id: "1",
      buy_price_low: 0.4,
      buy_price_high: 0.5,
    }),
  ),
  carbonPrepare(
    "carbon.prepareEditStrategy",
    "prepare_carbon_edit_strategy",
    (c) =>
      c.carbon.prepareEditStrategy({
        wallet_address: CARBON_WALLET,
        strategy_id: "1",
        buy_budget: 10,
      }),
    () => ({
      wallet_address: CARBON_WALLET,
      strategy_id: "1",
      buy_budget: 10,
    }),
  ),
  carbonPrepare(
    "carbon.prepareDepositBudget",
    "prepare_carbon_deposit_budget",
    (c) =>
      c.carbon.prepareDepositBudget({
        wallet_address: CARBON_WALLET,
        strategy_id: "1",
        buy_budget: 5,
      }),
    () => ({
      wallet_address: CARBON_WALLET,
      strategy_id: "1",
      buy_budget: 5,
    }),
  ),
  carbonPrepare(
    "carbon.prepareWithdrawBudget",
    "prepare_carbon_withdraw_budget",
    (c) =>
      c.carbon.prepareWithdrawBudget({
        wallet_address: CARBON_WALLET,
        strategy_id: "1",
        buy_budget: 1,
      }),
    () => ({
      wallet_address: CARBON_WALLET,
      strategy_id: "1",
      buy_budget: 1,
    }),
  ),
  carbonPrepare(
    "carbon.preparePauseStrategy",
    "prepare_carbon_pause_strategy",
    (c) =>
      c.carbon.preparePauseStrategy({
        wallet_address: CARBON_WALLET,
        strategy_id: "1",
      }),
    () => ({ wallet_address: CARBON_WALLET, strategy_id: "1" }),
  ),
  carbonPrepare(
    "carbon.prepareResumeStrategy",
    "prepare_carbon_resume_strategy",
    (c) =>
      c.carbon.prepareResumeStrategy({
        wallet_address: CARBON_WALLET,
        strategy_id: "1",
      }),
    () => ({ wallet_address: CARBON_WALLET, strategy_id: "1" }),
  ),
  carbonPrepare(
    "carbon.prepareDeleteStrategy",
    "prepare_carbon_delete_strategy",
    (c) =>
      c.carbon.prepareDeleteStrategy({
        wallet_address: CARBON_WALLET,
        strategy_id: "1",
      }),
    () => ({ wallet_address: CARBON_WALLET, strategy_id: "1" }),
  ),
  carbonPrepare(
    "carbon.prepareTrade",
    "prepare_carbon_trade",
    (c) =>
      c.carbon.prepareTrade({
        wallet_address: CARBON_WALLET,
        source_token: CELO,
        target_token: USDC,
        amount: "1",
        min_return: "0",
      }),
    () => ({
      wallet_address: CARBON_WALLET,
      source_token: CELO,
      target_token: USDC,
      amount: "1",
      min_return: "0",
    }),
  ),
];
