import { describe, expect, it } from "vitest";
import { z } from "zod";
import { ALL_TOOL_DEFINITIONS } from "../../src/tools/catalog.js";
import { filterToolDefinitions } from "../../src/tools/filter.js";
import { optionalWalletAddressSchema } from "../../src/tools/schemas/common.js";
import { requireWalletParamsInInputSchema } from "../../src/tools/schemas/wallet-params.js";

describe("requireWalletParamsInInputSchema", () => {
  it("makes optional wallet address fields required", () => {
    const schema = z.object({
      address: optionalWalletAddressSchema,
      tokens: z.array(z.string()).optional(),
    });
    const adapted = requireWalletParamsInInputSchema(schema);
    expect(adapted.safeParse({}).success).toBe(false);
    expect(
      adapted.safeParse({
        address: "0xC1C860804EFdA544fe79194d1a37e60b846CEdeb",
      }).success,
    ).toBe(true);
  });
});

describe("hosted MCP wallet params", () => {
  const hostedOptions = {
    surface: "mcp" as const,
    serverKeyToolsEnabled: false,
    carbonExecuteEnabled: false,
    selfSessionToolsEnabled: false,
    estimateToolsEnabled: false,
  };

  it("keeps from optional on get_mento_fx_quote", () => {
    const def = filterToolDefinitions(ALL_TOOL_DEFINITIONS, hostedOptions).find(
      (tool) => tool.name === "get_mento_fx_quote",
    );

    expect(def).toBeDefined();
    expect(
      def!.inputSchema.safeParse({
        token_in: "USDm",
        token_out: "EURm",
        amount: "1",
      }).success,
    ).toBe(true);
    expect(
      def!.inputSchema.safeParse({
        token_in: "USDm",
        token_out: "EURm",
        amount: "1",
        from: "0xC1C860804EFdA544fe79194d1a37e60b846CEdeb",
      }).success,
    ).toBe(true);
  });

  it("requires address on get_celo_balances when serverKeyToolsEnabled is false", () => {
    const def = filterToolDefinitions(ALL_TOOL_DEFINITIONS, hostedOptions).find(
      (tool) => tool.name === "get_celo_balances",
    );

    expect(def).toBeDefined();
    expect(def!.inputSchema.safeParse({}).success).toBe(false);
    expect(
      def!.inputSchema.safeParse({
        address: "0xC1C860804EFdA544fe79194d1a37e60b846CEdeb",
      }).success,
    ).toBe(true);
  });

  it("requires wallet_address or strategy_id on get_carbon_activity when hosted", () => {
    const def = filterToolDefinitions(ALL_TOOL_DEFINITIONS, hostedOptions).find(
      (tool) => tool.name === "get_carbon_activity",
    );

    expect(def).toBeDefined();
    expect(def!.inputSchema.safeParse({}).success).toBe(false);
    expect(
      def!.inputSchema.safeParse({
        wallet_address: "0xC1C860804EFdA544fe79194d1a37e60b846CEdeb",
      }).success,
    ).toBe(true);
    expect(def!.inputSchema.safeParse({ strategy_id: "9186" }).success).toBe(
      true,
    );
  });
});
