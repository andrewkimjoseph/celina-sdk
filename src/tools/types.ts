import type { z } from "zod";
import type { CelinaClient } from "../index.js";
import type { CarbonWriteBody } from "../services/carbon.service.js";

export type ToolSurface = "mcp" | "browser";
export type ToolFamily = "read" | "prepare" | "execute";
export type ToolEnvRequirement =
  | "CELO_PRIVATE_KEY"
  | "SELF_AGENT_PRIVATE_KEY"
  | "SELF_SESSION";

export type WalletInput = {
  address?: string;
  wallet_address?: string;
  from?: string;
};

export type McpToolAnnotations = {
  readOnlyHint?: boolean;
  idempotentHint?: boolean;
  destructiveHint?: boolean;
  openWorldHint?: boolean;
};

export type McpToolMeta = {
  title?: string;
  annotations?: McpToolAnnotations;
  /** MCP adapter uses okSelfSession for QR registration flows. */
  responseKind?: "default" | "self_session";
};

export type ToolRuntimeHooks = {
  beforePrepareSend?: (params: {
    sender: `0x${string}`;
    token: string;
    amount: string;
  }) => Promise<void>;
  carbon?: {
    validateBody?: (toolName: string, body: CarbonWriteBody) => void;
    prepare?: (
      toolName: string,
      sender: `0x${string}`,
      prepareFn: (body: CarbonWriteBody) => Promise<unknown>,
      body: CarbonWriteBody,
      options?: { marketPriceFallback?: boolean; concentrated?: boolean },
    ) => Promise<unknown>;
  };
};

export type TransactionExecutors = {
  estimateSend: (
    to: `0x${string}`,
    token: string,
    amount: string,
  ) => Promise<unknown>;
  sendToken: (
    to: `0x${string}`,
    token: string,
    amount: string,
  ) => Promise<unknown>;
};

export type MentoFxExecutors = {
  estimate: (
    tokenIn: string,
    tokenOut: string,
    amount: string,
    options?: {
      recipient?: `0x${string}`;
      slippageTolerance?: number;
      deadlineMinutes?: number;
    },
  ) => Promise<unknown>;
  execute: (
    tokenIn: string,
    tokenOut: string,
    amount: string,
    options?: {
      recipient?: `0x${string}`;
      slippageTolerance?: number;
      deadlineMinutes?: number;
    },
  ) => Promise<unknown>;
};

export type UniswapExecutors = {
  estimate: (
    tokenIn: string,
    tokenOut: string,
    amount: string,
    options?: {
      recipient?: `0x${string}`;
      slippageTolerance?: number;
      deadlineMinutes?: number;
    },
  ) => Promise<unknown>;
  execute: (
    tokenIn: string,
    tokenOut: string,
    amount: string,
    options?: {
      recipient?: `0x${string}`;
      slippageTolerance?: number;
      deadlineMinutes?: number;
    },
  ) => Promise<unknown>;
};

export type AaveExecutors = {
  supply: (token: string, amount: string) => Promise<unknown>;
  withdraw: (
    token: string,
    amount?: string,
    withdrawMax?: boolean,
  ) => Promise<unknown>;
};

export type CarbonWriteExecutors = {
  executeLimitOrder: (body: Record<string, unknown>) => Promise<unknown>;
  executeRangeOrder: (body: Record<string, unknown>) => Promise<unknown>;
  executeRecurringStrategy: (body: Record<string, unknown>) => Promise<unknown>;
  executeConcentratedStrategy: (body: Record<string, unknown>) => Promise<unknown>;
  executeFullRangeStrategy: (body: Record<string, unknown>) => Promise<unknown>;
  executeRepriceStrategy: (body: Record<string, unknown>) => Promise<unknown>;
  executeEditStrategy: (body: Record<string, unknown>) => Promise<unknown>;
  executeDepositBudget: (body: Record<string, unknown>) => Promise<unknown>;
  executeWithdrawBudget: (body: Record<string, unknown>) => Promise<unknown>;
  executePauseStrategy: (body: Record<string, unknown>) => Promise<unknown>;
  executeResumeStrategy: (body: Record<string, unknown>) => Promise<unknown>;
  executeDeleteStrategy: (body: Record<string, unknown>) => Promise<unknown>;
  executeTrade: (body: Record<string, unknown>) => Promise<unknown>;
};

export type GoodDollarWriteExecutors = {
  claimDailyUbi: () => Promise<unknown>;
  estimateReserveSwap: (
    tokenIn: string,
    tokenOut: string,
    amount: string,
    options?: {
      recipient?: `0x${string}`;
      slippageTolerance?: number;
    },
  ) => Promise<unknown>;
  executeReserveSwap: (
    tokenIn: string,
    tokenOut: string,
    amount: string,
    options?: {
      recipient?: `0x${string}`;
      slippageTolerance?: number;
    },
  ) => Promise<unknown>;
};

export type SelfExecutors = {
  verifyAgent: (args: Record<string, unknown>) => Promise<unknown>;
  lookupAgent: (agentId: number) => Promise<unknown>;
  verifyRequest: (args: Record<string, unknown>) => Promise<unknown>;
  registerAgent: (args: Record<string, unknown>) => Promise<unknown>;
  checkRegistration: (sessionId: string) => Promise<unknown>;
  getIdentity: () => Promise<unknown>;
  refreshProof: (args: Record<string, unknown>) => Promise<unknown>;
  deregisterAgent: () => Promise<unknown>;
  signRequest: (args: Record<string, unknown>) => Promise<unknown>;
  authenticatedFetch: (args: Record<string, unknown>) => Promise<unknown>;
};

export type ToolRuntimeExecutors = {
  transaction?: TransactionExecutors;
  mentoFx?: MentoFxExecutors;
  uniswap?: UniswapExecutors;
  aave?: AaveExecutors;
  carbonWrite?: CarbonWriteExecutors;
  gooddollarWrite?: GoodDollarWriteExecutors;
  self?: SelfExecutors;
};

export interface ToolRuntime {
  celina: CelinaClient;
  resolveWallet: (input?: WalletInput) => `0x${string}`;
  hooks?: ToolRuntimeHooks;
  executors?: ToolRuntimeExecutors;
  /** MCP session wallet metadata for get_wallet_address. */
  mcpWallet?: {
    address: `0x${string}`;
    hasWallet: boolean;
  };
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: z.ZodTypeAny;
  families: ToolFamily[];
  surfaces?: ToolSurface[];
  requiresEnv?: ToolEnvRequirement[];
  mcp?: McpToolMeta;
  handler: (runtime: ToolRuntime, input: Record<string, unknown>) => Promise<unknown>;
}

export type FilterToolsOptions = {
  surface?: ToolSurface;
  families?: ToolFamily[];
  names?: string[];
  carbonPrepareEnabled?: boolean;
  carbonExecuteEnabled?: boolean;
  /** When false, omit tools that require CELO_PRIVATE_KEY or SELF_AGENT_PRIVATE_KEY. Default true. */
  serverKeyToolsEnabled?: boolean;
  /** When false, omit Self registration session tools. Default true. */
  selfSessionToolsEnabled?: boolean;
  /** When false, omit estimate_* gas simulation tools. Default true. */
  estimateToolsEnabled?: boolean;
};
