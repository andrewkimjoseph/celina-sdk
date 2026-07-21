import {
  ERC_8021_MARKER,
  fromDataSuffix,
  toDataSuffix,
} from "@celo/attribution-tags";
import { concat } from "viem";

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

function sameCodeSets(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].map((c) => c.toLowerCase()).sort();
  const sortedB = [...b].map((c) => c.toLowerCase()).sort();
  return sortedA.every((code, i) => code === sortedB[i]);
}

type Erc8021Schema0Match = {
  /** Hex char index into `data.slice(2)` where the ERC-8021 suffix starts. */
  suffixStart: number;
  /** Hex char index into `data.slice(2)` where the suffix ends (exclusive). */
  markerEnd: number;
  decoded: { codes: string[]; schemaId: number };
};

/**
 * Locate a valid ERC-8021 Schema 0 suffix even when trailing bytes follow the marker
 * (AA/UserOp packing). Prefers the last valid occurrence.
 */
function findErc8021Schema0Suffix(
  data: `0x${string}`,
): Erc8021Schema0Match | null {
  const hex = data.slice(2).toLowerCase();
  const markerHex = ERC_8021_MARKER.slice(2).toLowerCase();
  if (hex.length < markerHex.length + 4) return null;

  let searchEnd = hex.length;
  while (searchEnd >= markerHex.length) {
    const idx = hex.lastIndexOf(markerHex, searchEnd - 1);
    if (idx === -1) return null;

    const markerEnd = idx + markerHex.length;
    const schemaPos = idx - 2;
    const lengthPos = schemaPos - 2;
    if (lengthPos < 0) {
      searchEnd = idx;
      continue;
    }

    const schemaId = Number.parseInt(hex.slice(schemaPos, idx), 16);
    const lengthByte = Number.parseInt(hex.slice(lengthPos, schemaPos), 16);
    const suffixStart = lengthPos - lengthByte * 2;
    if (
      schemaId !== 0 ||
      !Number.isFinite(lengthByte) ||
      lengthByte < 0 ||
      suffixStart < 0
    ) {
      searchEnd = idx;
      continue;
    }

    const window = `0x${hex.slice(0, markerEnd)}` as `0x${string}`;
    const decoded = fromDataSuffix(window);
    if (decoded && decoded.schemaId === 0) {
      return {
        suffixStart,
        markerEnd,
        decoded: { codes: [...decoded.codes], schemaId: decoded.schemaId },
      };
    }

    searchEnd = idx;
  }

  return null;
}

/**
 * Truncate calldata to end at an embedded ERC-8021 Schema 0 suffix when tip parse fails.
 * Tip-of-calldata tags are returned unchanged.
 */
export function attributionDecodeWindow(data: `0x${string}`): `0x${string}` {
  if (!data || data === "0x") return data;
  if (fromDataSuffix(data)) return data;

  const found = findErc8021Schema0Suffix(data);
  if (!found) return data;
  return `0x${data.slice(2).slice(0, found.markerEnd)}` as `0x${string}`;
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

export type AttributionVerificationResult = {
  erc8021: { codes: string[]; schemaId: number } | null;
  matched: boolean;
};

/** Verification result plus all ERC-8021 `tags` in lowercase (mirrors `erc8021.codes`). */
export type AttributionCheckResult = AttributionVerificationResult & {
  tags: string[];
};

function tagMatchesVerification(
  tag: string,
  erc8021Codes: string[] | null,
): boolean {
  const normalized = normalizeAttributionTag(tag);
  return (
    erc8021Codes?.some((code) => code.toLowerCase() === normalized.toLowerCase()) ??
    false
  );
}

/** Collect all ERC-8021 codes as lowercase tags, deduped in first-seen order. */
export function collectAttributionTags(
  erc8021Codes: string[] | null,
): string[] {
  if (!erc8021Codes?.length) return [];

  const deduped = new Set<string>();
  for (const code of erc8021Codes) {
    const normalized = code.trim().toLowerCase();
    if (!normalized || deduped.has(normalized)) continue;
    deduped.add(normalized);
  }
  return [...deduped];
}

/** Decode ERC-8021 attribution from calldata; optionally check for a tag. */
export function verifyAttributionInCalldata(
  data: `0x${string}`,
  tag?: string,
): AttributionVerificationResult {
  const window = attributionDecodeWindow(data);
  const erc8021 = fromDataSuffix(window);
  const matched = tag
    ? tagMatchesVerification(tag, erc8021?.codes ?? null)
    : Boolean(erc8021?.codes.length);

  return {
    erc8021: erc8021
      ? { codes: [...erc8021.codes], schemaId: erc8021.schemaId }
      : null,
    matched,
  };
}

/**
 * Decode ERC-8021 attribution from calldata with a lowercase `tags` list that mirrors `erc8021.codes`.
 * Prefer this for "what tags are on this tx?"; use {@link verifyAttributionInCalldata} for the raw layer only.
 */
export function checkAttributionInCalldata(
  data: `0x${string}`,
  tag?: string,
): AttributionCheckResult {
  const verified = verifyAttributionInCalldata(data, tag);
  return {
    ...verified,
    tags: collectAttributionTags(verified.erc8021?.codes ?? null),
  };
}

/**
 * Append Celina ERC-8021 Schema 0 attribution to calldata (no legacy UTF-8 `CELINA|...`).
 *
 * Used by `prepare*` when `createCelinaClient({ attributionTags })` is set, and by
 * `createAAClient({ attributionTags }).sendPreparedFlow` when AA tags are set.
 *
 * @param data - Original transaction calldata.
 * @param attributionTags - Optional custom tags (same list semantics on Celina or AA client).
 *   ERC-8021: `toDataSuffix(["celina", ...])` with lowercase codes.
 *   Example: `["goclaim"]` -> codes `celina`, `goclaim`.
 *   Existing legacy UTF-8 on `data` is left in place; a matching ERC-8021 suffix is ensured.
 */
export function appendCelinaCalldataTag(
  data: `0x${string}`,
  attributionTags?: string[],
): `0x${string}` {
  if (!data || data === "0x") return data;

  const erc8021Hex = buildErc8021AttributionSuffix(attributionTags);
  const expectedCodes = toErc8021AttributionCodes(attributionTags);

  const tip = fromDataSuffix(data);
  if (tip && sameCodeSets(tip.codes, expectedCodes)) {
    return data;
  }

  const without8021 = stripErc8021SuffixIfPresent(data);
  return concat([without8021, erc8021Hex]);
}
