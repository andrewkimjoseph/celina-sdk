/** Celo Fixidity fractions use 1e24 precision. */
export const FIXIDITY_ONE = 10n ** 24n;

/** Convert a percent (0–100) to Fixidity at 1e24 precision. */
export function percentToFixidity(percent: number): bigint {
  if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
    throw new Error(`Fixidity percent must be between 0 and 100, got ${percent}`);
  }
  return (FIXIDITY_ONE * BigInt(Math.floor(percent * 1_000_000))) / 100_000_000n;
}

/**
 * Convert a unit fraction (0–1) to a Fixidity uint256 at 1e24 precision.
 * @param fraction - Unit fraction, e.g. 0.5 for 50%
 */
export function toFixidity(fraction: number): bigint {
  if (!Number.isFinite(fraction) || fraction < 0 || fraction > 1) {
    throw new Error(`Fixidity fraction must be between 0 and 1, got ${fraction}`);
  }
  return percentToFixidity(fraction * 100);
}

/** Convert Fixidity bigint back to a unit fraction. */
export function fromFixidity(value: bigint): number {
  return Number(value) / Number(FIXIDITY_ONE);
}
