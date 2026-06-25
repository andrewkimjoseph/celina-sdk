import { describe, expect, it, vi } from "vitest";
import { AgentKarmaService } from "../../src/services/agentkarma.service.js";
import type { CeloAgentSnapshot, KarmaSnapshot } from "../../src/services/agentkarma.service.js";

// A Celo agent wallet. NOT a valid Solana base58 address — so a successful read
// proves the adapter pins chain="celo" (chain="solana" would reject this shape).
const CELO_WALLET = "0x1234567890abcdef1234567890abcdef12345678";

const karmaBoth: KarmaSnapshot = {
  address: CELO_WALLET,
  face: "both",
  identity: { claimed: true, displayName: "Test Agent" },
  txCount: 42,
  lastActive: "2026-06-20T00:00:00.000Z",
  provider: {
    score: 50,
    trustTier: "Fair",
    confidenceBadge: "behavior-inferred",
    metrics: { success_rate: 0.8 },
    tierAggregates: { tier1: null, tier2: 0.8, tier3: null, tier4: null },
    hasSignal: true,
  },
  consumer: {
    score: 70,
    trustTier: "Good",
    confidenceBadge: "receipt-backed",
    metrics: null,
    tierAggregates: { tier1: 0.9, tier2: null, tier3: null, tier4: null },
    hasSignal: true,
  },
  autonomy: {
    score: 88,
    label: "agent-like",
    signals: {},
    effectiveWeights: {},
    txCount: 42,
    lastUpdated: "2026-06-20T00:00:00.000Z",
  },
};

const celoAgent: CeloAgentSnapshot = {
  chain: "celo",
  agentId: 9058,
  owner: "0xcfc0000000000000000000000000000000005b96",
  agentWallet: CELO_WALLET,
  tokenURI: "https://agentkarma.io/.well-known/agent.json",
  registration: { name: "AgentKarma", x402Support: true },
  reputation: { count: 3, average: 4.5, records: [] },
  explorer: {
    celoscan: "https://celoscan.io/token/x?a=9058",
    eightthousandfourscan: "https://8004scan.org/celo/9058",
  },
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/** Mock fetch that records calls and replays a fixed body. */
function mockFetch(body: unknown) {
  const calls: string[] = [];
  const fetchImpl = vi.fn(async (input: string | URL | Request) => {
    calls.push(String(input));
    return jsonResponse(body);
  });
  return { fetchImpl, calls };
}

describe("AgentKarmaService", () => {
  it("getKarma reads the Celo score API through the AgentKarma SDK", async () => {
    const { fetchImpl, calls } = mockFetch(karmaBoth);
    const ak = new AgentKarmaService({ fetch: fetchImpl });

    const snap = await ak.getKarma(CELO_WALLET);

    expect(calls).toHaveLength(1);
    expect(calls[0]).toBe(
      `https://agentkarma.io/api/v2/score/${CELO_WALLET}?face=both`,
    );
    expect(snap.address).toBe(CELO_WALLET);
    expect(snap.provider?.score).toBe(50);
    expect(ak.chain).toBe("celo");
  });

  it("getKarma honors a face selector and a custom baseUrl", async () => {
    const { fetchImpl, calls } = mockFetch(karmaBoth);
    const ak = new AgentKarmaService({
      fetch: fetchImpl,
      baseUrl: "https://staging.agentkarma.io",
    });

    await ak.getKarma(CELO_WALLET, { face: "provider" });

    expect(calls[0]).toBe(
      `https://staging.agentkarma.io/api/v2/score/${CELO_WALLET}?face=provider`,
    );
    expect(ak.baseUrl).toBe("https://staging.agentkarma.io");
  });

  it("getCeloAgent resolves an ERC-8004 agent by id", async () => {
    const { fetchImpl, calls } = mockFetch(celoAgent);
    const ak = new AgentKarmaService({ fetch: fetchImpl });

    const agent = await ak.getCeloAgent(9058);

    expect(calls[0]).toBe("https://agentkarma.io/api/v2/celo/9058");
    expect(agent.chain).toBe("celo");
    expect(agent.agentId).toBe(9058);
  });

  it("evaluateCounterparty returns an allow decision when the policy passes", async () => {
    const { fetchImpl } = mockFetch(karmaBoth);
    const ak = new AgentKarmaService({ fetch: fetchImpl });

    const result = await ak.evaluateCounterparty(CELO_WALLET, { minScore: 10 });

    expect(result.chain).toBe("celo");
    expect(result.wallet).toBe(CELO_WALLET);
    expect(result.decision.allowed).toBe(true);
    expect(result.decision.reasons).toEqual([]);
    expect(result.snapshot.address).toBe(CELO_WALLET);
  });

  it("evaluateCounterparty returns denied reasons when the policy fails", async () => {
    const { fetchImpl } = mockFetch(karmaBoth);
    const ak = new AgentKarmaService({ fetch: fetchImpl });

    const result = await ak.evaluateCounterparty(CELO_WALLET, {
      face: "provider",
      minScore: 90,
      requireReceiptBacked: true,
    });

    expect(result.decision.allowed).toBe(false);
    // provider score 50 < 90, and provider has no Tier-1 receipt signal.
    expect(result.decision.reasons.length).toBeGreaterThanOrEqual(2);
    expect(
      result.decision.reasons.some((r: string) => r.includes("minScore")),
    ).toBe(true);
    expect(
      result.decision.reasons.some((r: string) =>
        r.includes("requireReceiptBacked"),
      ),
    ).toBe(true);
  });

  it("exposes the canonical @agentkarma/sdk/tools catalog", () => {
    const ak = new AgentKarmaService();
    const names = ak.catalog.map((t) => t.name);
    // Drawn from the shared SDK catalog, not re-defined locally.
    expect(names).toContain("get_karma");
    expect(names).toContain("get_celo_agent");
    expect(names).toContain("check_trust");
    expect(ak.catalog.length).toBeGreaterThanOrEqual(9);
  });

  it("runCatalogTool executes a catalog tool, Celo-pinned", async () => {
    const { fetchImpl, calls } = mockFetch(karmaBoth);
    const ak = new AgentKarmaService({ fetch: fetchImpl });

    // Routed through the SDK catalog's get_karma handler — chain forced to celo,
    // so an EVM 0x address (invalid on Solana) resolves cleanly.
    const snap = (await ak.runCatalogTool("get_karma", {
      wallet: CELO_WALLET,
    })) as { address: string };

    expect(calls[0]).toBe(
      `https://agentkarma.io/api/v2/score/${CELO_WALLET}?face=both`,
    );
    expect(snap.address).toBe(CELO_WALLET);
  });
});
