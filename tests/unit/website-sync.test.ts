import { describe, expect, it } from "vitest";
import { z } from "zod";
import { getToolDefinition } from "../../src/tools/catalog.js";
import { toWebsiteToolBaseline } from "../../src/tools/website-sync.js";

describe("website-sync", () => {
  it("marks optional Zod fields as not required", () => {
    const verify = toWebsiteToolBaseline(
      getToolDefinition("verify_attribution_tag")!,
    );
    const tag = verify.inputs.find((field) => field.name === "tag");
    expect(tag?.required).toBe(false);

    const getBlock = toWebsiteToolBaseline(getToolDefinition("get_block")!);
    const includeTx = getBlock.inputs.find(
      (field) => field.name === "include_transactions",
    );
    expect(includeTx?.required).toBe(false);
  });

  it("uses Zod .describe() text for input descriptions", () => {
    const verify = toWebsiteToolBaseline(
      getToolDefinition("verify_attribution_tag")!,
    );
    const hash = verify.inputs.find((field) => field.name === "hash");
    const tag = verify.inputs.find((field) => field.name === "tag");

    expect(hash?.description).toContain("Transaction hash");
    expect(tag?.description).toContain("Optional attribution code");
  });

  it("includes check_attribution_tag in the tool catalog", () => {
    const check = toWebsiteToolBaseline(
      getToolDefinition("check_attribution_tag")!,
    );
    expect(check.name).toBe("check_attribution_tag");
    expect(check.category).toBe("Blockchain");
    expect(check.kind).toBe("read");
    const tag = check.inputs.find((field) => field.name === "tag");
    expect(tag?.required).toBe(false);
    expect(tag?.description).toContain("Omit to list all tags");
  });

  it("falls back to snake_case field names when no describe is set", () => {
    const baseline = toWebsiteToolBaseline({
      name: "test_tool",
      description: "Test tool.",
      inputSchema: z.object({
        my_field: z.string(),
      }),
      families: ["read"],
      handler: async () => ({}),
    });

    expect(baseline.inputs[0]).toMatchObject({
      name: "my_field",
      required: true,
      description: "my field",
    });
  });

  it("maps VADVVADA tools to Governance, Staking, GoodDollar, Account, and Humanness", () => {
    expect(toWebsiteToolBaseline(getToolDefinition("execute_lock_celo")!).category).toBe(
      "Governance",
    );
    expect(toWebsiteToolBaseline(getToolDefinition("execute_stake")!).category).toBe("Staking");
    expect(
      toWebsiteToolBaseline(getToolDefinition("execute_connect_gooddollar_identity")!).category,
    ).toBe("GoodDollar");
    expect(
      toWebsiteToolBaseline(getToolDefinition("execute_register_celo_account")!).category,
    ).toBe("Account");
    expect(toWebsiteToolBaseline(getToolDefinition("check_humanness")!).category).toBe(
      "Humanness",
    );
  });
});
