import { describe, expect, it, vi } from "vitest";
import { pad } from "viem";
import { SelfService } from "../../src/services/self.service.js";
import type { CeloClientFactory } from "../../src/clients/celo-client.js";

const agentAddress = "0x5409ED021D9299bf6814279A6A1411A7e866A631" as const;
const selfProvider = "0x0B43f87a4c2b8e9a1d2c3b4a5e6f708192a3b4c5" as const;

function mockVerifyReads(opts: {
  olderThan: bigint;
  ofacClear: boolean;
  nationality?: string;
}) {
  const readContract = vi.fn(
    async ({ functionName }: { functionName: string }) => {
      switch (functionName) {
        case "isVerifiedAgent":
          return true;
        case "getAgentId":
          return 42n;
        case "getHumanNullifier":
          return 1n;
        case "getAgentCountForHuman":
          return 1n;
        case "getProofProvider":
          return selfProvider;
        case "selfProofProvider":
          return selfProvider;
        case "agentRegisteredAt":
          return 1_700_000_000n;
        case "proofExpiresAt":
          return BigInt(Math.floor(Date.now() / 1000) + 86_400 * 100);
        case "isProofFresh":
          return true;
        case "getAgentsForNullifier":
          return [42n];
        case "getAgentCredentials":
          return {
            issuingState: "USA",
            name: ["Test"],
            idNumber: "",
            nationality: opts.nationality ?? "USA",
            dateOfBirth: "",
            gender: "",
            expiryDate: "",
            olderThan: opts.olderThan,
            ofac: [opts.ofacClear, opts.ofacClear, opts.ofacClear] as const,
          };
        default:
          throw new Error(`unexpected read: ${functionName}`);
      }
    },
  );

  // Ensure agentKey derivation stays valid for isVerifiedAgent args
  void pad(agentAddress, { size: 32 });

  return {
    getClients: () => ({
      public: { readContract },
    }),
  } as unknown as CeloClientFactory;
}

describe("SelfService.verifyAgent defaults", () => {
  it("fails by default when OFAC is not clear", async () => {
    const service = new SelfService(
      mockVerifyReads({ olderThan: 18n, ofacClear: false }),
      {},
    );

    const result = await service.verifyAgent({ agentAddress });

    expect(result.verified).toBe(false);
    expect("reason" in result && result.reason).toMatch(/OFAC/i);
  });

  it("fails by default when age is below 18", async () => {
    const service = new SelfService(
      mockVerifyReads({ olderThan: 0n, ofacClear: true }),
      {},
    );

    const result = await service.verifyAgent({ agentAddress });

    expect(result.verified).toBe(false);
    expect("reason" in result && result.reason).toMatch(/age/i);
  });

  it("passes when age 18+ and OFAC clear", async () => {
    const service = new SelfService(
      mockVerifyReads({ olderThan: 18n, ofacClear: true, nationality: "KEN" }),
      {},
    );

    const result = await service.verifyAgent({ agentAddress });

    expect(result.verified).toBe(true);
    if ("credentials" in result) {
      expect(result.credentials?.nationality).toBe("KEN");
      expect(result.credentials?.ofac_clear).toBe(true);
      expect(result.credentials?.older_than).toBe(18);
    }
  });

  it("allows relaxing OFAC via requireOfac false", async () => {
    const service = new SelfService(
      mockVerifyReads({ olderThan: 18n, ofacClear: false }),
      {},
    );

    const result = await service.verifyAgent({
      agentAddress,
      requireOfac: false,
    });

    expect(result.verified).toBe(true);
  });
});
