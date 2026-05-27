import { expect } from "vitest";
import type { OperationSpec } from "../types.js";
import { assertHasKeys } from "../../helpers/assert.js";

export const tokenOperations: OperationSpec[] = [
  {
    id: "token.getBalances",
    domain: "token",
    layer: "read",
    sdk: {
      invoke: (client, fx) =>
        client.token.getBalances(fx.wallet, ["CELO", "USDm"]),
    },
    mcp: {
      tool: "get_celo_balances",
      arguments: (fx) => ({
        address: fx.wallet,
        tokens: ["CELO", "USDm"],
      }),
    },
    assert: (result) => {
      assertHasKeys(result, ["address", "balances"]);
    },
  },
  {
    id: "token.getStablecoinBalances",
    domain: "token",
    layer: "read",
    sdk: {
      invoke: (client, fx) => client.token.getStablecoinBalances(fx.wallet),
    },
    mcp: {
      tool: "get_stablecoin_balances",
      arguments: (fx) => ({ address: fx.wallet }),
    },
    assert: (result) => {
      assertHasKeys(result, ["address", "stablecoins"]);
    },
  },
  {
    id: "token.getTokenInfo",
    domain: "token",
    layer: "read",
    sdk: {
      invoke: (client) => client.token.getTokenInfo("USDm"),
    },
    mcp: {
      tool: "get_token_info",
      arguments: () => ({ token: "USDm" }),
    },
    assert: (result) => {
      assertHasKeys(result, ["symbol", "decimals"]);
    },
  },
  {
    id: "token.getTokenBalance",
    domain: "token",
    layer: "read",
    sdk: {
      invoke: (client, fx) =>
        client.token.getTokenBalance(fx.usdm, fx.wallet),
    },
    mcp: {
      tool: "get_token_balance",
      arguments: (fx) => ({
        tokenAddress: fx.usdm,
        address: fx.wallet,
      }),
    },
    assert: (result) => {
      assertHasKeys(result, ["formatted", "symbol"]);
    },
  },
];
