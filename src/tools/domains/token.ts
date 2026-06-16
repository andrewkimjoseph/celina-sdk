import { z } from "zod";
import {
  optionalWalletAddressSchema,
  tokenSymbolSchema,
} from "../schemas/common.js";
import type { ToolDefinition } from "../types.js";
import { normalizeRegistryTokenInput } from "../utils/normalize-token.js";
import { resolveWalletFromRuntime } from "../utils/wallet.js";

const readOnly = {
  readOnlyHint: true,
  idempotentHint: true,
} as const;

const NON_IDENTITY_BALANCE_NOTE =
  " Reads on-chain balances for the given address only; GoodDollar connected-wallet identity is not resolved.";

export const tokenToolDefinitions: ToolDefinition[] = [
  {
    name: "get_celo_balances",
    description:
      `Balances for named registry tokens on Celo mainnet. Default tokens: CELO + USDm.${NON_IDENTITY_BALANCE_NOTE}`,
    inputSchema: z.object({
      address: optionalWalletAddressSchema,
      tokens: z.array(tokenSymbolSchema).optional(),
    }),
    families: ["read"],
    mcp: { title: "Get Celo Balances", annotations: readOnly },
    handler: async (runtime, input) => {
      const target = resolveWalletFromRuntime(runtime, {
        address: input.address as string | undefined,
      });
      return runtime.celina.token.getBalances(
        target,
        input.tokens as string[] | undefined,
      );
    },
  },
  {
    name: "get_stablecoin_balances",
    description:
      `Scan fiat-pegged registry stablecoins (Mento *m, USDT, USDC, etc.) for an address in one call. Omits zero balances by default. Excludes GoodDollar (G$) and WETH — use get_token_balance or GoodDollar tools for those.${NON_IDENTITY_BALANCE_NOTE}`,
    inputSchema: z.object({
      address: optionalWalletAddressSchema,
      stablecoins: z.array(z.string()).optional(),
      include_zero: z.boolean().optional(),
    }),
    families: ["read"],
    mcp: { title: "Get Stablecoin Balances", annotations: readOnly },
    handler: async (runtime, input) => {
      const target = resolveWalletFromRuntime(runtime, {
        address: input.address as string | undefined,
      });
      return runtime.celina.token.getStablecoinBalances(target, {
        stablecoins: input.stablecoins as string[] | undefined,
        includeZero: input.include_zero as boolean | undefined,
      });
    },
  },
  {
    name: "get_token_info",
    description:
      "Registry token metadata (symbol, address, decimals). Does not read balances.",
    inputSchema: z.object({
      token: tokenSymbolSchema,
    }),
    families: ["read"],
    mcp: { title: "Get Token Info", annotations: readOnly },
    handler: async (runtime, input) =>
      runtime.celina.token.getTokenInfo(
        normalizeRegistryTokenInput(input.token as string),
      ),
  },
  {
    name: "get_token_balance",
    description:
      `Balance for one registry token. Pass a symbol or known registry contract address.${NON_IDENTITY_BALANCE_NOTE}`,
    inputSchema: z.object({
      token: tokenSymbolSchema,
      address: optionalWalletAddressSchema,
    }),
    families: ["read"],
    mcp: { title: "Get Token Balance", annotations: readOnly },
    handler: async (runtime, input) => {
      const target = resolveWalletFromRuntime(runtime, {
        address: input.address as string | undefined,
      });
      return runtime.celina.token.getTokenBalance(
        normalizeRegistryTokenInput(input.token as string),
        target,
      );
    },
  },
];
