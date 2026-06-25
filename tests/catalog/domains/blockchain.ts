import assert from "node:assert/strict";
import type { OperationSpec } from "../types.js";
import { assertArray, assertHasKeys } from "../../helpers/assert.js";

function expectNumberLike(value: unknown): void {
  assert.notEqual(value, undefined);
  assert.equal(Number.isNaN(Number(value)), false);
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
        block_id: Number(fx.latestBlockNumber),
      }),
    },
    assert: (result) => {
      assertHasKeys(result, ["number", "hash"]);
    },
  },
  {
    id: "blockchain.getBlockWithTransactions",
    domain: "blockchain",
    layer: "read",
    sdk: {
      invoke: (client, fx) =>
        client.blockchain.getBlock(Number(fx.latestBlockNumber), {
          includeTransactions: true,
        }),
    },
    mcp: {
      tool: "get_block",
      arguments: (fx) => ({
        block_id: Number(fx.latestBlockNumber),
        include_transactions: true,
      }),
    },
    assert: (result) => {
      const obj = assertHasKeys(result, ["number", "hash", "transactions"]);
      assert.doesNotThrow(() => JSON.stringify(result));
      const txs = assertArray(obj.transactions);
      assert.ok(txs.length > 0);
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
      assert.ok(blocks.length > 0);
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
  {
    id: "account.getWalletAddress",
    domain: "blockchain",
    layer: "read",
    requiresEnv: ["CELO_PRIVATE_KEY"],
    mcp: {
      tool: "get_wallet_address",
      arguments: () => ({}),
    },
    assert: (result, fx) => {
      const obj = assertHasKeys(result, ["wallet_address", "has_wallet", "source"]);
      assert.equal(obj.has_wallet, true);
      assert.equal(
        String(obj.wallet_address).toLowerCase(),
        fx.wallet.toLowerCase(),
      );
      assert.equal(obj.source, "CELO_PRIVATE_KEY");
    },
  },
];
