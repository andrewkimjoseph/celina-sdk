import { describe, expect, it } from "vitest";
import { getToolDefinition } from "../../src/tools/catalog.js";
import {
  nonNegativeIntSchema,
  positiveIntSchema,
} from "../../src/tools/schemas/common.js";

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

describe("nonNegativeIntSchema", () => {
  it("accepts non-negative integers", () => {
    expect(nonNegativeIntSchema.parse(0)).toBe(0);
    expect(nonNegativeIntSchema.parse(295)).toBe(295);
  });

  it("coerces decimal strings from form inputs", () => {
    expect(nonNegativeIntSchema.parse("295")).toBe(295);
    expect(nonNegativeIntSchema.parse(" 0 ")).toBe(0);
  });

  it("rejects negatives and non-numeric strings", () => {
    expect(() => nonNegativeIntSchema.parse(-1)).toThrow();
    expect(() => nonNegativeIntSchema.parse("-1")).toThrow();
    expect(() => nonNegativeIntSchema.parse("abc")).toThrow();
  });
});

describe("get_proposal_details inputSchema", () => {
  it("accepts proposal_id as a numeric string", () => {
    const definition = getToolDefinition("get_proposal_details");
    expect(definition).toBeDefined();
    const parsed = definition!.inputSchema.parse({ proposal_id: "295" });
    expect(parsed).toEqual({ proposal_id: 295 });
  });
});
