import { JsonRpcProvider } from "ethers";
import { ContractsApi } from "@bancor/carbon-sdk/contracts-api";
import { initSyncedCache } from "@bancor/carbon-sdk/chain-cache";
import {
  CELO_CARBON_CONTRACTS,
  CELO_CHAIN_ID,
} from "../config/carbon.js";
import { populatedTransactionToPreparedFlow } from "../utils/carbon-prepared-flow.js";
import type { SerializedPreparedFlow } from "../types/prepared.js";

const MAX_BLOCK_AGE = 2000;

/** Minimal Toolkit surface used for trade fallback. */
type CarbonToolkit = {
  getTradeData: (
    sourceToken: string,
    targetToken: string,
    amount: string,
    isTradeByTarget: boolean,
  ) => Promise<{
    tradeActions: unknown[];
    totalSourceAmount: string;
    totalTargetAmount: string;
  }>;
  composeTradeBySourceTransaction: (
    sourceToken: string,
    targetToken: string,
    tradeActions: unknown[],
    deadline: string,
    minReturn: string,
  ) => Promise<{ to?: string | null; data?: string | null; value?: bigint | null }>;
};

export class CarbonSdkClient {
  private toolkit: CarbonToolkit | null = null;
  private initPromise: Promise<CarbonToolkit> | null = null;

  constructor(private readonly rpcUrl: string) {}

  async getToolkit(): Promise<CarbonToolkit> {
    if (this.toolkit) return this.toolkit;
    if (!this.initPromise) {
      this.initPromise = this.initialize();
    }
    this.toolkit = await this.initPromise;
    return this.toolkit;
  }

  private async initialize(): Promise<CarbonToolkit> {
    const strategyMod = (await import(
      "@bancor/carbon-sdk/strategy-management"
    )) as { Toolkit: new (api: ContractsApi, cache: unknown) => CarbonToolkit };
    const { Toolkit } = strategyMod;

    const provider = new JsonRpcProvider(this.rpcUrl, CELO_CHAIN_ID, {
      staticNetwork: true,
    });
    const api = new ContractsApi(provider, CELO_CARBON_CONTRACTS);
    const { cache, startDataSync } = initSyncedCache(
      api.reader,
      undefined,
      MAX_BLOCK_AGE,
    );
    const toolkit = new Toolkit(api, cache);
    await startDataSync();
    return toolkit;
  }

  async getTradeQuoteFallback(
    sourceToken: string,
    targetToken: string,
    amount: string,
    isTradeByTarget: boolean,
  ) {
    const toolkit = await this.getToolkit();
    const tradeData = await toolkit.getTradeData(
      sourceToken,
      targetToken,
      amount,
      isTradeByTarget,
    );
    return { tradeData };
  }

  async prepareTradeFallback(
    from: `0x${string}`,
    sourceToken: string,
    targetToken: string,
    amount: string,
    isTradeByTarget: boolean,
    minReturnOrMaxInput: string,
    deadlineMinutes = 5,
  ): Promise<SerializedPreparedFlow> {
    const toolkit = await this.getToolkit();
    const tradeData = await toolkit.getTradeData(
      sourceToken,
      targetToken,
      amount,
      isTradeByTarget,
    );
    const deadline = String(
      Math.floor(Date.now() / 1000) + deadlineMinutes * 60,
    );
    const tx = await toolkit.composeTradeBySourceTransaction(
      sourceToken,
      targetToken,
      tradeData.tradeActions,
      deadline,
      minReturnOrMaxInput,
    );
    return populatedTransactionToPreparedFlow(
      from,
      tx,
      `Carbon swap ${sourceToken} → ${targetToken}`,
    );
  }
}
