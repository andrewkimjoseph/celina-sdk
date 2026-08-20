import { describe, expect, it, vi } from "vitest";
import { GovernanceService } from "../../src/services/governance.service.js";

function makeProposalResult(id: number, url = `https://cgp.example/${id}`) {
  return [
    "0x1111111111111111111111111111111111111111",
    1n,
    1n,
    1n,
    url,
    0n,
    true,
  ] as const;
}

describe("GovernanceService actionable discovery", () => {
  it("returns queued and referendum proposals with one shared batched scan", async () => {
    const readContract = vi.fn(async ({ functionName }: { functionName: string }) => {
      if (functionName === "getQueue") {
        return [[5n, 4n], [1000000000000000000n, 500000000000000000n]] as const;
      }
      if (functionName === "getDequeue") {
        return [3n, 2n] as const;
      }
      throw new Error(`Unexpected readContract: ${functionName}`);
    });

    const multicall = vi.fn(
      async ({ contracts }: { contracts: Array<{ functionName: string; args: readonly [bigint] }> }) => {
        const fn = contracts[0]?.functionName;
        if (fn === "getProposal") {
          return contracts.map((c) => ({
            status: "success" as const,
            result: makeProposalResult(Number(c.args[0])),
          }));
        }
        if (fn === "getProposalStage") {
          const stages: Record<number, bigint> = {
            5: 1n, // Queued
            4: 2n, // Approval
            3: 3n, // Referendum
            2: 4n, // Execution
          };
          return contracts.map((c) => ({
            status: "success" as const,
            result: stages[Number(c.args[0])] ?? 0n,
          }));
        }
        throw new Error(`Unexpected multicall function: ${fn}`);
      },
    );

    const service = new GovernanceService({
      getConfig: () => ({}),
      getClients: () => ({ public: { readContract, multicall } }),
    } as any);

    const result = await service.getActionableGovernanceProposals();

    expect(result.hasAny).toBe(true);
    expect(result.hasQueued).toBe(true);
    expect(result.hasReferendum).toBe(true);
    expect(result.queued).toEqual([
      {
        proposalId: 5,
        upvotes: "1 CELO",
        stage: "Queued",
        url: "https://cgp.example/5",
      },
    ]);
    expect(result.referendum).toEqual([
      {
        proposalId: 3,
        index: 0,
        stage: "Referendum",
        url: "https://cgp.example/3",
      },
    ]);
    expect(result.message).toBe("1 Queued, 1 Referendum");
    expect(multicall).toHaveBeenCalledTimes(2);
  });

  it("applies proposal scan limit to votable/queued discovery", async () => {
    const readContract = vi.fn(async ({ functionName }: { functionName: string }) => {
      if (functionName === "getQueue") {
        return [[5n, 4n], [1n, 1n]] as const;
      }
      if (functionName === "getDequeue") {
        return [3n, 2n] as const;
      }
      throw new Error(`Unexpected readContract: ${functionName}`);
    });

    const multicall = vi.fn(
      async ({ contracts }: { contracts: Array<{ functionName: string; args: readonly [bigint] }> }) => {
        const fn = contracts[0]?.functionName;
        if (fn === "getProposal") {
          return contracts.map((c) => ({
            status: "success" as const,
            result: makeProposalResult(Number(c.args[0])),
          }));
        }
        if (fn === "getProposalStage") {
          return contracts.map((c) => ({
            status: "success" as const,
            result: Number(c.args[0]) === 3 ? 3n : 1n,
          }));
        }
        throw new Error(`Unexpected multicall function: ${fn}`);
      },
    );

    const service = new GovernanceService({
      getConfig: () => ({}),
      getClients: () => ({ public: { readContract, multicall } }),
    } as any);

    const votable = await service.getVotableProposals({ limit: 2 });
    const queued = await service.getQueuedProposals({ limit: 2 });

    // Top 2 proposal ids are 5 and 4, so referendum id 3 is excluded.
    expect(votable.proposals).toEqual([]);
    expect(queued.proposals.map((p) => p.proposalId)).toEqual([5, 4]);
    expect(multicall).toHaveBeenCalledTimes(4);
  });
});
