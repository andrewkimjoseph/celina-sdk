/**
 * Browser-safe GoodDollar reserve quotes and unsigned G$ ↔ USDm swap steps.
 *
 * This module does not import citizen-sdk, AgentKarma, or `createCelinaClient`.
 * Pass the host app's viem `PublicClient` (wagmi's `usePublicClient()` is fine).
 */
import {
  encodeFunctionData,
  erc20Abi,
  formatUnits,
  maxUint256,
  type Hex,
  type PublicClient,
} from "viem";
import { goodDollarBrokerAbi } from "../abis/gooddollar-broker.js";
import { appendCelinaCalldataTag } from "../config/celina-tag.js";
import {
  GOODDOLLAR_CUSD_EXCHANGE_ID,
  GOODDOLLAR_MENTO_BROKER,
  GOODDOLLAR_MENTO_EXCHANGE_PROVIDER,
  GOODDOLLAR_RESERVE_COLLATERAL,
  GOODDOLLAR_TOKEN_ADDRESS,
  isGoodDollarUsdReservePair,
} from "../config/gooddollar.js";
import { CHAIN } from "../config/chains.js";
import type { CeloClientFactory } from "../clients/celo-client.js";
import {
  type PreparedFlow,
  type PreparedTx,
  serializePreparedFlow,
  type SerializedPreparedFlow,
} from "../types/prepared.js";
import {
  ALLOWANCE_MAPPING_SLOTS,
  erc20AllowanceStateOverride,
} from "../utils/erc20-allowance-storage.js";
import { TokenService, type ResolvedToken } from "../services/token.service.js";

export {
  GOODDOLLAR_CUSD_EXCHANGE_ID,
  GOODDOLLAR_MENTO_BROKER,
  GOODDOLLAR_MENTO_EXCHANGE_PROVIDER,
  GOODDOLLAR_RESERVE_COLLATERAL,
  GOODDOLLAR_TOKEN_ADDRESS,
  isGoodDollarUsdReservePair,
};

export type GoodDollarReserveAmountSide = "in" | "out";

/** Optional parameters for GoodDollar reserve swap prepares. */
export interface GoodDollarReserveSwapParams {
  /** Max slippage tolerance in percent (default `0.5`). */
  slippageTolerance?: number;
  /** Address receiving output tokens (default: `from`). */
  recipient?: `0x${string}`;
  /**
   * `in` (default): `amount` is token_in spend. `out`: `amount` is desired token_out;
   * the client resolves required token_in via MentoBroker `getAmountIn`.
   */
  amountSide?: GoodDollarReserveAmountSide;
}

export interface GoodDollarReserveQuoteOptions {
  /** @deprecated Ignored; balance checks run on prepare/estimate only. */
  from?: `0x${string}`;
  amountSide?: GoodDollarReserveAmountSide;
}

export interface GoodDollarReserveClientOptions {
  /** Extra ERC-8021 codes appended after `celina` on approve and swap calldata. */
  attributionTags?: string[];
}

const DEFAULT_RESERVE_SLIPPAGE = 0.5;

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

function applySlippage(amountOut: bigint, slippagePercent: number): bigint {
  const bps = BigInt(Math.round(slippagePercent * 100));
  return (amountOut * (10000n - bps)) / 10000n;
}

function tokenAddress(token: ResolvedToken): `0x${string}` {
  if (token.address === "native") {
    throw new Error(`${token.symbol} is native CELO; GoodDollar reserve swaps require ERC-20 tokens.`);
  }
  return token.address;
}

function tokensFor(publicClient: PublicClient): TokenService {
  return new TokenService({
    getClients: () => ({ public: publicClient }),
  } as CeloClientFactory);
}

function reserveOptions(params?: GoodDollarReserveSwapParams) {
  return {
    slippageTolerance: params?.slippageTolerance ?? DEFAULT_RESERVE_SLIPPAGE,
  };
}

