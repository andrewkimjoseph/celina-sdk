/**
 * Mento FX: getFxQuote is read-only; prepareFx builds approve + swap steps when needed.
 * Uses @mento-protocol/mento-sdk for routing and simulates allowance via state overrides.
 */
import {
  decodeFunctionData,
  erc20Abi,
  formatUnits,
  type Hex,
} from "viem";
import {
  ChainId,
  deadlineFromMinutes,
  Mento,
  RouteNotFoundError,
  FXMarketClosedError,
  type CallParams,
} from "../clients/mento-sdk.js";
import type { CeloClientFactory, CeloClients } from "../clients/celo-client.js";
import { appendCelinaCalldataTag } from "../config/celina-tag.js";
import { toMentoTokenAddress } from "../config/chains.js";
import {
  ALLOWANCE_MAPPING_SLOTS,
  erc20AllowanceStateOverride,
  isLikelyTransferFailed,
} from "../utils/erc20-allowance-storage.js";
import {
  type PreparedFlow,
  type PreparedTx,
  serializePreparedFlow,
  type SerializedPreparedFlow,
} from "../types/prepared.js";
import { TokenService, type ResolvedToken } from "./token.service.js";

/** Optional parameters for Mento FX swap estimates and prepares. */
export interface MentoFxParams {
  /** Max slippage tolerance in percent (default `0.5`). */
  slippageTolerance?: number;
  /** Swap deadline in minutes from now (default `5`). */
  deadlineMinutes?: number;
  /** Address receiving output tokens (default: `from`). */
  recipient?: `0x${string}`;
}

const DEFAULT_SLIPPAGE = 0.5;
const DEFAULT_DEADLINE_MINUTES = 5;

function trimDisplayDecimals(value: string): string {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return value;
  }
  if (Math.abs(num) >= 1000) {
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }
  if (Math.abs(num) >= 1) {
    return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
  }
  return num.toLocaleString(undefined, { maximumSignificantDigits: 6 });
}

/** Human-friendly amount for UI labels (handles raw base-unit integers). */
export function formatDisplayAmount(amount: string, decimals: number): string {
  const trimmed = amount.trim();
  const approx = trimmed.startsWith("~");
  let numeric = approx ? trimmed.slice(1).trim() : trimmed;
  numeric = numeric.replace(/,/g, "");

  const integerPart = numeric.split(".")[0] ?? numeric;
  if (/^\d+(?:\.\d+)?$/.test(numeric) && integerPart.length >= 10) {
    try {
      const human = formatUnits(BigInt(integerPart), decimals);
      const asNumber = Number(human);
      if (Number.isFinite(asNumber) && asNumber >= 0 && asNumber < 1_000_000_000) {
        numeric = trimDisplayDecimals(human);
        return approx ? `~${numeric}` : numeric;
      }
    } catch {
      // fall through
    }
  }

  if (/^\d+(?:\.\d+)?$/.test(numeric)) {
    numeric = trimDisplayDecimals(numeric);
  }

  return approx ? `~${numeric}` : numeric;
}

type Erc20ApproveCall = {
  token: `0x${string}`;
  spender: `0x${string}`;
  amount: bigint;
};

function parseErc20Approve(params: CallParams): Erc20ApproveCall | null {
  try {
    const decoded = decodeFunctionData({
      abi: erc20Abi,
      data: params.data as Hex,
    });

    if (decoded.functionName !== "approve") {
      return null;
    }

    return {
      token: params.to as `0x${string}`,
      spender: decoded.args[0] as `0x${string}`,
      amount: decoded.args[1] as bigint,
    };
  } catch {
    return null;
  }
}

function callParamsToPreparedTx(
  params: CallParams,
  description: string,
  attributionTags?: string[],
): PreparedTx {
  const approve = parseErc20Approve(params);
  if (approve) {
    return {
      kind: "erc20",
      to: approve.token,
      data: appendCelinaCalldataTag(params.data as Hex, attributionTags),
      value: "0",
      description,
    };
  }

  return {
    kind: "contract",
    to: params.to as `0x${string}`,
    data: appendCelinaCalldataTag(params.data as Hex, attributionTags),
    value: BigInt(params.value).toString(),
    description,
  };
}

/** Mento FX quotes, gas estimates, and `prepareFx` flows on Celo mainnet. */
export class MentoFxService {
  private readonly tokenService: TokenService;
  private readonly attributionTags?: string[];

  constructor(private readonly clientFactory: CeloClientFactory) {
    this.tokenService = new TokenService(clientFactory);
    this.attributionTags = clientFactory.getConfig().attributionTags;
  }

  private async getMentoClient(publicClient: CeloClients["public"]) {
    return Mento.create(ChainId.CELO, publicClient);
  }

