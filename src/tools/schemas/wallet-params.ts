import { z } from "zod";
import {
  requiredWalletAddressSchema,
  WALLET_PARAM_KEYS,
} from "./common.js";

export type RequireWalletParamsOptions = {
  /** Quote tools stay wallet-free; do not promote optional `from`. */
  toolName?: string;
};

/** Require explicit wallet params when no MCP server signer is configured (hosted MCP). */
export function requireWalletParamsInInputSchema(
  schema: z.ZodTypeAny,
  options: RequireWalletParamsOptions = {},
): z.ZodTypeAny {
  if (!(schema instanceof z.ZodObject)) {
    return schema;
  }

  const skipFrom = options.toolName?.endsWith("_quote") ?? false;
  const shape = { ...schema.shape };
  let changed = false;

  for (const key of WALLET_PARAM_KEYS) {
    if (skipFrom && key === "from") {
      continue;
    }
    if (!(key in shape)) {
      continue;
    }
    const field = shape[key];
    if (field instanceof z.ZodOptional) {
      shape[key] = requiredWalletAddressSchema;
      changed = true;
    }
  }

  return changed ? z.object(shape) : schema;
}
