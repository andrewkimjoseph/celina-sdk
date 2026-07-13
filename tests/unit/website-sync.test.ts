import { describe, expect, it } from "vitest";
import { getHostedMcpToolCount, getMcpToolNameSet, toWebsiteToolBaseline } from "../../src/tools/website-sync.js";
import { getToolDefinition } from "../../src/tools/catalog.js";

describe("website-sync", () => {
  it("maps GoodDollar identity link tool to website baseline", () => {
    const def = getToolDefinition("get_gooddollar_identity_link");
    expect(def).toBeDefined();
    const baseline = toWebsiteToolBaseline(def!);
    expect(baseline.category).toBe("GoodDollar");
    expect(baseline.slug).toBe("get-gooddollar-identity-link");
  });

  it("hosted MCP tool count matches catalog filter profile", () => {
    expect(getHostedMcpToolCount()).toBe(35);
  });

  it("MCP tool name set includes identity link", () => {
    expect(getMcpToolNameSet().has("get_gooddollar_identity_link")).toBe(true);
  });
});
