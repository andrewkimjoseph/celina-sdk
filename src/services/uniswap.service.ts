/**
 * Uniswap v4 swaps on Celo mainnet: quote, estimate, and prepare flows.
 * Uses V4Quoter for pricing and Universal Router + Permit2 for execution calldata.
 * Pool discovery prefers the v4 subgraph; falls back to on-chain hub probing when unavailable.
 */
import {
  encodeFunctionData,
  erc20Abi,
  formatUnits,
  maxUint256,
  type Hex,
} from "viem";
import { permit2Abi } from "../abis/permit2.js";
import { universalRouterAbi } from "../abis/universal-router.js";
import {
  Actions,
  CommandType,
  RoutePlanner,
  V4Planner,
} from "../clients/uniswap-sdk.js";
import type { CeloClientFactory, CeloClients } from "../clients/celo-client.js";
import { appendCelinaCalldataTag } from "../config/celina-tag.js";
import {
  UNISWAP_V4,
  uniswapInputTokenAddress,
  toUniswapRoutingCurrency,
} from "../config/uniswap.js";
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
import { CHAIN } from "../config/chains.js";
import { findBestUniswapRoute, applySlippage } from "./uniswap-path-router.js";
import { TokenService, type ResolvedToken } from "./token.service.js";

/** Optional parameters for Uniswap v4 swap estimates and prepares. */
export interface UniswapSwapParams {
  /** Max slippage tolerance in percent (default `0.5`). */
  slippageTolerance?: number;
  /** Swap deadline in minutes from now (default `5`). */
  deadlineMinutes?: number;
  /** Address receiving output tokens (default: `from`). */
  recipient?: `0x${string}`;
}

const DEFAULT_SLIPPAGE = 0.5;
const DEFAULT_DEADLINE_MINUTES = 5;
const PERMIT2_MAX_UINT160 = (1n << 160n) - 1n;

function trimDisplayDecimals(value: string): string {
  const num = Number(value);
  if (!Number.isFinite(num)) return value;
  if (Math.abs(num) >= 1000) {
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }
  if (Math.abs(num) >= 1) {
    return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
  }
  return num.toLocaleString(undefined, { maximumSignificantDigits: 6 });
}

function swapOptions(params?: UniswapSwapParams) {
  const slippageTolerance = params?.slippageTolerance ?? DEFAULT_SLIPPAGE;
  const deadlineMinutes = params?.deadlineMinutes ?? DEFAULT_DEADLINE_MINUTES;
  const deadline = BigInt(Math.floor(Date.now() / 1000) + deadlineMinutes * 60);
  return { slippageTolerance, deadlineMinutes, deadline };
}

function formatUniswapError(
  error: unknown,
  tokenIn: string,
  tokenOut: string,
): never {
  const message = error instanceof Error ? error.message : String(error);
  if (/insufficient liquidity|amountOut.*0/i.test(message)) {
    throw new Error(
      `Insufficient liquidity in Uniswap v4 pools for ${tokenIn} → ${tokenOut}.`,
    );
  }
  throw error instanceof Error ? error : new Error(message);
}

/** Uniswap v4 quotes, gas estimates, and `prepareSwap` flows on Celo mainnet. */
export class UniswapService {
  private readonly tokenService: TokenService;
  private readonly attributionTags?: string[];

  constructor(private readonly clientFactory: CeloClientFactory) {
    this.tokenService = new TokenService(clientFactory);
    this.attributionTags = clientFactory.getConfig().attributionTags;
  }

  private resolvePair(tokenIn: string, tokenOut: string) {
    const resolvedIn = this.tokenService.resolveToken(tokenIn);
    const resolvedOut = this.tokenService.resolveToken(tokenOut);
    const routingIn = toUniswapRoutingCurrency(resolvedIn.address);
    const routingOut = toUniswapRoutingCurrency(resolvedOut.address);
    const inputToken = uniswapInputTokenAddress(resolvedIn.address);

    return { resolvedIn, resolvedOut, routingIn, routingOut, inputToken };
  }

