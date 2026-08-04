const PRIVATE_KEY_HEX_BODY_RE = /^[a-fA-F0-9]{64}$/;

/**
 * Parse and normalize a private key from an environment variable or config string.
 * Accepts 64 hex characters with or without a 0x prefix.
 *
 * @param raw - Raw env value
 * @param envName - Used in error messages when invalid
 * @returns Normalized `0x`-prefixed key, or undefined when unset/blank
 */
export function parsePrivateKeyEnv(
  raw: string | undefined,
  envName: string,
): `0x${string}` | undefined {
  if (raw === undefined || raw.trim() === "") {
    return undefined;
  }

  const trimmed = raw.trim();
  const hexBody = trimmed.startsWith("0x") || trimmed.startsWith("0X")
    ? trimmed.slice(2)
    : trimmed;

  if (!PRIVATE_KEY_HEX_BODY_RE.test(hexBody)) {
    throw new Error(
      `${envName} is set but invalid (expected 64 hex characters, with or without 0x prefix). Remove it or fix it.`,
    );
  }

  return `0x${hexBody.toLowerCase()}` as `0x${string}`;
}
