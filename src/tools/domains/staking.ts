import { z } from "zod";
import {
  addressSchema,
  optionalBoundedPositiveInt,
  optionalWalletAddressSchema,
  paginationFields,
} from "../schemas/common.js";
import type { ToolDefinition } from "../types.js";
import { resolveWalletFromRuntime } from "../utils/wallet.js";

const readOnly = {
  readOnlyHint: true,
  idempotentHint: true,
} as const;

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
];
