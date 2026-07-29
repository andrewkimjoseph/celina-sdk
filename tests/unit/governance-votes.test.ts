import { describe, expect, it, vi } from "vitest";
import type { PublicClient } from "viem";
import type { CeloClientFactory } from "../../src/clients/celo-client.js";
import { CELO_CORE_CONTRACTS } from "../../src/config/celo-core-contracts.js";
import { GovernanceService } from "../../src/services/governance.service.js";

const WALLET = "0x1111111111111111111111111111111111111111" as const;
const VOTE_SIGNER = "0x2222222222222222222222222222222222222222" as const;
const ACCOUNT = "0x3333333333333333333333333333333333333333" as const;

function createService(mocks: {
  isAccount?: boolean;
  voteSignerAccount?: `0x${string}` | null;
  dequeued?: readonly bigint[];
  voteRecords?: Array<
    readonly [bigint, bigint, bigint, bigint, bigint, bigint] | "failure"
  >;
  upvote?: readonly [bigint, bigint];
  goldUsed?: bigint;
  proposalStage?: number;
}) {
  const {
    isAccount = true,
    voteSignerAccount = null,
    dequeued = [99n, 100n],
    voteRecords = [
      [99n, 0n, 0n, 1_000_000_000_000_000_000n, 0n, 0n],
      [0n, 0n, 0n, 0n, 0n, 0n],
    ],
    upvote = [42n, 500_000_000_000_000_000n],
    goldUsed = 1_500_000_000_000_000_000n,
    proposalStage = 3,
  } = mocks;

  const readContract = vi.fn(async (args: { functionName: string; args?: unknown[] }) => {
    switch (args.functionName) {
      case "isAccount":
        return isAccount;
      case "voteSignerToAccount":
        if (voteSignerAccount) {
          return voteSignerAccount;
        }
        throw new Error("reverted");
      case "getDequeue":
        return dequeued;
      case "getUpvoteRecord":
        return upvote;
      case "getAmountOfGoldUsedForVoting":
        return goldUsed;
      case "getProposal":
        return [
          "0x4444444444444444444444444444444444444444",
          0n,
          1_700_000_000n,
          1n,
          "https://example.com/cgp-0099.md",
          1_000_000n,
          true,
        ];
      case "getProposalStage":
        return proposalStage;
      case "getVoteTotals":
        return [0n, 0n, 0n];
      default:
        throw new Error(`Unexpected readContract: ${args.functionName}`);
    }
  });

  const multicall = vi.fn(async (args: { contracts: unknown[] }) =>
    args.contracts.map((_, index) => {
      const record = voteRecords[index];
      if (!record || record === "failure") {
        return { status: "failure" as const, error: new Error("failed") };
      }
      return { status: "success" as const, result: record };
    }),
  );

  const clientFactory = {
    getClients: () => ({
      public: { readContract, multicall } as unknown as PublicClient,
    }),
    getConfig: () => ({}),
  } as CeloClientFactory;

  return {
    service: new GovernanceService(clientFactory),
    readContract,
    multicall,
  };
}

describe("GovernanceService.getGovernanceVotes", () => {
  it("returns referendum votes with non-zero weights and skips empty slots", async () => {
    const { service } = createService({});

    const result = await service.getGovernanceVotes(WALLET);

    expect(result.address).toBe(WALLET);
    expect(result.referendumVotes).toHaveLength(1);
    expect(result.referendumVotes[0]).toMatchObject({
      proposalId: 99,
      dequeueIndex: 0,
      yesVotes: "1000000000000000000",
      noVotes: "0",
      abstainVotes: "0",
      stale: false,
      stage: "Referendum",
    });
    expect(result.upvote).toEqual({
      proposalId: 42,
      weight: "500000000000000000",
      weightFormatted: "0.5 CELO",
    });
    expect(result.goldUsedForVoting).toBe("1500000000000000000");
    expect(result.message).toContain("1 referendum vote(s)");
  });

  it("marks stale when record proposalId does not match dequeue slot", async () => {
    const { service } = createService({
      dequeued: [200n],
      voteRecords: [[150n, 0n, 0n, 1_000_000_000_000_000_000n, 0n, 0n]],
    });

    const result = await service.getGovernanceVotes(WALLET);

    expect(result.referendumVotes[0]?.stale).toBe(true);
    expect(result.referendumVotes[0]?.proposalId).toBe(150);
  });

  it("filters by proposal_id for referendum votes and upvotes", async () => {
    const { service } = createService({
      dequeued: [99n, 100n],
      voteRecords: [[100n, 0n, 0n, 0n, 2_000_000_000_000_000_000n, 0n]],
      upvote: [42n, 500_000_000_000_000_000n],
    });

    const result = await service.getGovernanceVotes(WALLET, { proposalId: 100 });

    expect(result.referendumVotes).toHaveLength(1);
    expect(result.referendumVotes[0]?.proposalId).toBe(100);
    expect(result.upvote).toBeNull();
  });

  it("resolves vote-signer address to governance account", async () => {
    const { service, readContract } = createService({
      isAccount: false,
      voteSignerAccount: ACCOUNT,
      dequeued: [99n],
      voteRecords: [[99n, 0n, 0n, 1_000_000_000_000_000_000n, 0n, 0n]],
    });

    const result = await service.getGovernanceVotes(VOTE_SIGNER);

    expect(readContract).toHaveBeenCalledWith(
      expect.objectContaining({
        address: CELO_CORE_CONTRACTS.accounts,
        functionName: "voteSignerToAccount",
        args: [VOTE_SIGNER],
      }),
    );
    expect(result.address).toBe(ACCOUNT);
    expect(result.queriedAddress).toBe(VOTE_SIGNER);
  });
});
