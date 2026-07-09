import { describe, expect, it } from "vitest";
import { stringToHex } from "viem";
import {
  appendCelinaCalldataTag,
  buildCelinaAttributionTag,
  normalizeAttributionTags,
} from "../../src/config/celina-tag.js";

describe("celina tag helpers", () => {
  it("normalizes tags by trimming, uppercasing, and deduping", () => {
    expect(
      normalizeAttributionTags(["  celeste_ai ", "CELINA", "", "ceLESTE_ai", "session_1"]),
    ).toEqual(["CELESTE_AI", "SESSION_1"]);
  });

  it("builds attribution string with CELINA prefix", () => {
    expect(buildCelinaAttributionTag()).toBe("CELINA");
    expect(buildCelinaAttributionTag(["celeste_ai", "session_x"])).toBe(
      "CELINA|CELESTE_AI|SESSION_X",
    );
  });

  it("appends custom suffix once and avoids double-append", () => {
    const baseData = "0xabcdef" as const;
    const once = appendCelinaCalldataTag(baseData, ["celeste_ai"]);
    const expectedSuffix = stringToHex("CELINA|CELESTE_AI").slice(2).toLowerCase();
    expect(once.toLowerCase().endsWith(expectedSuffix)).toBe(true);
    expect(appendCelinaCalldataTag(once, ["CELESTE_AI"])).toBe(once);
  });
});
