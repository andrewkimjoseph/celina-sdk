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
});
