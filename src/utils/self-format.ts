import { selfQrUrl } from "../clients/self-api.js";
import { SELF_PROOF_EXPIRING_SOON_DAYS } from "../config/self.js";

export interface SelfSessionLinksInput {
  sessionToken: string;
  deepLink: string;
  scanUrl?: string;
  apiBase?: string;
}

export interface SelfSessionLinks {
  qr_code_url: string;
  deep_link: string;
}

export function resolveSelfSessionLinks(
  input: SelfSessionLinksInput,
): SelfSessionLinks {
  const qr_code_url = input.scanUrl ?? selfQrUrl(input.sessionToken, input.apiBase);
  const deep_link = input.deepLink.trim();

  if (!qr_code_url) {
    throw new Error("Self session is missing a QR code URL.");
  }

  if (!deep_link || deep_link === "undefined") {
    throw new Error("Self session is missing a deep link.");
  }

  return { qr_code_url, deep_link };
}

export function formatSelfSessionLinksDisplay(links: SelfSessionLinks): string {
  return [
    "Present BOTH links to the human (never omit one):",
    "",
    `QR code URL: ${links.qr_code_url}`,
    `Deep link: ${links.deep_link}`,
  ].join("\n");
}

export interface SelfCredentialLike {
  nationality?: string;
  olderThan?: bigint | number;
  older_than?: number;
  ofac?: boolean[];
  ofac_clear?: boolean;
}

export type SelfOfacCheckList = "sdn" | "consolidated" | "other_ofac";

export interface SelfOfacCheck {
  list: SelfOfacCheckList;
  label: string;
  clear: boolean;
}

export const SELF_OFAC_CHECK_DEFINITIONS = [
  {
    list: "sdn" as const,
    label: "Specially Designated Nationals (SDN)",
    index: 0,
  },
  {
    list: "consolidated" as const,
    label: "Consolidated non-SDN sanctions",
    index: 1,
  },
  {
    list: "other_ofac" as const,
    label: "Other OFAC sanctions lists",
    index: 2,
  },
] as const;

export interface ParsedSelfOfacScreening {
  ofac_clear: boolean;
  ofac_screened: boolean;
  ofac_checks: SelfOfacCheck[];
}

export interface FormattedSelfCredentials {
  nationality?: string;
  older_than: number;
  ofac_clear: boolean;
  ofac_screened: boolean;
  ofac_checks: SelfOfacCheck[];
}

export interface SelfCredentialsInput {
  nationality?: string;
  olderThan?: bigint | number;
  ofac?: readonly boolean[] | null;
}

/**
 * Self on-chain/API ofac is bool[3] with OpenAPI labels
 * [isOnSdnList, isOnConsolidatedList, isOnOfacList] — true means cleared (not on list).
 * Celina exposes `clear` on each labeled check so consumers are not misled by Self's names.
 */
export function parseSelfOfacScreening(
  ofac?: readonly boolean[] | null,
): ParsedSelfOfacScreening {
  const ofac_checks = SELF_OFAC_CHECK_DEFINITIONS.map(({ list, label, index }) => ({
    list,
    label,
    clear: ofac?.[index] === true,
  }));
  const ofac_screened =
    ofac !== undefined &&
    ofac !== null &&
    ofac_checks.some((check) => check.clear);
  const ofac_clear = ofac_checks.every((check) => check.clear);

  return {
    ofac_clear,
    ofac_screened,
    ofac_checks,
  };
}

export function formatSelfCredentials(
  raw?: SelfCredentialsInput | null,
): FormattedSelfCredentials {
  const nationality = raw?.nationality || undefined;
  const older_than = Number(raw?.olderThan ?? 0);
  const { ofac_clear, ofac_screened, ofac_checks } = parseSelfOfacScreening(
    raw?.ofac,
  );

  return {
    nationality,
    older_than,
    ofac_clear,
    ofac_screened,
    ofac_checks,
  };
}

export function formatCredentialsSummary(
  credentials?: SelfCredentialLike | null,
): string {
  if (!credentials) {
    return "No credentials available";
  }

  const parts = ["Verified human"];
  const age = Number(credentials.older_than ?? credentials.olderThan ?? 0);

  if (age > 0) {
    parts.push(`${age}+`);
  }

  const ofacClear =
    credentials.ofac_clear ??
    parseSelfOfacScreening(credentials.ofac).ofac_clear;

  if (ofacClear) {
    parts.push("OFAC clear");
  } else if (credentials.ofac?.length || credentials.ofac_clear === false) {
    parts.push("OFAC not fully clear");
  }

  if (credentials.nationality) {
    parts.push(`nationality: ${credentials.nationality}`);
  }

  return parts.join(", ");
}

export function truncateBody(
  body: string,
  maxBytes = 10 * 1024,
): { body: string; truncated: boolean } {
  const encoded = new TextEncoder().encode(body);

  if (encoded.byteLength <= maxBytes) {
    return { body, truncated: false };
  }

  const truncated = new TextDecoder().decode(encoded.slice(0, maxBytes));
  return {
    body:
      truncated +
      `\n\n[Truncated — original was ${encoded.byteLength} bytes, limit is ${maxBytes} bytes]`,
    truncated: true,
  };
}

export function formatAgentInfo(
  info: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(info)) {
    result[key] =
      typeof value === "bigint"
        ? Number(value)
        : Array.isArray(value)
          ? value.map((item) => (typeof item === "bigint" ? Number(item) : item))
          : value;
  }

  return result;
}

export function proofExpiryFields(proofExpiresAtRaw: bigint) {
  const proofExpiresAtSecs = Number(proofExpiresAtRaw);
  const proofExpiresAtISO =
    proofExpiresAtSecs > 0
      ? new Date(proofExpiresAtSecs * 1000).toISOString()
      : null;
  const now = Math.floor(Date.now() / 1000);
  const daysUntilExpiry =
    proofExpiresAtSecs > 0
      ? Math.floor((proofExpiresAtSecs - now) / 86400)
      : -1;
  const isExpiringSoon =
    daysUntilExpiry >= 0 && daysUntilExpiry <= SELF_PROOF_EXPIRING_SOON_DAYS;

  return {
    proof_expires_at: proofExpiresAtISO,
    days_until_expiry: daysUntilExpiry,
    is_expiring_soon: isExpiringSoon,
  };
}