  private resolveMentoPair(tokenIn: string, tokenOut: string) {
    const resolvedIn = this.tokenService.resolveToken(tokenIn);
    const resolvedOut = this.tokenService.resolveToken(tokenOut);

    return {
      resolvedIn,
      resolvedOut,
      mentoIn: toMentoTokenAddress(resolvedIn.address),
      mentoOut: toMentoTokenAddress(resolvedOut.address),
    };
  }

  private fxOptions(params?: MentoFxParams) {
    const slippageTolerance = params?.slippageTolerance ?? DEFAULT_SLIPPAGE;
    const deadlineMinutes = params?.deadlineMinutes ?? DEFAULT_DEADLINE_MINUTES;

    return {
      slippageTolerance,
      deadlineMinutes,
      deadline: deadlineFromMinutes(deadlineMinutes),
    };
  }

  private formatFxError(
    error: unknown,
    tokenIn: string,
    tokenOut: string,
  ): never {
    if (error instanceof RouteNotFoundError) {
      throw new Error(`No Mento FX route for ${tokenIn} → ${tokenOut}.`);
    }

    if (error instanceof FXMarketClosedError) {
      throw new Error(
        "Mento FX market is currently closed. FX quotes and execution are unavailable until the market reopens.",
      );
    }

    if (error instanceof Error && /FXMarketClosed/i.test(error.message)) {
      throw new Error(
        "Mento FX market is currently closed. FX quotes and execution are unavailable until the market reopens.",
      );
    }

    throw error instanceof Error ? error : new Error(String(error));
  }

  private async buildFxSwap(
    from: `0x${string}`,
    tokenIn: string,
    tokenOut: string,
    amount: string,
    params?: MentoFxParams,
  ) {
    const { public: client } = this.clientFactory.getClients();
    const { resolvedIn, resolvedOut, mentoIn, mentoOut } =
      this.resolveMentoPair(tokenIn, tokenOut);
    const recipient = params?.recipient ?? from;
    const amountInWei = this.tokenService.parseAmount(amount, resolvedIn.decimals);
    const { slippageTolerance, deadlineMinutes, deadline } =
      this.fxOptions(params);

    await this.tokenService.assertSpendableBalance(from, resolvedIn, amount, {
      spendToken: resolvedIn.address === "native" ? mentoIn : resolvedIn.address,
    });

    const mento = await this.getMentoClient(client);
    const { approval, swap } = await mento.swap.buildSwapTransaction(
      mentoIn,
      mentoOut,
      amountInWei,
      recipient,
      from,
      { slippageTolerance, deadline },
    );

    return {
      client,
      from,
      recipient,
      resolvedIn,
      resolvedOut,
      amount,
      approval,
      swap,
      slippageTolerance,
      deadlineMinutes,
      deadline,
    };
  }

  private async estimateCallGas(
    client: CeloClients["public"],
    from: `0x${string}`,
    params: CallParams,
  ) {
    const approve = parseErc20Approve(params);
    if (approve) {
      const gas = await client.estimateContractGas({
        account: from,
        address: approve.token,
        abi: erc20Abi,
        functionName: "approve",
        args: [approve.spender, approve.amount],
      });
      return gas.toString();
    }

    const gas = await client.estimateGas({
      account: from,
      to: params.to as `0x${string}`,
      data: params.data as Hex,
      value: BigInt(params.value),
    });
    return gas.toString();
  }

  private async estimateSwapGasWithAllowance(
    client: CeloClients["public"],
    from: `0x${string}`,
    params: CallParams,
    approve: Erc20ApproveCall,
  ) {
    const request = {
      account: from,
      to: params.to as `0x${string}`,
      data: params.data as Hex,
      value: BigInt(params.value),
    };

    for (const mappingSlot of ALLOWANCE_MAPPING_SLOTS) {
      try {
        const gas = await client.estimateGas({
          ...request,
          stateOverride: erc20AllowanceStateOverride(
            approve.token,
            from,
            approve.spender,
            approve.amount,
            mappingSlot,
          ),
        });
        return gas.toString();
      } catch (error) {
        if (!isLikelyTransferFailed(error)) {
          throw error;
        }
      }
    }

    throw new Error(
      "Could not estimate Mento FX swap gas: failed to simulate ERC-20 allowance for this token.",
    );
  }

  private baseQuoteFields(
    resolvedIn: ResolvedToken,
    resolvedOut: ResolvedToken,
    amount: string,
    expectedOutWei: bigint,
    routeHops: number,
  ) {
    return {
      protocol: "mento_fx" as const,
      network: "mainnet" as const,
      tokenIn: resolvedIn.symbol,
      tokenOut: resolvedOut.symbol,
      amountIn: amount,
      expectedOut: formatUnits(expectedOutWei, resolvedOut.decimals),
      routeHops,
    };
  }

