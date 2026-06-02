import { describe, expect, it } from "vitest";
import { CeloClientFactory } from "../../src/clients/celo-client.js";
import { resolveSdkConfig } from "../../src/config/sdk-config.js";
import { TokenService } from "../../src/services/token.service.js";
import {
  applyCarbonStepLabels,
  describeCarbonControllerStep,
} from "../../src/utils/carbon-step-labels.js";
import type { PreparedTx } from "../../src/types/prepared.js";

function makeTokenService() {
  return new TokenService(new CeloClientFactory(resolveSdkConfig({})));
}

function controllerStep(index = 0): PreparedTx {
  return {
    kind: "contract",
    to: "0x6619871118D144c1c28eC3b23036FC1f0829ed3a",
    data: "0xdeadbeef",
    description: `Carbon transaction step ${index + 1}`,
  };
}

function approveStep(): PreparedTx {
  return {
    kind: "erc20",
    to: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
    data: "0xapprove",
    description: "Approve 0.02 USDT for Carbon DeFi",
  };
}

describe("carbon-step-labels", () => {
  const tokenService = makeTokenService();

  it("labels limit buy with budget and pair", () => {
    const label = describeCarbonControllerStep(
      {
        summary: "Carbon limit order",
        orderMeta: {
          base_token: "CELO",
          quote_token: "USDT",
          direction: "buy",
          budget: 0.02,
        },
        strategyPreview: {
          type: "limit_order",
          direction: "buy",
          budget: 0.02,
        },
        tokenService,
      },
      0,
      1,
    );

    expect(label).toMatch(/limit buy/i);
    expect(label).toContain("USDT");
    expect(label).toContain("CELO / USDT");
    expect(label).not.toMatch(/step 1$/i);
  });

  it("leaves approve steps unchanged", () => {
    const steps = applyCarbonStepLabels([approveStep(), controllerStep()], {
      summary: "Carbon limit order",
      orderMeta: {
        base_token: "CELO",
        quote_token: "USDT",
        direction: "buy",
        budget: 0.02,
      },
      tokenService,
    });

    expect(steps[0].description).toBe("Approve 0.02 USDT for Carbon DeFi");
    expect(steps[1].description).toMatch(/limit buy/i);
    expect(steps[1].description).not.toBe("Carbon transaction step 1");
  });

  it("labels manage deposit from summary", () => {
    const label = describeCarbonControllerStep(
      {
        summary: "Carbon deposit budget",
        orderMeta: { strategy_id: "123" },
        tokenService,
      },
      0,
      1,
    );

    expect(label).toBe("Deposit to Carbon strategy");
  });

  it("suffixes multi-controller steps", () => {
    const ctx = {
      summary: "Carbon limit order",
      orderMeta: {
        base_token: "CELO",
        quote_token: "USDT",
        direction: "buy",
        budget: 0.02,
      },
      tokenService,
    };

    const steps = applyCarbonStepLabels(
      [controllerStep(0), controllerStep(1)],
      ctx,
    );

    expect(steps[0].description).toContain("(step 1 of 2)");
    expect(steps[1].description).toContain("(step 2 of 2)");
  });

  it("labels taker swap", () => {
    const label = describeCarbonControllerStep(
      {
        summary: "Carbon taker swap",
        orderMeta: {
          source_token: "USDT",
          amount: 10,
        },
        tokenService,
      },
      0,
      1,
    );

    expect(label).toBe("Swap via Carbon DeFi");
  });
});
