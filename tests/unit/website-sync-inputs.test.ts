import { describe, expect, it } from "vitest";
import { ALL_TOOL_DEFINITIONS } from "../../src/tools/catalog.js";
import { toWebsiteToolBaseline } from "../../src/tools/website-sync.js";

function baseline(name: string) {
  const def = ALL_TOOL_DEFINITIONS.find((tool) => tool.name === name);
  expect(def).toBeDefined();
  return toWebsiteToolBaseline(def!);
}

function input(name: string, field: string) {
  const found = baseline(name).inputs.find((entry) => entry.name === field);
  expect(found).toBeDefined();
  return found!;
}

describe("toWebsiteToolBaseline optional preprocess fields", () => {
  it("marks governance include_* as optional booleans", () => {
    expect(input("get_governance_proposals", "include_inactive")).toMatchObject({
      required: false,
      type: "boolean",
    });
    expect(input("get_governance_proposals", "include_metadata")).toMatchObject({
      required: false,
      type: "boolean",
    });
  });

  it("marks verify_self_agent require_* as optional", () => {
    expect(input("verify_self_agent", "require_age").required).toBe(false);
    expect(input("verify_self_agent", "require_ofac")).toMatchObject({
      required: false,
      type: "boolean",
    });
    expect(input("verify_self_agent", "require_self_provider")).toMatchObject({
      required: false,
      type: "boolean",
    });
    expect(input("verify_self_agent", "agent_address").required).toBe(true);
  });

  it("marks agentkarma face as optional", () => {
    expect(input("get_agentkarma_reputation", "face").required).toBe(false);
    expect(input("get_agentkarma_reputation", "address").required).toBe(true);
  });
});
