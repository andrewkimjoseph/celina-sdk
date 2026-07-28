import { z } from "zod";
import { optionalWalletAddressSchema } from "../schemas/common.js";
import type { ToolDefinition } from "../types.js";
import { resolveWalletFromRuntime } from "../utils/wallet.js";

const readOnly = {
  readOnlyHint: true,
  idempotentHint: true,
} as const;

export const humannessToolDefinitions: ToolDefinition[] = [
  {
    name: "check_humanness",
    description:
      "Check whether an address passes humanness on Self Agent ID or GoodDollar IdentityV4. Pass if either rail succeeds.",
    inputSchema: z.object({
      address: optionalWalletAddressSchema,
    }),
    families: ["read"],
    mcp: { title: "Check Humanness", annotations: readOnly },
    handler: async (runtime, input) => {
      const target = resolveWalletFromRuntime(runtime, {
        address: input.address as string | undefined,
      });
      return runtime.celina.humanness.checkHumanness(target);
    },
  },
];
