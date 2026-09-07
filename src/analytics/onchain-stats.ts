import type { SdkConfig } from "../config/sdk-config.js";

/** Production ingest URL for successful celina-tagged Celo transactions. */
export const DEFAULT_STATS_API_BASE_URL = "https://api.stats.usecelina.xyz";

const TX_HASH_RE = /^0x[0-9a-fA-F]{64}$/;

type OnchainStatsRuntime = {
  enabled: boolean;
  baseUrl: string;
};

let runtime: OnchainStatsRuntime = defaultRuntime();

let testFetch: typeof fetch | null = null;

function defaultRuntime(): OnchainStatsRuntime {
  return {
    enabled: true,
    baseUrl: DEFAULT_STATS_API_BASE_URL,
  };
}

function envFlag(name: string): string | undefined {
  if (typeof process === "undefined") return undefined;
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function resolveEnabled(config?: Pick<SdkConfig, "onchainStatsEnabled">): boolean {
  if (config?.onchainStatsEnabled === false) return false;
  const env = envFlag("CELINA_ONCHAIN_STATS_ENABLED");
  if (env === "false" || env === "0") return false;
  if (config?.onchainStatsEnabled === true) return true;
  return true;
}

function resolveBaseUrl(config?: Pick<SdkConfig, "statsApiBaseUrl">): string {
  const fromConfig = config?.statsApiBaseUrl?.trim();
  const fromEnv = envFlag("CELINA_STATS_API_URL");
  const raw = fromConfig || fromEnv || DEFAULT_STATS_API_BASE_URL;
  return raw.replace(/\/+$/, "");
}

/** Apply `createCelinaClient()` on-chain stats options to the process-wide reporter. */
export function applyOnchainStatsConfig(config: SdkConfig): void {
  runtime = {
    enabled: resolveEnabled(config),
    baseUrl: resolveBaseUrl(config),
  };
}

/** Test-only: replace `fetch` used by {@link reportCelinaOnchainTxn}. */
export function setOnchainStatsFetchForTests(fn: typeof fetch | null): void {
  testFetch = fn;
}

/** Test-only: restore default enabled/base URL. */
export function resetOnchainStatsConfigForTests(): void {
  runtime = defaultRuntime();
  testFetch = null;
}

/**
 * Fire-and-forget POST of a successful Celo tx hash to celina-stats-api.
 * Never throws. No-ops when opted out or when `hash` is not a 32-byte hex string.
 *
 * Call after `waitForTransactionReceipt` succeeds (MCP, wagmi apps, AA).
 */
export function reportCelinaOnchainTxn(hash: string): void {
  if (!runtime.enabled) return;
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
