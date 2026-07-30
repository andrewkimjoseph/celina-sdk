import { describe, expect, it } from "vitest";
import {
  SELF_OFAC_CHECK_DEFINITIONS,
  formatCredentialsSummary,
  formatSelfCredentials,
  parseSelfOfacScreening,
} from "../../src/utils/self-format.js";

const expectedChecks = (
  clears: [boolean, boolean, boolean],
) =>
  SELF_OFAC_CHECK_DEFINITIONS.map(({ list, label, index }) => ({
    list,
    label,
    clear: clears[index],
  }));

describe("parseSelfOfacScreening", () => {
  it("maps all three true to ofac_clear and labeled ofac_checks", () => {
    expect(parseSelfOfacScreening([true, true, true])).toEqual({
      ofac_clear: true,
      ofac_screened: true,
      ofac_checks: expectedChecks([true, true, true]),
    });
  });

  it("maps all false to not screened and not clear", () => {
    expect(parseSelfOfacScreening([false, false, false])).toEqual({
      ofac_clear: false,
      ofac_screened: false,
      ofac_checks: expectedChecks([false, false, false]),
    });
  });

  it("fails ofac_clear when only the first flag is true", () => {
    expect(parseSelfOfacScreening([true, false, false]).ofac_clear).toBe(false);
    expect(parseSelfOfacScreening([true, false, false]).ofac_screened).toBe(true);
    expect(parseSelfOfacScreening([true, false, false]).ofac_checks).toEqual(
      expectedChecks([true, false, false]),
    );
  });
});

describe("formatSelfCredentials", () => {
  it("normalizes nationality and older_than", () => {
    expect(
      formatSelfCredentials({
        nationality: "KEN",
        olderThan: 18,
        ofac: [true, true, true],
      }),
    ).toEqual({
      nationality: "KEN",
      older_than: 18,
      ofac_clear: true,
      ofac_screened: true,
      ofac_checks: expectedChecks([true, true, true]),
    });
  });
});

describe("formatCredentialsSummary", () => {
  it("includes OFAC clear only when all three screening flags pass", () => {
    expect(
      formatCredentialsSummary({
        nationality: "KEN",
        older_than: 18,
        ofac_clear: true,
      }),
    ).toContain("OFAC clear");

    expect(
      formatCredentialsSummary({
        nationality: "KEN",
        older_than: 18,
        ofac: [true, false, false],
      }),
    ).toContain("OFAC not fully clear");
    expect(
      formatCredentialsSummary({
        nationality: "KEN",
        older_than: 18,
        ofac: [true, false, false],
      }),
    ).not.toContain("OFAC clear");
  });
});
