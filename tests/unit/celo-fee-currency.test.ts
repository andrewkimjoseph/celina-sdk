import { describe, expect, it, vi } from "vitest";
import type { PublicClient } from "viem";
import {
  feeCurrencySymbol,
  MINIPAY_FEE_CURRENCIES,
  resolveMiniPayFeeCurrency,
} from "../../src/utils/celo-fee-currency.js";

function mockPublicClient(multicall: ReturnType<typeof vi.fn>): PublicClient {
  return { multicall } as unknown as PublicClient;
}

describe("resolveMiniPayFeeCurrency", () => {
  const from = "0xA3872860EE9FEaB369c1a5E911CeCc2F4c40f702" as const;

  it("returns explicit override", async () => {
    const usdtAdapter = MINIPAY_FEE_CURRENCIES[0]!.feeCurrency;
    const multicall = vi.fn();
    const client = mockPublicClient(multicall);
    const result = await resolveMiniPayFeeCurrency(client, from, {
      feeCurrency: usdtAdapter,
    });
    expect(result).toBe(usdtAdapter);
    expect(multicall).not.toHaveBeenCalled();
  });

  it("returns USDT adapter when USDT balance wins", async () => {
    const client = mockPublicClient(
      vi.fn().mockResolvedValue([
        { status: "success", result: 1_000_000n },
        { status: "success", result: 500n },
        { status: "success", result: 500n },
      ]),
    );
    const result = await resolveMiniPayFeeCurrency(client, from, {
      isMiniPay: true,
    });
    expect(result).toBe(MINIPAY_FEE_CURRENCIES[0]!.feeCurrency);
    expect(result).not.toBe(MINIPAY_FEE_CURRENCIES[0]!.token);
  });

  it("picks highest stable balance with USDT tiebreak", async () => {
    const client = mockPublicClient(
      vi.fn().mockResolvedValue([
        { status: "success", result: 1000n },
        { status: "success", result: 1000n },
        { status: "success", result: 500n },
      ]),
    );
    const result = await resolveMiniPayFeeCurrency(client, from, {
      isMiniPay: true,
    });
    expect(result).toBe(MINIPAY_FEE_CURRENCIES[0]!.feeCurrency);
  });

  it("throws in MiniPay when no stable balance", async () => {
    const client = mockPublicClient(
      vi.fn().mockResolvedValue([
        { status: "success", result: 0n },
        { status: "success", result: 0n },
        { status: "success", result: 0n },
      ]),
    );
    await expect(
      resolveMiniPayFeeCurrency(client, from, { isMiniPay: true }),
    ).rejects.toThrow(/No stablecoin balance for gas/);
  });

  it("falls back to CELO when not MiniPay and no stables", async () => {
    const client = mockPublicClient(
      vi.fn().mockResolvedValue([
        { status: "success", result: 0n },
        { status: "success", result: 0n },
        { status: "success", result: 0n },
      ]),
    );
    const result = await resolveMiniPayFeeCurrency(client, from, {
      isMiniPay: false,
    });
    expect(result).toBeUndefined();
  });
});

describe("feeCurrencySymbol", () => {
  it("returns CELO for undefined", () => {
    expect(feeCurrencySymbol(undefined)).toBe("CELO");
  });

  it("returns USDT for token and adapter addresses", () => {
    expect(feeCurrencySymbol(MINIPAY_FEE_CURRENCIES[0]!.token)).toBe("USDT");
    expect(feeCurrencySymbol(MINIPAY_FEE_CURRENCIES[0]!.feeCurrency)).toBe("USDT");
  });
});
