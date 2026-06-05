import type { OperationSpec } from "../types.js";
import { assertHasKeys } from "../../helpers/assert.js";
import { getSwapQuoteWithFallback } from "../../../src/tools/swap-routing.js";
import { GOODDOLLAR_MENTO_BROKER } from "../../../src/config/gooddollar.js";

function fromAddress(fx: Parameters<OperationSpec["assert"]>[1]): `0x${string}` {
  return fx.signerAddress ?? fx.wallet;
}

export const mentoFxOperations: OperationSpec[] = [
  {
    id: "mentoFx.getFxQuote",
    domain: "mentoFx",
    layer: "read",
    sdk: {
      invoke: (client) => client.mentoFx.getFxQuote("USDm", "EURm", "1"),
    },
    mcp: {
      tool: "get_mento_fx_quote",
      arguments: () => ({
        tokenIn: "USDm",
        tokenOut: "EURm",
        amount: "1",
      }),
    },
    assert: (result) => {
      assertHasKeys(result, ["tokenIn", "tokenOut", "expectedOut"]);
    },
  },
  {
    id: "mentoFx.estimateFx",
    domain: "mentoFx",
    layer: "read",
    requiresEnv: ["CELO_PRIVATE_KEY"],
    sdk: {
      invoke: (client, fx) =>
        client.mentoFx.estimateFx(fromAddress(fx), "USDm", "EURm", "1"),
    },
    mcp: {
      tool: "estimate_mento_fx",
      arguments: () => ({
        tokenIn: "USDm",
        tokenOut: "EURm",
        amount: "1",
      }),
    },
    assert: (result) => {
      assertHasKeys(result, ["fxGas", "expectedOut"]);
    },
  },
  {
    id: "mentoFx.prepareFx",
    domain: "mentoFx",
    layer: "prepare",
    sdk: {
      invoke: (client, fx) =>
        client.mentoFx.prepareFx(fromAddress(fx), "USDm", "EURm", "1"),
    },
    assert: (result) => {
      assertHasKeys(result, ["from", "steps", "summary"]);
    },
  },
  {
    id: "mentoFx.executeFx",
    domain: "mentoFx",
    layer: "write",
    requiresEnv: ["CELO_PRIVATE_KEY"],
    requiresWrites: true,
    mcp: {
      tool: "execute_mento_fx",
      arguments: () => ({
        tokenIn: "USDm",
        tokenOut: "EURm",
        amount: "0.01",
      }),
    },
    assert: (result) => {
      assertHasKeys(result, ["hash"]);
    },
  },
];

export const uniswapOperations: OperationSpec[] = [
  {
    id: "uniswap.getSwapQuote",
    domain: "uniswap",
    layer: "read",
    sdk: {
      invoke: (client) => client.uniswap.getSwapQuote("CELO", "USDC", "0.001"),
    },
    mcp: {
      tool: "get_uniswap_quote",
      arguments: () => ({
        tokenIn: "CELO",
        tokenOut: "USDC",
        amount: "0.001",
      }),
    },
    assert: (result) => {
      assertHasKeys(result, ["tokenIn", "tokenOut", "expectedOut", "protocol"]);
    },
  },
  {
    id: "uniswap.estimateSwap",
    domain: "uniswap",
    layer: "read",
    requiresEnv: ["CELO_PRIVATE_KEY"],
    sdk: {
      invoke: (client, fx) =>
        client.uniswap.estimateSwap(
          fromAddress(fx),
          "CELO",
          "USDC",
          "0.001",
        ),
    },
    mcp: {
      tool: "estimate_uniswap_swap",
      arguments: () => ({
        tokenIn: "CELO",
        tokenOut: "USDC",
        amount: "0.001",
      }),
    },
    assert: (result) => {
      assertHasKeys(result, ["swapGas", "expectedOut"]);
    },
  },
  {
    id: "uniswap.prepareSwap",
    domain: "uniswap",
    layer: "prepare",
    sdk: {
      invoke: (client, fx) =>
        client.uniswap.prepareSwap(
          fromAddress(fx),
          "CELO",
          "USDC",
          "0.001",
        ),
    },
    assert: (result) => {
      assertHasKeys(result, ["from", "steps", "summary"]);
    },
  },
  {
    id: "uniswap.executeSwap",
    domain: "uniswap",
    layer: "write",
    requiresEnv: ["CELO_PRIVATE_KEY"],
    requiresWrites: true,
    mcp: {
      tool: "execute_uniswap_swap",
      arguments: () => ({
        tokenIn: "CELO",
        tokenOut: "USDC",
        amount: "0.001",
      }),
    },
    assert: (result) => {
      assertHasKeys(result, ["hash"]);
    },
  },
];

