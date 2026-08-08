import { describe, expect, it, vi } from "vitest";
import { HumannessService } from "../../src/services/humanness.service.js";
import type { CeloClientFactory } from "../../src/clients/celo-client.js";
import type { SelfService } from "../../src/services/self.service.js";

function mockFactory(readImpl: (args: unknown) => Promise<unknown>) {
  return {
    getClients: () => ({
      public: {
        readContract: readImpl,
      },
    }),
  } as unknown as CeloClientFactory;
}

describe("HumannessService", () => {
  const address = "0x5409ED021D9299bf6814279A6A1411A7e866A631" as const;

  it("passes when Self agent is verified", async () => {
    const self = {
      verifyAgent: vi.fn().mockResolvedValue({ verified: true, agent_id: 42 }),
    } as unknown as SelfService;

    const service = new HumannessService(mockFactory(async () => false), self);
    const result = await service.checkHumanness(address);

    expect(result.isHumanOverall).toBe(true);
    expect(result.selfAgent.isHuman).toBe(true);
    expect(self.verifyAgent).toHaveBeenCalledWith({
      agentAddress: address,
      requireOfac: false,
      requireAge: 18,
    });
  });

  it("passes Self rail when verifyAgent succeeds without requiring OFAC", async () => {
    const self = {
      verifyAgent: vi.fn().mockResolvedValue({
        verified: true,
        agent_id: 7,
      }),
    } as unknown as SelfService;

    const service = new HumannessService(mockFactory(async () => false), self);
    const result = await service.checkHumanness(address);

    expect(result.isHumanOverall).toBe(true);
    expect(result.selfAgent.isHuman).toBe(true);
    expect(self.verifyAgent).toHaveBeenCalledWith({
      agentAddress: address,
      requireOfac: false,
      requireAge: 18,
    });
  });

  it("passes when GoodDollar whitelists address", async () => {
    const self = {
      verifyAgent: vi.fn().mockResolvedValue({ verified: false, reason: "not verified" }),
    } as unknown as SelfService;

    const service = new HumannessService(
      mockFactory(async ({ functionName }) => {
        if (functionName === "getWhitelistedRoot") {
          return address;
        }
        if (functionName === "isWhitelisted") return true;
        return false;
      }),
      self,
    );

    const result = await service.checkHumanness(address);
    expect(result.isHumanOverall).toBe(true);
    expect(result.goodDollar.isHuman).toBe(true);
  });

  it("returns reverify-index-out-of-bounds on IdentityV4 revert", async () => {
    const self = {
      verifyAgent: vi.fn().mockResolvedValue({ verified: false }),
    } as unknown as SelfService;

    const service = new HumannessService(
      mockFactory(async () => {
        throw new Error("execution reverted: reverifyDaysOptions out of bounds");
      }),
      self,
    );

    const result = await service.checkHumanness(address);
    expect(result.isHumanOverall).toBe(false);
    expect(result.goodDollar.reason).toBe("reverify-index-out-of-bounds");
  });
});
