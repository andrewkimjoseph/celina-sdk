import { z } from "zod";
import {
  requiredWalletAddressSchema,
  WALLET_PARAM_KEYS,
} from "./common.js";

/** Require explicit wallet params when no MCP server signer is configured (hosted MCP). */
export function requireWalletParamsInInputSchema(
  schema: z.ZodTypeAny,
): z.ZodTypeAny {
  if (!(schema instanceof z.ZodObject)) {
    return schema;
  }

  const shape = { ...schema.shape };
  let changed = false;

  for (const key of WALLET_PARAM_KEYS) {
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
