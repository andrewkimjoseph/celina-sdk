import type { SdkConfig } from "../config/sdk-config.js";
import {
  isAnalyticsEnabled,
  resolveDeviceId,
} from "./config.js";
import { resolveAnalyticsWallet } from "./wallet-context.js";

/** Amplitude HTTP API v2. Write key only — cannot read the export. */
export const AMPLITUDE_HTTP_API_URL = "https://api2.amplitude.com/2/httpapi";

/**
 * Celina stats Amplitude project write key.
 * Public ingest credential; the export secret stays on celina-stats-api.
 */
export const AMPLITUDE_WRITE_API_KEY = "b8d30326c023a17e70f0a42432824279";

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

/** Test-only hook to assert telemetry without POSTing to Amplitude. */
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

/** Test-only: replace `fetch` used by the Amplitude HTTP API path. */
export function setEventsStatsFetchForTests(fn: typeof fetch | null): void {
  testFetch = fn;
}

function randomInsertId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }
}

async function postEvent(payload: EventPayload): Promise<void> {
  const doFetch = testFetch ?? globalThis.fetch;
  if (typeof doFetch !== "function") {
    return;
  }
  const event: Record<string, unknown> = {
    event_type: payload.event,
    device_id: payload.deviceId,
    insert_id: payload.insertId,
    time: Date.parse(payload.occurredAt),
  };
  if (payload.userId) {
    event.user_id = payload.userId;
  }
  try {
    await doFetch(AMPLITUDE_HTTP_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: AMPLITUDE_WRITE_API_KEY,
        events: [event],
      }),
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

  await postEvent(payload);
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

/** Await in-flight Amplitude telemetry calls. Use with Worker/Vercel `waitUntil`. */
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
