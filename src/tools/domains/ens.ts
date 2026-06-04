import { z } from "zod";
import { ensNameSchema } from "../schemas/common.js";
import type { ToolDefinition } from "../types.js";

export const ensToolDefinitions: ToolDefinition[] = [
  {
    name: "resolve_ens",
    description:
      "Resolve a Celo or Ethereum ENS name to an address. Defaults to Celo coin record with Ethereum fallback.",
    inputSchema: z.object({
      name: ensNameSchema,
      chain: z.enum(["celo", "ethereum"]).optional(),
    }),
    families: ["read"],
    mcp: { title: "Resolve ENS", annotations: { readOnlyHint: true, idempotentHint: true } },
    handler: async (runtime, input) =>
      runtime.celina.ens.resolveEns(
        input.name as string,
        (input.chain as "celo" | "ethereum" | undefined) ?? "celo",
      ),
  },
];
