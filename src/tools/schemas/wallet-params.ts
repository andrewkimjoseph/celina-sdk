import { z } from "zod";
import {
  requiredWalletAddressSchema,
  WALLET_PARAM_KEYS,
} from "./common.js";

export type RequireWalletParamsOptions = {
  /** Quote tools stay wallet-free; do not promote optional `from`. */
  toolName?: string;
  /** Hosted MCP: wallet optional when any of these fields is provided instead. */
  walletAlternatives?: readonly string[];
};

function hasNonEmptyField(data: Record<string, unknown>, key: string): boolean {
  const value = data[key];
  return value !== undefined && value !== null && value !== "";
}

/** Require explicit wallet params when no MCP server signer is configured (hosted MCP). */
export function requireWalletParamsInInputSchema(
  schema: z.ZodTypeAny,
  options: RequireWalletParamsOptions = {},
): z.ZodTypeAny {
  if (!(schema instanceof z.ZodObject)) {
    return schema;
  }

  const skipFrom = options.toolName?.endsWith("_quote") ?? false;
  const walletAlternatives = options.walletAlternatives ?? [];
  const useWalletOrAlternatives = walletAlternatives.length > 0;
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
      if (useWalletOrAlternatives) {
        continue;
      }
      shape[key] = requiredWalletAddressSchema;
      changed = true;
    }
  }

  const passthrough = schema._def.unknownKeys === "passthrough";
  let result: z.ZodTypeAny = changed
    ? passthrough
      ? z.object(shape).passthrough()
      : z.object(shape)
    : schema;

  if (useWalletOrAlternatives) {
    const walletKeys = WALLET_PARAM_KEYS.filter((key) => key in shape);
    result = result.refine(
      (data) => {
        const record = data as Record<string, unknown>;
        const hasWallet = walletKeys.some((key) => hasNonEmptyField(record, key));
        const hasAlternative = walletAlternatives.some((key) =>
          hasNonEmptyField(record, key),
        );
        return hasWallet || hasAlternative;
      },
      {
        message: `Provide ${[...walletKeys, ...walletAlternatives].join(" or ")}`,
      },
    );
  }

  return result;
}
