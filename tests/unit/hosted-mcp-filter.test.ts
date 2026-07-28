import { describe, expect, it } from "vitest";
import { ALL_TOOL_DEFINITIONS, getToolDefinition } from "../../src/tools/catalog.js";
import { toolRequiresWalletInput, filterToolDefinitions } from "../../src/tools/filter.js";
import {
  getHostedMcpToolNames,
  HOSTED_MCP_FILTER,
} from "../../src/tools/website-sync.js";

describe("hosted MCP filter", () => {
  it("excludes wallet-input tools including get_gooddollar_identity_link", () => {
    const names = getHostedMcpToolNames();

    expect(names).not.toContain("get_gooddollar_identity_link");
    expect(names).not.toContain("get_celo_balances");
    expect(names).not.toContain("check_humanness");
    expect(names).not.toContain("call_contract_function");
  });

  it("keeps wallet-free reads and quote tools", () => {
    const names = getHostedMcpToolNames();

    expect(names).toContain("get_network_status");
    expect(names).toContain("get_mento_fx_quote");
    expect(names).toContain("get_uniswap_quote");
    expect(names).toContain("get_gooddollar_reserve_quote");
    expect(names).toContain("verify_self_agent");
  });

  it("matches HOSTED_MCP_FILTER profile", () => {
    const filtered = filterToolDefinitions(ALL_TOOL_DEFINITIONS, HOSTED_MCP_FILTER).map(
      (d) => d.name,
    );
    expect(filtered).toEqual(getHostedMcpToolNames());
    expect(filtered).toHaveLength(23);
  });

  it("treats quote tools as wallet-free even when from is optional", () => {
    expect(toolRequiresWalletInput(getToolDefinition("get_mento_fx_quote")!)).toBe(false);
    expect(toolRequiresWalletInput(getToolDefinition("get_gooddollar_identity_link")!)).toBe(
      true,
    );
  });
});
