import { concat, stringToHex } from "viem";

/** Calldata suffix appended to prepared transactions for on-chain Celina attribution. */
export const CELINA_DATA_SUFFIX = stringToHex("CELINA");

/** Celo Builders on-chain attribution tag: `celo_` + 12 hex chars (lowercase). */
const CELO_BUILDERS_TAG = /^celo_[0-9a-f]{12}$/i;

function normalizeAttributionTag(tag: string): string {
  const trimmed = tag.trim();
  if (CELO_BUILDERS_TAG.test(trimmed)) {
    return trimmed.toLowerCase();
  }
  return trimmed.toUpperCase();
}

/** Normalize custom attribution tags while preserving first-seen order. */
export function normalizeAttributionTags(tags?: string[]): string[] {
  if (!tags?.length) return [];
  const deduped = new Set<string>();
  for (const tag of tags) {
    const normalized = normalizeAttributionTag(tag);
    if (!normalized || normalized === "CELINA" || deduped.has(normalized)) continue;
    deduped.add(normalized);
  }
  return [...deduped];
}

/** Build deterministic attribution tag string that always starts with `CELINA`. */
export function buildCelinaAttributionTag(tags?: string[]): string {
  const normalized = normalizeAttributionTags(tags);
  return normalized.length ? `CELINA|${normalized.join("|")}` : "CELINA";
}

/**
 * Append CELINA attribution suffix to calldata; no-op when empty or already tagged.
 *
 * @param data - Original transaction calldata.
 * @param attributionTags - Optional tags from `createCelinaClient({ attributionTags })`.
 *   Appended after `CELINA` as `CELINA|TAG1|TAG2`. App tags normalize uppercase;
 *   `celo_<12 hex>` tags canonicalize lowercase. Omitted or empty → suffix is `CELINA` only.
 */
export function appendCelinaCalldataTag(
  data: `0x${string}`,
  attributionTags?: string[],
): `0x${string}` {
  if (!data || data === "0x") return data;
  const suffixHex = stringToHex(buildCelinaAttributionTag(attributionTags));
  const suffix = suffixHex.slice(2);
  if (data.toLowerCase().endsWith(suffix.toLowerCase())) return data;
  return concat([data, suffixHex]);
}
