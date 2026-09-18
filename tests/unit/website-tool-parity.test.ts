import { describe, expect, it } from "vitest";
import { GENERATED_TOOL_NAMES } from "../../../celina-website/src/data/tools.generated.js";
import { getWebsiteToolBaselines } from "../../src/tools/website-sync.js";

describe("website tool parity", () => {
  it("website tool names match SDK website baselines", () => {
    expect(new Set(GENERATED_TOOL_NAMES)).toEqual(
      new Set(getWebsiteToolBaselines().map((tool) => tool.name)),
    );
    expect(GENERATED_TOOL_NAMES).toContain("get_mento_swap_pairs");
    expect(GENERATED_TOOL_NAMES).toContain("get_uniswap_swap_pairs");
  });
});
