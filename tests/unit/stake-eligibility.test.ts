import { describe, expect, it } from "vitest";
import { parseEther } from "viem";
import { deriveStakeEligibility } from "../../src/utils/stake-eligibility.js";

const ADDRESS = "0x5409ED021D9299bf6814279A6A1411A7e866A631" as const;
const GROUP = "0xe09632da4deafb3da2cd6939f31c98607fccdbc5" as const;

const baseInput = {
  address: ADDRESS,
  groupAddress: GROUP,
  groupName: "cLabs",
  amount: "1",
  amountWei: parseEther("1"),
  canReceiveVotes: parseEther("100"),
  nonvotingLocked: parseEther("10"),
  accountRegistered: true,
  inEligibleGroups: true,
};

describe("deriveStakeEligibility", () => {
  it("returns canStake true when all checks pass", () => {
    const result = deriveStakeEligibility(baseInput);

    expect(result.canStake).toBe(true);
    expect(result.reasons).toEqual([]);
    expect(result.maxStakeAmount).toBe(parseEther("10").toString());
  });

  it("blocks when group cannot receive votes (at capacity)", () => {
    const result = deriveStakeEligibility({
      ...baseInput,
      canReceiveVotes: 0n,
    });

    expect(result.canStake).toBe(false);
    expect(result.reasons.some((r) => r.includes("cannot receive votes"))).toBe(
      true,
    );
  });

  it("blocks when amount exceeds group headroom", () => {
    const result = deriveStakeEligibility({
      ...baseInput,
      amount: "5",
      amountWei: parseEther("5"),
      canReceiveVotes: parseEther("2"),
    });

    expect(result.canStake).toBe(false);
    expect(result.reasons.some((r) => r.includes("exceeds group headroom"))).toBe(
      true,
    );
  });

  it("blocks when non-voting locked balance is insufficient", () => {
    const result = deriveStakeEligibility({
      ...baseInput,
      amount: "5",
      amountWei: parseEther("5"),
      nonvotingLocked: parseEther("1"),
    });

    expect(result.canStake).toBe(false);
    expect(result.reasons.some((r) => r.includes("Insufficient non-voting locked"))).toBe(
      true,
    );
  });

  it("blocks when address is not registered", () => {
    const result = deriveStakeEligibility({
      ...baseInput,
      accountRegistered: false,
    });

    expect(result.canStake).toBe(false);
    expect(result.reasons.some((r) => r.includes("not registered"))).toBe(true);
  });
});

describe("StakingService.getStakeEligibility", () => {
  it("maps on-chain reads into eligibility result", async () => {
    const { StakingService } = await import("../../src/services/staking.service.js");

    const readContract = async (args: { functionName: string; args?: unknown[] }) => {
      switch (args.functionName) {
        case "canReceiveVotes":
          return 0n;
        case "getAccountNonvotingLockedGold":
          return parseEther("10");
        case "isAccount":
          return true;
        case "getEligibleValidatorGroups":
          return [GROUP];
        case "getName":
          return "cLabs";
        default:
          throw new Error(`Unexpected read: ${args.functionName}`);
      }
    };

    const clientFactory = {
      getClients: () => ({ public: { readContract } }),
      getConfig: () => ({}),
    } as never;

    const service = new StakingService(clientFactory);
    const result = await service.getStakeEligibility(ADDRESS, GROUP, "1");

    expect(result.canStake).toBe(false);
    expect(result.groupName).toBe("cLabs");
    expect(result.inEligibleGroups).toBe(true);
    expect(result.canReceiveVotes).toBe("0");
  });
});
