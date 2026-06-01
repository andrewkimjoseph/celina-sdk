import { describe, expect, it } from "vitest";
import { MCP_TOOL_EVENT_BY_SDK_METHOD } from "../../src/analytics/mcp-tool-events.js";

describe("MCP_TOOL_EVENT_BY_SDK_METHOD", () => {
  it("maps blockchain reads to MCP tool names", () => {
    expect(MCP_TOOL_EVENT_BY_SDK_METHOD["blockchain.getNetworkStatus"]).toBe(
      "get_network_status",
    );
    expect(MCP_TOOL_EVENT_BY_SDK_METHOD["account.getAccount"]).toBe(
      "get_account",
    );
  });

  it("includes Self read tools", () => {
    expect(MCP_TOOL_EVENT_BY_SDK_METHOD["self.verifySelfAgent"]).toBe(
      "verify_self_agent",
    );
    expect(MCP_TOOL_EVENT_BY_SDK_METHOD["token.getStablecoinBalances"]).toBe(
      "get_stablecoin_balances",
    );
  });

  it("does not include prepare or write operations", () => {
    expect(MCP_TOOL_EVENT_BY_SDK_METHOD["transaction.prepareSend"]).toBeUndefined();
    expect(MCP_TOOL_EVENT_BY_SDK_METHOD["self.registerSelfAgent"]).toBeUndefined();
  });
});
