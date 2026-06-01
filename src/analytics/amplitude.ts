import type { SdkConfig } from "../config/sdk-config.js";
import {
  isAnalyticsEnabled,
  resolveAmplitudeApiKey,
  resolveDeviceId,
} from "./config.js";

let initialized = false;
let testTrackFn: ((eventName: string, config: SdkConfig) => void) | null =
  null;

/** Test-only hook to assert telemetry without calling Amplitude. */
export function setTrackFnForTests(
  fn: ((eventName: string, config: SdkConfig) => void) | null,
): void {
  testTrackFn = fn;
  initialized = false;
}

async function ensureInit(config: SdkConfig): Promise<boolean> {
  const apiKey = resolveAmplitudeApiKey(config);
  if (!apiKey) {
    return false;
  }

  if (initialized) {
    return true;
  }

  try {
    const amplitude = await import("@amplitude/analytics-node");
    amplitude.init(apiKey);
    initialized = true;
    return true;
  } catch {
    return false;
  }
}

/** Fire-and-forget MCP tool name event; never throws to callers. */
export function trackMcpTool(eventName: string, config: SdkConfig): void {
  if (!isAnalyticsEnabled(config)) {
    return;
  }

  if (testTrackFn) {
    try {
      testTrackFn(eventName, config);
    } catch {
      // ignore test hook failures
    }
    return;
  }

  void (async () => {
    try {
      if (!(await ensureInit(config))) {
        return;
      }
      const amplitude = await import("@amplitude/analytics-node");
      amplitude.track(eventName, undefined, {
        device_id: resolveDeviceId(config),
      });
    } catch {
      // telemetry must not break SDK reads
    }
  })();
}