  private baseQuoteFields(
    resolvedIn: ResolvedToken,
    resolvedOut: ResolvedToken,
    amount: string,
    expectedOutWei: bigint,
    routeHops: number,
    indexSource?: string,
  ) {
    return {
      protocol: "uniswap_v4" as const,
      network: "mainnet" as const,
      tokenIn: resolvedIn.symbol,
      tokenOut: resolvedOut.symbol,
      amountIn: amount,
      expectedOut: formatUnits(expectedOutWei, resolvedOut.decimals),
      routeHops,
      indexSource,
    };
  }

  private async buildSwapRoute(
    tokenIn: string,
    tokenOut: string,
    amount: string,
    params?: UniswapSwapParams,
    from?: `0x${string}`,
  ) {
    const { public: client } = this.clientFactory.getClients();
    const { resolvedIn, resolvedOut, routingIn, routingOut, inputToken } =
      this.resolvePair(tokenIn, tokenOut);

    if (routingIn.toLowerCase() === routingOut.toLowerCase()) {
      throw new Error("tokenIn and tokenOut must be different.");
    }

    const amountInWei = this.tokenService.parseAmount(amount, resolvedIn.decimals);

    if (from) {
      const celoHint =
        resolvedIn.address === "native"
          ? " Uniswap v4 swaps require wrapped CELO (WCELO), not native CELO."
          : "";
      await this.tokenService.assertSpendableBalance(from, resolvedIn, amount, {
        spendToken: inputToken === "native" ? "native" : inputToken,
        hint: celoHint,
      });
    }

    const quote = await findBestUniswapRoute(
      client,
      routingIn,
      routingOut,
      amountInWei,
    );

    if (!quote) {
      throw new Error(
        `No Uniswap v4 route for ${resolvedIn.symbol} → ${resolvedOut.symbol}.`,
      );
    }

    const { slippageTolerance, deadlineMinutes, deadline } = swapOptions(params);
    const amountOutMin = applySlippage(quote.amountOut, slippageTolerance);

    return {
      client,
      resolvedIn,
      resolvedOut,
      routingIn,
      routingOut,
      inputToken,
      amountInWei,
      route: quote.route,
      expectedOutWei: quote.amountOut,
      amountOutMin,
      slippageTolerance,
      deadlineMinutes,
      deadline,
      indexSource: quote.indexSource,
    };
  }

  private buildUniversalRouterCalldata(
    built: Awaited<ReturnType<typeof this.buildSwapRoute>>,
    _recipient: `0x${string}`,
  ): { to: `0x${string}`; data: Hex; value: bigint } {
    const {
      route,
      amountInWei,
      amountOutMin,
      deadline,
      routingIn,
      routingOut,
    } = built;

    const v4Planner = new V4Planner();
    const routePlanner = new RoutePlanner();
    const amountIn = amountInWei.toString();
    const amountOutMinimum = amountOutMin.toString();

    if (route.hops === 1) {
      const poolKey = route.pools[0]!;
      const zeroForOne =
        routingIn.toLowerCase() === poolKey.currency0.toLowerCase();

      v4Planner.addAction(Actions.SWAP_EXACT_IN_SINGLE, [
        {
          poolKey,
          zeroForOne,
          amountIn,
          amountOutMinimum,
          hookData: "0x",
        },
      ]);
      v4Planner.addAction(Actions.SETTLE_ALL, [routingIn, amountIn]);
      v4Planner.addAction(Actions.TAKE_ALL, [routingOut, amountOutMinimum]);
    } else {
      v4Planner.addAction(Actions.SWAP_EXACT_IN, [
        {
          currencyIn: routingIn,
          path: route.pathKeys,
          amountIn,
          amountOutMinimum,
        },
      ]);
      v4Planner.addAction(Actions.SETTLE_ALL, [routingIn, amountIn]);
      v4Planner.addAction(Actions.TAKE_ALL, [routingOut, amountOutMinimum]);
    }

    routePlanner.addCommand(CommandType.V4_SWAP, [
      v4Planner.actions,
      v4Planner.params,
    ]);

    const data = encodeFunctionData({
      abi: universalRouterAbi,
      functionName: "execute",
      args: [
        routePlanner.commands as Hex,
        [v4Planner.finalize() as Hex],
        deadline,
      ],
    });

    return {
      to: UNISWAP_V4.universalRouter,
      data,
      value: 0n,
    };
  }

