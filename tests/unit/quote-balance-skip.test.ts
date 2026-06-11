import { describe, expect, it, vi } from "vitest";
import { MentoFxService } from "../../src/services/mento-fx.service.js";
import type { CeloClientFactory } from "../../src/clients/celo-client.js";

describe("quote services skip balance checks", () => {
  it("getFxQuote does not call assertSpendableBalance when from is set", async () => {
    const service = new MentoFxService({
      getClients: () => ({ public: {} }),
    } as unknown as CeloClientFactory);

    const tokenService = (
      service as unknown as { tokenService: { assertSpendableBalance: () => Promise<void> } }
    ).tokenService;
    const assertSpendableBalance = vi
      .spyOn(tokenService, "assertSpendableBalance")
      .mockResolvedValue();

    vi.spyOn(service as never, "resolveMentoPair").mockReturnValue({
      resolvedIn: { symbol: "USDm", decimals: 18, address: "0x1" },
      resolvedOut: { symbol: "EURm", decimals: 18, address: "0x2" },
      mentoIn: "0x1" as `0x${string}`,
      mentoOut: "0x2" as `0x${string}`,
    });
    vi.spyOn(service as never, "getMentoClient").mockResolvedValue({
      quotes: { getAmountOut: vi.fn(async () => 900_000n) },
      routes: { findRoute: vi.fn(async () => ({ path: ["a", "b"] })) },
    });

    const from = "0xC1C860804EFdA544fe79194d1a37e60b846CEdeb" as const;
    const result = await service.getFxQuote("USDm", "EURm", "1", from);

    expect(assertSpendableBalance).not.toHaveBeenCalled();
    expect(result.expectedOut).toBeDefined();
  });
});
