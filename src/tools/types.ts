import type { z } from "zod";
import type { CelinaClient } from "../index.js";

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
};

export type TransactionExecutors = {
  estimateSend: (
    to: `0x${string}`,
    token: string,
    amount: string,
    signer?: "celo" | "self_agent",
  ) => Promise<unknown>;
  sendToken: (
    to: `0x${string}`,
    token: string,
    amount: string,
    signer?: "celo" | "self_agent",
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

export type ContractExecutors = {
  executeFunction: (params: {
    contractAddress: `0x${string}`;
    functionName: string;
    abi: unknown;
    functionArgs?: unknown[];
    value?: string;
  }) => Promise<unknown>;
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

export type GoodDollarIdentityExecutors = {
  getFaceVerificationLink: (callbackUrl: string) => Promise<unknown>;
};

export type GoodDollarIdentityWriteExecutors = {
  connectIdentity: (
    connectedAccount: `0x${string}`,
    signer?: "celo" | "self_agent",
  ) => Promise<unknown>;
  disconnectIdentity: (
    connectedAccount: `0x${string}`,
    signer?: "celo" | "self_agent",
  ) => Promise<unknown>;
};

export type GovernanceWriteExecutors = {
  lockCelo: (amount: string, signer?: "celo" | "self_agent") => Promise<unknown>;
  unlockCelo: (amount: string, signer?: "celo" | "self_agent") => Promise<unknown>;
  relockCelo: (
    index: number,
    amount: string,
    signer?: "celo" | "self_agent",
  ) => Promise<unknown>;
  withdrawCelo: (signer?: "celo" | "self_agent") => Promise<unknown>;
  vote: (
    proposalId: number,
    vote: "Abstain" | "No" | "Yes",
    signer?: "celo" | "self_agent",
  ) => Promise<unknown>;
  upvote: (proposalId: number, signer?: "celo" | "self_agent") => Promise<unknown>;
  revokeGovernanceVotes: (signer?: "celo" | "self_agent") => Promise<unknown>;
  revokeGovernanceUpvote: (
    proposalId?: number,
    signer?: "celo" | "self_agent",
  ) => Promise<unknown>;
};

export type StakingWriteExecutors = {
  stake: (
    groupAddress: `0x${string}`,
    amount: string,
    signer?: "celo" | "self_agent",
  ) => Promise<unknown>;
  activateStake: (
    groupAddress: `0x${string}`,
    signer?: "celo" | "self_agent",
  ) => Promise<unknown>;
  unstake: (
    groupAddress: `0x${string}`,
    amount: string,
    signer?: "celo" | "self_agent",
  ) => Promise<unknown>;
  delegatePower: (
    delegatee: `0x${string}`,
    percent: number,
    signer?: "celo" | "self_agent",
  ) => Promise<unknown>;
  undelegatePower: (
    delegatee: `0x${string}`,
    percent: number,
    signer?: "celo" | "self_agent",
  ) => Promise<unknown>;
};

export type AccountWriteExecutors = {
  registerAccount: (signer?: "celo" | "self_agent") => Promise<unknown>;
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
  contract?: ContractExecutors;
  gooddollarWrite?: GoodDollarWriteExecutors;
  gooddollarIdentity?: GoodDollarIdentityExecutors;
  gooddollarIdentityWrite?: GoodDollarIdentityWriteExecutors;
  governanceWrite?: GovernanceWriteExecutors;
  stakingWrite?: StakingWriteExecutors;
  accountWrite?: AccountWriteExecutors;
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
    /** Which configured key resolves to `address` when no explicit signer is requested. */
    signer?: "celo" | "self_agent";
    /** Every configured signer's address — lets a single call see both wallets at once. */
    wallets?: {
      celo?: { address: `0x${string}` };
      self_agent?: { address: `0x${string}` };
    };
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
  /** When false, omit tools that require CELO_PRIVATE_KEY or SELF_AGENT_PRIVATE_KEY. Default true. */
  serverKeyToolsEnabled?: boolean;
  /** When false, omit Self registration session tools. Default true. */
  selfSessionToolsEnabled?: boolean;
  /** When false, omit estimate_* gas simulation tools. Default true. */
  estimateToolsEnabled?: boolean;
};
