import { parseEther } from "viem";
import type { OperationSpec } from "../types.js";
import { assertHasKeys } from "../../helpers/assert.js";

function fromAddress(fx: Parameters<OperationSpec["assert"]>[1]): `0x${string}` {
  return fx.signerAddress ?? fx.wallet;
}

export const transactionOperations: OperationSpec[] = [
  {
    id: "transaction.getGasFeeData",
    domain: "transaction",
    layer: "read",
    sdk: {
      invoke: (client) => client.transaction.getGasFeeData(),
    },
    mcp: {
      tool: "get_gas_fee_data",
      arguments: () => ({}),
    },
    assert: (result) => {
      assertHasKeys(result, ["network"]);
    },
  },
  {
    id: "transaction.estimateTransaction",
    domain: "transaction",
    layer: "read",
    requiresEnv: ["CELO_PRIVATE_KEY"],
    sdk: {
      invoke: (client, fx) =>
        client.transaction.estimateTransaction({
          from: fromAddress(fx),
          to: fx.wallet,
          value: parseEther("0.001").toString(),
        }),
    },
    mcp: {
      tool: "estimate_transaction",
      arguments: (fx) => ({
        from: fromAddress(fx),
        to: fx.wallet,
        value: parseEther("0.001").toString(),
      }),
    },
    assert: (result) => {
      assertHasKeys(result, ["gasLimit"]);
    },
  },
  {
    id: "transaction.estimateSend",
    domain: "transaction",
    layer: "read",
    requiresEnv: ["CELO_PRIVATE_KEY"],
    sdk: {
      invoke: (client, fx) =>
        client.transaction.estimateSend(
          fromAddress(fx),
          fx.wallet,
          "CELO",
          "0.001",
        ),
    },
    mcp: {
      tool: "estimate_send",
      arguments: () => ({
        to: "0x471EcE3750Da237f93B8E339c536989b8978a438",
        token: "CELO",
        amount: "0.001",
      }),
    },
    assert: (result) => {
      assertHasKeys(result, ["gas"]);
    },
  },
  {
    id: "transaction.prepareSend",
    domain: "transaction",
    layer: "prepare",
    sdk: {
      invoke: (client, fx) =>
        client.transaction.prepareSend(
          fromAddress(fx),
          fx.wallet,
          "CELO",
          "0.001",
        ),
    },
    assert: (result) => {
      assertHasKeys(result, ["from", "steps", "summary"]);
    },
  },
  {
    id: "transaction.sendToken",
    domain: "transaction",
    layer: "write",
    requiresEnv: ["CELO_PRIVATE_KEY"],
    requiresWrites: true,
    mcp: {
      tool: "send_token",
      arguments: () => ({
        to: "0x471EcE3750Da237f93B8E339c536989b8978a438",
        token: "CELO",
        amount: "0.000001",
      }),
    },
    assert: (result) => {
      assertHasKeys(result, ["hash"]);
    },
  },
];
