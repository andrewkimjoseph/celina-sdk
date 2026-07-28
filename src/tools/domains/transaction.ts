import { z } from "zod";
import {
  addressOrEnsSchema,
  addressSchema,
  executeEnvRequirements,
  hexDataSchema,
  optionalSignerSchema,
  optionalWalletAddressSchema,
  tokenSymbolSchema,
} from "../schemas/common.js";
import type { ToolDefinition } from "../types.js";
import { normalizeRegistryTokenInput } from "../utils/normalize-token.js";
import { resolveWalletFromRuntime, useMcpServerExecutor } from "../utils/wallet.js";

export const transactionToolDefinitions: ToolDefinition[] = [
  {
    name: "estimate_send",
    description:
      "Estimates gas for sending CELO or an ERC-20. Recipient can be ENS. On MCP, pass signer to estimate from a specific configured wallet (celo or self_agent) — e.g. before funding a Self agent from the main wallet.",
    inputSchema: z.object({
      to: addressOrEnsSchema,
      token: tokenSymbolSchema.optional(),
      amount: z.string(),
      from: optionalWalletAddressSchema,
      signer: optionalSignerSchema,
    }),
    families: ["read"],
    mcp: { title: "Estimate Send", annotations: { readOnlyHint: true } },
    handler: async (runtime, input) => {
      const { address, ens } = await runtime.celina.ens.resolveAddressOrEns(
        input.to as string,
      );
      const token = normalizeRegistryTokenInput(
        (input.token as string | undefined) ?? "CELO",
      );
      const amount = input.amount as string;
      const from = input.from as string | undefined;
      const signer = input.signer as "celo" | "self_agent" | undefined;
      if (
        runtime.executors?.transaction &&
        (signer || useMcpServerExecutor(runtime, from))
      ) {
        const estimate = await runtime.executors.transaction.estimateSend(
          address,
          token,
          amount,
          signer,
        );
        if (ens) {
          return Object.assign({}, estimate, { ens });
        }
        return estimate;
      }
      const sender = resolveWalletFromRuntime(runtime, {
        from,
        address: from,
      });
      const estimate = await runtime.celina.transaction.estimateSend(
        sender,
        address,
        token,
        amount,
      );
      return ens ? { ...estimate, ens } : estimate;
    },
  },
  {
    name: "send_token",
    description:
      "Send CELO or an ERC-20 on mainnet. Requires CELO_PRIVATE_KEY or SELF_AGENT_PRIVATE_KEY in MCP server env. Pass signer to choose which configured wallet sends — e.g. signer: \"celo\" to fund a freshly registered Self agent with CELO before any Self-signed write (lock, stake, vote, register_celo_account).",
    inputSchema: z.object({
      to: addressOrEnsSchema,
      token: tokenSymbolSchema.optional(),
      amount: z.string(),
      signer: optionalSignerSchema,
    }),
    families: ["execute"],
    surfaces: ["mcp"],
    requiresEnv: [...executeEnvRequirements],
    mcp: {
      title: "Send Token",
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    handler: async (runtime, input) => {
      const tx = runtime.executors?.transaction;
      if (!tx) throw new Error("Transaction executor not configured.");
      const { address, ens } = await runtime.celina.ens.resolveAddressOrEns(
        input.to as string,
      );
      const signer = input.signer as "celo" | "self_agent" | undefined;
      const result = await tx.sendToken(
        address,
        normalizeRegistryTokenInput((input.token as string | undefined) ?? "CELO"),
        input.amount as string,
        signer,
      );
      return ens ? Object.assign({}, result, { ens }) : result;
    },
  },
  {
    name: "prepare_send",
    description:
      "Prepare an unsigned send transaction. User must confirm and sign in wallet.",
    inputSchema: z.object({
      to: addressOrEnsSchema,
      token: z.string(),
      amount: z.string(),
      from: optionalWalletAddressSchema,
    }),
    families: ["prepare"],
    surfaces: ["browser"],
    handler: async (runtime, input) => {
      const sender = resolveWalletFromRuntime(runtime, {
        from: input.from as string | undefined,
      });
      const token = normalizeRegistryTokenInput(input.token as string);
      const amount = input.amount as string;
      await runtime.hooks?.beforePrepareSend?.({ sender, token, amount });
      const { address } = await runtime.celina.ens.resolveAddressOrEns(
        input.to as string,
      );
      return runtime.celina.transaction.prepareSend(
        sender,
        address,
        token,
        amount,
      );
    },
  },
  {
    name: "get_gas_fee_data",
    description: "Returns current gas fee data including EIP-1559 fees on mainnet.",
    inputSchema: z.object({}),
    families: ["read"],
    mcp: {
      title: "Get Gas Fee Data",
      annotations: { readOnlyHint: true, idempotentHint: true },
    },
    handler: async (runtime) => runtime.celina.transaction.getGasFeeData(),
  },
  {
    name: "estimate_transaction",
    description:
      "Estimates gas for a generic transaction (to/value/data) from a wallet.",
    inputSchema: z.object({
      from: optionalWalletAddressSchema,
      to: addressSchema,
      value: z.string().optional(),
      data: hexDataSchema,
    }),
    families: ["read"],
    mcp: { title: "Estimate Transaction", annotations: { readOnlyHint: true } },
    handler: async (runtime, input) => {
      const sender = resolveWalletFromRuntime(runtime, {
        from: input.from as string | undefined,
        address: input.from as string | undefined,
      });
      return runtime.celina.transaction.estimateTransaction({
        from: sender,
        to: input.to as `0x${string}`,
        value: input.value as string | undefined,
        data: input.data as `0x${string}` | undefined,
      });
    },
  },
];
