import { z } from "zod";
import {
  addressSchema,
  executeEnvRequirements,
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

export const stakingToolDefinitions: ToolDefinition[] = [
  {
    name: "get_staking_balances",
    description:
      "Active and pending staking votes for an address by validator group.",
    inputSchema: z.object({
      address: optionalWalletAddressSchema,
    }),
    families: ["read"],
    mcp: { title: "Get Staking Balances", annotations: readOnly },
    handler: async (runtime, input) => {
      const target = resolveWalletFromRuntime(runtime, {
        address: input.address as string | undefined,
      });
      return runtime.celina.staking.getStakingBalances(target);
    },
  },
  {
    name: "get_activatable_stakes",
    description:
      "Validator groups where pending stakes can be activated for an address.",
    inputSchema: z.object({
      address: optionalWalletAddressSchema,
    }),
    families: ["read"],
    mcp: { title: "Get Activatable Stakes", annotations: readOnly },
    handler: async (runtime, input) => {
      const target = resolveWalletFromRuntime(runtime, {
        address: input.address as string | undefined,
      });
      return runtime.celina.staking.getActivatableStakes(target);
    },
  },
  {
    name: "get_validator_groups",
    description:
      "Paginated validator groups with votes, capacity, and member counts.",
    inputSchema: z.object({
      ...paginationFields,
      page_size: optionalBoundedPositiveInt(50),
    }),
    families: ["read"],
    mcp: { title: "Get Validator Groups", annotations: readOnly },
    handler: async (runtime, input) =>
      runtime.celina.staking.getValidatorGroups({
        page: input.page as number | undefined,
        pageSize: input.page_size as number | undefined,
        offset: input.offset as number | undefined,
        limit: input.limit as number | undefined,
      }),
  },
  {
    name: "get_validator_group_details",
    description:
      "Detailed information about a validator group including members.",
    inputSchema: z.object({
      group_address: addressSchema,
    }),
    families: ["read"],
    mcp: { title: "Get Validator Group Details", annotations: readOnly },
    handler: async (runtime, input) =>
      runtime.celina.staking.getValidatorGroupDetails(
        input.group_address as `0x${string}`,
      ),
  },
  {
    name: "get_total_staking_info",
    description: "Network-wide staking participation metrics.",
    inputSchema: z.object({}),
    families: ["read"],
    mcp: { title: "Get Total Staking Info", annotations: readOnly },
    handler: async (runtime) => runtime.celina.staking.getTotalStakingInfo(),
  },
  {
    name: "get_delegation_info",
    description: "Governance vote delegation info from LockedGold for an address.",
    inputSchema: z.object({ address: optionalWalletAddressSchema }),
    families: ["read"],
    mcp: { title: "Get Delegation Info", annotations: readOnly },
    handler: async (runtime, input) => {
      const target = resolveWalletFromRuntime(runtime, {
        address: input.address as string | undefined,
      });
      return runtime.celina.staking.getDelegationInfo(target);
    },
  },
  {
    name: "execute_stake",
    description:
      "Stake locked CELO with a validator group. Requires humanness verification and registered Celo account.",
    inputSchema: z.object({
      group_address: addressSchema,
      amount: z.string(),
      signer: optionalSignerSchema,
    }),
    families: ["execute"],
    surfaces: ["mcp"],
    requiresEnv: [...executeEnvRequirements],
    mcp: { title: "Stake CELO", annotations: destructive },
    handler: async (runtime, input) => {
      const write = runtime.executors?.stakingWrite;
      if (!write) throw new Error("Staking write executor not configured.");
      return write.stake(
        input.group_address as `0x${string}`,
        input.amount as string,
        resolveSigner(input),
      );
    },
  },
  {
    name: "execute_activate_stake",
    description: "Activate pending stake for a validator group after epoch boundary.",
    inputSchema: z.object({
      group_address: addressSchema,
      signer: optionalSignerSchema,
    }),
    families: ["execute"],
    surfaces: ["mcp"],
    requiresEnv: [...executeEnvRequirements],
    mcp: { title: "Activate Stake", annotations: destructive },
    handler: async (runtime, input) => {
      const write = runtime.executors?.stakingWrite;
      if (!write) throw new Error("Staking write executor not configured.");
      return write.activateStake(
        input.group_address as `0x${string}`,
        resolveSigner(input),
      );
    },
  },
  {
    name: "execute_unstake",
    description: "Unstake CELO from a validator group. Requires humanness verification.",
    inputSchema: z.object({
      group_address: addressSchema,
      amount: z.string(),
      signer: optionalSignerSchema,
    }),
    families: ["execute"],
    surfaces: ["mcp"],
    requiresEnv: [...executeEnvRequirements],
    mcp: { title: "Unstake CELO", annotations: destructive },
    handler: async (runtime, input) => {
      const write = runtime.executors?.stakingWrite;
      if (!write) throw new Error("Staking write executor not configured.");
      return write.unstake(
        input.group_address as `0x${string}`,
        input.amount as string,
        resolveSigner(input),
      );
    },
  },
  {
    name: "execute_delegate_power",
    description: "Delegate governance voting power to another address. Requires humanness verification.",
    inputSchema: z.object({
      delegatee: addressSchema,
      percent: z.number().min(0).max(100),
      signer: optionalSignerSchema,
    }),
    families: ["execute"],
    surfaces: ["mcp"],
    requiresEnv: [...executeEnvRequirements],
    mcp: { title: "Delegate Power", annotations: destructive },
    handler: async (runtime, input) => {
      const write = runtime.executors?.stakingWrite;
      if (!write) throw new Error("Staking write executor not configured.");
      return write.delegatePower(
        input.delegatee as `0x${string}`,
        input.percent as number,
        resolveSigner(input),
      );
    },
  },
  {
    name: "execute_undelegate_power",
    description: "Revoke delegated governance voting power. Requires humanness verification.",
    inputSchema: z.object({
      delegatee: addressSchema,
      percent: z.number().min(0).max(100),
      signer: optionalSignerSchema,
    }),
    families: ["execute"],
    surfaces: ["mcp"],
    requiresEnv: [...executeEnvRequirements],
    mcp: { title: "Undelegate Power", annotations: destructive },
    handler: async (runtime, input) => {
      const write = runtime.executors?.stakingWrite;
      if (!write) throw new Error("Staking write executor not configured.");
      return write.undelegatePower(
        input.delegatee as `0x${string}`,
        input.percent as number,
        resolveSigner(input),
      );
    },
  },
  {
    name: "prepare_stake",
    description: "Prepare unsigned stake CELO flow for wallet signing.",
    inputSchema: z.object({
      from: optionalWalletAddressSchema,
      group_address: addressSchema,
      amount: z.string(),
    }),
    families: ["prepare"],
    surfaces: ["browser"],
    handler: async (runtime, input) => {
      const from = resolveWalletFromRuntime(runtime, {
        from: input.from as string | undefined,
      });
      return runtime.celina.staking.prepareStake(
        from,
        input.group_address as `0x${string}`,
        input.amount as string,
      );
    },
  },
  {
    name: "prepare_activate_stake",
    description: "Prepare unsigned activate stake flow for wallet signing.",
    inputSchema: z.object({
      from: optionalWalletAddressSchema,
      group_address: addressSchema,
    }),
    families: ["prepare"],
    surfaces: ["browser"],
    handler: async (runtime, input) => {
      const from = resolveWalletFromRuntime(runtime, {
        from: input.from as string | undefined,
      });
      return runtime.celina.staking.prepareActivateStake(
        from,
        input.group_address as `0x${string}`,
      );
    },
  },
  {
    name: "prepare_unstake",
    description: "Prepare unsigned unstake flow for wallet signing.",
    inputSchema: z.object({
      from: optionalWalletAddressSchema,
      group_address: addressSchema,
      amount: z.string(),
    }),
    families: ["prepare"],
    surfaces: ["browser"],
    handler: async (runtime, input) => {
      const from = resolveWalletFromRuntime(runtime, {
        from: input.from as string | undefined,
      });
      return runtime.celina.staking.prepareUnstake(
        from,
        input.group_address as `0x${string}`,
        input.amount as string,
      );
    },
  },
  {
    name: "prepare_delegate_power",
    description: "Prepare unsigned delegate governance power flow for wallet signing.",
    inputSchema: z.object({
      from: optionalWalletAddressSchema,
      delegatee: addressSchema,
      percent: z.number().min(0).max(100),
    }),
    families: ["prepare"],
    surfaces: ["browser"],
    handler: async (runtime, input) => {
      const from = resolveWalletFromRuntime(runtime, {
        from: input.from as string | undefined,
      });
      return runtime.celina.staking.prepareDelegatePower(
        from,
        input.delegatee as `0x${string}`,
        input.percent as number,
      );
    },
  },
  {
    name: "prepare_undelegate_power",
    description: "Prepare unsigned undelegate governance power flow for wallet signing.",
    inputSchema: z.object({
      from: optionalWalletAddressSchema,
      delegatee: addressSchema,
      percent: z.number().min(0).max(100),
    }),
    families: ["prepare"],
    surfaces: ["browser"],
    handler: async (runtime, input) => {
      const from = resolveWalletFromRuntime(runtime, {
        from: input.from as string | undefined,
      });
      return runtime.celina.staking.prepareUndelegatePower(
        from,
        input.delegatee as `0x${string}`,
        input.percent as number,
      );
    },
  },
];