export const aaveOperations: OperationSpec[] = [
  {
    id: "aave.prepareSupply",
    domain: "aave",
    layer: "prepare",
    requiresEnv: ["CELO_PRIVATE_KEY"],
    sdk: {
      invoke: (client, fx) =>
        client.aave.prepareSupply(fromAddress(fx), "USDm", "0.01"),
    },
    assert: (result) => {
      assertHasKeys(result, ["from", "steps"]);
    },
  },
  {
    id: "aave.prepareWithdraw",
    domain: "aave",
    layer: "prepare",
    requiresEnv: ["CELO_PRIVATE_KEY"],
    sdk: {
      invoke: (client, fx) =>
        client.aave.prepareWithdraw(fromAddress(fx), "USDm", "0.01"),
    },
    assert: (result) => {
      assertHasKeys(result, ["from", "steps"]);
    },
  },
  {
    id: "aave.supply",
    domain: "aave",
    layer: "write",
    requiresEnv: ["CELO_PRIVATE_KEY"],
    requiresWrites: true,
    mcp: {
      tool: "supply_aave",
      arguments: () => ({
        token: "USDm",
        amount: "0.01",
      }),
    },
    assert: (result) => {
      assertHasKeys(result, ["hash"]);
    },
  },
  {
    id: "aave.withdraw",
    domain: "aave",
    layer: "write",
    requiresEnv: ["CELO_PRIVATE_KEY"],
    requiresWrites: true,
    mcp: {
      tool: "withdraw_aave",
      arguments: () => ({
        token: "USDm",
        amount: "0.01",
      }),
    },
    assert: (result) => {
      assertHasKeys(result, ["hash"]);
    },
  },
];

export const ensOperations: OperationSpec[] = [
  {
    id: "ens.resolveEns",
    domain: "ens",
    layer: "read",
    sdk: {
      invoke: (client, fx) => client.ens.resolveEns(fx.ensName, "celo"),
    },
    mcp: {
      tool: "resolve_ens",
      arguments: (fx) => ({
        name: fx.ensName,
        chain: "celo",
      }),
    },
    assert: (result) => {
      assertHasKeys(result, ["name", "address"]);
    },
  },
];