  /**
   * Expected Mento FX output for a token pair — no wallet required.
   * @param tokenIn - Input token symbol or address
   * @param tokenOut - Output token symbol or address
   * @param amount - Human-readable input amount
   * @param _from - Deprecated; ignored. Balance checks run on prepare/estimate only.
   */
  async getFxQuote(
    tokenIn: string,
    tokenOut: string,
    amount: string,
    _from?: `0x${string}`,
  ) {
    const { public: client } = this.clientFactory.getClients();
    const { resolvedIn, resolvedOut, mentoIn, mentoOut } =
      this.resolveMentoPair(tokenIn, tokenOut);

    const amountInWei = this.tokenService.parseAmount(amount, resolvedIn.decimals);

    try {
      const mento = await this.getMentoClient(client);
      const [expectedOutWei, route] = await Promise.all([
        mento.quotes.getAmountOut(mentoIn, mentoOut, amountInWei),
        mento.routes.findRoute(mentoIn, mentoOut),
      ]);

      return this.baseQuoteFields(
        resolvedIn,
        resolvedOut,
        amount,
        expectedOutWei,
        route.path.length,
      );
    } catch (error) {
      this.formatFxError(error, resolvedIn.symbol, resolvedOut.symbol);
    }
  }

  /**
   * Simulate gas for a Mento FX swap from `from`, including approval if needed.
   * @param from - Sender wallet address
   * @param tokenIn - Input token symbol or address
   * @param tokenOut - Output token symbol or address
   * @param amount - Human-readable input amount
   * @param params - Optional slippage, deadline, and recipient
   */
  async estimateFx(
    from: `0x${string}`,
    tokenIn: string,
    tokenOut: string,
    amount: string,
    params?: MentoFxParams,
  ) {
    try {
      const built = await this.buildFxSwap(from, tokenIn, tokenOut, amount, params);
      const {
        client,
        resolvedIn,
        resolvedOut,
        approval,
        swap,
        recipient,
        slippageTolerance,
        deadlineMinutes,
        deadline,
      } = built;

      const approvalParsed = approval ? parseErc20Approve(approval) : null;

      const approvalGas = approval
        ? await this.estimateCallGas(client, from, approval)
        : undefined;

      let fxGas: string | undefined;
      let swapGasEstimated = true;
      try {
        fxGas =
          approvalParsed !== null
            ? await this.estimateSwapGasWithAllowance(
                client,
                from,
                swap.params,
                approvalParsed,
              )
            : await this.estimateCallGas(client, from, swap.params);
      } catch (error) {
        // USDT and other proxy/non-standard ERC-20s often cannot be simulated pre-approval.
        if (approvalParsed === null) {
          throw error;
        }
        swapGasEstimated = false;
      }

      return {
        ...this.baseQuoteFields(
          resolvedIn,
          resolvedOut,
          amount,
          swap.expectedAmountOut,
          swap.route.path.length,
        ),
        from,
        recipient,
        amountOutMin: formatUnits(swap.amountOutMin, resolvedOut.decimals),
        approvalNeeded: approval !== null,
        approvalGas,
        fxGas,
        swapGasEstimated,
        slippageTolerance,
        deadline: deadline.toString(),
        deadlineMinutes,
      };
    } catch (error) {
      this.formatFxError(error, tokenIn, tokenOut);
    }
  }

  /**
   * Build unsigned Mento FX steps (approve + swap when needed).
   * @param from - Sender wallet address
   * @param tokenIn - Input token symbol or address
   * @param tokenOut - Output token symbol or address
   * @param amount - Human-readable input amount
   * @param params - Optional slippage, deadline, and recipient
   * @returns 1–2 step `SerializedPreparedFlow` for sequential wallet signing
   */
  async prepareFx(
    from: `0x${string}`,
    tokenIn: string,
    tokenOut: string,
    amount: string,
    params?: MentoFxParams,
  ): Promise<SerializedPreparedFlow> {
    try {
      const built = await this.buildFxSwap(from, tokenIn, tokenOut, amount, params);
      const { resolvedIn, resolvedOut, approval, swap, recipient } = built;
      const displayIn = formatDisplayAmount(amount, resolvedIn.decimals);
      const displayOut = formatDisplayAmount(
        formatUnits(swap.expectedAmountOut, resolvedOut.decimals),
        resolvedOut.decimals,
      );

      const steps: PreparedTx[] = [];

      if (approval) {
        steps.push(
          callParamsToPreparedTx(
            approval,
            `Approve ${resolvedIn.symbol} for Mento FX`,
            this.attributionTags,
          ),
        );
      }

      steps.push(
        callParamsToPreparedTx(
          swap.params,
          `Swap ${displayIn} ${resolvedIn.symbol} → ~${displayOut} ${resolvedOut.symbol}`,
          this.attributionTags,
        ),
      );

      const flow: PreparedFlow = {
        network: "mainnet",
        from,
        summary: `Mento FX: ${displayIn} ${resolvedIn.symbol} → ${displayOut} ${resolvedOut.symbol}${recipient !== from ? ` (recipient ${recipient})` : ""}`,
        steps,
      };

      return serializePreparedFlow(flow);
    } catch (error) {
      this.formatFxError(error, tokenIn, tokenOut);
    }
  }
}