function resolveReservePair(
  tokens: TokenService,
  tokenIn: string,
  tokenOut: string,
) {
  if (!isGoodDollarUsdReservePair(tokenIn, tokenOut)) {
    throw new Error(
      `No GoodDollar reserve route for ${tokenIn} → ${tokenOut}. Supported: GoodDollar ↔ USDm.`,
    );
  }

  const resolvedIn = tokens.resolveToken(tokenIn);
  const resolvedOut = tokens.resolveToken(tokenOut);
  const tokenInAddr = tokenAddress(resolvedIn);
  const tokenOutAddr = tokenAddress(resolvedOut);

  const gdAddr = GOODDOLLAR_TOKEN_ADDRESS.toLowerCase();
  const collateralAddr = GOODDOLLAR_RESERVE_COLLATERAL.toLowerCase();
  const inLower = tokenInAddr.toLowerCase();
  const outLower = tokenOutAddr.toLowerCase();

  if (
    !(
      (inLower === gdAddr && outLower === collateralAddr) ||
      (inLower === collateralAddr && outLower === gdAddr)
    )
  ) {
    throw new Error(
      `No GoodDollar reserve route for ${resolvedIn.symbol} → ${resolvedOut.symbol}.`,
    );
  }

  return { resolvedIn, resolvedOut, tokenInAddr, tokenOutAddr };
}

function baseReserveQuoteFields(
  resolvedIn: ResolvedToken,
  resolvedOut: ResolvedToken,
  amountIn: string,
  expectedOutWei: bigint,
  amountSide: GoodDollarReserveAmountSide,
) {
  return {
    protocol: "gooddollar_reserve" as const,
    network: "mainnet" as const,
    tokenIn: resolvedIn.symbol,
    tokenOut: resolvedOut.symbol,
    amountIn,
    expectedOut: formatUnits(expectedOutWei, resolvedOut.decimals),
    amountSide,
    routeHops: 1,
    broker: GOODDOLLAR_MENTO_BROKER,
    exchangeProvider: GOODDOLLAR_MENTO_EXCHANGE_PROVIDER,
    exchangeId: GOODDOLLAR_CUSD_EXCHANGE_ID,
  };
}

async function resolveReserveAmount(
  client: PublicClient,
  tokens: TokenService,
  resolvedIn: ResolvedToken,
  resolvedOut: ResolvedToken,
  tokenInAddr: `0x${string}`,
  tokenOutAddr: `0x${string}`,
  amount: string,
  amountSide: GoodDollarReserveAmountSide = "in",
) {
  if (amountSide === "in") {
    const amountInWei = tokens.parseAmount(amount, resolvedIn.decimals);
    const expectedOutWei = await client.readContract({
      address: GOODDOLLAR_MENTO_BROKER,
      abi: goodDollarBrokerAbi,
      functionName: "getAmountOut",
      args: [
        GOODDOLLAR_MENTO_EXCHANGE_PROVIDER,
        GOODDOLLAR_CUSD_EXCHANGE_ID,
        tokenInAddr,
        tokenOutAddr,
        amountInWei,
      ],
    });

    return {
      amountIn: amount,
      amountInWei,
      expectedOutWei,
      amountSide: "in" as const,
    };
  }

  const expectedOutWei = tokens.parseAmount(amount, resolvedOut.decimals);
  const amountInWei = await client.readContract({
    address: GOODDOLLAR_MENTO_BROKER,
    abi: goodDollarBrokerAbi,
    functionName: "getAmountIn",
    args: [
      GOODDOLLAR_MENTO_EXCHANGE_PROVIDER,
      GOODDOLLAR_CUSD_EXCHANGE_ID,
      tokenInAddr,
      tokenOutAddr,
      expectedOutWei,
    ],
  });

  return {
    amountIn: trimDisplayDecimals(formatUnits(amountInWei, resolvedIn.decimals)),
    amountInWei,
    expectedOutWei,
    amountSide: "out" as const,
  };
}

function buildReserveApprovalData(attributionTags?: string[]): Hex {
  return appendCelinaCalldataTag(
    encodeFunctionData({
      abi: erc20Abi,
      functionName: "approve",
      args: [GOODDOLLAR_MENTO_BROKER, maxUint256],
    }),
    attributionTags,
  );
}

