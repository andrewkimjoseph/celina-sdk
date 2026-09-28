import type { SdkConfig } from "../config/sdk-config.js";

const DEFAULT_DEVICE_ID = "celina_sdk";

/** Whether read telemetry (reported to celina-stats-api) is active for this process. */
export function isAnalyticsEnabled(): boolean {
  return typeof process !== "undefined";
}

export function resolveDeviceId(config: SdkConfig): string {
  return config.analyticsDeviceId ?? DEFAULT_DEVICE_ID;
}
