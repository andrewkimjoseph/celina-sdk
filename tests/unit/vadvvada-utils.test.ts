import { describe, expect, it } from "vitest";
import { voteValueToInt, VOTE_VALUES } from "../../src/abis/governance.js";
import {
  FIXIDITY_ONE,
  fromFixidity,
  percentToFixidity,
  toFixidity,
} from "../../src/utils/fixidity.js";
import { findLesserAndGreaterAfterVote } from "../../src/utils/election-vote-neighbors.js";

describe("fixidity", () => {
  it("round-trips unit fractions", () => {
    expect(toFixidity(0.5)).toBe(FIXIDITY_ONE / 2n);
    expect(fromFixidity(toFixidity(0.25))).toBeCloseTo(0.25, 10);
  });

  it("converts percent to fixidity", () => {
    expect(percentToFixidity(50)).toBe(FIXIDITY_ONE / 2n);
    expect(percentToFixidity(100)).toBe(FIXIDITY_ONE);
  });

  it("rejects out-of-range fractions", () => {
    expect(() => toFixidity(1.5)).toThrow();
  });
});

describe("VoteValue ordering", () => {
  it("matches on-chain enum None=0 Abstain=1 No=2 Yes=3", () => {
    expect(VOTE_VALUES).toEqual(["None", "Abstain", "No", "Yes"]);
    expect(voteValueToInt("Abstain")).toBe(1);
    expect(voteValueToInt("No")).toBe(2);
    expect(voteValueToInt("Yes")).toBe(3);
  });
});

describe("findLesserAndGreaterAfterVote", () => {
  const groups = [
    { address: "0x00000000000000000000000000000000000000a1" as const, votes: 300n },
    { address: "0x00000000000000000000000000000000000000b2" as const, votes: 200n },
    { address: "0x00000000000000000000000000000000000000c3" as const, votes: 100n },
  ];

  it("finds neighbours when staking into middle group", () => {
    const { lesser, greater } = findLesserAndGreaterAfterVote(
      groups,
      "0x00000000000000000000000000000000000000b2",
      50n,
    );
    expect(lesser).toBe("0x00000000000000000000000000000000000000c3");
    expect(greater).toBe("0x00000000000000000000000000000000000000a1");
  });

  it("uses zero address at list ends", () => {
    const top = findLesserAndGreaterAfterVote(
      groups,
      "0x00000000000000000000000000000000000000a1",
      10n,
    );
    expect(top.greater).toBe("0x0000000000000000000000000000000000000000");

    const bottom = findLesserAndGreaterAfterVote(
      groups,
      "0x00000000000000000000000000000000000000c3",
      10n,
    );
    expect(bottom.lesser).toBe("0x0000000000000000000000000000000000000000");
  });
});
