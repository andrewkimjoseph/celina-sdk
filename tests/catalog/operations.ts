import { blockchainOperations } from "./domains/blockchain.js";
import { tokenOperations } from "./domains/token.js";
import { transactionOperations } from "./domains/transaction.js";
import {
  aaveOperations,
  ensOperations,
  gooddollarOperations,
  mentoFxOperations,
  uniswapOperations,
} from "./domains/defi.js";
import {
  contractOperations,
  governanceOperations,
  nftOperations,
  stakingOperations,
} from "./domains/chain-ext.js";
import { selfOperations } from "./domains/self.js";
import type { OperationSpec } from "./types.js";

export const OPERATIONS: OperationSpec[] = [
  ...blockchainOperations,
  ...tokenOperations,
  ...transactionOperations,
  ...mentoFxOperations,
  ...uniswapOperations,
  ...aaveOperations,
  ...ensOperations,
  ...gooddollarOperations,
  ...governanceOperations,
  ...stakingOperations,
  ...nftOperations,
  ...contractOperations,
  ...selfOperations,
];

export const MCP_OPERATIONS = OPERATIONS.filter(
  (spec): spec is OperationSpec & { mcp: NonNullable<OperationSpec["mcp"]> } =>
    Boolean(spec.mcp),
);

export const SDK_OPERATIONS = OPERATIONS.filter(
  (spec): spec is OperationSpec & { sdk: NonNullable<OperationSpec["sdk"]> } =>
    Boolean(spec.sdk),
);

export const MCP_TOOL_NAMES = MCP_OPERATIONS.map((spec) => spec.mcp.tool);
