import type { SdkConfig } from "../config/sdk-config.js";

/** Production ingest URL for successful celina-tagged Celo transactions. */
export const DEFAULT_STATS_API_BASE_URL = "https://api.stats.usecelina.xyz";

const TX_HASH_RE = /^0x[0-9a-fA-F]{64}$/;

type OnchainStatsRuntime = {
  baseUrl: string;
};

let runtime: OnchainStatsRuntime = defaultRuntime();

let testFetch: typeof fetch | null = null;

function defaultRuntime(): OnchainStatsRuntime {
  return {
    baseUrl: DEFAULT_STATS_API_BASE_URL,
  };
}

function envFlag(name: string): string | undefined {
  if (typeof process === "undefined") return undefined;
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

export function resolveStatsApiBaseUrl(config?: Pick<SdkConfig, "statsApiBaseUrl">): string {
  const fromConfig = config?.statsApiBaseUrl?.trim();
  const fromEnv = envFlag("CELINA_STATS_API_URL");
  const raw = fromConfig || fromEnv || DEFAULT_STATS_API_BASE_URL;
  return raw.replace(/\/+$/, "");
}

/** Apply `createCelinaClient()` on-chain stats options to the process-wide reporter. */
export function applyOnchainStatsConfig(config: SdkConfig): void {
  runtime = {
    baseUrl: resolveStatsApiBaseUrl(config),
  };
}

/** Test-only: replace `fetch` used by {@link reportCelinaOnchainTxn}. */
export function setOnchainStatsFetchForTests(fn: typeof fetch | null): void {
  testFetch = fn;
}

/** Test-only: restore the default base URL. */
export function resetOnchainStatsConfigForTests(): void {
  runtime = defaultRuntime();
  testFetch = null;
}

/**
 * Fire-and-forget POST of a successful Celo tx hash to celina-stats-api.
 * Never throws. No-ops when `hash` is not a 32-byte hex string.
 *
 * Call after `waitForTransactionReceipt` succeeds (MCP, wagmi apps, AA).
 */
export function reportCelinaOnchainTxn(hash: string): void {
  const normalized = hash.trim();
  if (!TX_HASH_RE.test(normalized)) return;

  const url = `${runtime.baseUrl}/onchain`;
  const doFetch = testFetch ?? globalThis.fetch;
  if (typeof doFetch !== "function") return;

  try {
    const pending = doFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hash: normalized }),
    });
    void Promise.resolve(pending).catch((err: unknown) => {
      console.warn("[celina-sdk] onchain stats report failed:", err);
    });
  } catch (err) {
    console.warn("[celina-sdk] onchain stats report failed:", err);
  }
}
