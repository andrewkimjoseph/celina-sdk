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
import { getMcpToolNames } from "../../src/tools/catalog.js";
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

/** MCP tool names from the SDK tools catalog. */
export const MCP_TOOL_NAMES = getMcpToolNames();

/** @deprecated Use MCP_TOOL_NAMES — kept for tests that import the operations-derived list. */
export const MCP_TOOL_NAMES_FROM_OPERATIONS = MCP_OPERATIONS.map(
  (spec) => spec.mcp.tool,
);
