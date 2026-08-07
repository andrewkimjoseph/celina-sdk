import { describe, expect, it } from "vitest";
import {
  parsePrivateKeyEnv,
  tryParsePrivateKeyEnv,
} from "../../src/utils/normalize-private-key.js";

const KEY_WITH_PREFIX =
  "0xac0974bec39a17e36ba4a6b4d15588dd6936b93c12f6f356520cf899b8d4e178";
const KEY_WITHOUT_PREFIX =
  "ac0974bec39a17e36ba4a6b4d15588dd6936b93c12f6f356520cf899b8d4e178";

describe("tryParsePrivateKeyEnv", () => {
  it("returns empty for unset values", () => {
    expect(tryParsePrivateKeyEnv(undefined, "CELO_PRIVATE_KEY")).toEqual({});
    expect(tryParsePrivateKeyEnv("  ", "CELO_PRIVATE_KEY")).toEqual({});
  });

  it("normalizes valid keys", () => {
    expect(tryParsePrivateKeyEnv(KEY_WITHOUT_PREFIX, "CELO_PRIVATE_KEY")).toEqual({
      value: KEY_WITH_PREFIX,
    });
  });

  it("returns error for invalid keys without throwing", () => {
    const result = tryParsePrivateKeyEnv("0x...", "CELO_PRIVATE_KEY");
    expect(result.value).toBeUndefined();
    expect(result.error).toMatch(/CELO_PRIVATE_KEY is set but invalid/);
  });
});

describe("parsePrivateKeyEnv", () => {
  it("throws for invalid keys", () => {
    expect(() => parsePrivateKeyEnv("0x...", "CELO_PRIVATE_KEY")).toThrow(
      /CELO_PRIVATE_KEY is set but invalid/,
    );
  });
});
