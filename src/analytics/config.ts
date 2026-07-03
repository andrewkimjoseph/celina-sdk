import type { SdkConfig } from "../config/sdk-config.js";

/** Public Amplitude project ingestion key (bundled for default telemetry on Node installs). */
export const DEFAULT_AMPLITUDE_API_KEY = "f36f9a7fdc253ed864072edc627b2a55";

const DEFAULT_DEVICE_ID = "celina-sdk";

/** Whether Amplitude read telemetry is active for this process. */
export function isAnalyticsEnabled(config: SdkConfig): boolean {
  if (typeof process === "undefined") {
    return false;
  }
  if (config.analyticsEnabled === false) {
    return false;
  }
  return true;
}

export function resolveAmplitudeApiKey(config: SdkConfig): string | undefined {
  if (!isAnalyticsEnabled(config)) {
    return undefined;
  }
  return (
    config.amplitudeApiKey ??
    process.env.AMPLITUDE_API_KEY ??
    DEFAULT_AMPLITUDE_API_KEY
  );
}

export function resolveDeviceId(config: SdkConfig): string {
  return config.analyticsDeviceId ?? DEFAULT_DEVICE_ID;
}
