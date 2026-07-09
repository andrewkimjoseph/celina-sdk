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

  it("preserves lowercase Celo Builders attribution tags", () => {
    expect(normalizeAttributionTags(["celo_862c21dd97a7"])).toEqual([
      "celo_862c21dd97a7",
    ]);
    expect(normalizeAttributionTags(["CELO_862C21DD97A7", "celo_862c21dd97a7"])).toEqual([
      "celo_862c21dd97a7",
    ]);
  });

  it("keeps app tags uppercase alongside lowercase builders tags", () => {
    expect(
      normalizeAttributionTags(["celo_862c21dd97a7", "celeste_ai"]),
    ).toEqual(["celo_862c21dd97a7", "CELESTE_AI"]);
    expect(
      buildCelinaAttributionTag(["celo_862c21dd97a7", "celeste_ai"]),
    ).toBe("CELINA|celo_862c21dd97a7|CELESTE_AI");
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

  it("appends lowercase builders tag suffix without uppercasing hex", () => {
    const baseData = "0xabcdef" as const;
    const tagged = appendCelinaCalldataTag(baseData, ["celo_862c21dd97a7"]);
    const expectedSuffix = stringToHex("CELINA|celo_862c21dd97a7").slice(2);
    expect(tagged.endsWith(expectedSuffix)).toBe(true);
  });
});
