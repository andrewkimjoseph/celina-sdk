import { describe, expect, it } from "vitest";
import { httpRequestPathSchema } from "../../src/tools/schemas/common.js";

describe("httpRequestPathSchema", () => {
  it("accepts HTTP paths and canonicalizes full URLs", () => {
    expect(httpRequestPathSchema.parse("/api/foo")).toBe("/api/foo");
    expect(
      httpRequestPathSchema.parse(
        "https://app.ai.self.xyz/api/demo/verify?network=celo-mainnet",
      ),
    ).toBe("/api/demo/verify?network=celo-mainnet");
  });

  it("rejects path traversal segments", () => {
    expect(() => httpRequestPathSchema.parse("../../../etc/passwd")).toThrow();
    expect(() => httpRequestPathSchema.parse("/api/../secret")).toThrow();
  });
});
