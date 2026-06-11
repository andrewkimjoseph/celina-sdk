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
  it("requires address on get_celo_balances when serverKeyToolsEnabled is false", () => {
    const def = filterToolDefinitions(ALL_TOOL_DEFINITIONS, {
      surface: "mcp",
      serverKeyToolsEnabled: false,
      carbonExecuteEnabled: false,
      selfSessionToolsEnabled: false,
      estimateToolsEnabled: false,
    }).find((tool) => tool.name === "get_celo_balances");

    expect(def).toBeDefined();
    expect(def!.inputSchema.safeParse({}).success).toBe(false);
    expect(
      def!.inputSchema.safeParse({
        address: "0xC1C860804EFdA544fe79194d1a37e60b846CEdeb",
      }).success,
    ).toBe(true);
  });
});
