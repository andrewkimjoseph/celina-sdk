import { describe, expect, it } from "vitest";
import { fromDataSuffix } from "@celo/attribution-tags";
import { stringToHex } from "viem";
import {
  appendCelinaCalldataTag,
  buildCelinaAttributionTag,
  normalizeAttributionTags,
  parseCelinaLegacyAttributionSuffix,
  toErc8021AttributionCodes,
  verifyAttributionInCalldata,
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

  it("maps ERC-8021 codes to lowercase with celina platform code", () => {
    expect(toErc8021AttributionCodes(["celo_862c21dd97a7", "celeste_ai"])).toEqual([
      "celina",
      "celo_862c21dd97a7",
      "celeste_ai",
    ]);
    expect(toErc8021AttributionCodes()).toEqual(["celina"]);
  });

  it("builds attribution string with CELINA prefix", () => {
    expect(buildCelinaAttributionTag()).toBe("CELINA");
    expect(buildCelinaAttributionTag(["celeste_ai", "session_x"])).toBe(
      "CELINA|CELESTE_AI|SESSION_X",
    );
  });

  it("appends dual legacy and ERC-8021 suffixes", () => {
    const baseData = "0xabcdef" as const;
    const tagged = appendCelinaCalldataTag(baseData, [
      "celo_862c21dd97a7",
      "celeste_ai",
    ]);

    const legacySuffix = stringToHex("CELINA|celo_862c21dd97a7|CELESTE_AI").slice(2);
    expect(tagged.toLowerCase().includes(legacySuffix.toLowerCase())).toBe(true);

    const erc8021 = fromDataSuffix(tagged);
    expect(erc8021).toEqual({
      codes: ["celina", "celo_862c21dd97a7", "celeste_ai"],
      schemaId: 0,
    });
  });

  it("appends custom suffix once and avoids double-append", () => {
    const baseData = "0xabcdef" as const;
    const once = appendCelinaCalldataTag(baseData, ["celeste_ai"]);
    expect(appendCelinaCalldataTag(once, ["celeste_ai"])).toBe(once);
  });

  it("upgrades legacy-only calldata with ERC-8021 suffix", () => {
    const baseData = "0xabcdef" as const;
    const legacyOnly = `${baseData}${stringToHex("CELINA|celo_862c21dd97a7").slice(2)}` as const;
    const upgraded = appendCelinaCalldataTag(legacyOnly, ["celo_862c21dd97a7"]);

    expect(parseCelinaLegacyAttributionSuffix(upgraded)).toEqual([
      "CELINA",
      "celo_862c21dd97a7",
    ]);
    expect(fromDataSuffix(upgraded)?.codes).toContain("celo_862c21dd97a7");
  });

  it("verifies attribution tags in calldata", () => {
    const tagged = appendCelinaCalldataTag("0xabcdef", ["celo_862c21dd97a7"]);
    expect(verifyAttributionInCalldata(tagged, "celo_862c21dd97a7").matched).toBe(
      true,
    );
    expect(verifyAttributionInCalldata(tagged, "missing_tag").matched).toBe(false);
  });
});
