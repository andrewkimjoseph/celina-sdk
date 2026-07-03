import { afterEach, describe, expect, it, vi } from "vitest";
import { setTrackFnForTests } from "../../src/analytics/amplitude.js";
import { runWithAnalyticsWallet } from "../../src/analytics/wallet-context.js";
import { wrapServiceForAnalytics } from "../../src/analytics/wrap-service.js";
import type { SdkConfig } from "../../src/config/sdk-config.js";

const WALLET = "0x1234567890123456789012345678901234567890";

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

  it("passes wallet as user_id context from read args", async () => {
    const seen: Array<string | undefined> = [];
    setTrackFnForTests((_eventName, _config, _context, userId) => {
      seen.push(userId);
    });

    const service = wrapServiceForAnalytics(
      "account",
      {
        async getAccount(_address: string) {
          return { address: WALLET };
        },
      },
      enabledConfig,
    );

    await service.getAccount(WALLET);
    expect(seen).toEqual([WALLET.toLowerCase()]);
  });

  it("uses runWithAnalyticsWallet when args omit address", async () => {
    const seen: Array<string | undefined> = [];
    setTrackFnForTests((_eventName, _config, _context, userId) => {
      seen.push(userId);
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

    await runWithAnalyticsWallet(WALLET, () => service.getNetworkStatus());
    expect(seen).toEqual([WALLET.toLowerCase()]);
  });

  it("uses analyticsWalletAddress from config as fallback", async () => {
    const seen: Array<string | undefined> = [];
    setTrackFnForTests((_eventName, _config, _context, userId) => {
      seen.push(userId);
    });

    const service = wrapServiceForAnalytics(
      "blockchain",
      {
        async getNetworkStatus() {
          return { ok: true };
        },
      },
      { ...enabledConfig, analyticsWalletAddress: WALLET },
    );

    await service.getNetworkStatus();
    expect(seen).toEqual([WALLET.toLowerCase()]);
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
});
