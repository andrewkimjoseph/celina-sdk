import { z } from "zod";
import { canonicalizeSigningUrl } from "../../utils/self-signing.js";

export const addressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address");

export const optionalWalletAddressSchema = addressSchema
  .optional()
  .describe(
    "Wallet on Celo mainnet. Omit to use the connected wallet or MCP CELO_PRIVATE_KEY signer.",
  );

export const requiredWalletAddressSchema = addressSchema.describe(
  "Wallet on Celo mainnet (0x address).",
);

/** Input keys that default to the MCP signer when omitted on local stdio. */
export const WALLET_PARAM_KEYS = [
  "address",
  "wallet_address",
  "from",
  "from_address",
] as const;

export const addressOrEnsSchema = z
  .string()
  .min(3)
  .describe(
    "Recipient 0x address or ENS name (e.g. andrewkimjoseph.celo.eth, celina.eth)",
  );

function normalizeBlockId(value: unknown): unknown {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "latest" || trimmed === "pending") {
      return trimmed;
    }
    if (/^\d+$/.test(trimmed)) {
      return Number(trimmed);
    }
    return trimmed;
  }
  return value;
}

function normalizePositiveInt(value: unknown): unknown {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (/^\d+$/.test(trimmed)) {
      return Number(trimmed);
    }
    return trimmed;
  }
  return value;
}

function normalizeDecimalNumber(value: unknown): unknown {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
      return Number(trimmed);
    }
    return trimmed;
  }
  return value;
}

export const blockIdSchema = z.preprocess(
  normalizeBlockId,
  z.union([
    z.literal("latest"),
    z.literal("pending"),
    z.number().int().nonnegative(),
    z.string().regex(/^0x[a-fA-F0-9]+$/, "Invalid block hash"),
  ]),
);

export const positiveIntSchema = z.preprocess(
  normalizePositiveInt,
  z.number().int().positive(),
);

export const nonNegativeIntSchema = z.preprocess(
  normalizePositiveInt,
  z.number().int().min(0),
);

export const coercedNumberSchema = z.preprocess(
  normalizeDecimalNumber,
  z.number(),
);

export const slippageToleranceSchema = z.preprocess(
  normalizeDecimalNumber,
  z.number().min(0).max(20),
);

/** Optional positive integer with an upper bound (e.g. page_size caps). */
export function optionalBoundedPositiveInt(max: number) {
  return z
    .preprocess(normalizePositiveInt, z.number().int().min(1).max(max))
    .optional();
}

/** Optional positive integer with min/max (e.g. get_latest_blocks count). */
export function optionalBoundedPositiveIntRange(min: number, max: number) {
  return z
    .preprocess(normalizePositiveInt, z.number().int().min(min).max(max))
    .optional();
}

export const tokenSymbolSchema = z
  .string()
  .describe("Celo mainnet token symbol (e.g. CELO, USDm, USDC, USDT)");

export const ensNameSchema = z
  .string()
  .min(3)
  .describe("ENS name, e.g. celina.eth or andrewkimjoseph.celo.eth");

function normalizeHttpRequestPath(value: unknown): unknown {
  if (typeof value === "string") {
    return value.trim();
  }
  return value;
}

export const httpRequestPathSchema = z.preprocess(
  normalizeHttpRequestPath,
  z
    .string()
    .min(1)
    .refine(
      (s) => !s.includes(".."),
      "HTTP request path must not contain '..'",
    )
    .transform((s) => canonicalizeSigningUrl(s))
    .describe(
      "HTTP request path or URL path+query that was signed — not a filesystem path.",
    ),
);

export const tokenIdSchema = z.string().describe("NFT token ID (decimal string)");

export const abiSchema = z
  .array(z.record(z.unknown()))
  .min(1)
  .describe("Contract ABI as a JSON array");

export const paginationFields = {
  page: positiveIntSchema.optional(),
  page_size: positiveIntSchema.optional(),
  offset: nonNegativeIntSchema.optional(),
  limit: positiveIntSchema.optional(),
} as const;

export const hexDataSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]*$/)
  .optional()
  .describe("Optional transaction calldata (hex)");

export const mentoFxQuoteSchema = z.object({
  token_in: tokenSymbolSchema.describe("Input token symbol or address"),
  token_out: tokenSymbolSchema.describe("Output token symbol or address"),
  amount: z.string().describe("Human-readable amount of token_in, e.g. 100"),
  from: optionalWalletAddressSchema,
});

export const mentoFxWalletSchema = mentoFxQuoteSchema.extend({
  recipient: addressSchema
    .optional()
    .describe("Address that receives output tokens (defaults to signer)"),
  slippage_tolerance: slippageToleranceSchema
    .optional()
    .describe("Max slippage in percent (default 0.5)"),
  deadline_minutes: positiveIntSchema
    .optional()
    .describe("Transaction deadline in minutes (default 5)"),
});

export const uniswapQuoteSchema = z.object({
  token_in: tokenSymbolSchema,
  token_out: tokenSymbolSchema,
  amount: z.string().describe("Human-readable amount of token_in"),
  from: optionalWalletAddressSchema,
});

export const uniswapWalletSchema = uniswapQuoteSchema.extend({
  recipient: addressSchema.optional(),
  slippage_tolerance: slippageToleranceSchema.optional(),
  deadline_minutes: positiveIntSchema.optional(),
});

export const goodDollarReserveQuoteSchema = z.object({
  token_in: tokenSymbolSchema.describe("GoodDollar or G$"),
  token_out: tokenSymbolSchema.describe("USDm or cUSD"),
  amount: z.string().describe("Human-readable amount of token_in"),
  from: optionalWalletAddressSchema,
});

export const goodDollarReserveWalletSchema = goodDollarReserveQuoteSchema.extend({
  recipient: addressSchema.optional(),
  slippage_tolerance: slippageToleranceSchema.optional(),
});
