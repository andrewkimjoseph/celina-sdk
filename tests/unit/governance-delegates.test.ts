import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { parseEther } from "viem";
import {
  CELO_MONDO_DELEGATES_URL,
  clearGovernanceDelegatesCacheForTests,
  getGovernanceDelegates,
} from "../../src/services/governance-delegates.js";
import { percentToFixidity } from "../../src/utils/fixidity.js";

const DELEGATE_A = {
  name: "Alice Delegate",
  address: "0x1111111111111111111111111111111111111111",
  logoUri: "/logos/alice.png",
  date: "2024-01-01",
  links: { website: "https://alice.example" },
  interests: ["Governance"],
  description: "Alice focuses on governance design.",
};

const DELEGATE_B = {
  name: "Bob Builder",
  address: "0x2222222222222222222222222222222222222222",
  logoUri: "/logos/bob.png",
  date: "2024-02-01",
  links: { twitter: "https://x.com/bob" },
  interests: ["DeFi", "Community"],
  description: "Bob builds DeFi tools for Celo.",
};

const MOCK_JSON = {
  [DELEGATE_A.address]: DELEGATE_A,
  [DELEGATE_B.address]: DELEGATE_B,
};

describe("getGovernanceDelegates", () => {
  beforeEach(() => {
    clearGovernanceDelegatesCacheForTests();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => MOCK_JSON,
      })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    clearGovernanceDelegatesCacheForTests();
  });

  it("returns Mondo directory metadata with source fields", async () => {
    const client = { multicall: vi.fn() } as never;
    const result = await getGovernanceDelegates(client, { includeStats: false });

    expect(result.source).toBe("celo-mondo");
    expect(result.sourceUrl).toBe(CELO_MONDO_DELEGATES_URL);
    expect(result.directoryNote).toContain("off-chain");
    expect(result.delegates).toHaveLength(2);
    expect(result.delegates[0]?.name).toBe("Alice Delegate");
    expect(fetch).toHaveBeenCalledWith(
      CELO_MONDO_DELEGATES_URL,
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("filters by search term", async () => {
    const client = { multicall: vi.fn() } as never;
    const result = await getGovernanceDelegates(client, {
      search: "defi",
      includeStats: false,
    });

    expect(result.delegates).toHaveLength(1);
    expect(result.delegates[0]?.name).toBe("Bob Builder");
    expect(result.pagination.total).toBe(1);
  });

  it("paginates results", async () => {
    const client = { multicall: vi.fn() } as never;
    const result = await getGovernanceDelegates(client, {
      offset: 1,
      limit: 1,
      includeStats: false,
    });

    expect(result.delegates).toHaveLength(1);
    expect(result.pagination.total).toBe(2);
    expect(result.pagination.hasMore).toBe(false);
  });

  it("enriches with LockedGold stats when includeStats is true", async () => {
    const multicall = vi
      .fn()
      .mockResolvedValueOnce([
        { status: "success", result: parseEther("100") },
        { status: "success", result: parseEther("50") },
      ])
      .mockResolvedValueOnce([
        { status: "success", result: percentToFixidity(25) },
        { status: "success", result: 0n },
      ])
      .mockResolvedValueOnce([
        { status: "success", result: parseEther("10") },
        { status: "success", result: parseEther("5") },
      ]);

    const client = { multicall } as never;
    const result = await getGovernanceDelegates(client, { includeStats: true, limit: 2 });

    expect(multicall).toHaveBeenCalledTimes(3);
    expect(result.delegates[0]?.votingPower).toBe(parseEther("100").toString());
    expect(result.delegates[0]?.delegatedToBalanceFormatted).toBeDefined();
    expect(result.delegates[0]?.delegatedByPercent).toBe("25.00");
  });

  it("uses metadata cache on second call", async () => {
    const client = { multicall: vi.fn() } as never;
    await getGovernanceDelegates(client, { includeStats: false });
    await getGovernanceDelegates(client, { includeStats: false });

    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
