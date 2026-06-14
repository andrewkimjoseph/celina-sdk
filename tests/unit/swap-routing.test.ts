import { describe, expect, it, vi } from "vitest";
import type { CelinaClient } from "../../src/index.js";
import { getSwapQuoteWithFallback } from "../../src/tools/swap-routing.js";

const MARKET_CLOSED =
  "Mento FX market is currently closed. FX quotes and execution are unavailable until the market reopens.";

function mockClient(overrides: {
  mentoFx?: Partial<CelinaClient["mentoFx"]>;
  uniswap?: Partial<CelinaClient["uniswap"]>;
}): CelinaClient {
  return {
    mentoFx: {
      getFxQuote: vi.fn().mockRejectedValue(new Error(MARKET_CLOSED)),
      ...overrides.mentoFx,
    },
    uniswap: {
      getSwapQuote: vi
        .fn()
        .mockRejectedValue(new Error("No Uniswap v4 route for USDm → EURm.")),
      ...overrides.uniswap,
    },
    gooddollar: {
      getReserveQuote: vi.fn(),
    },
  } as unknown as CelinaClient;
}

describe("getSwapQuoteWithFallback", () => {
  it("surfaces Mento FX market closed instead of a generic no-route error", async () => {
    const client = mockClient({});

    await expect(
      getSwapQuoteWithFallback(client, "USDm", "EURm", "20"),
    ).rejects.toThrow(MARKET_CLOSED);
  });

  it("still returns Uniswap when Mento FX is closed but Uniswap has a route", async () => {
    const client = mockClient({
      uniswap: {
        getSwapQuote: vi.fn().mockResolvedValue({
          tokenIn: "G$",
          tokenOut: "USDT",
          amountIn: "100",
          expectedOut: "1.5",
          routeHops: 1,
          network: "mainnet",
        }),
      },
    });

    const quote = await getSwapQuoteWithFallback(client, "GoodDollar", "USDT", "100");

    expect(quote.protocol).toBe("uniswap_v4");
  });
});
