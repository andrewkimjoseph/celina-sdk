import { expect } from "vitest";
import type { OperationSpec } from "../types.js";
import { assertArray, assertHasKeys } from "../../helpers/assert.js";

function expectNumberLike(value: unknown): void {
  expect(value).toBeDefined();
  expect(Number(value)).not.toBeNaN();
}

export const blockchainOperations: OperationSpec[] = [
  {
    id: "blockchain.getNetworkStatus",
    domain: "blockchain",
    layer: "read",
    sdk: {
      invoke: (client) => client.blockchain.getNetworkStatus(),
    },
    mcp: {
      tool: "get_network_status",
      arguments: () => ({}),
    },
    assert: (result) => {
      const obj = assertHasKeys(result, ["network", "chainId", "blockNumber"]);
      expectNumberLike(obj.blockNumber);
    },
  },
  {
    id: "blockchain.getBlock",
    domain: "blockchain",
    layer: "read",
    sdk: {
      invoke: (client, fx) =>
        client.blockchain.getBlock(Number(fx.latestBlockNumber)),
    },
    mcp: {
      tool: "get_block",
      arguments: (fx) => ({
        blockId: Number(fx.latestBlockNumber),
      }),
    },
    assert: (result) => {
      assertHasKeys(result, ["number", "hash"]);
    },
  },
  {
    id: "blockchain.getLatestBlocks",
    domain: "blockchain",
    layer: "read",
    sdk: {
      invoke: (client) => client.blockchain.getLatestBlocks(3, 0),
    },
    mcp: {
      tool: "get_latest_blocks",
      arguments: () => ({ count: 3, offset: 0 }),
    },
    assert: (result) => {
      const blocks = assertArray(result);
      expect(blocks.length).toBeGreaterThan(0);
    },
  },
  {
    id: "blockchain.getTransaction",
    domain: "blockchain",
    layer: "read",
    sdk: {
      invoke: (client, fx) => client.blockchain.getTransaction(fx.knownTxHash),
    },
    mcp: {
      tool: "get_transaction",
      arguments: (fx) => ({ hash: fx.knownTxHash }),
    },
    assert: (result) => {
      assertHasKeys(result, ["hash", "from"]);
    },
  },
  {
    id: "account.getAccount",
    domain: "blockchain",
    layer: "read",
    sdk: {
      invoke: (client, fx) => client.account.getAccount(fx.wallet),
    },
    mcp: {
      tool: "get_account",
      arguments: (fx) => ({ address: fx.wallet }),
    },
    assert: (result) => {
      assertHasKeys(result, ["address", "balanceWei"]);
    },
  },
];
