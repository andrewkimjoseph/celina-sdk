import { z } from "zod";

export const addressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address");

export const optionalWalletAddressSchema = addressSchema
  .optional()
  .describe(
    "Wallet on Celo mainnet. Omit to use the connected wallet or MCP CELO_PRIVATE_KEY signer.",
  );

export const addressOrEnsSchema = z
  .string()
  .min(3)
  .describe(
    "Recipient 0x address or ENS name (e.g. andrewkimjoseph.celo.eth, celina.eth)",
  );

export const blockIdSchema = z.union([
  z.number().int().nonnegative(),
  z.string().regex(/^0x[a-fA-F0-9]+$/, "Invalid block hash"),
  z.literal("latest"),
  z.literal("pending"),
]);

export const tokenSymbolSchema = z
  .string()
  .describe("Celo mainnet token symbol (e.g. CELO, USDm, USDC, USDT)");

export const ensNameSchema = z
  .string()
  .min(3)
  .describe("ENS name, e.g. celina.eth or andrewkimjoseph.celo.eth");

export const tokenIdSchema = z.string().describe("NFT token ID (decimal string)");

export const abiSchema = z
  .array(z.record(z.unknown()))
  .min(1)
  .describe("Contract ABI as a JSON array");

export const paginationFields = {
  page: z.number().int().min(1).optional(),
  page_size: z.number().int().min(1).optional(),
  offset: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).optional(),
} as const;

export const hexDataSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]*$/)
  .optional()
  .describe("Optional transaction calldata (hex)");

export const carbonWriteSchema = z
  .object({
    wallet_address: optionalWalletAddressSchema,
    from: addressSchema.optional(),
  })
  .passthrough();

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
  slippage_tolerance: z
    .number()
    .min(0)
    .max(20)
    .optional()
    .describe("Max slippage in percent (default 0.5)"),
  deadline_minutes: z
    .number()
    .int()
    .positive()
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
  slippage_tolerance: z.number().min(0).max(20).optional(),
  deadline_minutes: z.number().int().positive().optional(),
});
