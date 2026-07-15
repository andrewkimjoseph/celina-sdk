import { describe, expect, it } from "vitest";
import { fromDataSuffix } from "@celo/attribution-tags";
import { stringToHex } from "viem";
import {
  appendCelinaCalldataTag,
  buildCelinaAttributionTag,
  buildErc8021AttributionSuffix,
  checkAttributionInCalldata,
  collectAttributionTags,
  normalizeAttributionTags,
  parseCelinaLegacyAttributionSuffix,
  toErc8021AttributionCodes,
  verifyAttributionInCalldata,
} from "../../src/config/celina-tag.js";

const CELINA_UTF8_HEX = stringToHex("CELINA").slice(2).toLowerCase();

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

  it("appends ERC-8021 only without legacy UTF-8 CELINA", () => {
    const baseData = "0xabcdef" as const;
    const tagged = appendCelinaCalldataTag(baseData, [
      "celo_862c21dd97a7",
      "celeste_ai",
    ]);

    expect(tagged.toLowerCase().includes(CELINA_UTF8_HEX)).toBe(false);
    expect(parseCelinaLegacyAttributionSuffix(tagged)).toBeNull();

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

  it("upgrades legacy-only calldata with ERC-8021 without adding more legacy", () => {
    const baseData = "0xabcdef" as const;
    const legacyOnly =
      `${baseData}${stringToHex("CELINA|celo_862c21dd97a7").slice(2)}` as const;
    const upgraded = appendCelinaCalldataTag(legacyOnly, ["celo_862c21dd97a7"]);

    expect(parseCelinaLegacyAttributionSuffix(upgraded)).toEqual([
      "CELINA",
      "celo_862c21dd97a7",
    ]);
    expect(fromDataSuffix(upgraded)?.codes).toContain("celo_862c21dd97a7");
    // Only one CELINA marker (original legacy), not a second append.
    const body = upgraded.slice(2).toLowerCase();
    const first = body.indexOf(CELINA_UTF8_HEX);
    const second = body.indexOf(CELINA_UTF8_HEX, first + CELINA_UTF8_HEX.length);
    expect(first).toBeGreaterThanOrEqual(0);
    expect(second).toBe(-1);
  });

  it("verifies attribution tags in calldata", () => {
    const tagged = appendCelinaCalldataTag("0xabcdef", ["celo_862c21dd97a7"]);
    expect(verifyAttributionInCalldata(tagged, "celo_862c21dd97a7").matched).toBe(
      true,
    );
    expect(verifyAttributionInCalldata(tagged, "missing_tag").matched).toBe(false);
  });

  it("collects custom tags excluding platform CELINA/celina", () => {
    expect(
      collectAttributionTags(
        ["CELINA", "celo_862c21dd97a7", "CELESTE_AI"],
        ["celina", "celo_862c21dd97a7", "celeste_ai"],
      ),
    ).toEqual(["celo_862c21dd97a7", "CELESTE_AI"]);
    expect(collectAttributionTags(["CELINA"], ["celina"])).toEqual([]);
    expect(collectAttributionTags(null, null)).toEqual([]);
  });

  it("checks attribution with unified custom tags list (ERC-8021 write)", () => {
    const tagged = appendCelinaCalldataTag("0xabcdef", [
      "celo_862c21dd97a7",
      "celeste_ai",
    ]);
    const all = checkAttributionInCalldata(tagged);
    expect(all.tags).toEqual(["celo_862c21dd97a7", "CELESTE_AI"]);
    expect(all.matched).toBe(true);
    expect(all.legacyTags).toBeNull();
    expect(all.erc8021?.codes).toEqual([
      "celina",
      "celo_862c21dd97a7",
      "celeste_ai",
    ]);

    expect(checkAttributionInCalldata(tagged, "celo_862c21dd97a7").matched).toBe(
      true,
    );
    expect(checkAttributionInCalldata(tagged, "missing_tag").matched).toBe(false);

    const platformOnly = appendCelinaCalldataTag("0xabcdef");
    const platform = checkAttributionInCalldata(platformOnly);
    expect(platform.tags).toEqual([]);
    expect(platform.matched).toBe(true);
  });

  it("still decodes historical dual attribution when present", () => {
    const historical =
      `0xabcdef${stringToHex("CELINA|GOCLAIM").slice(2)}${buildErc8021AttributionSuffix(["goclaim"]).slice(2)}` as `0x${string}`;

    const tip = checkAttributionInCalldata(historical);
    expect(tip.legacyTags).toEqual(["CELINA", "GOCLAIM"]);
    expect(tip.erc8021?.codes).toEqual(["celina", "goclaim"]);
    expect(tip.tags).toEqual(["GOCLAIM"]);
    expect(tip.matched).toBe(true);

    const embedded = `${historical}${"00".repeat(40)}` as `0x${string}`;
    expect(checkAttributionInCalldata(embedded)).toEqual(tip);
  });

  it("decodes ERC-8021-only when followed by trailing bytes", () => {
    const tagged = appendCelinaCalldataTag("0xabcdef", ["goclaim"]);
    const embedded = `${tagged}${"00".repeat(40)}` as `0x${string}`;

    const tip = checkAttributionInCalldata(tagged);
    const mid = checkAttributionInCalldata(embedded);

    expect(tip).toEqual({
      legacyTags: null,
      erc8021: { codes: ["celina", "goclaim"], schemaId: 0 },
      matched: true,
      tags: ["GOCLAIM"],
    });
    expect(mid).toEqual(tip);
  });

  it("legacy fallback stops before binary when ERC-8021 cannot be parsed", () => {
    const legacyAndBinary =
      `0xabcdef${stringToHex("CELINA|GOCLAIM").slice(2)}deadbeef` as `0x${string}`;
    expect(parseCelinaLegacyAttributionSuffix(legacyAndBinary)).toEqual([
      "CELINA",
      "GOCLAIM",
    ]);
    const checked = checkAttributionInCalldata(legacyAndBinary);
    expect(checked.legacyTags).toEqual(["CELINA", "GOCLAIM"]);
    expect(checked.erc8021).toBeNull();
    expect(checked.tags).toEqual(["GOCLAIM"]);
    expect(checked.matched).toBe(true);
  });
});
