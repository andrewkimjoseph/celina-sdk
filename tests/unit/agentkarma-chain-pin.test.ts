import { describe, expect, it, vi } from "vitest";

// The AgentKarma SDK never serializes `chain` onto the request URL (it keys by
// composite (chain,address) server-side), so a mocked-fetch test cannot observe
// it. To actually pin chain="celo", spy on the SDK client the service builds.
const { getKarmaSpy, getCeloAgentSpy } = vi.hoisted(() => ({
  getKarmaSpy: vi.fn(async () => ({ address: "0x", face: "both", autonomy: {} })),
  getCeloAgentSpy: vi.fn(async () => ({ chain: "celo", agentId: 1, owner: "0x" })),
}));

vi.mock("@agentkarma/sdk", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@agentkarma/sdk")>();
  return {
    ...actual,
    createAgentKarmaClient: vi.fn((config?: { baseUrl?: string }) => ({
      baseUrl: config?.baseUrl ?? "https://agentkarma.io",
      getKarma: getKarmaSpy,
      getCeloAgent: getCeloAgentSpy,
    })),
  };
});

import { AgentKarmaService } from "../../src/services/agentkarma.service.js";

const WALLET = "0x1234567890abcdef1234567890abcdef12345678";

describe("AgentKarmaService chain pinning", () => {
  it("pins getKarma to chain 'celo' with default face 'both'", async () => {
    const ak = new AgentKarmaService();
    await ak.getKarma(WALLET);
    expect(getKarmaSpy).toHaveBeenLastCalledWith(WALLET, {
      chain: "celo",
      face: "both",
    });
  });

  it("keeps chain 'celo' when a face is given explicitly", async () => {
    const ak = new AgentKarmaService();
    await ak.getKarma(WALLET, { face: "provider" });
    expect(getKarmaSpy).toHaveBeenLastCalledWith(WALLET, {
      chain: "celo",
      face: "provider",
    });
  });

  it("evaluateCounterparty always fetches both faces on celo", async () => {
    const ak = new AgentKarmaService();
    await ak.evaluateCounterparty(WALLET, { minScore: 10 });
    expect(getKarmaSpy).toHaveBeenLastCalledWith(WALLET, {
      chain: "celo",
      face: "both",
    });
  });
});
