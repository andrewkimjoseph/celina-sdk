import { describe, expect, it } from "vitest";
import { formatDisplayAmount } from "../../src/services/mento-fx.service.js";

describe("formatDisplayAmount", () => {
  it("keeps short human integers for 6-decimal USDT", () => {
    expect(formatDisplayAmount("5", 6)).toBe("5");
    expect(formatDisplayAmount("100", 6)).toBe("100");
  });

  it("keeps short human integers for 18-decimal tokens", () => {
    expect(formatDisplayAmount("100", 18)).toBe("100");
  });

  it("converts long raw base-unit integers (>=10 digits)", () => {
    expect(formatDisplayAmount("1000000000000000000", 18)).toBe("1");
  });

  it("preserves approximate prefix", () => {
    expect(formatDisplayAmount("~5", 6)).toBe("~5");
  });
});
