import { describe, expect, it } from "vitest";
import { findKnownToken, resolveStablecoins, STABLECOINS } from "../../src/config/chains.js";

describe("STABLECOINS registry", () => {
  it("includes Mento and bridged fiat stablecoins", () => {
    const symbols = STABLECOINS.map((coin) => coin.symbol);
    expect(symbols).toContain("USDm");
    expect(symbols).toContain("USDT");
    expect(symbols).toContain("USDC");
    expect(symbols).toContain("USAT");
  });

  it("resolves USAT by symbol, alias, and address with 6 decimals", () => {
    const bySymbol = findKnownToken("USAT");
    const byAlias = findKnownToken("USA₮");
    const byAddress = findKnownToken(
      "0xD2ab3C9A02DBBAB236BfEC45D1d755DF4267F771",
    );

    expect(bySymbol?.symbol).toBe("USAT");
    expect(bySymbol?.decimals).toBe(6);
    expect(bySymbol?.address).toBe(
      "0xD2ab3C9A02DBBAB236BfEC45D1d755DF4267F771",
    );
    expect(byAlias?.symbol).toBe("USAT");
    expect(byAddress?.symbol).toBe("USAT");
  });

  it("excludes GoodDollar and WETH from stablecoin scans", () => {
    const symbols = STABLECOINS.map((coin) => coin.symbol);
    expect(symbols).not.toContain("GoodDollar");
    expect(symbols).not.toContain("WETH");
    expect(findKnownToken("GoodDollar")).toBeDefined();
    expect(findKnownToken("WETH")).toBeDefined();
  });

  it("rejects explicit GoodDollar in resolveStablecoins", () => {
    expect(() => resolveStablecoins(["GoodDollar"])).toThrow(/No matching stablecoins/);
  });
});
