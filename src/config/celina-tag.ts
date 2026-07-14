import {
  ERC_8021_MARKER,
  fromDataSuffix,
  toDataSuffix,
} from "@celo/attribution-tags";
import { concat, hexToString, stringToHex } from "viem";

/** Calldata suffix appended to prepared transactions for on-chain Celina attribution. */
export const CELINA_DATA_SUFFIX = stringToHex("CELINA");

export { ERC_8021_MARKER };

/** Celo Builders on-chain attribution tag: `celo_` + 12 hex chars (lowercase). */
const CELO_BUILDERS_TAG = /^celo_[0-9a-f]{12}$/i;

const CELINA_PLATFORM_ERC8021_CODE = "celina";

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

/** Map client attribution tags to ERC-8021 Schema 0 codes (lowercase `[a-z0-9_]` only). */
export function toErc8021AttributionCodes(attributionTags?: string[]): string[] {
  const codes = [CELINA_PLATFORM_ERC8021_CODE];
  for (const tag of normalizeAttributionTags(attributionTags)) {
    codes.push(tag.toLowerCase());
  }
  return [...new Set(codes)];
}

/** Build ERC-8021 Schema 0 suffix hex for the given attribution tags. */
export function buildErc8021AttributionSuffix(
  attributionTags?: string[],
): `0x${string}` {
  const codes = toErc8021AttributionCodes(attributionTags);
  return codes.length === 1
    ? toDataSuffix(codes[0]!)
    : toDataSuffix(codes);
}

function buildLegacyAttributionSuffixHex(
  attributionTags?: string[],
): `0x${string}` {
  return stringToHex(buildCelinaAttributionTag(attributionTags));
}

function sameCodeSets(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].map((c) => c.toLowerCase()).sort();
  const sortedB = [...b].map((c) => c.toLowerCase()).sort();
  return sortedA.every((code, i) => code === sortedB[i]);
}

/** Strip a trailing ERC-8021 Schema 0/2 suffix when present. */
export function stripErc8021SuffixIfPresent(
  data: `0x${string}`,
): `0x${string}` {
  if (!fromDataSuffix(data)) return data;

  const hex = data.slice(2);
  const markerHex = ERC_8021_MARKER.slice(2).toLowerCase();
  const markerByteLen = markerHex.length / 2;
  if (hex.length < markerByteLen * 2) return data;
  if (hex.slice(-markerByteLen * 2).toLowerCase() !== markerHex) return data;

  const schemaPos = hex.length - markerByteLen * 2 - 2;
  const lengthFieldHex = hex.slice(schemaPos - 2, schemaPos);
  const lengthByte = Number.parseInt(lengthFieldHex, 16);
  const suffixStart = schemaPos - 2 - lengthByte * 2;
  if (suffixStart < 0) return data;

  return `0x${hex.slice(0, suffixStart)}` as `0x${string}`;
}

/** Parse legacy UTF-8 `CELINA|TAG1|…` suffix from calldata (ignores trailing ERC-8021). */
export function parseCelinaLegacyAttributionSuffix(
  data: `0x${string}`,
): string[] | null {
  const body = stripErc8021SuffixIfPresent(data);
  const celinaMarker = stringToHex("CELINA").slice(2).toLowerCase();
  const lower = body.slice(2).toLowerCase();
  const idx = lower.lastIndexOf(celinaMarker);
  if (idx === -1) return null;

  try {
    const suffixHex = `0x${body.slice(2).slice(idx)}` as `0x${string}`;
    const text = hexToString(suffixHex);
    if (!text.startsWith("CELINA")) return null;
    return text.split("|");
  } catch {
    return null;
  }
}

export type AttributionVerificationResult = {
  legacyTags: string[] | null;
  erc8021: { codes: string[]; schemaId: number } | null;
  matched: boolean;
};

/** Verification result plus a unified custom/app `tags` list (excludes platform CELINA/celina). */
export type AttributionCheckResult = AttributionVerificationResult & {
  tags: string[];
};

function tagMatchesVerification(
  tag: string,
  legacyTags: string[] | null,
  erc8021Codes: string[] | null,
): boolean {
  const normalized = normalizeAttributionTag(tag);
  const legacyHit =
    legacyTags?.some((legacyTag) => normalizeAttributionTag(legacyTag) === normalized) ??
    false;
  const ercHit =
    erc8021Codes?.some((code) => code.toLowerCase() === normalized.toLowerCase()) ??
    false;
  return legacyHit || ercHit;
}

/** Merge legacy + ERC-8021 codes into custom tags (skips CELINA/celina, dedupes). */
export function collectAttributionTags(
  legacyTags: string[] | null,
  erc8021Codes: string[] | null,
): string[] {
  return normalizeAttributionTags([
    ...(legacyTags ?? []),
    ...(erc8021Codes ?? []),
  ]);
}

/** Decode legacy and ERC-8021 attribution from calldata; optionally check for a tag. */
export function verifyAttributionInCalldata(
  data: `0x${string}`,
  tag?: string,
): AttributionVerificationResult {
  const legacyTags = parseCelinaLegacyAttributionSuffix(data);
  const erc8021 = fromDataSuffix(data);
  const matched = tag
    ? tagMatchesVerification(tag, legacyTags, erc8021?.codes ?? null)
    : Boolean(legacyTags?.length || erc8021?.codes.length);

  return {
    legacyTags,
    erc8021: erc8021
      ? { codes: [...erc8021.codes], schemaId: erc8021.schemaId }
      : null,
    matched,
  };
}

/**
 * Decode attribution from calldata with a unified custom `tags` list.
 * Prefer this for “what tags are on this tx?”; use {@link verifyAttributionInCalldata} for the raw layers only.
 */
export function checkAttributionInCalldata(
  data: `0x${string}`,
  tag?: string,
): AttributionCheckResult {
  const verified = verifyAttributionInCalldata(data, tag);
  return {
    ...verified,
    tags: collectAttributionTags(verified.legacyTags, verified.erc8021?.codes ?? null),
  };
}

/**
 * Append legacy UTF-8 and ERC-8021 attribution suffixes to calldata.
 *
 * @param data - Original transaction calldata.
 * @param attributionTags - Optional tags from `createCelinaClient({ attributionTags })`.
 *   Legacy layer: `CELINA|TAG1|TAG2` (app tags uppercase, `celo_<12 hex>` lowercase).
 *   ERC-8021 layer: `toDataSuffix(["celina", ...])` with lowercase codes.
 */
export function appendCelinaCalldataTag(
  data: `0x${string}`,
  attributionTags?: string[],
): `0x${string}` {
  if (!data || data === "0x") return data;

  const legacyHex = buildLegacyAttributionSuffixHex(attributionTags);
  const legacySuffix = legacyHex.slice(2);
  const erc8021Hex = buildErc8021AttributionSuffix(attributionTags);
  const expectedCodes = toErc8021AttributionCodes(attributionTags);
  const fullDualSuffix = `${legacySuffix}${erc8021Hex.slice(2)}`.toLowerCase();

  if (data.toLowerCase().endsWith(fullDualSuffix)) return data;

  let result = stripErc8021SuffixIfPresent(data);
  if (!result.toLowerCase().endsWith(legacySuffix.toLowerCase())) {
    result = concat([result, legacyHex]);
  }

  const decoded = fromDataSuffix(result);
  if (!decoded || !sameCodeSets(decoded.codes, expectedCodes)) {
    result = concat([result, erc8021Hex]);
  }

  return result;
}
