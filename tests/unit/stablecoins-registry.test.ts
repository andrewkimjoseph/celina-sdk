import { describe, expect, it } from "vitest";
import { findKnownToken, resolveStablecoins, STABLECOINS } from "../../src/config/chains.js";

describe("STABLECOINS registry", () => {
  it("includes Mento and bridged fiat stablecoins", () => {
    const symbols = STABLECOINS.map((coin) => coin.symbol);
    expect(symbols).toContain("USDm");
    expect(symbols).toContain("USDT");
    expect(symbols).toContain("USDC");
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
