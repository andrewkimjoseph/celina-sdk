import { describe, expect, it } from "vitest";
import {
  ALL_TOOL_DEFINITIONS,
  getCelesteToolNames,
  getMcpToolNames,
  validateToolCatalogSnakeCase,
} from "../../src/tools/catalog.js";

describe("tools catalog", () => {
  it("uses snake_case input keys", () => {
    expect(() => validateToolCatalogSnakeCase()).not.toThrow();
  });

  it("exposes MCP and Celeste surfaces", () => {
    expect(getMcpToolNames().length).toBeGreaterThan(50);
    expect(getCelesteToolNames().length).toBeGreaterThan(30);
    expect(getCelesteToolNames()).toContain("get_swap_quote");
    expect(getCelesteToolNames()).not.toContain("send_token");
  });

  it("has unique tool names", () => {
    const names = ALL_TOOL_DEFINITIONS.map((d) => d.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
