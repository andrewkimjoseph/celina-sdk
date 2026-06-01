import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CarbonRestClient, CarbonRestError } from "../../src/clients/carbon-rest.js";

describe("CarbonRestClient", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("POSTs to /tools/:name with chain celo injected", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ status: "ok", strategies: [] }),
    });

    const client = new CarbonRestClient("https://mcp.carbondefi.xyz");
    const result = await client.postTool("get_strategies", {
      wallet_address: "0xabc",
    });

    expect(result.status).toBe("ok");
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://mcp.carbondefi.xyz/tools/get_strategies");
    const body = JSON.parse(String(init.body));
    expect(body.chain).toBe("celo");
    expect(body.wallet_address).toBe("0xabc");
  });

  it("throws CarbonRestError when API returns error field", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ error: "rate limited" }),
    });

    const client = new CarbonRestClient("https://example.test");
    await expect(client.postTool("help")).rejects.toThrow(CarbonRestError);
  });
});
