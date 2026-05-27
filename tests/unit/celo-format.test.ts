import { describe, expect, it } from "vitest";
import {
  formatAddress,
  formatCeloAmount,
  formatScorePercentage,
} from "../../src/utils/celo-format.js";

describe("celo-format", () => {
  it("formats wei as CELO", () => {
    expect(formatCeloAmount(1_000_000_000_000_000_000n)).toBe("1 CELO");
  });

  it("shortens long addresses", () => {
    expect(formatAddress("0x471EcE3750Da237f93B8E339c536989b8978a438")).toBe(
      "0x471E...a438",
    );
  });

  it("formats basis-point style scores as percentages", () => {
    expect(formatScorePercentage(12_345)).toBe("123.45%");
    expect(formatScorePercentage(12_345n)).toBe("123.45%");
  });
});
