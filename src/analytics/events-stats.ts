import type { SdkConfig } from "../config/sdk-config.js";
import {
  isAnalyticsEnabled,
  resolveDeviceId,
} from "./config.js";
import { DEFAULT_STATS_API_BASE_URL } from "./onchain-stats.js";
import { resolveAnalyticsWallet } from "./wallet-context.js";

export type TrackMcpToolContext = {
  methodKey: string;
  args: readonly unknown[];
};

type EventPayload = {
  insertId: string;
  event: string;
  deviceId: string;
  userId?: string;
  occurredAt: string;
};

const inflight = new Set<Promise<void>>();
let testTrackFn:
  | ((
      eventName: string,
      config: SdkConfig,
      context: TrackMcpToolContext,
      userId: string | undefined,
    ) => void)
  | null = null;
let testFetch: typeof fetch | null = null;

/** Test-only hook to assert telemetry without POSTing to celina-stats-api. */
export function setTrackFnForTests(
  fn:
    | ((
        eventName: string,
        config: SdkConfig,
        context: TrackMcpToolContext,
        userId: string | undefined,
      ) => void)
    | null,
): void {
  testTrackFn = fn;
}

/** Test-only: replace `fetch` used by the real `POST /events` path. */
export function setEventsStatsFetchForTests(fn: typeof fetch | null): void {
  testFetch = fn;
}

function envFlag(name: string): string | undefined {
  if (typeof process === "undefined") return undefined;
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

/** Resolve celina-stats-api base URL: `statsApiBaseUrl` config -> `CELINA_STATS_API_URL` -> default. */
function resolveBaseUrl(config: SdkConfig): string {
  const fromConfig = config.statsApiBaseUrl?.trim();
  const fromEnv = envFlag("CELINA_STATS_API_URL");
  const raw = fromConfig || fromEnv || DEFAULT_STATS_API_BASE_URL;
  return raw.replace(/\/+$/, "");
}

function randomInsertId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }
}

async function postEvent(config: SdkConfig, payload: EventPayload): Promise<void> {
  const doFetch = testFetch ?? globalThis.fetch;
  if (typeof doFetch !== "function") {
    return;
  }
  const url = `${resolveBaseUrl(config)}/events`;
  try {
    await doFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // telemetry must not break SDK reads
  }
}

async function trackMcpToolImpl(
  eventName: string,
  config: SdkConfig,
  context?: TrackMcpToolContext,
): Promise<void> {
  if (!isAnalyticsEnabled(config)) {
    return;
  }

  const userId = context
    ? resolveAnalyticsWallet(context.methodKey, context.args, config)
    : undefined;

  if (testTrackFn) {
    try {
      testTrackFn(eventName, config, context ?? { methodKey: "", args: [] }, userId);
    } catch {
      // ignore test hook failures
    }
    return;
  }

  const payload: EventPayload = {
    insertId: randomInsertId(),
    event: eventName,
    deviceId: resolveDeviceId(config),
    ...(userId ? { userId } : {}),
    occurredAt: new Date().toISOString(),
  };

  await postEvent(config, payload);
}

/** Track an MCP tool name event; never throws to callers. */
export function trackMcpTool(
  eventName: string,
  config: SdkConfig,
  context?: TrackMcpToolContext,
): Promise<void> {
  const run = trackMcpToolImpl(eventName, config, context);
  inflight.add(run);
  void run.finally(() => inflight.delete(run));
  return run;
}

/** Await in-flight `POST /events` calls. Use with Worker/Vercel `waitUntil`. */
export async function drainCelinaAnalytics(): Promise<void> {
  await Promise.allSettled([...inflight]);
}

/**
 * Await any queued event posts (e.g. end of a Next.js route via `after()`).
 * Alias of {@link drainCelinaAnalytics} — kept as a separate export for API compatibility;
 * there is no separate client-side batch to flush now that events post individually.
 */
export async function flushCelinaAnalytics(): Promise<void> {
  await drainCelinaAnalytics();
}
