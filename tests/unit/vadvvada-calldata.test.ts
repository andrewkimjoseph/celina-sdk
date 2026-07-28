import { describe, expect, it } from "vitest";
import { encodeFunctionData } from "viem";
import { accountsAbi } from "../../src/abis/accounts.js";
import { governanceAbi, voteValueToInt } from "../../src/abis/governance.js";
import { lockedGoldAbi } from "../../src/abis/locked-gold.js";
import { appendCelinaCalldataTag } from "../../src/config/celina-tag.js";

describe("prepare calldata ERC-8021 suffix", () => {
  it("appends celina tag to lock calldata", () => {
    const data = appendCelinaCalldataTag(
      encodeFunctionData({ abi: lockedGoldAbi, functionName: "lock" }),
    );
    expect(data.toLowerCase()).toContain("63656c696e61");
  });

  it("appends celina tag to createAccount calldata", () => {
    const data = appendCelinaCalldataTag(
      encodeFunctionData({ abi: accountsAbi, functionName: "createAccount" }),
    );
    expect(data.toLowerCase()).toContain("63656c696e61");
  });

  it("encodes vote with correct enum index", () => {
    const data = encodeFunctionData({
      abi: governanceAbi,
      functionName: "vote",
      args: [1n, 2n, voteValueToInt("Yes")],
    });
    expect(data.startsWith("0x")).toBe(true);
    expect(voteValueToInt("Yes")).toBe(3);
  });
});
