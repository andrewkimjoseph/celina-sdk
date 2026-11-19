/**
 * Browser-safe, fire-and-forget reporter for celina-sdk read-layer events.
 *
 * Mirrors {@link reportCelinaOnchainTxn} in style: never throws, no Node
 * process / filesystem dependencies, no isAnalyticsEnabled() gate that would
 * block execution in a browser context.
 *
 * Used by createGoodDollarReserveClient() to report get_gooddollar_reserve_quote
 * and estimate_gooddollar_reserve_swap events to celina-stats-api /telemetry.
 */
import { DEFAULT_STATS_API_BASE_URL, resolveStatsApiBaseUrl } from "./onchain-stats.js";

export { DEFAULT_STATS_API_BASE_URL };

/** Default device_id when no analyticsDeviceId is configured. */
export const DEFAULT_OFFCHAIN_BROWSER_DEVICE_ID = "celina_sdk";

export interface ReportOffchainEventOptions {
  /** Sanitized package/project name (e.g. "cnvlabskoxyz_goodreservekit"). */
  deviceId?: string;
  /** Override celina-stats-api base URL (default https://api.stats.usecelina.xyz). */
  statsApiBaseUrl?: string;
  /** Wallet address to attach as user_id for wallet-scoped reads (e.g. estimateReserveSwap from). */
  userId?: string;
}

let testFetch: typeof fetch | null = null;

/** Test-only: replace fetch used by {@link reportCelinaOffchainEvent}. */
export function setBrowserOffchainStatsFetchForTests(fn: typeof fetch | null): void {
  testFetch = fn;
}

/** Test-only: reset to default. */
export function resetBrowserOffchainStatsForTests(): void {
  testFetch = null;
}

function randomInsertId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }
}

/**
 * Fire-and-forget POST of a celina-sdk read event to celina-stats-api /telemetry.
 * Never throws. No-ops when fetch is unavailable.
 */
export function reportCelinaOffchainEvent(
  eventName: string,
  options?: ReportOffchainEventOptions,
): void {
  const doFetch = testFetch ?? globalThis.fetch;
  if (typeof doFetch !== "function") return;

  const baseUrl = resolveStatsApiBaseUrl({ statsApiBaseUrl: options?.statsApiBaseUrl });
  const body: Record<string, unknown> = {
    event_type: eventName,
    device_id: options?.deviceId ?? DEFAULT_OFFCHAIN_BROWSER_DEVICE_ID,
    insert_id: randomInsertId(),
    time: Date.now(),
  };
  if (options?.userId) {
    body.user_id = options.userId;
  }

  try {
    const pending = doFetch(`${baseUrl}/telemetry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    void Promise.resolve(pending).catch((err: unknown) => {
      console.warn("[celina-sdk] offchain event report failed:", err);
    });
  } catch (err) {
    console.warn("[celina-sdk] offchain event report failed:", err);
  }
}
