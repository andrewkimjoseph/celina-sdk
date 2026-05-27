import type { OperationSpec } from "../types.js";
import { assertHasKeys } from "../../helpers/assert.js";

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
];