async function estimateReserveSwapGas(
  client: PublicClient,
  from: `0x${string}`,
  swapData: Hex,
  tokenInAddr: `0x${string}`,
  approvalNeeded: boolean,
): Promise<string> {
  const swapEstimateRequest = {
    account: from,
    to: GOODDOLLAR_MENTO_BROKER,
    data: swapData,
    value: 0n,
  };

  if (!approvalNeeded) {
    const gas = await client.estimateGas(swapEstimateRequest);
    return gas.toString();
  }

  for (const mappingSlot of ALLOWANCE_MAPPING_SLOTS) {
    try {
      const gas = await client.estimateGas({
        ...swapEstimateRequest,
        stateOverride: erc20AllowanceStateOverride(
          tokenInAddr,
          from,
          GOODDOLLAR_MENTO_BROKER,
          maxUint256,
          mappingSlot,
        ),
      });
      return gas.toString();
    } catch (error) {
      const isLast = mappingSlot === ALLOWANCE_MAPPING_SLOTS.at(-1);
      if (isLast) {
        throw error;
      }
    }
  }

  throw new Error(
    "Could not estimate GoodDollar reserve swap gas: failed to simulate ERC-20 allowance for this token.",
  );
}

async function buildReserveSwap(
  client: PublicClient,
  tokens: TokenService,
  attributionTags: string[] | undefined,
  from: `0x${string}`,
  tokenIn: string,
  tokenOut: string,
  amount: string,
  params?: GoodDollarReserveSwapParams,
) {
  const { resolvedIn, resolvedOut, tokenInAddr, tokenOutAddr } =
    resolveReservePair(tokens, tokenIn, tokenOut);
  const recipient = params?.recipient ?? from;
  const amountSide = params?.amountSide ?? "in";
  const { slippageTolerance } = reserveOptions(params);
  const resolved = await resolveReserveAmount(
    client,
    tokens,
    resolvedIn,
    resolvedOut,
    tokenInAddr,
    tokenOutAddr,
    amount,
    amountSide,
  );
  const { amountIn, amountInWei, expectedOutWei } = resolved;

  await tokens.assertSpendableBalance(from, resolvedIn, amountIn, {
    spendToken: tokenInAddr,
  });

  const amountOutMin = applySlippage(expectedOutWei, slippageTolerance);

  const swapData = appendCelinaCalldataTag(
    encodeFunctionData({
      abi: goodDollarBrokerAbi,
      functionName: "swapIn",
      args: [
        GOODDOLLAR_MENTO_EXCHANGE_PROVIDER,
        GOODDOLLAR_CUSD_EXCHANGE_ID,
        tokenInAddr,
        tokenOutAddr,
        amountInWei,
        amountOutMin,
      ],
    }),
    attributionTags,
  );

  return {
    client,
    from,
    recipient,
    resolvedIn,
    resolvedOut,
    tokenInAddr,
    tokenOutAddr,
    amountIn,
    amountInWei,
    expectedOutWei,
    amountOutMin,
    swapData,
    slippageTolerance,
    amountSide: resolved.amountSide,
  };
}

/**
 * Quote and prepare GoodDollar reserve swaps (G$ ↔ USDm) against a caller-supplied public client.
 */
