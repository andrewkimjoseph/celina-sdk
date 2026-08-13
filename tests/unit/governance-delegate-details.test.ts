import { afterEach, describe, expect, it, vi } from "vitest";
import type { PublicClient } from "viem";
import {
  CELO_MONDO_DELEGATES_URL,
  clearGovernanceDelegatesCacheForTests,
  getGovernanceDelegateDetails,
} from "../../src/services/governance-delegates.js";

const LISTED_ADDRESS = "0x1111111111111111111111111111111111111111" as const;
const UNKNOWN_ADDRESS = "0x2222222222222222222222222222222222222222" as const;

const SAMPLE_METADATA = {
  sample: {
    name: "Sample Delegate",
    address: LISTED_ADDRESS,
    logoUri: "https://example.com/logo.png",
    date: "2024-01-01",
    links: { website: "https://example.com" },
    interests: ["Governance"],
    description: "A sample delegate for testing.",
  },
};

function mockClient(readResults: bigint[]): PublicClient {
  let callIndex = 0;
  return {
    readContract: vi.fn(async () => {
      const value = readResults[callIndex] ?? 0n;
      callIndex += 1;
      return value;
    }),
  } as unknown as PublicClient;
}

describe("getGovernanceDelegateDetails", () => {
  afterEach(() => {
    clearGovernanceDelegatesCacheForTests();
    vi.restoreAllMocks();
  });

  it("returns Mondo metadata and on-chain stats for a listed delegate", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => SAMPLE_METADATA,
      })),
    );

    const client = mockClient([
      5_000_000_000_000_000_000n, // votingPower
      0n, // delegatedFraction
      2_000_000_000_000_000_000n, // delegatedToBalance
      5_000_000_000_000_000_000n, // totalLocked
      1_000_000_000_000_000_000n, // nonvotingLocked
    ]);

    const result = await getGovernanceDelegateDetails(client, LISTED_ADDRESS);

    expect(result.inMondoDirectory).toBe(true);
    expect(result.metadata?.name).toBe("Sample Delegate");
    expect(result.address).toBe(LISTED_ADDRESS);
    expect(result.votingPower).toBe("5000000000000000000");
    expect(result.delegatedToBalance).toBe("2000000000000000000");
    expect(result.delegatedByPercent).toBe("0.00");
    expect(result.sourceUrl).toBe(CELO_MONDO_DELEGATES_URL);
  });

  it("returns on-chain stats with null metadata for an unknown address", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => SAMPLE_METADATA,
      })),
    );

    const client = mockClient([
      0n,
      0n,
      0n,
      0n,
      0n,
    ]);

    const result = await getGovernanceDelegateDetails(client, UNKNOWN_ADDRESS);

    expect(result.inMondoDirectory).toBe(false);
    expect(result.metadata).toBeNull();
    expect(result.address).toBe(UNKNOWN_ADDRESS);
    expect(result.votingPower).toBe("0");
  });
});
