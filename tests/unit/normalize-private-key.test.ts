import { describe, expect, it } from "vitest";
import { parsePrivateKeyEnv } from "../../src/utils/normalize-private-key.js";

const KEY_WITH_PREFIX =
  "0xac0974bec39a17e36ba4a6b4d15588dd6936b93c12f6f356520cf899b8d4e178";
const KEY_WITHOUT_PREFIX =
  "ac0974bec39a17e36ba4a6b4d15588dd6936b93c12f6f356520cf899b8d4e178";

describe("parsePrivateKeyEnv", () => {
  it("returns undefined for unset or blank values", () => {
    expect(parsePrivateKeyEnv(undefined, "CELO_PRIVATE_KEY")).toBeUndefined();
    expect(parsePrivateKeyEnv("", "CELO_PRIVATE_KEY")).toBeUndefined();
    expect(parsePrivateKeyEnv("   ", "CELO_PRIVATE_KEY")).toBeUndefined();
  });

  it("accepts keys with 0x prefix", () => {
    expect(parsePrivateKeyEnv(KEY_WITH_PREFIX, "CELO_PRIVATE_KEY")).toBe(
      KEY_WITH_PREFIX,
    );
  });

  it("accepts keys without 0x prefix", () => {
    expect(parsePrivateKeyEnv(KEY_WITHOUT_PREFIX, "CELO_PRIVATE_KEY")).toBe(
      KEY_WITH_PREFIX,
    );
  });

  it("accepts uppercase hex", () => {
    expect(
      parsePrivateKeyEnv(KEY_WITHOUT_PREFIX.toUpperCase(), "CELO_PRIVATE_KEY"),
    ).toBe(KEY_WITH_PREFIX);
  });

  it("throws for placeholder values", () => {
    expect(() => parsePrivateKeyEnv("0x...", "CELO_PRIVATE_KEY")).toThrow(
      /CELO_PRIVATE_KEY is set but invalid/,
    );
  });

  it("throws for wrong length", () => {
    expect(() => parsePrivateKeyEnv("0xdead", "SELF_AGENT_PRIVATE_KEY")).toThrow(
      /with or without 0x prefix/,
    );
  });
});
