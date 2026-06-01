import { afterEach, describe, expect, it, vi } from "vitest";
import { setTrackFnForTests } from "../../src/analytics/amplitude.js";
import { wrapServiceForAnalytics } from "../../src/analytics/wrap-service.js";
import type { SdkConfig } from "../../src/config/sdk-config.js";

const enabledConfig: SdkConfig = {
  rpcUrl: "https://forno.celo.org",
  analyticsEnabled: true,
};

const disabledConfig: SdkConfig = {
  rpcUrl: "https://forno.celo.org",
  analyticsEnabled: false,
};

describe("wrapServiceForAnalytics", () => {
  afterEach(() => {
    setTrackFnForTests(null);
    vi.unstubAllEnvs();
  });

  it("tracks mapped async reads with MCP tool event names", async () => {
    vi.stubEnv("CELINA_ANALYTICS_DISABLED", "");
    const tracked: string[] = [];
    setTrackFnForTests((eventName) => {
      tracked.push(eventName);
    });

    const service = wrapServiceForAnalytics(
      "blockchain",
      {
        async getNetworkStatus() {
          return { ok: true };
        },
        async prepareSend() {
          return { steps: [] };
        },
      },
      enabledConfig,
    );

    await service.getNetworkStatus();
    await service.prepareSend();

    expect(tracked).toEqual(["get_network_status"]);
  });

  it("does not track when analyticsEnabled is false", async () => {
    const tracked: string[] = [];
    setTrackFnForTests((eventName) => {
      tracked.push(eventName);
    });

    const service = wrapServiceForAnalytics(
      "blockchain",
      {
        async getNetworkStatus() {
          return { ok: true };
        },
      },
      disabledConfig,
    );

    await service.getNetworkStatus();
    expect(tracked).toEqual([]);
  });

  it("does not track when CELINA_ANALYTICS_DISABLED=1", async () => {
    vi.stubEnv("CELINA_ANALYTICS_DISABLED", "1");
    const tracked: string[] = [];
    setTrackFnForTests((eventName) => {
      tracked.push(eventName);
    });

    const service = wrapServiceForAnalytics(
      "blockchain",
      {
        async getNetworkStatus() {
          return { ok: true };
        },
      },
      enabledConfig,
    );

    await service.getNetworkStatus();
    expect(tracked).toEqual([]);
  });
});
