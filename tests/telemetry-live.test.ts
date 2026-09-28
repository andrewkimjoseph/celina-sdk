import { afterEach, describe, expect, it } from "vitest";
import { setEventsStatsFetchForTests } from "../src/analytics/events-stats.js";
import { createCelinaClient, drainCelinaAnalytics } from "../src/index.js";
import { MAINNET_STATIC } from "./fixtures/mainnet.js";
import { loadTestConfig } from "./helpers/env.js";

const DEVICE_ID = "celina_sdk";

type TelemetryPost = {
  status: number;
  body: Record<string, unknown>;
};

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

describe("live SDK telemetry", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    setEventsStatsFetchForTests((() =>
      Promise.resolve(new Response(null, { status: 204 })),
    ) as typeof fetch);
  });

  it("posts read events to celina-stats-api as celina_sdk", async () => {
    setEventsStatsFetchForTests(null);
    const posts: TelemetryPost[] = [];
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const response = await originalFetch(input, init);
      const url = requestUrl(input);
      const method = init?.method ?? (input instanceof Request ? input.method : "GET");
      if (url.includes("/telemetry") && method === "POST") {
        const raw = typeof init?.body === "string" ? init.body : "";
        posts.push({
          status: response.status,
          body: raw ? (JSON.parse(raw) as Record<string, unknown>) : {},
        });
      }
      return response;
    }) as typeof fetch;

    try {
      const config = loadTestConfig();
      const client = createCelinaClient({
        ...config,
        analyticsDeviceId: DEVICE_ID,
      });

      await client.blockchain.getNetworkStatus();
      await client.transaction.getGasFeeData();
      await client.gooddollar.getWhitelistingInfo(MAINNET_STATIC.wallet);
      await drainCelinaAnalytics();
    } finally {
      globalThis.fetch = originalFetch;
    }

    expect(posts).toHaveLength(3);
    for (const post of posts) {
      expect(post.status).toBe(204);
      expect(post.body.api_key).toBeUndefined();
      expect(post.body.device_id).toBe(DEVICE_ID);
      expect(typeof post.body.insert_id).toBe("string");
      expect(String(post.body.insert_id).length).toBeGreaterThan(0);
      expect(typeof post.body.time).toBe("number");
    }

    const byEvent = new Map(posts.map((post) => [post.body.event_type, post]));
    expect(byEvent.get("get_network_status")?.body.user_id).toBeUndefined();
    expect(byEvent.get("get_gas_fee_data")?.body.user_id).toBeUndefined();
    expect(byEvent.get("get_gooddollar_whitelisting_info")?.body.user_id).toBe(
      MAINNET_STATIC.wallet.toLowerCase(),
    );
  });
});
