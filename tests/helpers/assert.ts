import assert from "node:assert/strict";

export function assertDefined(result: unknown): asserts result is NonNullable<unknown> {
  assert.notEqual(result, undefined);
  assert.notEqual(result, null);
}

export function assertObject(result: unknown): Record<string, unknown> {
  assertDefined(result);
  assert.equal(typeof result, "object");
  assert.equal(Array.isArray(result), false);
  return result as Record<string, unknown>;
}

export function assertArray(result: unknown): unknown[] {
  assertDefined(result);
  assert.equal(Array.isArray(result), true);
  return result as unknown[];
}

export function assertHasKeys(
  result: unknown,
  keys: string[],
): Record<string, unknown> {
  const obj = assertObject(result);
  for (const key of keys) {
    assert.ok(key in obj, `Expected object to have property ${key}`);
  }
  return obj;
}
