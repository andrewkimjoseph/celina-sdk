import { describe, expect, it } from "vitest";
import { blockIdSchema } from "../../src/tools/schemas/common.js";

describe("blockIdSchema", () => {
  it("accepts latest and pending with surrounding whitespace", () => {
    expect(blockIdSchema.parse("latest")).toBe("latest");
    expect(blockIdSchema.parse(" latest")).toBe("latest");
    expect(blockIdSchema.parse("pending ")).toBe("pending");
  });

  it("coerces decimal block numbers from strings", () => {
    expect(blockIdSchema.parse("69290035")).toBe(69290035);
    expect(blockIdSchema.parse(" 42 ")).toBe(42);
  });

  it("accepts block hashes", () => {
    expect(blockIdSchema.parse("0xabc")).toBe("0xabc");
  });
});
