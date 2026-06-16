import { describe, expect, it } from "vitest";
import { GENERATED_TOOL_NAMES } from "../../../celina-website/src/data/tools.generated.js";
import { getMcpToolNameSet } from "../../src/tools/website-sync.js";

describe("website tool parity", () => {
  it("website tool names match MCP catalog", () => {
    expect(new Set(GENERATED_TOOL_NAMES)).toEqual(getMcpToolNameSet());
  });
});
