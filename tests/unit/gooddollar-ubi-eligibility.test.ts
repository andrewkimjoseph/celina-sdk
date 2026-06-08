import { describe, expect, it } from "vitest";
import { resolveUbiPeriodEligibility } from "../../src/utils/gooddollar-ubi-period.js";

const baseInput = {
  contractDay: 100n,
  computedDay: 100n,
  claimedForOnChainDay: false,
  hasRoot: true,
  schemePaused: false,
  schemeStarted: true,
  isWhitelisted: true,
  claimable: 129_070_000_000_000_000_000n,
};

describe("resolveUbiPeriodEligibility", () => {
  it("treats day-roll window as eligible even when hasClaimed is stale", () => {
    const result = resolveUbiPeriodEligibility({
      ...baseInput,
      contractDay: 100n,
      computedDay: 101n,
      claimedForOnChainDay: true,
    });

    expect(result.awaitingContractDayRoll).toBe(true);
    expect(result.alreadyClaimedToday).toBe(false);
    expect(result.inClaimCooldown).toBe(false);
    expect(result.isEligibleToClaim).toBe(true);
  });

  it("blocks claim when already claimed for the current on-chain period", () => {
    const result = resolveUbiPeriodEligibility({
      ...baseInput,
      contractDay: 100n,
      computedDay: 100n,
      claimedForOnChainDay: true,
    });

    expect(result.awaitingContractDayRoll).toBe(false);
    expect(result.alreadyClaimedToday).toBe(true);
    expect(result.inClaimCooldown).toBe(true);
    expect(result.isEligibleToClaim).toBe(false);
  });

  it("allows claim when not yet claimed for the current period", () => {
    const result = resolveUbiPeriodEligibility({
      ...baseInput,
      contractDay: 100n,
      computedDay: 100n,
      claimedForOnChainDay: false,
    });

    expect(result.alreadyClaimedToday).toBe(false);
    expect(result.inClaimCooldown).toBe(false);
    expect(result.isEligibleToClaim).toBe(true);
  });
});
