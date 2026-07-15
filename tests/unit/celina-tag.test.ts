import { describe, expect, it } from "vitest";
import { fromDataSuffix } from "@celo/attribution-tags";
import {
  appendCelinaCalldataTag,
  buildErc8021AttributionSuffix,
  checkAttributionInCalldata,
  collectAttributionTags,
  normalizeAttributionTags,
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
  });

  it("maps ERC-8021 codes to lowercase with celina platform code", () => {
    expect(toErc8021AttributionCodes(["celo_862c21dd97a7", "celeste_ai"])).toEqual([
      "celina",
      "celo_862c21dd97a7",
      "celeste_ai",
    ]);
    expect(toErc8021AttributionCodes()).toEqual(["celina"]);
  });

  it("appends ERC-8021 attribution suffix", () => {
    const baseData = "0xabcdef" as const;
    const tagged = appendCelinaCalldataTag(baseData, [
      "celo_862c21dd97a7",
      "celeste_ai",
    ]);

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

  it("replaces a mismatched ERC-8021 suffix with the expected codes", () => {
    const baseData = "0xabcdef" as const;
    const withOldTags = appendCelinaCalldataTag(baseData, ["old_tag"]);
    const updated = appendCelinaCalldataTag(withOldTags, ["new_tag"]);

    expect(fromDataSuffix(updated)?.codes).toEqual(["celina", "new_tag"]);
  });

  it("verifies attribution tags in calldata", () => {
    const tagged = appendCelinaCalldataTag("0xabcdef", ["celo_862c21dd97a7"]);
    expect(verifyAttributionInCalldata(tagged, "celo_862c21dd97a7").matched).toBe(
      true,
    );
    expect(verifyAttributionInCalldata(tagged, "missing_tag").matched).toBe(false);
  });

  it("collects custom tags excluding platform celina", () => {
    expect(
      collectAttributionTags(["celina", "celo_862c21dd97a7", "celeste_ai"]),
    ).toEqual(["celo_862c21dd97a7", "CELESTE_AI"]);
    expect(collectAttributionTags(["celina"])).toEqual([]);
    expect(collectAttributionTags(null)).toEqual([]);
  });

  it("checks attribution with unified custom tags list (ERC-8021 write)", () => {
    const tagged = appendCelinaCalldataTag("0xabcdef", [
      "celo_862c21dd97a7",
      "celeste_ai",
    ]);
    const all = checkAttributionInCalldata(tagged);
    expect(all.tags).toEqual(["celo_862c21dd97a7", "CELESTE_AI"]);
    expect(all.matched).toBe(true);
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

  it("decodes ERC-8021 attribution when followed by trailing bytes", () => {
    const tagged = appendCelinaCalldataTag("0xabcdef", ["goclaim"]);
    const embedded = `${tagged}${"00".repeat(40)}` as `0x${string}`;

    const tip = checkAttributionInCalldata(tagged);
    const mid = checkAttributionInCalldata(embedded);

    expect(tip).toEqual({
      erc8021: { codes: ["celina", "goclaim"], schemaId: 0 },
      matched: true,
      tags: ["GOCLAIM"],
    });
    expect(mid).toEqual(tip);
  });

  it("reports no attribution when ERC-8021 cannot be parsed", () => {
    const noAttribution = "0xabcdefdeadbeef" as `0x${string}`;
    const checked = checkAttributionInCalldata(noAttribution);
    expect(checked.erc8021).toBeNull();
    expect(checked.tags).toEqual([]);
    expect(checked.matched).toBe(false);
  });

  it("buildErc8021AttributionSuffix stays a valid standalone helper", () => {
    expect(buildErc8021AttributionSuffix()).toEqual(
      buildErc8021AttributionSuffix([]),
    );
  });
});
