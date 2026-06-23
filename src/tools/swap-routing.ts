import type { CelinaClient } from "../index.js";
import { isGoodDollarUsdReservePair } from "../config/gooddollar.js";

export type SwapProtocol = "mento_fx" | "uniswap_v4" | "gooddollar_reserve";

export interface SwapQuoteResult {
  protocol: SwapProtocol;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  expectedOut: string;
  routeHops: number;
  network: "mainnet";
  alternatives?: Array<{
    protocol: SwapProtocol;
    expectedOut: string;
    error?: string;
  }>;
}

export interface SwapPrepareParams {
  recipient?: `0x${string}`;
  slippageTolerance?: number;
  deadlineMinutes?: number;
  amountSide?: "in" | "out";
}

function parseExpectedOut(value: string): number {
  const n = Number(value.replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function isMentoMarketClosedError(message: string): boolean {
  return /mento fx market is currently closed/i.test(message);
}

function isMentoRouteError(message: string): boolean {
  return /no mento fx route/i.test(message);
}

function isUniswapRouteError(message: string): boolean {
  return /no uniswap v4 route|insufficient liquidity in uniswap v4/i.test(message);
}

function isGoodDollarReserveRouteError(message: string): boolean {
  return /no gooddollar reserve route/i.test(message);
}

function isInsufficientBalanceError(message: string): boolean {
  return /insufficient .+ balance/i.test(message);
}

function rejectionMessage(reason: unknown): string {
  return reason instanceof Error ? reason.message : String(reason);
}

function filterAlternatives(
  best: SwapQuoteResult,
  others: NonNullable<SwapQuoteResult["alternatives"]>,
): NonNullable<SwapQuoteResult["alternatives"]> {
  if (best.protocol !== "gooddollar_reserve") {
    return others;
  }

  const bestOut = parseExpectedOut(best.expectedOut);
  if (bestOut <= 0) {
    return others;
  }

  return others.filter((alt) => {
    if (alt.protocol !== "uniswap_v4" || alt.error) {
      return true;
    }
    const altOut = parseExpectedOut(alt.expectedOut);
    return altOut >= bestOut * 0.95;
  });
}

async function tryMentoQuote(
  celina: CelinaClient,
  tokenIn: string,
  tokenOut: string,
  amount: string,
  from?: `0x${string}`,
) {
  const quote = await celina.mentoFx.getFxQuote(tokenIn, tokenOut, amount, from);
  return {
    protocol: "mento_fx" as const,
    tokenIn: quote.tokenIn,
    tokenOut: quote.tokenOut,
    amountIn: quote.amountIn,
    expectedOut: quote.expectedOut,
    routeHops: quote.routeHops,
    network: quote.network,
  };
}

async function tryUniswapQuote(
  celina: CelinaClient,
  tokenIn: string,
  tokenOut: string,
  amount: string,
  from?: `0x${string}`,
) {
  const quote = await celina.uniswap.getSwapQuote(tokenIn, tokenOut, amount, from);
  return {
    protocol: "uniswap_v4" as const,
    tokenIn: quote.tokenIn,
    tokenOut: quote.tokenOut,
    amountIn: quote.amountIn,
    expectedOut: quote.expectedOut,
    routeHops: quote.routeHops,
    network: quote.network,
  };
}

async function tryGoodDollarReserveQuote(
  celina: CelinaClient,
  tokenIn: string,
  tokenOut: string,
  amount: string,
  from?: `0x${string}`,
) {
  const quote = await celina.gooddollar.getReserveQuote(
    tokenIn,
    tokenOut,
    amount,
    { from },
  );
  return {
    protocol: "gooddollar_reserve" as const,
    tokenIn: quote.tokenIn,
    tokenOut: quote.tokenOut,
    amountIn: quote.amountIn,
    expectedOut: quote.expectedOut,
    routeHops: quote.routeHops,
    network: quote.network,
  };
}

/** Quote a swap across Mento FX, GoodDollar reserve, and Uniswap v4; returns the best route. */
export async function getSwapQuoteWithFallback(
  celina: CelinaClient,
  tokenIn: string,
  tokenOut: string,
  amount: string,
  from?: `0x${string}`,
): Promise<SwapQuoteResult> {
  const reserveEligible = isGoodDollarUsdReservePair(tokenIn, tokenOut);

  const quoteTasks: Promise<SwapQuoteResult>[] = [
    tryMentoQuote(celina, tokenIn, tokenOut, amount, from),
    tryUniswapQuote(celina, tokenIn, tokenOut, amount, from),
  ];

  if (reserveEligible) {
    quoteTasks.push(
      tryGoodDollarReserveQuote(celina, tokenIn, tokenOut, amount, from),
    );
  }

  const results = await Promise.allSettled(quoteTasks);

  const mentoResult = results[0]!;
  const uniswapResult = results[1]!;
  const reserveResult = reserveEligible ? results[2] : undefined;

  const successes: SwapQuoteResult[] = [];
  const alternatives: SwapQuoteResult["alternatives"] = [];

  if (mentoResult.status === "fulfilled") {
    successes.push(mentoResult.value);
  } else {
    const message = rejectionMessage(mentoResult.reason);
    if (!isMentoRouteError(message)) {
      alternatives.push({ protocol: "mento_fx", expectedOut: "0", error: message });
    }
  }

  if (uniswapResult.status === "fulfilled") {
    successes.push(uniswapResult.value);
  } else {
    const message = rejectionMessage(uniswapResult.reason);
    if (!isUniswapRouteError(message)) {
      alternatives.push({ protocol: "uniswap_v4", expectedOut: "0", error: message });
    }
  }

  if (reserveResult) {
    if (reserveResult.status === "fulfilled") {
      successes.push(reserveResult.value);
    } else {
      const message = rejectionMessage(reserveResult.reason);
      if (!isGoodDollarReserveRouteError(message)) {
        alternatives.push({
          protocol: "gooddollar_reserve",
          expectedOut: "0",
          error: message,
        });
      }
    }
  }

  if (successes.length === 0) {
    const failures = results
      .filter((result) => result.status === "rejected")
      .map((result) => rejectionMessage(result.reason));

    const balanceError = failures.find(isInsufficientBalanceError);
    if (balanceError) {
      throw new Error(balanceError);
    }

    const marketClosedError = failures.find(isMentoMarketClosedError);
    if (marketClosedError) {
      throw new Error(marketClosedError);
    }

    throw new Error(
      `No swap route for ${tokenIn} → ${tokenOut} via Mento FX, GoodDollar reserve, or Uniswap v4.`,
    );
  }

  successes.sort(
    (a, b) => parseExpectedOut(b.expectedOut) - parseExpectedOut(a.expectedOut),
  );

  const best = successes[0]!;
  const otherProtocols = filterAlternatives(
    best,
    successes.slice(1).map((q) => ({
      protocol: q.protocol,
      expectedOut: q.expectedOut,
    })),
  );

  return {
    ...best,
    alternatives: otherProtocols.length > 0 ? otherProtocols : alternatives,
  };
}

export async function prepareSwapWithFallback(
  celina: CelinaClient,
  from: `0x${string}`,
  tokenIn: string,
  tokenOut: string,
  amount: string,
  params?: SwapPrepareParams,
  protocol?: SwapProtocol,
) {
  const chosen =
    protocol ??
    (await getSwapQuoteWithFallback(celina, tokenIn, tokenOut, amount, from))
      .protocol;

  if (chosen === "mento_fx") {
    return celina.mentoFx.prepareFx(from, tokenIn, tokenOut, amount, {
      recipient: params?.recipient,
      slippageTolerance: params?.slippageTolerance,
      deadlineMinutes: params?.deadlineMinutes,
    });
  }

  if (chosen === "gooddollar_reserve") {
    return celina.gooddollar.prepareReserveSwap(from, tokenIn, tokenOut, amount, {
      recipient: params?.recipient,
      slippageTolerance: params?.slippageTolerance,
      amountSide: params?.amountSide,
    });
  }

  return celina.uniswap.prepareSwap(from, tokenIn, tokenOut, amount, {
    recipient: params?.recipient,
    slippageTolerance: params?.slippageTolerance,
    deadlineMinutes: params?.deadlineMinutes,
  });
}
