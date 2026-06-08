/** Inputs for UBISchemeV2 period/cooldown eligibility (mirrors on-chain claim()). */
export type UbiPeriodEligibilityInput = {
  contractDay: bigint;
  computedDay: bigint;
  claimedForOnChainDay: boolean;
  hasRoot: boolean;
  schemePaused: boolean;
  schemeStarted: boolean;
  isWhitelisted: boolean;
  claimable: bigint;
};

export type UbiPeriodEligibilityState = {
  awaitingContractDayRoll: boolean;
  alreadyClaimedToday: boolean;
  inClaimCooldown: boolean;
  isEligibleToClaim: boolean;
};

/**
 * Resolve UBI claim eligibility from period day and on-chain hasClaimed.
 * Between UTC noon and the first claim that calls setDay(), computedDay exceeds
 * contractDay while hasClaimed still reflects the previous on-chain day.
 */
export function resolveUbiPeriodEligibility(
  input: UbiPeriodEligibilityInput,
): UbiPeriodEligibilityState {
  const awaitingContractDayRoll = input.computedDay > input.contractDay;
  const alreadyClaimedToday =
    input.claimedForOnChainDay && !awaitingContractDayRoll;
  const inClaimCooldown = input.hasRoot && alreadyClaimedToday;
  const isEligibleToClaim =
    input.hasRoot &&
    !input.schemePaused &&
    input.schemeStarted &&
    input.isWhitelisted &&
    !inClaimCooldown &&
    (input.claimable > 0n || awaitingContractDayRoll);

  return {
    awaitingContractDayRoll,
    alreadyClaimedToday,
    inClaimCooldown,
    isEligibleToClaim,
  };
}
