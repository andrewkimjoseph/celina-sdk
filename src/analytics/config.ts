import type { SdkConfig } from "../config/sdk-config.js";

const DEFAULT_DEVICE_ID = "celina_sdk";

/** Whether read telemetry (reported to celina-stats-api) is active for this process. */
export function isAnalyticsEnabled(config: SdkConfig): boolean {
  if (typeof process === "undefined") {
    return false;
  }
  if (config.analyticsEnabled === false) {
    return false;
  }
  return true;
}

export function resolveDeviceId(config: SdkConfig): string {
  return config.analyticsDeviceId ?? DEFAULT_DEVICE_ID;
}
