import { describe, expect, it } from "vitest";
import { proposalStageName } from "../../src/abis/governance.js";

describe("proposalStageName", () => {
  it("maps known governance stages", () => {
    expect(proposalStageName(0)).toBe("None");
    expect(proposalStageName(1)).toBe("Queued");
    expect(proposalStageName(5)).toBe("Executed");
  });

  it("falls back to None for unknown stage numbers", () => {
    expect(proposalStageName(999)).toBe("None");
  });
});
