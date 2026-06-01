/**
 * Carbon DeFi on Celo — hybrid @bancor/carbon-sdk + Carbon REST (mcp.carbondefi.xyz).
 * REST is primary for all 25 MCP tools; SDK is fallback for quotes/trades when REST fails.
 */
import type { SdkConfig } from "../config/sdk-config.js";
import { CarbonRestClient } from "../clients/carbon-rest.js";
import { CarbonSdkClient } from "../clients/carbon-sdk.js";
import type { CarbonPrepareResult, CarbonRestSuccess } from "../types/carbon.js";
import {
  extractWarnings,
  normalizeCarbonPrepareResult,
} from "../utils/carbon-rest-adapter.js";
import type { TokenService } from "./token.service.js";

export type CarbonWriteBody = Record<string, unknown> & {
  wallet_address: `0x${string}`;
};

function walletAddress(value: string): `0x${string}` {
  return value as `0x${string}`;
}

export class CarbonService {
  private readonly rest: CarbonRestClient;
  private readonly sdk: CarbonSdkClient | null;

  constructor(
    config: SdkConfig,
    private readonly tokenService: TokenService,
  ) {
    this.rest = new CarbonRestClient(config.carbonRestBaseUrl);
    this.sdk =
      config.carbonSdkFallback !== false
        ? new CarbonSdkClient(config.rpcUrl)
        : null;
  }

  private async restRead<T extends CarbonRestSuccess>(
    tool: string,
    body: Record<string, unknown> = {},
  ): Promise<T & { warnings: string[] }> {
    const result = await this.rest.postTool<T>(tool, body);
    return { ...result, warnings: extractWarnings(result) };
  }

  private async restPrepare(
    tool: string,
    body: CarbonWriteBody,
    summary: string,
  ): Promise<CarbonPrepareResult> {
    const from = walletAddress(body.wallet_address);
    const result = await this.rest.postTool<CarbonRestSuccess>(tool, body);
    return normalizeCarbonPrepareResult(from, result, summary);
  }

  private async withSdkFallback<T>(
    restFn: () => Promise<T>,
    fallbackFn: () => Promise<T>,
  ): Promise<T> {
    try {
      return await restFn();
    } catch (primary) {
      if (!this.sdk) throw primary;
      return fallbackFn();
    }
  }

  // --- Read (2) ---

  async getStrategies(walletAddress: `0x${string}`) {
    return this.restRead("get_strategies", { wallet_address: walletAddress });
  }

  async getStrategy(strategyId: string) {
    return this.restRead("get_strategy", { strategy_id: strategyId });
  }

  // --- Create (5) ---

  async prepareLimitOrder(body: CarbonWriteBody) {
    return this.restPrepare("create_limit_order", body, "Carbon limit order");
  }

  async prepareRangeOrder(body: CarbonWriteBody) {
    return this.restPrepare("create_range_order", body, "Carbon range order");
  }

  async prepareRecurringStrategy(body: CarbonWriteBody) {
    return this.restPrepare(
      "create_recurring_strategy",
      body,
      "Carbon recurring strategy",
    );
  }

  async prepareConcentratedStrategy(body: CarbonWriteBody) {
    return this.restPrepare(
      "create_concentrated_strategy",
      body,
      "Carbon concentrated strategy",
    );
  }

  async prepareFullRangeStrategy(body: CarbonWriteBody) {
    return this.restPrepare(
      "create_full_range_strategy",
      body,
      "Carbon full-range strategy",
    );
  }

  // --- Manage (7) ---

  async prepareRepriceStrategy(body: CarbonWriteBody) {
    return this.restPrepare("reprice_strategy", body, "Carbon reprice strategy");
  }

  async prepareEditStrategy(body: CarbonWriteBody) {
    return this.restPrepare("edit_strategy", body, "Carbon edit strategy");
  }

  async prepareDepositBudget(body: CarbonWriteBody) {
    return this.restPrepare("deposit_budget", body, "Carbon deposit budget");
  }

  async prepareWithdrawBudget(body: CarbonWriteBody) {
    return this.restPrepare("withdraw_budget", body, "Carbon withdraw budget");
  }

