/**
 * Mento FX: getFxQuote is read-only; prepareFx builds approve + swap steps when needed.
 * Uses @mento-protocol/mento-sdk for routing and simulates allowance via state overrides.
 */
import {
  concat,
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
import { CELINA_DATA_SUFFIX } from "../config/celina-tag.js";
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

export interface MentoFxParams {
  slippageTolerance?: number;
  deadlineMinutes?: number;
  recipient?: `0x${string}`;
}

const DEFAULT_SLIPPAGE = 0.5;
const DEFAULT_DEADLINE_MINUTES = 5;

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

function taggedCalldata(data: Hex): Hex {
  return concat([data, CELINA_DATA_SUFFIX]);
}

function callParamsToPreparedTx(
  params: CallParams,
  description: string,
): PreparedTx {
  const approve = parseErc20Approve(params);
  if (approve) {
    return {
      kind: "erc20",
      to: approve.token,
      data: taggedCalldata(params.data as Hex),
      value: "0",
      description,
    };
  }

  return {
    kind: "contract",
    to: params.to as `0x${string}`,
    data: taggedCalldata(params.data as Hex),
    value: BigInt(params.value).toString(),
    description,
  };
}

export class MentoFxService {
  private readonly tokenService: TokenService;

  constructor(private readonly clientFactory: CeloClientFactory) {
    this.tokenService = new TokenService(clientFactory);
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

  /** Expected Mento FX output for a token pair — no wallet required. */
  async getFxQuote(tokenIn: string, tokenOut: string, amount: string) {
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

  /** Simulate gas for a Mento FX swap from `from`, including approval if needed. */
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

      const fxGas =
        approvalParsed !== null
          ? await this.estimateSwapGasWithAllowance(
              client,
              from,
              swap.params,
              approvalParsed,
            )
          : await this.estimateCallGas(client, from, swap.params);

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
   * Returns `SerializedPreparedFlow` for sequential wallet signing.
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

      const steps: PreparedTx[] = [];

      if (approval) {
        steps.push(
          callParamsToPreparedTx(
            approval,
            `Approve ${resolvedIn.symbol} for Mento FX`,
          ),
        );
      }

      steps.push(
        callParamsToPreparedTx(
          swap.params,
          `Swap ${amount} ${resolvedIn.symbol} → ~${formatUnits(swap.expectedAmountOut, resolvedOut.decimals)} ${resolvedOut.symbol}`,
        ),
      );

      const flow: PreparedFlow = {
        network: "mainnet",
        from,
        summary: `Mento FX: ${amount} ${resolvedIn.symbol} → ${resolvedOut.symbol}${recipient !== from ? ` (recipient ${recipient})` : ""}`,
        steps,
      };

      return serializePreparedFlow(flow);
    } catch (error) {
      this.formatFxError(error, tokenIn, tokenOut);
    }
  }
}
