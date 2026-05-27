import { expect } from "vitest";

export function assertDefined(result: unknown): asserts result is NonNullable<unknown> {
  expect(result).toBeDefined();
  expect(result).not.toBeNull();
}

export function assertObject(result: unknown): Record<string, unknown> {
  assertDefined(result);
  expect(typeof result).toBe("object");
  expect(Array.isArray(result)).toBe(false);
  return result as Record<string, unknown>;
}

export function assertArray(result: unknown): unknown[] {
  assertDefined(result);
  expect(Array.isArray(result)).toBe(true);
  return result as unknown[];
}

export function assertHasKeys(
  result: unknown,
  keys: string[],
): Record<string, unknown> {
  const obj = assertObject(result);
  for (const key of keys) {
    expect(obj).toHaveProperty(key);
  }
  return obj;
}
