import { afterEach, describe, expect, it } from "vitest";
import { createCelinaClient } from "../../src/index.js";
import {
  DEFAULT_STATS_API_BASE_URL,
  reportCelinaOnchainTxn,
  resetOnchainStatsConfigForTests,
  setOnchainStatsFetchForTests,
} from "../../src/analytics/onchain-stats.js";

const HASH = ("0x" + "ab".repeat(32)) as `0x${string}`;

afterEach(() => {
  resetOnchainStatsConfigForTests();
});

describe("reportCelinaOnchainTxn", () => {
  it("POSTs the hash to the stats API", () => {
    const calls: Array<{ url: string; init: RequestInit }> = [];
    setOnchainStatsFetchForTests(((url: string, init?: RequestInit) => {
      calls.push({ url: String(url), init: init ?? {} });
      return Promise.resolve(new Response(null, { status: 200 }));
    }) as typeof fetch);

    reportCelinaOnchainTxn(HASH);

    expect(calls).toHaveLength(1);
    expect(calls[0]?.url).toBe(`${DEFAULT_STATS_API_BASE_URL}/onchain`);
    expect(calls[0]?.init.method).toBe("POST");
    expect(calls[0]?.init.body).toBe(JSON.stringify({ hash: HASH }));
  });

  it("skips invalid hashes", () => {
    const calls: unknown[] = [];
    setOnchainStatsFetchForTests((() => {
      calls.push(1);
      return Promise.resolve(new Response(null, { status: 200 }));
    }) as typeof fetch);

    reportCelinaOnchainTxn("0xabc");
    expect(calls).toHaveLength(0);
  });

  it("skips when createCelinaClient opts out", () => {
    createCelinaClient({ analyticsEnabled: false, onchainStatsEnabled: false });
    const calls: unknown[] = [];
    setOnchainStatsFetchForTests((() => {
      calls.push(1);
      return Promise.resolve(new Response(null, { status: 200 }));
    }) as typeof fetch);

    reportCelinaOnchainTxn(HASH);
    expect(calls).toHaveLength(0);
  });

  it("does not throw when fetch rejects", () => {
    setOnchainStatsFetchForTests((() =>
      Promise.reject(new Error("offline"))) as typeof fetch);
    expect(() => reportCelinaOnchainTxn(HASH)).not.toThrow();
  });
});