  private async getApprovalSteps(
    client: CeloClients["public"],
    from: `0x${string}`,
    inputToken: `0x${string}` | "native",
    tokenSymbol: string,
    amountInWei: bigint,
    deadline: bigint,
  ): Promise<PreparedTx[]> {
    if (inputToken === "native") {
      return [];
    }

    const steps: PreparedTx[] = [];
    const token = inputToken;

    const erc20Allowance = await client.readContract({
      address: token,
      abi: erc20Abi,
      functionName: "allowance",
      args: [from, UNISWAP_V4.permit2],
    });

    if (erc20Allowance < amountInWei) {
      steps.push({
        kind: "erc20",
        to: token,
        data: appendCelinaCalldataTag(
          encodeFunctionData({
            abi: erc20Abi,
            functionName: "approve",
            args: [UNISWAP_V4.permit2, maxUint256],
          }),
          this.attributionTags,
        ),
        value: "0",
        description: `Approve ${tokenSymbol} for Uniswap Permit2`,
      });
    }

    const permit2Allowance = await client.readContract({
      address: UNISWAP_V4.permit2,
      abi: permit2Abi,
      functionName: "allowance",
      args: [from, token, UNISWAP_V4.universalRouter],
    });

    const now = BigInt(Math.floor(Date.now() / 1000));
    if (
      permit2Allowance[0] < amountInWei ||
      BigInt(permit2Allowance[1]) <= now
    ) {
      steps.push({
        kind: "contract",
        to: UNISWAP_V4.permit2,
        data: appendCelinaCalldataTag(
          encodeFunctionData({
            abi: permit2Abi,
            functionName: "approve",
            args: [
              token,
              UNISWAP_V4.universalRouter,
              PERMIT2_MAX_UINT160,
              Number(deadline),
            ],
          }),
          this.attributionTags,
        ),
        value: "0",
        description: `Permit2 approve ${tokenSymbol} for Uniswap Universal Router`,
      });
    }

    return steps;
  }

  private async estimateCallGas(
    client: CeloClients["public"],
    from: `0x${string}`,
    to: `0x${string}`,
    data: Hex,
    value = 0n,
  ) {
    const gas = await client.estimateGas({
      account: from,
      to,
      data,
      value,
    });
    return gas.toString();
  }

