import { describe, expect, it } from "vitest";
import { encodeFunctionData, parseEther } from "viem";
import { accountsAbi } from "../../src/abis/accounts.js";
import { lockedGoldAbi } from "../../src/abis/locked-gold.js";
import { CELO_CORE_CONTRACTS } from "../../src/config/celo-core-contracts.js";
import { freshAccount, publicClient, testClient, walletClient } from "./anvil/utils.js";

describe("LockedGold fork cycle", () => {
  it("registers account then locks CELO", async () => {
    const account = freshAccount(2);

    const isAccountBefore = await publicClient.readContract({
      address: CELO_CORE_CONTRACTS.accounts,
      abi: accountsAbi,
      functionName: "isAccount",
      args: [account.address],
    });
    expect(isAccountBefore).toBe(false);

    await walletClient.writeContract({
      account,
      chain: walletClient.chain,
      address: CELO_CORE_CONTRACTS.accounts,
      abi: accountsAbi,
      functionName: "createAccount",
    });

    const lockAmount = parseEther("1");
    await walletClient.writeContract({
      account,
      chain: walletClient.chain,
      address: CELO_CORE_CONTRACTS.lockedGold,
      abi: lockedGoldAbi,
      functionName: "lock",
      value: lockAmount,
    });

    const locked = await publicClient.readContract({
      address: CELO_CORE_CONTRACTS.lockedGold,
      abi: lockedGoldAbi,
      functionName: "getAccountTotalLockedGold",
      args: [account.address],
    });
    expect(locked).toBeGreaterThanOrEqual(lockAmount);
  });

  it("runs lock -> unlock -> timelapse -> withdraw", async () => {
    const account = freshAccount(3);
    const lockAmount = parseEther("0.5");

    await walletClient.writeContract({
      account,
      chain: walletClient.chain,
      address: CELO_CORE_CONTRACTS.accounts,
      abi: accountsAbi,
      functionName: "createAccount",
    });

    await walletClient.writeContract({
      account,
      chain: walletClient.chain,
      address: CELO_CORE_CONTRACTS.lockedGold,
      abi: lockedGoldAbi,
      functionName: "lock",
      value: lockAmount,
    });

    await walletClient.writeContract({
      account,
      chain: walletClient.chain,
      address: CELO_CORE_CONTRACTS.lockedGold,
      abi: lockedGoldAbi,
      functionName: "unlock",
      args: [lockAmount],
    });

    const unlockingPeriod = await publicClient.readContract({
      address: CELO_CORE_CONTRACTS.lockedGold,
      abi: lockedGoldAbi,
      functionName: "unlockingPeriod",
    });

    await testClient.increaseTime({ seconds: Number(unlockingPeriod) + 1 });
    await testClient.mine({ blocks: 1 });

    await walletClient.writeContract({
      account,
      chain: walletClient.chain,
      address: CELO_CORE_CONTRACTS.lockedGold,
      abi: lockedGoldAbi,
      functionName: "withdraw",
      args: [0n],
    });

    const lockedAfter = await publicClient.readContract({
      address: CELO_CORE_CONTRACTS.lockedGold,
      abi: lockedGoldAbi,
      functionName: "getAccountTotalLockedGold",
      args: [account.address],
    });
    expect(lockedAfter).toBe(0n);
  });

  it("reverts withdraw before timelock", async () => {
    const account = freshAccount(4);
    const lockAmount = parseEther("0.1");

    await walletClient.writeContract({
      account,
      chain: walletClient.chain,
      address: CELO_CORE_CONTRACTS.accounts,
      abi: accountsAbi,
      functionName: "createAccount",
    });

    await walletClient.writeContract({
      account,
      chain: walletClient.chain,
      address: CELO_CORE_CONTRACTS.lockedGold,
      abi: lockedGoldAbi,
      functionName: "lock",
      value: lockAmount,
    });

    await walletClient.writeContract({
      account,
      chain: walletClient.chain,
      address: CELO_CORE_CONTRACTS.lockedGold,
      abi: lockedGoldAbi,
      functionName: "unlock",
      args: [lockAmount],
    });

    await expect(
      walletClient.writeContract({
        account,
        chain: walletClient.chain,
        address: CELO_CORE_CONTRACTS.lockedGold,
        abi: lockedGoldAbi,
        functionName: "withdraw",
        args: [0n],
      }),
    ).rejects.toThrow();
  });
});

describe("prepare calldata on fork", () => {
  it("encodes lock selector", () => {
    const data = encodeFunctionData({ abi: lockedGoldAbi, functionName: "lock" });
    expect(data.startsWith("0x")).toBe(true);
  });
});