  async preparePauseStrategy(body: CarbonWriteBody) {
    return this.restPrepare("pause_strategy", body, "Carbon pause strategy");
  }

  async prepareResumeStrategy(body: CarbonWriteBody) {
    return this.restPrepare("resume_strategy", body, "Carbon resume strategy");
  }

  async prepareDeleteStrategy(body: CarbonWriteBody) {
    return this.restPrepare("delete_strategy", body, "Carbon delete strategy");
  }

  // --- Trade (2) ---

  async getTradeQuote(body: Record<string, unknown>) {
    const amount =
      typeof body.amount === "string" ? Number(body.amount) : body.amount;
    const normalized = {
      ...body,
      amount,
      ...(body.is_trade_by_target !== undefined
        ? { by_target: body.is_trade_by_target }
        : {}),
    };
    return this.withSdkFallback(
      () => this.restRead("get_trade_quote", normalized),
      async () => {
        if (!this.sdk) throw new Error("Carbon SDK fallback unavailable");
        const sourceToken = String(body.source_token ?? body.token_in);
        const targetToken = String(body.target_token ?? body.token_out);
        const amountStr = String(amount);
        const isTradeByTarget = Boolean(
          body.is_trade_by_target ?? body.by_target,
        );
        const { tradeData } = await this.sdk.getTradeQuoteFallback(
          sourceToken,
          targetToken,
          amountStr,
          isTradeByTarget,
        );
        return {
          status: "ok" as const,
          warnings: [] as string[],
          source: "sdk_fallback",
          ...tradeData,
        };
      },
    );
  }

  async prepareTrade(body: CarbonWriteBody) {
    try {
      return await this.restPrepare("execute_trade", body, "Carbon taker swap");
    } catch (primary) {
      if (!this.sdk) throw primary;
      const sourceToken = String(body.source_token ?? body.token_in);
      const targetToken = String(body.target_token ?? body.token_out);
      const amount = String(body.amount);
      const minReturn = String(body.min_return ?? "0");
      const preparedFlow = await this.sdk.prepareTradeFallback(
        walletAddress(body.wallet_address),
        sourceToken,
        targetToken,
        amount,
        false,
        minReturn,
      );
      return {
        status: "ok" as const,
        warnings: [] as string[],
        preparedFlow,
        source: "sdk_fallback",
      };
    }
  }

  // --- Explore (8) ---

  async explorePair(body: Record<string, unknown>) {
    return this.restRead("explore_pair", body);
  }

  async resolveToken(symbolOrName: string) {
    try {
      return await this.restRead("resolve_token", {
        token: symbolOrName,
      });
    } catch {
      const resolved = this.tokenService.resolveToken(symbolOrName);
      return {
        status: "ok" as const,
        warnings: [] as string[],
        symbol: resolved.symbol,
        address: resolved.address,
        decimals: resolved.decimals,
        source: "celina_registry",
      };
    }
  }

  async getActivity(body: Record<string, unknown>) {
    return this.restRead("get_activity", body);
  }

  async findOpportunities(body: Record<string, unknown>) {
    return this.restRead("find_opportunities", body);
  }

  async getProtocolStats(body: Record<string, unknown> = {}) {
    const { period_days, ...rest } = body;
    return this.restRead("get_protocol_stats", {
      ...rest,
      ...(period_days !== undefined ? { days: period_days } : {}),
    });
  }

  async getPriceHistory(body: Record<string, unknown>) {
    const { period_days, days, ...rest } = body;
    const lookback = days ?? period_days;
    return this.restRead("get_price_history", {
      ...rest,
      ...(lookback !== undefined ? { days: lookback } : {}),
    });
  }

  async simulateStrategy(body: Record<string, unknown>) {
    const { days, ...rest } = body;
    if (rest.start === undefined && rest.end === undefined && days !== undefined) {
      const end = Math.floor(Date.now() / 1000);
      const start = end - Number(days) * 86_400;
      return this.restRead("simulate_strategy", { ...rest, start, end });
    }
    return this.restRead("simulate_strategy", body);
  }

  // --- Help (2) ---

  async help(topic?: string) {
    return this.restRead("help", topic ? { topic } : {});
  }

  async learn(topic?: string) {
    return this.restRead("learn", topic ? { topic } : {});
  }
}
