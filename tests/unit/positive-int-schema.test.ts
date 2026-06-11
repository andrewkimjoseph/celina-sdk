import { describe, expect, it } from "vitest";
import { positiveIntSchema } from "../../src/tools/schemas/common.js";

describe("positiveIntSchema", () => {
  it("accepts positive integers", () => {
    expect(positiveIntSchema.parse(9186)).toBe(9186);
  });

  it("coerces decimal strings from form inputs", () => {
    expect(positiveIntSchema.parse("9186")).toBe(9186);
    expect(positiveIntSchema.parse(" 42 ")).toBe(42);
  });

  it("rejects zero, negatives, and non-numeric strings", () => {
    expect(() => positiveIntSchema.parse(0)).toThrow();
    expect(() => positiveIntSchema.parse("-1")).toThrow();
    expect(() => positiveIntSchema.parse("abc")).toThrow();
  });
});