export const gooddollarOperations: OperationSpec[] = [
  {
    id: "gooddollar.getWhitelistingInfo",
    domain: "gooddollar",
    layer: "read",
    sdk: {
      invoke: (client, fx) => client.gooddollar.getWhitelistingInfo(fx.wallet),
    },
    mcp: {
      tool: "get_gooddollar_whitelisting_info",
      arguments: (fx) => ({ address: fx.wallet }),
    },
    assert: (result) => {
      assertHasKeys(result, ["isCurrentlyWhitelisted"]);
    },
  },
  {
    id: "gooddollar.getUbiClaimEligibility",
    domain: "gooddollar",
    layer: "read",
    sdk: {
      invoke: (client, fx) =>
        client.gooddollar.getUbiClaimEligibility(fx.wallet),
    },
    mcp: {
      tool: "get_gooddollar_ubi_entitlement",
      arguments: (fx) => ({ address: fx.wallet }),
    },
    assert: (result) => {
      assertHasKeys(result, [
        "isEligibleToClaim",
        "claimableAmount",
        "secondsUntilNextClaim",
        "nextClaimAvailableIn",
        "ubiPeriodDay",
      ]);
    },
  },
  {
    id: "gooddollar.prepareClaimUbi",
    domain: "gooddollar",
    layer: "prepare",
    requiresEnv: ["CELO_PRIVATE_KEY"],
    sdk: {
      invoke: (client, fx) =>
        client.gooddollar.prepareClaimUbi(fromAddress(fx)),
    },
    assert: (result) => {
      assertHasKeys(result, ["from", "steps"]);
    },
  },
  {
    id: "gooddollar.claimDailyUbi",
    domain: "gooddollar",
    layer: "write",
    requiresEnv: ["CELO_PRIVATE_KEY"],
    requiresWrites: true,
    mcp: {
      tool: "claim_daily_gooddollar_ubi",
      arguments: () => ({}),
    },
    assert: (result) => {
      assertHasKeys(result, ["hash"]);
    },
  },
  {
    id: "gooddollar.getReserveQuote.sell",
    domain: "gooddollar",
    layer: "read",
    sdk: {
      invoke: (client) =>
        client.gooddollar.getReserveQuote("GoodDollar", "USDm", "1000"),
    },
    mcp: {
      tool: "get_gooddollar_reserve_quote",
      arguments: () => ({
        token_in: "GoodDollar",
        token_out: "USDm",
        amount: "1000",
      }),
    },
    assert: (result) => {
      const quote = result as { protocol?: string; expectedOut?: string };
      if (quote.protocol !== "gooddollar_reserve") {
        throw new Error(`Expected gooddollar_reserve, got ${quote.protocol}`);
      }
      if (parseExpectedOut(quote.expectedOut) <= 0) {
        throw new Error("Expected positive reserve output for G$ → USDm");
      }
    },
  },
  {
    id: "gooddollar.getReserveQuote.buy",
    domain: "gooddollar",
    layer: "read",
    sdk: {
      invoke: (client) =>
        client.gooddollar.getReserveQuote("USDm", "GoodDollar", "100"),
    },
    mcp: {
      tool: "get_gooddollar_reserve_quote",
      arguments: () => ({
        token_in: "USDm",
        token_out: "GoodDollar",
        amount: "100",
      }),
    },
    assert: (result) => {
      const quote = result as { protocol?: string; expectedOut?: string };
      if (quote.protocol !== "gooddollar_reserve") {
        throw new Error(`Expected gooddollar_reserve, got ${quote.protocol}`);
      }
      if (parseExpectedOut(quote.expectedOut) <= 1000) {
        throw new Error("Expected reserve to return substantially more G$ than Uniswap");
      }
    },
  },
  {
    id: "swap.getSwapQuoteWithFallback.gdUsd",
    domain: "swap",
    layer: "read",
    sdk: {
      invoke: (client) =>
        getSwapQuoteWithFallback(client, "GoodDollar", "USDm", "1000"),
    },
    assert: (result) => {
      const quote = result as { protocol?: string };
      if (quote.protocol !== "gooddollar_reserve") {
        throw new Error(`Expected gooddollar_reserve, got ${quote.protocol}`);
      }
    },
  },
  {
    id: "swap.getSwapQuoteWithFallback.usdGd",
    domain: "swap",
    layer: "read",
    sdk: {
      invoke: (client) =>
        getSwapQuoteWithFallback(client, "USDm", "GoodDollar", "100"),
    },
    assert: (result) => {
      const quote = result as { protocol?: string };
      if (quote.protocol !== "gooddollar_reserve") {
        throw new Error(`Expected gooddollar_reserve, got ${quote.protocol}`);
      }
    },
  },
  {
    id: "gooddollar.prepareReserveSwap.sell",
    domain: "gooddollar",
    layer: "prepare",
    requiresEnv: ["CELO_PRIVATE_KEY"],
    sdk: {
      invoke: (client, fx) =>
        client.gooddollar.prepareReserveSwap(
          fromAddress(fx),
          "GoodDollar",
          "USDm",
          "1000",
        ),
    },
    assert: (result) => {
      const flow = result as { steps?: Array<{ to?: string }> };
      assertHasKeys(result, ["from", "steps"]);
      const last = flow.steps?.at(-1);
      if (last?.to?.toLowerCase() !== GOODDOLLAR_MENTO_BROKER.toLowerCase()) {
        throw new Error("Expected final reserve swap step to target MentoBroker");
      }
    },
  },
  {
    id: "gooddollar.prepareReserveSwap.buy",
    domain: "gooddollar",
    layer: "prepare",
    requiresEnv: ["CELO_PRIVATE_KEY"],
    sdk: {
      invoke: (client, fx) =>
        client.gooddollar.prepareReserveSwap(
          fromAddress(fx),
          "USDm",
          "GoodDollar",
          "10",
        ),
    },
    assert: (result) => {
      const flow = result as { steps?: Array<{ to?: string }> };
      assertHasKeys(result, ["from", "steps"]);
      const last = flow.steps?.at(-1);
      if (last?.to?.toLowerCase() !== GOODDOLLAR_MENTO_BROKER.toLowerCase()) {
        throw new Error("Expected final reserve swap step to target MentoBroker");
      }
    },
  },
];

function parseExpectedOut(value: string | undefined): number {
  const n = Number(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}
