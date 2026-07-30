import { describe, expect, it } from "vitest";
import {
  formatCredentialsSummary,
  formatSelfCredentials,
  parseSelfOfacScreening,
} from "../../src/utils/self-format.js";

describe("parseSelfOfacScreening", () => {
  it("maps all three true to ofac_clear and labeled screening flags", () => {
    expect(parseSelfOfacScreening([true, true, true])).toEqual({
      ofac_clear: true,
      ofac_screened: true,
      ofac_screening: {
        is_on_sdn_list: true,
        is_on_consolidated_list: true,
        is_on_ofac_list: true,
      },
    });
  });

  it("maps all false to not screened and not clear", () => {
    expect(parseSelfOfacScreening([false, false, false])).toEqual({
      ofac_clear: false,
      ofac_screened: false,
      ofac_screening: {
        is_on_sdn_list: false,
        is_on_consolidated_list: false,
        is_on_ofac_list: false,
      },
    });
  });

  it("fails ofac_clear when only the first flag is true", () => {
    expect(parseSelfOfacScreening([true, false, false]).ofac_clear).toBe(false);
    expect(parseSelfOfacScreening([true, false, false]).ofac_screened).toBe(true);
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
      ofac_screening: {
        is_on_sdn_list: true,
        is_on_consolidated_list: true,
        is_on_ofac_list: true,
      },
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
