import { formatUnits } from "viem";
import { formatCeloAmount } from "./celo-format.js";

export type StakeEligibilityInput = {
  address: `0x${string}`;
  groupAddress: `0x${string}`;
  groupName?: string;
  amount: string;
  amountWei: bigint;
  /** Remaining vote headroom before the group hits its cap. */
  canReceiveVotes: bigint;
  /** On-chain Election.canReceiveVotes(group, amount) — exact gate used by vote(). */
  canReceiveAmount: boolean;
  nonvotingLocked: bigint;
  accountRegistered: boolean;
  inEligibleGroups: boolean;
};

/** Headroom = max(0, capacity - totalVotesForGroup). */
export function computeGroupVoteHeadroom(
  capacity: bigint,
  totalVotesForGroup: bigint,
): bigint {
  return capacity > totalVotesForGroup ? capacity - totalVotesForGroup : 0n;
}

export type StakeEligibilityResult = {
  network: "mainnet";
  address: `0x${string}`;
  groupAddress: `0x${string}`;
  groupName?: string;
  amount: string;
  amountWei: string;
  canReceiveVotes: string;
  canReceiveVotesFormatted: string;
  nonvotingLocked: string;
  nonvotingLockedFormatted: string;
  accountRegistered: boolean;
  inEligibleGroups: boolean;
  maxStakeAmount: string;
  maxStakeAmountFormatted: string;
  canStake: boolean;
  reasons: string[];
};

export function deriveStakeEligibility(
  input: StakeEligibilityInput,
): StakeEligibilityResult {
  const reasons: string[] = [];

  if (!input.accountRegistered) {
    reasons.push(
      "Address not registered — call execute_register_celo_account first.",
    );
  }

  if (input.amountWei <= 0n) {
    reasons.push("Stake amount must be greater than zero.");
  }

  if (!input.canReceiveAmount || input.canReceiveVotes === 0n) {
    reasons.push("Group cannot receive votes (at capacity).");
  } else if (input.amountWei > input.canReceiveVotes) {
    reasons.push(
      `Amount ${input.amount} CELO exceeds group headroom ${formatCeloAmount(input.canReceiveVotes)} CELO.`,
    );
  }

  if (input.amountWei > input.nonvotingLocked) {
    reasons.push(
      `Insufficient non-voting locked CELO (have ${formatCeloAmount(input.nonvotingLocked)}, need ${input.amount} CELO).`,
    );
  }

  const maxStakeAmount =
    input.canReceiveVotes < input.nonvotingLocked
      ? input.canReceiveVotes
      : input.nonvotingLocked;

  return {
    network: "mainnet",
    address: input.address,
    groupAddress: input.groupAddress,
    groupName: input.groupName,
    amount: input.amount,
    amountWei: input.amountWei.toString(),
    canReceiveVotes: input.canReceiveVotes.toString(),
    canReceiveVotesFormatted: formatCeloAmount(input.canReceiveVotes),
    nonvotingLocked: input.nonvotingLocked.toString(),
    nonvotingLockedFormatted: formatCeloAmount(input.nonvotingLocked),
    accountRegistered: input.accountRegistered,
    inEligibleGroups: input.inEligibleGroups,
    maxStakeAmount: maxStakeAmount.toString(),
    maxStakeAmountFormatted: formatCeloAmount(maxStakeAmount),
    canStake: reasons.length === 0,
    reasons,
  };
}

export function assertStakeEligible(result: StakeEligibilityResult): void {
  if (!result.canStake) {
    throw new Error(result.reasons.join(" "));
  }
}

/** @internal Exported for tests — human-readable CELO from wei without trailing zeros noise. */
export function formatStakeAmountFromWei(amountWei: bigint): string {
  return formatUnits(amountWei, 18).replace(/\.?0+$/, "") || "0";
}
