import { z } from "zod";
import {
  executeEnvRequirements,
  nonNegativeIntSchema,
  optionalBooleanSchema,
  optionalBoundedPositiveInt,
  optionalSignerSchema,
  optionalWalletAddressSchema,
  paginationFields,
} from "../schemas/common.js";
import type { ToolDefinition } from "../types.js";
import { resolveWalletFromRuntime } from "../utils/wallet.js";

const readOnly = {
  readOnlyHint: true,
  idempotentHint: true,
} as const;

const destructive = {
  destructiveHint: true,
  openWorldHint: true,
} as const;

function resolveSigner(input: Record<string, unknown>) {
  return input.signer as "celo" | "self_agent" | undefined;
}

export const governanceToolDefinitions: ToolDefinition[] = [
  {
    name: "get_governance_proposals",
    description:
      "Returns Celo governance proposals with pagination. Set include_metadata=false for faster responses.",
    inputSchema: z.object({
      include_inactive: optionalBooleanSchema,
      include_metadata: optionalBooleanSchema,
      ...paginationFields,
      page_size: optionalBoundedPositiveInt(20),
    }),
    families: ["read"],
    mcp: {
      title: "Get Governance Proposals",
      annotations: { readOnlyHint: true, idempotentHint: true },
    },
    handler: async (runtime, input) =>
      runtime.celina.governance.getGovernanceProposals({
        includeInactive: input.include_inactive as boolean | undefined,
        includeMetadata: input.include_metadata as boolean | undefined,
        page: input.page as number | undefined,
        pageSize: input.page_size as number | undefined,
        offset: input.offset as number | undefined,
        limit: input.limit as number | undefined,
      }),
  },
  {
    name: "get_proposal_details",
    description:
      "Returns detailed information about a Celo governance proposal.",
    inputSchema: z.object({
      proposal_id: nonNegativeIntSchema,
    }),
    families: ["read"],
    mcp: {
      title: "Get Proposal Details",
      annotations: { readOnlyHint: true, idempotentHint: true },
    },
    handler: async (runtime, input) =>
      runtime.celina.governance.getProposalDetails(input.proposal_id as number),
  },
  {
    name: "get_locked_celo_balance",
    description: "Locked CELO balances and governance voting power for an address.",
    inputSchema: z.object({ address: optionalWalletAddressSchema }),
    families: ["read"],
    mcp: { title: "Get Locked CELO Balance", annotations: readOnly },
    handler: async (runtime, input) => {
      const target = resolveWalletFromRuntime(runtime, {
        address: input.address as string | undefined,
      });
      return runtime.celina.governance.getLockedCeloBalance(target);
    },
  },
  {
    name: "get_pending_withdrawals",
    description: "Pending LockedGold withdrawals with maturity timestamps for an address.",
    inputSchema: z.object({ address: optionalWalletAddressSchema }),
    families: ["read"],
    mcp: { title: "Get Pending Withdrawals", annotations: readOnly },
    handler: async (runtime, input) => {
      const target = resolveWalletFromRuntime(runtime, {
        address: input.address as string | undefined,
      });
      return runtime.celina.governance.getPendingWithdrawals(target);
    },
  },
  {
    name: "get_votable_proposals",
    description: "Governance proposals currently in Referendum with dequeue index for voting.",
    inputSchema: z.object({}),
    families: ["read"],
    mcp: { title: "Get Votable Proposals", annotations: readOnly },
    handler: async (runtime) => runtime.celina.governance.getVotableProposals(),
  },
  {
    name: "get_governance_votes",
    description:
      "Referendum votes and queue upvotes cast by an address on Celo governance.",
    inputSchema: z.object({
      address: optionalWalletAddressSchema,
      proposal_id: nonNegativeIntSchema.optional(),
    }),
    families: ["read"],
    mcp: { title: "Get Governance Votes", annotations: readOnly },
    handler: async (runtime, input) => {
      const target = resolveWalletFromRuntime(runtime, {
        address: input.address as string | undefined,
      });
      return runtime.celina.governance.getGovernanceVotes(target, {
        proposalId: input.proposal_id as number | undefined,
      });
    },
  },
  {
    name: "execute_lock_celo",
    description:
      "Lock CELO for governance and staking. Requires humanness verification and a registered Celo account.",
    inputSchema: z.object({
      amount: z.string().describe("CELO amount to lock (human-readable)"),
      signer: optionalSignerSchema,
    }),
    families: ["execute"],
    surfaces: ["mcp"],
    requiresEnv: [...executeEnvRequirements],
    mcp: { title: "Lock CELO", annotations: destructive },
    handler: async (runtime, input) => {
      const write = runtime.executors?.governanceWrite;
      if (!write) throw new Error("Governance write executor not configured.");
      return write.lockCelo(input.amount as string, resolveSigner(input));
    },
  },
  {
    name: "execute_unlock_celo",
    description: "Start unlocking locked CELO (3-day timelock). Requires humanness verification.",
    inputSchema: z.object({
      amount: z.string(),
      signer: optionalSignerSchema,
    }),
    families: ["execute"],
    surfaces: ["mcp"],
    requiresEnv: [...executeEnvRequirements],
    mcp: { title: "Unlock CELO", annotations: destructive },
    handler: async (runtime, input) => {
      const write = runtime.executors?.governanceWrite;
      if (!write) throw new Error("Governance write executor not configured.");
      return write.unlockCelo(input.amount as string, resolveSigner(input));
    },
  },
  {
    name: "execute_relock_celo",
    description: "Relock CELO from a pending withdrawal index. Requires humanness verification.",
    inputSchema: z.object({
      index: nonNegativeIntSchema,
      amount: z.string(),
      signer: optionalSignerSchema,
    }),
    families: ["execute"],
    surfaces: ["mcp"],
    requiresEnv: [...executeEnvRequirements],
    mcp: { title: "Relock CELO", annotations: destructive },
    handler: async (runtime, input) => {
      const write = runtime.executors?.governanceWrite;
      if (!write) throw new Error("Governance write executor not configured.");
      return write.relockCelo(
        input.index as number,
        input.amount as string,
        resolveSigner(input),
      );
    },
  },
  {
    name: "execute_withdraw_celo",
    description: "Withdraw all matured pending CELO unlocks. Requires humanness verification.",
    inputSchema: z.object({ signer: optionalSignerSchema }),
    families: ["execute"],
    surfaces: ["mcp"],
    requiresEnv: [...executeEnvRequirements],
    mcp: { title: "Withdraw CELO", annotations: destructive },
    handler: async (runtime, input) => {
      const write = runtime.executors?.governanceWrite;
      if (!write) throw new Error("Governance write executor not configured.");
      return write.withdrawCelo(resolveSigner(input));
    },
  },
  {
    name: "execute_vote",
    description:
      "Vote on a governance proposal in Referendum. Vote values: Abstain, No, Yes.",
    inputSchema: z.object({
      proposal_id: nonNegativeIntSchema,
      vote: z.enum(["Abstain", "No", "Yes"]),
      signer: optionalSignerSchema,
    }),
    families: ["execute"],
    surfaces: ["mcp"],
    requiresEnv: [...executeEnvRequirements],
    mcp: { title: "Vote on Proposal", annotations: destructive },
    handler: async (runtime, input) => {
      const write = runtime.executors?.governanceWrite;
      if (!write) throw new Error("Governance write executor not configured.");
      return write.vote(
        input.proposal_id as number,
        input.vote as "Abstain" | "No" | "Yes",
        resolveSigner(input),
      );
    },
  },
  {
    name: "execute_upvote",
    description:
      "Upvote a Queued governance proposal. Requires locked CELO; only one active queue upvote per account.",
    inputSchema: z.object({
      proposal_id: nonNegativeIntSchema,
      signer: optionalSignerSchema,
    }),
    families: ["execute"],
    surfaces: ["mcp"],
    requiresEnv: [...executeEnvRequirements],
    mcp: { title: "Upvote Proposal", annotations: destructive },
    handler: async (runtime, input) => {
      const write = runtime.executors?.governanceWrite;
      if (!write) throw new Error("Governance write executor not configured.");
      return write.upvote(input.proposal_id as number, resolveSigner(input));
    },
  },
  {
    name: "execute_revoke_governance_votes",
    description:
      "Revoke all active referendum governance votes for the signer in one transaction (bulk on-chain).",
    inputSchema: z.object({ signer: optionalSignerSchema }),
    families: ["execute"],
    surfaces: ["mcp"],
    requiresEnv: [...executeEnvRequirements],
    mcp: { title: "Revoke Governance Votes", annotations: destructive },
    handler: async (runtime, input) => {
      const write = runtime.executors?.governanceWrite;
      if (!write) throw new Error("Governance write executor not configured.");
      return write.revokeGovernanceVotes(resolveSigner(input));
    },
  },
  {
    name: "execute_revoke_governance_upvote",
    description:
      "Revoke the signer's active queue upvote on a Queued governance proposal.",
    inputSchema: z.object({
      proposal_id: nonNegativeIntSchema.optional(),
      signer: optionalSignerSchema,
    }),
    families: ["execute"],
    surfaces: ["mcp"],
    requiresEnv: [...executeEnvRequirements],
    mcp: { title: "Revoke Governance Upvote", annotations: destructive },
    handler: async (runtime, input) => {
      const write = runtime.executors?.governanceWrite;
      if (!write) throw new Error("Governance write executor not configured.");
      return write.revokeGovernanceUpvote(
        input.proposal_id as number | undefined,
        resolveSigner(input),
      );
    },
  },
  {
    name: "prepare_lock_celo",
    description: "Prepare unsigned lock CELO flow for wallet signing.",
    inputSchema: z.object({
      from: optionalWalletAddressSchema,
      amount: z.string(),
    }),
    families: ["prepare"],
    surfaces: ["browser"],
    handler: async (runtime, input) => {
      const from = resolveWalletFromRuntime(runtime, {
        from: input.from as string | undefined,
      });
      return runtime.celina.governance.prepareLockCelo(from, input.amount as string);
    },
  },
  {
    name: "prepare_unlock_celo",
    description: "Prepare unsigned unlock CELO flow for wallet signing.",
    inputSchema: z.object({
      from: optionalWalletAddressSchema,
      amount: z.string(),
    }),
    families: ["prepare"],
    surfaces: ["browser"],
    handler: async (runtime, input) => {
      const from = resolveWalletFromRuntime(runtime, {
        from: input.from as string | undefined,
      });
      return runtime.celina.governance.prepareUnlockCelo(from, input.amount as string);
    },
  },
  {
    name: "prepare_relock_celo",
    description: "Prepare unsigned relock CELO flow for wallet signing.",
    inputSchema: z.object({
      from: optionalWalletAddressSchema,
      index: nonNegativeIntSchema,
      amount: z.string(),
    }),
    families: ["prepare"],
    surfaces: ["browser"],
    handler: async (runtime, input) => {
      const from = resolveWalletFromRuntime(runtime, {
        from: input.from as string | undefined,
      });
      return runtime.celina.governance.prepareRelockCelo(
        from,
        input.index as number,
        input.amount as string,
      );
    },
  },
  {
    name: "prepare_withdraw_celo",
    description: "Prepare unsigned withdraw matured CELO flow for wallet signing.",
    inputSchema: z.object({ from: optionalWalletAddressSchema }),
    families: ["prepare"],
    surfaces: ["browser"],
    handler: async (runtime, input) => {
      const from = resolveWalletFromRuntime(runtime, {
        from: input.from as string | undefined,
      });
      return runtime.celina.governance.prepareWithdrawCelo(from);
    },
  },
  {
    name: "prepare_vote",
    description: "Prepare unsigned governance vote for wallet signing.",
    inputSchema: z.object({
      from: optionalWalletAddressSchema,
      proposal_id: nonNegativeIntSchema,
      vote: z.enum(["Abstain", "No", "Yes"]),
    }),
    families: ["prepare"],
    surfaces: ["browser"],
    handler: async (runtime, input) => {
      const from = resolveWalletFromRuntime(runtime, {
        from: input.from as string | undefined,
      });
      return runtime.celina.governance.prepareVote(
        from,
        input.proposal_id as number,
        input.vote as "Abstain" | "No" | "Yes",
      );
    },
  },
  {
    name: "prepare_upvote",
    description:
      "Prepare unsigned governance queue upvote for wallet signing. Requires locked CELO.",
    inputSchema: z.object({
      from: optionalWalletAddressSchema,
      proposal_id: nonNegativeIntSchema,
    }),
    families: ["prepare"],
    surfaces: ["browser"],
    handler: async (runtime, input) => {
      const from = resolveWalletFromRuntime(runtime, {
        from: input.from as string | undefined,
      });
      return runtime.celina.governance.prepareUpvote(
        from,
        input.proposal_id as number,
      );
    },
  },
  {
    name: "prepare_revoke_governance_votes",
    description:
      "Prepare unsigned bulk referendum vote revoke for wallet signing.",
    inputSchema: z.object({ from: optionalWalletAddressSchema }),
    families: ["prepare"],
    surfaces: ["browser"],
    handler: async (runtime, input) => {
      const from = resolveWalletFromRuntime(runtime, {
        from: input.from as string | undefined,
      });
      return runtime.celina.governance.prepareRevokeGovernanceVotes(from);
    },
  },
  {
    name: "prepare_revoke_governance_upvote",
    description: "Prepare unsigned queue upvote revoke for wallet signing.",
    inputSchema: z.object({
      from: optionalWalletAddressSchema,
      proposal_id: nonNegativeIntSchema.optional(),
    }),
    families: ["prepare"],
    surfaces: ["browser"],
    handler: async (runtime, input) => {
      const from = resolveWalletFromRuntime(runtime, {
        from: input.from as string | undefined,
      });
      return runtime.celina.governance.prepareRevokeGovernanceUpvote(from, {
        proposalId: input.proposal_id as number | undefined,
      });
    },
  },
];
