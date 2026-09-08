import { afterEach, describe, expect, it } from "vitest";
import {
  setEventsStatsFetchForTests,
  setTrackFnForTests,
  trackMcpTool,
} from "../../src/analytics/events-stats.js";
import { DEFAULT_STATS_API_BASE_URL } from "../../src/analytics/onchain-stats.js";
import type { SdkConfig } from "../../src/config/sdk-config.js";

const enabledConfig: SdkConfig = {
  rpcUrl: "https://forno.celo.org",
  analyticsEnabled: true,
  analyticsDeviceId: "test_device",
};

afterEach(() => {
  setEventsStatsFetchForTests(null);
  setTrackFnForTests(null);
});

describe("trackMcpTool (POST /events)", () => {
  it("POSTs an event payload to celina-stats-api", async () => {
    const calls: Array<{ url: string; init: RequestInit }> = [];
    setEventsStatsFetchForTests(((url: string, init?: RequestInit) => {
      calls.push({ url: String(url), init: init ?? {} });
      return Promise.resolve(new Response(null, { status: 200 }));
    }) as typeof fetch);

    await trackMcpTool("get_wallet_address", enabledConfig);

    expect(calls).toHaveLength(1);
    expect(calls[0]?.url).toBe(`${DEFAULT_STATS_API_BASE_URL}/events`);
    expect(calls[0]?.init.method).toBe("POST");
    const body = JSON.parse(String(calls[0]?.init.body));
    expect(body.event).toBe("get_wallet_address");
    expect(body.deviceId).toBe("test_device");
    expect(typeof body.insertId).toBe("string");
    expect(body.insertId.length).toBeGreaterThan(0);
    expect(typeof body.occurredAt).toBe("string");
    expect(body.userId).toBeUndefined();
  });

  it("includes userId when a wallet is resolved from context", async () => {
    const calls: Array<{ init: RequestInit }> = [];
    setEventsStatsFetchForTests((( _url: string, init?: RequestInit) => {
      calls.push({ init: init ?? {} });
      return Promise.resolve(new Response(null, { status: 200 }));
    }) as typeof fetch);

    await trackMcpTool("get_account", enabledConfig, {
      methodKey: "account.getAccount",
      args: ["0x1234567890123456789012345678901234567890"],
    });

    const body = JSON.parse(String(calls[0]?.init.body));
    expect(body.userId).toBe("0x1234567890123456789012345678901234567890");
  });

  it("does not POST when analyticsEnabled is false", async () => {
    const calls: unknown[] = [];
    setEventsStatsFetchForTests((() => {
      calls.push(1);
      return Promise.resolve(new Response(null, { status: 200 }));
    }) as typeof fetch);

    await trackMcpTool("get_wallet_address", {
      ...enabledConfig,
      analyticsEnabled: false,
    });

    expect(calls).toHaveLength(0);
  });

  it("does not throw when fetch rejects", async () => {
    setEventsStatsFetchForTests((() =>
      Promise.reject(new Error("offline"))) as typeof fetch);

    await expect(
      trackMcpTool("get_wallet_address", enabledConfig),
    ).resolves.toBeUndefined();
  });

  it("prefers the test track hook over the real fetch path", async () => {
    const tracked: string[] = [];
    let fetchCalled = false;
    setEventsStatsFetchForTests((() => {
      fetchCalled = true;
      return Promise.resolve(new Response(null, { status: 200 }));
    }) as typeof fetch);
    setTrackFnForTests((eventName) => {
      tracked.push(eventName);
    });

    await trackMcpTool("get_wallet_address", enabledConfig);

    expect(tracked).toEqual(["get_wallet_address"]);
    expect(fetchCalled).toBe(false);
  });
});
