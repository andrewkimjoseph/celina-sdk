import { describe, expect, it } from "vitest";
import { getAddress } from "viem";
import { normalizeAddress } from "../../src/utils/normalize-address.js";

describe("normalizeAddress", () => {
  it("checksums a valid lowercase address", () => {
    const input = "0x471ece3750da237f93b8e339c536989b8978a438";
    expect(normalizeAddress(input)).toBe(getAddress(input));
  });

  it("accepts already checksummed addresses", () => {
    const input = "0x471EcE3750Da237f93B8E339c536989b8978a438";
    expect(normalizeAddress(input)).toBe(input);
  });

  it("throws with a custom label for invalid input", () => {
    expect(() => normalizeAddress("not-an-address", "wallet")).toThrow(
      "Invalid wallet: not-an-address",
    );
  });
});
