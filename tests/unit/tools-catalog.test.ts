import { describe, expect, it } from "vitest";
import {
  ALL_TOOL_DEFINITIONS,
  getBrowserToolNames,
  getMcpToolNames,
  validateToolCatalogSnakeCase,
} from "../../src/tools/catalog.js";

describe("tools catalog", () => {
  it("uses snake_case input keys", () => {
    expect(() => validateToolCatalogSnakeCase()).not.toThrow();
  });

  it("exposes MCP and browser surfaces", () => {
    expect(getMcpToolNames().length).toBeGreaterThan(50);
    expect(getBrowserToolNames().length).toBeGreaterThan(30);
    expect(getBrowserToolNames()).toContain("get_swap_quote");
    expect(getBrowserToolNames()).not.toContain("send_token");
  });

  it("has unique tool names", () => {
    const names = ALL_TOOL_DEFINITIONS.map((d) => d.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("hosted MCP profile omits server-key, Self session, and estimate tools", () => {
    const hosted = getMcpToolNames({
      carbonExecuteEnabled: false,
      serverKeyToolsEnabled: false,
      selfSessionToolsEnabled: false,
      estimateToolsEnabled: false,
    });
    expect(hosted).toHaveLength(54);
    expect(hosted).not.toContain("send_token");
    expect(hosted).not.toContain("get_wallet_address");
    expect(hosted).not.toContain("register_self_agent");
    expect(hosted).not.toContain("estimate_send");
    expect(hosted).not.toContain("execute_carbon_limit_order");
    expect(hosted).toContain("prepare_carbon_limit_order");
    expect(hosted).toContain("get_mento_fx_quote");
  });
});