  private async estimateSwapGasWithAllowance(
    client: CeloClients["public"],
    from: `0x${string}`,
    to: `0x${string}`,
    data: Hex,
    token: `0x${string}`,
    amount: bigint,
  ) {
    const request = { account: from, to, data, value: 0n };

    for (const mappingSlot of ALLOWANCE_MAPPING_SLOTS) {
      try {
        const gas = await client.estimateGas({
          ...request,
          stateOverride: erc20AllowanceStateOverride(
            token,
            from,
            UNISWAP_V4.permit2,
            amount,
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
      "Could not estimate Uniswap swap gas: failed to simulate ERC-20 allowance for this token.",
    );
  }

  /**
   * Expected Uniswap v4 output for a token pair — no wallet required.
   * @param tokenIn - Input token symbol or address
   * @param tokenOut - Output token symbol or address
   * @param amount - Human-readable input amount
   * @param _from - Deprecated; ignored. Balance checks run on prepare/estimate only.
   */
  async getSwapQuote(
    tokenIn: string,
    tokenOut: string,
    amount: string,
    _from?: `0x${string}`,
  ) {
    try {
      const built = await this.buildSwapRoute(tokenIn, tokenOut, amount, undefined, undefined);
      return {
        ...this.baseQuoteFields(
          built.resolvedIn,
          built.resolvedOut,
          amount,
          built.expectedOutWei,
          built.route.hops,
          built.indexSource,
        ),
        route: {
          pools: built.route.pools,
        },
      };
    } catch (error) {
      formatUniswapError(error, tokenIn, tokenOut);
    }
  }

  /**
   * Simulate gas for a Uniswap v4 swap from `from`, including Permit2 approvals when needed.
   * @param from - Sender wallet address
   * @param tokenIn - Input token symbol or address
   * @param tokenOut - Output token symbol or address
   * @param amount - Human-readable input amount
   * @param params - Optional slippage, deadline, and recipient
   */
  async estimateSwap(
    from: `0x${string}`,
    tokenIn: string,
    tokenOut: string,
    amount: string,
    params?: UniswapSwapParams,
  ) {
    try {
      const built = await this.buildSwapRoute(tokenIn, tokenOut, amount, params, from);
      const recipient = params?.recipient ?? from;
      const approvalSteps = await this.getApprovalSteps(
        built.client,
        from,
        built.inputToken,
        built.resolvedIn.symbol,
        built.amountInWei,
        built.deadline,
      );
      const swapTx = this.buildUniversalRouterCalldata(built, recipient);
      const taggedSwapData = appendCelinaCalldataTag(
        swapTx.data,
        this.attributionTags,
      );

      const approvalGasEntries = await Promise.all(
        approvalSteps.map(async (step) =>
          this.estimateCallGas(
            built.client,
            from,
            step.to,
            step.data as Hex,
          ),
        ),
      );

      let swapGas: string | undefined;
      let swapGasEstimated = true;
      try {
        swapGas =
          built.inputToken !== "native" && approvalSteps.length > 0
            ? await this.estimateSwapGasWithAllowance(
                built.client,
                from,
                swapTx.to,
                taggedSwapData,
                built.inputToken,
                built.amountInWei,
              )
            : await this.estimateCallGas(
                built.client,
                from,
                swapTx.to,
                taggedSwapData,
              );
      } catch {
        swapGasEstimated = false;
      }

      return {
        ...this.baseQuoteFields(
          built.resolvedIn,
          built.resolvedOut,
          amount,
          built.expectedOutWei,
          built.route.hops,
          built.indexSource,
        ),
        from,
        recipient,
        amountOutMin: formatUnits(
          built.amountOutMin,
          built.resolvedOut.decimals,
        ),
        approvalStepsNeeded: approvalSteps.length,
        approvalGas: approvalGasEntries,
        swapGas,
        swapGasEstimated,
        slippageTolerance: built.slippageTolerance,
        deadline: built.deadline.toString(),
        deadlineMinutes: built.deadlineMinutes,
      };
    } catch (error) {
      formatUniswapError(error, tokenIn, tokenOut);
    }
  }

  /**
   * Build unsigned Uniswap v4 steps (ERC-20 approve → Permit2 approve → swap when needed).
   * @param from - Sender wallet address
   * @param tokenIn - Input token symbol or address
   * @param tokenOut - Output token symbol or address
   * @param amount - Human-readable input amount
   * @param params - Optional slippage, deadline, and recipient
   * @returns 1–3 step `SerializedPreparedFlow` for sequential wallet signing
   */
  async prepareSwap(
    from: `0x${string}`,
    tokenIn: string,
    tokenOut: string,
    amount: string,
    params?: UniswapSwapParams,
  ): Promise<SerializedPreparedFlow> {
    try {
      const built = await this.buildSwapRoute(tokenIn, tokenOut, amount, params, from);
      const recipient = params?.recipient ?? from;
      const displayIn = trimDisplayDecimals(amount);
      const displayOut = trimDisplayDecimals(
        formatUnits(built.expectedOutWei, built.resolvedOut.decimals),
      );

      const approvalSteps = await this.getApprovalSteps(
        built.client,
        from,
        built.inputToken,
        built.resolvedIn.symbol,
        built.amountInWei,
        built.deadline,
      );

      const swapTx = this.buildUniversalRouterCalldata(built, recipient);

      const steps: PreparedTx[] = [
        ...approvalSteps,
        {
          kind: "contract",
          to: swapTx.to,
          data: appendCelinaCalldataTag(swapTx.data, this.attributionTags),
          value: swapTx.value.toString(),
          description: `Swap ${displayIn} ${built.resolvedIn.symbol} → ~${displayOut} ${built.resolvedOut.symbol} via Uniswap v4`,
        },
      ];

      const flow: PreparedFlow = {
        chainId: CHAIN.id,
        from,
        summary: `Uniswap v4: ${displayIn} ${built.resolvedIn.symbol} → ${displayOut} ${built.resolvedOut.symbol}${recipient !== from ? ` (recipient ${recipient})` : ""}`,
        steps,
      };

      return serializePreparedFlow(flow);
    } catch (error) {
      formatUniswapError(error, tokenIn, tokenOut);
    }
  }
}
