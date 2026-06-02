import { MENTO_CELO_ADDRESS } from "../config/chains.js";
import type { TokenService } from "../services/token.service.js";

const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/i;

/** Token fields normalized before Carbon REST write calls. */
export const CARBON_WRITE_TOKEN_FIELDS = [
  "base_token",
  "quote_token",
  "source_token",
  "target_token",
  "token_in",
  "token_out",
  "token",
] as const;

/**
 * Resolve a Carbon token symbol or address to a concrete `0x` ERC-20 address.
 * CELO registry entries map to WCELO/MENTO collateral (Carbon does not accept `"native"`).
 */
export function resolveCarbonTokenAddress(
  tokenService: TokenService,
  tokenOrAddress: string,
): `0x${string}` {
  const trimmed = tokenOrAddress.trim();
  if (ADDRESS_RE.test(trimmed)) {
    return trimmed as `0x${string}`;
  }
  const resolved = tokenService.resolveToken(trimmed);
  if (resolved.address === "native") {
    return MENTO_CELO_ADDRESS;
  }
  return resolved.address;
}

/** Normalize token symbol fields in a Carbon write body before REST POST. */
export function normalizeCarbonWriteBody(
  tokenService: TokenService,
  body: Record<string, unknown>,
): Record<string, unknown> {
  const out = { ...body };
  for (const key of CARBON_WRITE_TOKEN_FIELDS) {
    const value = out[key];
    if (typeof value === "string" && value.trim()) {
      out[key] = resolveCarbonTokenAddress(tokenService, value);
    }
  }
  return out;
}
