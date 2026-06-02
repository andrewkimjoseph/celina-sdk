import { describe, expect, it, vi } from "vitest";
import { finalizeCarbonPrepare } from "../../src/utils/finalize-carbon-prepare.js";
import type { CarbonPrepareResult } from "../../src/types/carbon.js";

const WALLET = "0xC1aC9666aa6704758644ee42c9354ce28a43f878" as const;

describe("finalizeCarbonPrepare", () => {
  it("merges buildExecutionSteps into preparedFlow and preserves metadata", async () => {
    const approveStep = {
      kind: "erc20" as const,
      to: "0x765DE816845861e75A25CA122013886E985123" as const,
      data: "0xapprove" as const,
      description: "Approve USDT",
    };
    const carbonStep = {
      kind: "contract" as const,
      to: "0x6619871118D144c1c28eC3b23036FC1f0829ed3a" as const,
      data: "0xcarbon" as const,
      description: "Carbon limit order",
    };

    const carbon = {
      buildExecutionSteps: vi.fn().mockResolvedValue([approveStep, carbonStep]),
    };

    const prepared: CarbonPrepareResult = {
      status: "ok",
      warnings: ["Check price"],
      deep_link: "https://celo.carbondefi.xyz/trade/disposable?foo=bar",
      preparedFlow: {
        preparedFlow: true,
        from: WALLET,
        network: "mainnet",
        summary: "Carbon limit order",
        steps: [carbonStep],
      },
    };

    const result = await finalizeCarbonPrepare(
      carbon,
      WALLET,
      prepared,
      { wallet_address: WALLET, budget: 100 },
    );

    expect(carbon.buildExecutionSteps).toHaveBeenCalledWith(
      WALLET,
      prepared,
      { wallet_address: WALLET, budget: 100 },
    );
    expect(result.steps).toHaveLength(2);
    expect(result.steps[0]).toEqual(approveStep);
    expect(result.deep_link).toBe(prepared.deep_link);
    expect(result.warnings).toEqual(["Check price"]);
    expect(result.summary).toBe("Carbon limit order");
  });

  it("throws when Carbon REST returns no preparedFlow", async () => {
    await expect(
      finalizeCarbonPrepare(
        { buildExecutionSteps: vi.fn() },
        WALLET,
        { status: "ok", warnings: [] },
        {},
      ),
    ).rejects.toThrow("Carbon prepare returned no transaction steps.");
  });
});
