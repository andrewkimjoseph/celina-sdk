import { describe, expect, it, vi } from "vitest";
import type { PublicClient } from "viem";
import type { CeloClientFactory } from "../../src/clients/celo-client.js";
import { CELO_CORE_CONTRACTS } from "../../src/config/celo-core-contracts.js";
import { GovernanceService } from "../../src/services/governance.service.js";

const WALLET = "0x1111111111111111111111111111111111111111" as const;

function createService(mocks: {
  queue?: Array<[number, bigint]>;
  upvoteRecord?: readonly [bigint, bigint];
  lockedGold?: bigint;
  dequeued?: readonly bigint[];
  voteRecords?: Array<readonly [bigint, bigint, bigint, bigint, bigint, bigint]>;
}) {
  const {
    queue = [
      [10, 100n],
      [20, 200n],
    ],
    upvoteRecord = [0n, 0n],
    lockedGold = 1_000_000_000_000_000_000n,
    dequeued = [],
    voteRecords = [],
  } = mocks;

  const readContract = vi.fn(async (args: { functionName: string; args?: unknown[] }) => {
    switch (args.functionName) {
      case "isAccount":
        return true;
      case "getQueue": {
        const ids = queue.map(([id]) => BigInt(id));
        const upvotes = queue.map(([, weight]) => weight);
        return [ids, upvotes] as const;
      }
      case "getUpvoteRecord":
        return upvoteRecord;
      case "getAccountTotalLockedGold":
        return lockedGold;
      case "getDequeue":
        return dequeued;
      case "getAmountOfGoldUsedForVoting":
        return 0n;
      case "getProposal":
        return [
          "0x4444444444444444444444444444444444444444",
          0n,
          1_700_000_000n,
          1n,
          "https://example.com/cgp.md",
          1_000_000n,
          true,
        ];
      case "getProposalStage":
        return 1;
      case "getVoteTotals":
        return [0n, 0n, 0n];
      default:
        throw new Error(`Unexpected readContract: ${args.functionName}`);
    }
  });

  const multicall = vi.fn(async (args: { contracts: unknown[] }) =>
    args.contracts.map((_, index) => ({
      status: "success" as const,
      result: voteRecords[index] ?? [0n, 0n, 0n, 0n, 0n, 0n],
    })),
  );

  const clientFactory = {
    getClients: () => ({
      public: { readContract, multicall } as unknown as PublicClient,
    }),
    getConfig: () => ({}),
  } as CeloClientFactory;

  return new GovernanceService(clientFactory);
}

describe("GovernanceService upvote + revoke prepares", () => {
  it("prepareUpvote encodes upvote with queue neighbors", async () => {
    const service = createService({});
    const flow = await service.prepareUpvote(WALLET, 10);

    expect(flow.steps).toHaveLength(1);
    expect(flow.steps[0]?.to).toBe(CELO_CORE_CONTRACTS.governance);
    expect(flow.summary).toContain("Upvote governance proposal #10");
  });

  it("prepareUpvote rejects when proposal is not queued", async () => {
    const service = createService({});
    await expect(service.prepareUpvote(WALLET, 99)).rejects.toThrow("not in the governance queue");
  });

  it("prepareUpvote rejects when locked gold is zero", async () => {
    const service = createService({ lockedGold: 0n });
    await expect(service.prepareUpvote(WALLET, 10)).rejects.toThrow("locked CELO");
  });

  it("prepareUpvote rejects when another queue upvote is active", async () => {
    const service = createService({ upvoteRecord: [20n, 500n] });
    await expect(service.prepareUpvote(WALLET, 10)).rejects.toThrow("active upvote");
  });

  it("prepareRevokeGovernanceVotes rejects when no referendum votes", async () => {
    const service = createService({});
    await expect(service.prepareRevokeGovernanceVotes(WALLET)).rejects.toThrow(
      "No referendum votes",
    );
  });

  it("prepareRevokeGovernanceVotes encodes revokeVotes", async () => {
    const service = createService({
      dequeued: [10n],
      voteRecords: [[10n, 0n, 0n, 1_000n, 0n, 0n]],
    });
    const flow = await service.prepareRevokeGovernanceVotes(WALLET);

    expect(flow.steps).toHaveLength(1);
    expect(flow.summary).toContain("Revoke all governance referendum votes");
  });

  it("prepareRevokeGovernanceUpvote encodes revokeUpvote", async () => {
    const service = createService({ upvoteRecord: [10n, 1_000n] });
    const flow = await service.prepareRevokeGovernanceUpvote(WALLET);

    expect(flow.steps).toHaveLength(1);
    expect(flow.summary).toContain("Revoke governance upvote");
  });

  it("prepareRevokeGovernanceUpvote validates proposal_id", async () => {
    const service = createService({ upvoteRecord: [10n, 1_000n] });
    await expect(
      service.prepareRevokeGovernanceUpvote(WALLET, { proposalId: 20 }),
    ).rejects.toThrow("Active upvote is on proposal 10");
  });
});
