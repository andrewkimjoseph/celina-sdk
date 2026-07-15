import type { Abi } from "viem";
import { z } from "zod";
import {
  abiSchema,
  addressSchema,
  optionalWalletAddressSchema,
} from "../schemas/common.js";
import type { ToolDefinition } from "../types.js";
import { resolveWalletFromRuntime } from "../utils/wallet.js";

const contractWriteInputSchema = z.object({
  contract_address: addressSchema,
  function_name: z.string().min(1),
  abi: abiSchema,
  function_args: z.array(z.unknown()).optional(),
  value: z.string().optional(),
});

export const contractToolDefinitions: ToolDefinition[] = [
  {
    name: "call_contract_function",
    description:
      "Calls a read-only contract function. Requires caller-supplied ABI JSON.",
    inputSchema: z.object({
      contract_address: addressSchema,
      function_name: z.string().min(1),
      abi: abiSchema,
      function_args: z.array(z.unknown()).optional(),
      from_address: optionalWalletAddressSchema,
    }),
    families: ["read"],
    mcp: {
      title: "Call Contract Function",
      annotations: { readOnlyHint: true, idempotentHint: true },
    },
    handler: async (runtime, input) => {
      const from = input.from_address
        ? resolveWalletFromRuntime(runtime, {
            address: input.from_address as string,
          })
        : undefined;
      return runtime.celina.contract.callFunction({
        contractAddress: input.contract_address as `0x${string}`,
        functionName: input.function_name as string,
        abi: input.abi as unknown as Abi,
        functionArgs: input.function_args as unknown[] | undefined,
        fromAddress: from,
      });
    },
  },
  {
    name: "estimate_contract_gas",
    description:
      "Estimates gas for a contract function call. Requires caller-supplied ABI JSON. Call before execute_contract_function when possible.",
    inputSchema: z.object({
      contract_address: addressSchema,
      function_name: z.string().min(1),
      abi: abiSchema,
      function_args: z.array(z.unknown()).optional(),
      value: z.string().optional(),
      from: optionalWalletAddressSchema,
      from_address: optionalWalletAddressSchema,
    }),
    families: ["read"],
    mcp: { title: "Estimate Contract Gas", annotations: { readOnlyHint: true } },
    handler: async (runtime, input) => {
      const fromField =
        (input.from as string | undefined) ??
        (input.from_address as string | undefined);
      const from = resolveWalletFromRuntime(runtime, {
        from: fromField,
        address: fromField,
      });
      return runtime.celina.contract.estimateGas({
        contractAddress: input.contract_address as `0x${string}`,
        functionName: input.function_name as string,
        abi: input.abi as unknown as Abi,
        functionArgs: input.function_args as unknown[] | undefined,
        fromAddress: from,
        value: input.value as string | undefined,
      });
    },
  },
  {
    name: "execute_contract_function",
    description:
      "Calls a state-changing contract function and broadcasts the transaction. Requires caller-supplied ABI JSON and CELO_PRIVATE_KEY. Prefer estimate_contract_gas first. Optional value is wei as a decimal string.",
    inputSchema: contractWriteInputSchema,
    families: ["execute"],
    surfaces: ["mcp"],
    requiresEnv: ["CELO_PRIVATE_KEY"],
    mcp: {
      title: "Execute Contract Function",
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    handler: async (runtime, input) => {
      const contract = runtime.executors?.contract;
      if (!contract) throw new Error("Contract executor not configured.");
      return contract.executeFunction({
        contractAddress: input.contract_address as `0x${string}`,
        functionName: input.function_name as string,
        abi: input.abi as unknown as Abi,
        functionArgs: input.function_args as unknown[] | undefined,
        value: input.value as string | undefined,
      });
    },
  },
  {
    name: "prepare_contract_function",
    description:
      "Prepare an unsigned contract write (caller ABI). User signs in wallet. Prefer estimate_contract_gas first. Optional value is wei as a decimal string.",
    inputSchema: contractWriteInputSchema.extend({
      from: optionalWalletAddressSchema,
    }),
    families: ["prepare"],
    surfaces: ["browser"],
    handler: async (runtime, input) => {
      const sender = resolveWalletFromRuntime(runtime, {
        from: input.from as string | undefined,
      });
      return runtime.celina.contract.prepareFunction(sender, {
        contractAddress: input.contract_address as `0x${string}`,
        functionName: input.function_name as string,
        abi: input.abi as unknown as Abi,
        functionArgs: input.function_args as unknown[] | undefined,
        value: input.value as string | undefined,
      });
    },
  },
];
