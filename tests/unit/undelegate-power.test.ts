import { describe, expect, it } from "vitest";
import { decodeFunctionData, parseEther } from "viem";
import { lockedGoldAbi } from "../../src/abis/locked-gold.js";
import { stripErc8021SuffixIfPresent } from "../../src/config/celina-tag.js";
import { StakingService } from "../../src/services/staking.service.js";
import { getToolDefinition } from "../../src/tools/catalog.js";
import { percentToFixidity } from "../../src/utils/fixidity.js";

const FROM = "0x68961aC3376fa6c2aa20689307Be57f107031B31" as const;
const DELEGATEE = "0xFEF5A1A2b3754A2F53161EaaAcb3EB889F004d4a" as const;
const HALF = percentToFixidity(50);
const THREE = parseEther("3");

function serviceWithShare(fraction: bigint, amount: bigint) {
  const readContract = async (args: { functionName: string }) => {
    switch (args.functionName) {
      case "isAccount":
        return true;
      case "getDelegatorDelegateeInfo":
        return [fraction, amount] as const;
      default:
        throw new Error(`Unexpected read: ${args.functionName}`);
    }
  };
  const clientFactory = {
    getClients: () => ({ public: { readContract } }),
    getConfig: () => ({}),
  } as never;
  return new StakingService(clientFactory);
}

function revokeFraction(data: `0x${string}`): bigint {
  const decoded = decodeFunctionData({
    abi: lockedGoldAbi,
    data: stripErc8021SuffixIfPresent(data),
  });
  if (decoded.functionName !== "revokeDelegatedGovernanceVotes") {
    throw new Error(`Unexpected function ${decoded.functionName}`);
  }
  return decoded.args[1];
}

describe("prepareUndelegatePower", () => {
  it("rejects 100 percentage points when the delegatee holds 50%", async () => {
    const service = serviceWithShare(HALF, THREE);

    await expect(
      service.prepareUndelegatePower(FROM, DELEGATEE, 100),
    ).rejects.toThrow(/currently holds 50\.00% \(3 CELO\)/);
    await expect(
      service.prepareUndelegatePower(FROM, DELEGATEE, 100),
    ).rejects.toThrow(/100 means all of your voting power/);
    await expect(
      service.prepareUndelegatePower(FROM, DELEGATEE, 100),
    ).rejects.toThrow(/all: true/);
  });

  it("encodes the exact on-chain fraction when all is true", async () => {
    const raw = HALF + 123n;
    const service = serviceWithShare(raw, THREE);
    const flow = await service.prepareUndelegatePower(FROM, DELEGATEE, {
      all: true,
    });

    expect(revokeFraction(flow.steps[0]!.data)).toBe(raw);
    expect(flow.steps[0]!.description).toBe(
      "Revoke this delegatee's entire share (50.00%, 3 CELO) from 0xFEF5...4d4a",
    );
    expect(flow.summary).toContain("entire share");
  });

  it("encodes percent 50 as fixidity when that is the whole share", async () => {
    const service = serviceWithShare(HALF, THREE);
    const flow = await service.prepareUndelegatePower(FROM, DELEGATEE, 50);

    expect(revokeFraction(flow.steps[0]!.data)).toBe(percentToFixidity(50));
    expect(flow.steps[0]!.description).toContain("entire share (50.00%, 3 CELO)");
  });

  it("encodes a partial revoke as percentage points of total voting power", async () => {
    const service = serviceWithShare(HALF, THREE);
    const flow = await service.prepareUndelegatePower(FROM, DELEGATEE, 25);

    expect(revokeFraction(flow.steps[0]!.data)).toBe(percentToFixidity(25));
    expect(flow.steps[0]!.description).toBe(
      "Revoke 25 percentage points from 0xFEF5...4d4a (they hold 50.00%, 3 CELO)",
    );
  });

  it("rejects a delegatee who holds nothing", async () => {
    const service = serviceWithShare(0n, 0n);

    await expect(
      service.prepareUndelegatePower(FROM, DELEGATEE, { all: true }),
    ).rejects.toThrow(`No voting power is delegated to ${DELEGATEE}.`);
  });
});

describe("undelegate tool schema", () => {
  const prepare = getToolDefinition("prepare_undelegate_power")!;
  const execute = getToolDefinition("execute_undelegate_power")!;

  it("requires exactly one of percent or all", () => {
    expect(() =>
      prepare.inputSchema.parse({ delegatee: DELEGATEE, percent: 50 }),
    ).not.toThrow();
    expect(() =>
      prepare.inputSchema.parse({ delegatee: DELEGATEE, all: true }),
    ).not.toThrow();
    expect(() => prepare.inputSchema.parse({ delegatee: DELEGATEE })).toThrow(
      /Pass percent or all: true/,
    );
    expect(() =>
      prepare.inputSchema.parse({ delegatee: DELEGATEE, percent: 50, all: true }),
    ).toThrow(/Pass percent or all: true/);
    expect(() =>
      execute.inputSchema.parse({ delegatee: DELEGATEE, percent: 100 }),
    ).not.toThrow();
  });
});