export function createGoodDollarReserveClient(
  publicClient: PublicClient,
  options?: GoodDollarReserveClientOptions,
) {
  const tokens = tokensFor(publicClient);
  const attributionTags = options?.attributionTags;

  return {
    /**
     * Expected GoodDollar reserve output for G$ ↔ USDm — no wallet required.
     * Balance checks run on prepare/estimate only.
     */
    async getReserveQuote(
      tokenIn: string,
      tokenOut: string,
      amount: string,
      quoteOptions?: GoodDollarReserveQuoteOptions,
    ) {
      const { resolvedIn, resolvedOut, tokenInAddr, tokenOutAddr } =
        resolveReservePair(tokens, tokenIn, tokenOut);
      const amountSide = quoteOptions?.amountSide ?? "in";
      const resolved = await resolveReserveAmount(
        publicClient,
        tokens,
        resolvedIn,
        resolvedOut,
        tokenInAddr,
        tokenOutAddr,
        amount,
        amountSide,
      );

      return baseReserveQuoteFields(
        resolvedIn,
        resolvedOut,
        resolved.amountIn,
        resolved.expectedOutWei,
        resolved.amountSide,
      );
    },

    /**
     * Simulate gas for a GoodDollar reserve swap from `from`, including approval if needed.
     */
    async estimateReserveSwap(
      from: `0x${string}`,
      tokenIn: string,
      tokenOut: string,
      amount: string,
      params?: GoodDollarReserveSwapParams,
    ) {
      const built = await buildReserveSwap(
        publicClient,
        tokens,
        attributionTags,
        from,
        tokenIn,
        tokenOut,
        amount,
        params,
      );
      const {
        resolvedIn,
        resolvedOut,
        tokenInAddr,
        amountInWei,
        expectedOutWei,
        amountOutMin,
        swapData,
        slippageTolerance,
        recipient,
      } = built;

      const allowance = await publicClient.readContract({
        address: tokenInAddr,
        abi: erc20Abi,
        functionName: "allowance",
        args: [from, GOODDOLLAR_MENTO_BROKER],
      });

      const approvalNeeded = allowance < amountInWei;
      const approvalGas = approvalNeeded
        ? (
            await publicClient.estimateGas({
              account: from,
              to: tokenInAddr,
              data: buildReserveApprovalData(attributionTags),
            })
          ).toString()
        : undefined;

      const swapGas = await estimateReserveSwapGas(
        publicClient,
        from,
        swapData,
        tokenInAddr,
        approvalNeeded,
      );

      const approvalGasBig = approvalGas ? BigInt(approvalGas) : 0n;
      const totalGas = (approvalGasBig + BigInt(swapGas)).toString();

      return {
        ...baseReserveQuoteFields(
          resolvedIn,
          resolvedOut,
          built.amountIn,
          expectedOutWei,
          built.amountSide,
        ),
        from,
        recipient,
        amountOutMin: formatUnits(amountOutMin, resolvedOut.decimals),
        approvalNeeded,
        approvalGas,
        swapGas,
        totalGas,
        slippageTolerance,
      };
    },

    /**
     * Build unsigned GoodDollar reserve swap steps (approve + swapIn when needed).
     */
    async prepareReserveSwap(
      from: `0x${string}`,
      tokenIn: string,
      tokenOut: string,
      amount: string,
      params?: GoodDollarReserveSwapParams,
    ): Promise<SerializedPreparedFlow> {
      const built = await buildReserveSwap(
        publicClient,
        tokens,
        attributionTags,
        from,
        tokenIn,
        tokenOut,
        amount,
        params,
      );
      const {
        resolvedIn,
        resolvedOut,
        tokenInAddr,
        amountInWei,
        expectedOutWei,
        swapData,
        recipient,
      } = built;

      const displayIn = trimDisplayDecimals(built.amountIn);
      const displayOut = trimDisplayDecimals(
        formatUnits(expectedOutWei, resolvedOut.decimals),
      );

      const steps: PreparedTx[] = [];

      const allowance = await publicClient.readContract({
        address: tokenInAddr,
        abi: erc20Abi,
        functionName: "allowance",
        args: [from, GOODDOLLAR_MENTO_BROKER],
      });

      if (allowance < amountInWei) {
        steps.push({
          kind: "erc20",
          to: tokenInAddr,
          data: buildReserveApprovalData(attributionTags),
          value: "0",
          description: `Approve ${resolvedIn.symbol} for GoodDollar reserve`,
        });
      }

      steps.push({
        kind: "contract",
        to: GOODDOLLAR_MENTO_BROKER,
        data: swapData,
        value: "0",
        description: `Swap ${displayIn} ${resolvedIn.symbol} → ~${displayOut} ${resolvedOut.symbol} via GoodDollar reserve`,
      });

      await estimateReserveSwapGas(
        publicClient,
        from,
        swapData,
        tokenInAddr,
        allowance < amountInWei,
      );

      const flow: PreparedFlow = {
        chainId: CHAIN.id,
        from,
        summary: `GoodDollar reserve: ${displayIn} ${resolvedIn.symbol} → ${displayOut} ${resolvedOut.symbol}${recipient !== from ? ` (recipient ${recipient})` : ""}`,
        steps,
      };

      return serializePreparedFlow(flow);
    },
  };
}

export type GoodDollarReserveClient = ReturnType<typeof createGoodDollarReserveClient>;
