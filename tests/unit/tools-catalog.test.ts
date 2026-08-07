import { describe, expect, it } from "vitest";
import { MCP_OPERATIONS } from "../catalog/operations.js";
import type { MainnetFixtures } from "../fixtures/mainnet.js";
import { MAINNET_STATIC } from "../fixtures/mainnet.js";
import {
  ALL_TOOL_DEFINITIONS,
  assertSnakeCaseRecordKeys,
  getBrowserToolNames,
  getMcpToolNames,
  getToolDefinition,
  getToolInputSchemaShape,
  validateToolCatalogSnakeCase,
} from "../../src/tools/catalog.js";

const mockMcpFixtures: MainnetFixtures = {
  ...MAINNET_STATIC,
  knownTxHash: `0x${"a".repeat(64)}`,
  latestBlockNumber: 1n,
  signerAddress: MAINNET_STATIC.wallet,
};

describe("tools catalog", () => {
  it("uses snake_case input keys", () => {
    expect(() => validateToolCatalogSnakeCase()).not.toThrow();
  });

  it("uses snake_case MCP catalog arguments that match tool inputSchema keys", () => {
    for (const spec of MCP_OPERATIONS) {
      const definition = getToolDefinition(spec.mcp.tool);
      expect(definition, `missing tool ${spec.mcp.tool}`).toBeDefined();

      const args = spec.mcp.arguments(mockMcpFixtures);
      const argKeys = Object.keys(args);
      expect(() =>
        assertSnakeCaseRecordKeys(spec.mcp.tool, argKeys),
      ).not.toThrow();

      const shape = getToolInputSchemaShape(definition!);
      if (shape) {
        for (const key of argKeys) {
          expect(shape, `${spec.id}: stray MCP argument "${key}"`).toHaveProperty(
            key,
          );
        }
      }
    }
  });

  it("exposes MCP and browser surfaces", () => {
    expect(getMcpToolNames().length).toBeGreaterThan(30);
    expect(getBrowserToolNames().length).toBeGreaterThan(20);
    expect(getBrowserToolNames()).toContain("get_swap_quote");
    expect(getBrowserToolNames()).not.toContain("send_token");
  });

  it("has unique tool names", () => {
    const names = ALL_TOOL_DEFINITIONS.map((d) => d.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("hosted MCP profile omits server-key, Self session, and estimate tools", () => {
    const hosted = getMcpToolNames({
      serverKeyToolsEnabled: false,
      selfSessionToolsEnabled: false,
      estimateToolsEnabled: false,
    });
    expect(hosted).toHaveLength(45);
    expect(hosted).not.toContain("send_token");
    expect(hosted).not.toContain("get_wallet_address");
    expect(hosted).not.toContain("register_self_agent");
    expect(hosted).not.toContain("estimate_send");
    expect(hosted).toContain("get_mento_fx_quote");
  });
});
