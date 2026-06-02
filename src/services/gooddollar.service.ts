/**
 * GoodDollar IdentityV4 whitelist and reverification reads on Celo mainnet.
 */
import { concat, encodeFunctionData, formatUnits, type Hex } from "viem";
import type { CeloClientFactory } from "../clients/celo-client.js";
import { goodDollarIdentityAbi } from "../abis/gooddollar-identity.js";
import { ubiSchemeAbi } from "../abis/ubi-scheme.js";
import {
  GOODDOLLAR_IDENTITY_ADDRESS,
  GOODDOLLAR_UBI_SCHEME_ADDRESS,
} from "../config/gooddollar.js";
import { CELINA_DATA_SUFFIX } from "../config/celina-tag.js";
import {
  type PreparedFlow,
  serializePreparedFlow,
  type SerializedPreparedFlow,
} from "../types/prepared.js";
import { formatUnixDate } from "../utils/format-date.js";
import { formatDuration } from "../utils/format-duration.js";
import {
  formatUnixDateTimeUtc,
  formatUnixIso,
} from "../utils/format-unix-datetime.js";

const SECONDS_PER_DAY = 86400n;

const G_DOLLAR_DECIMALS = 18;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

const STATUS_LABELS: Record<number, string> = {
  0: "none",
  1: "whitelisted",
  2: "dao_contract",
  255: "blacklisted",
};

// Post-upgrade users authenticated before this timestamp use the last reverify step.
const LEGACY_AUTH_CUTOFF = 1772697574;

function statusLabel(status: number): string {
  return STATUS_LABELS[status] ?? "unknown";
}

function taggedCalldata(data: Hex): Hex {
  return concat([data, CELINA_DATA_SUFFIX]);
}

/** GoodDollar IdentityV4 whitelist, reverification, and daily UBI claim preparation. */
export class GoodDollarService {
  constructor(private readonly clientFactory: CeloClientFactory) {}

  private getPublicClient() {
    return this.clientFactory.getClients().public;
  }

  /**
   * GoodDollar IdentityV4 whitelist status and reverification progress for a wallet.
   * @param address - Wallet to check against IdentityV4
   * @returns On-chain status, whitelist dates, field descriptions, and reverification timeline
   */
  async getWhitelistingInfo(address: `0x${string}`) {
    const { public: client } = this.clientFactory.getClients();
    const contract = GOODDOLLAR_IDENTITY_ADDRESS;

    const [
      identityResult,
      isCurrentlyWhitelisted,
      maxReverificationPeriodDays,
      reverifyDaysOptions,
    ] = await Promise.all([
      client.readContract({
        address: contract,
        abi: goodDollarIdentityAbi,
        functionName: "identities",
        args: [address],
      }),
      client.readContract({
        address: contract,
        abi: goodDollarIdentityAbi,
        functionName: "isWhitelisted",
        args: [address],
      }),
      client.readContract({
        address: contract,
        abi: goodDollarIdentityAbi,
        functionName: "authenticationPeriod",
      }),
      this.fetchReverifyDaysOptions(client, contract),
    ]);

    const [
      dateAuthenticated,
      dateAdded,
      did,
      whitelistedOnChainId,
      status,
      authCount,
    ] = identityResult;

    const statusNum = Number(status);
    const dateAuthenticatedNum = Number(dateAuthenticated);
    const dateAddedNum = Number(dateAdded);
    const authCountNum = Number(authCount);

    let currentReverificationPeriodDays: number | null = null;
    if (statusNum === 1 && dateAuthenticatedNum > 0 && reverifyDaysOptions.length > 0) {
      const effectiveAuthCount = this.effectiveAuthCount(
        dateAuthenticatedNum,
        authCountNum,
        reverifyDaysOptions.length,
      );
      currentReverificationPeriodDays =
        reverifyDaysOptions[effectiveAuthCount] ?? null;
    }

    const isWhitelistedStatus = statusNum === 1 && dateAddedNum > 0;

    const reverification =
      statusNum === 1 && dateAuthenticatedNum > 0 && currentReverificationPeriodDays !== null
        ? this.buildReverificationProgress(
            dateAuthenticatedNum,
            currentReverificationPeriodDays,
            Number(maxReverificationPeriodDays),
          )
        : null;

    return {
      address,
      contract,
      isCurrentlyWhitelisted,
      status: statusNum,
      statusLabel: statusLabel(statusNum),
      whitelistedOn: isWhitelistedStatus ? formatUnixDate(dateAddedNum) : null,
      lastAuthenticatedOn:
        dateAuthenticatedNum > 0 ? formatUnixDate(dateAuthenticatedNum) : null,
      fieldDescriptions: {
        whitelistedOn:
          "When the wallet was first added to the GoodDollar whitelist.",
        lastAuthenticatedOn:
          "When the wallet last verified its identity. Periodic reverification is required to remain whitelisted.",
      },
      reverification,
      identity: {
        dateAuthenticated: dateAuthenticatedNum,
        dateAdded: dateAddedNum,
        did,
        whitelistedOnChainId: Number(whitelistedOnChainId),
        status: statusNum,
        authCount: authCountNum,
      },
    };
  }

  /**
   * Daily UBI claim eligibility for a wallet against UBISchemeV2 on Celo.
   * Resolves connected wallets via Identity `getWhitelistedRoot`.
   */
  async getUbiClaimEligibility(address: `0x${string}`) {
    const client = this.getPublicClient();
    const ubiContract = GOODDOLLAR_UBI_SCHEME_ADDRESS;
    const identityContract = GOODDOLLAR_IDENTITY_ADDRESS;

    const [
      whitelistedRoot,
      claimableAmount,
      schemePaused,
      periodStart,
      estimatedDailyUbi,
      dailyUbi,
      ubiPeriodDay,
    ] = await Promise.all([
      client.readContract({
        address: identityContract,
        abi: goodDollarIdentityAbi,
        functionName: "getWhitelistedRoot",
        args: [address],
      }),
      client.readContract({
        address: ubiContract,
        abi: ubiSchemeAbi,
        functionName: "checkEntitlement",
        args: [address],
      }),
      client.readContract({
        address: ubiContract,
        abi: ubiSchemeAbi,
        functionName: "paused",
      }),
      client.readContract({
        address: ubiContract,
        abi: ubiSchemeAbi,
        functionName: "periodStart",
      }),
      client.readContract({
        address: ubiContract,
        abi: ubiSchemeAbi,
        functionName: "estimateNextDailyUBI",
      }),
      client.readContract({
        address: ubiContract,
        abi: ubiSchemeAbi,
        functionName: "dailyUbi",
      }),
      client.readContract({
        address: ubiContract,
        abi: ubiSchemeAbi,
        functionName: "currentDay",
      }),
    ]);

    const root = whitelistedRoot as `0x${string}`;
    const claimable = claimableAmount as bigint;
    const periodStartBn = periodStart as bigint;
    const nowSec = BigInt(Math.floor(Date.now() / 1000));
    const schemeStarted = nowSec >= periodStartBn;

    const identityAddress =
      root !== ZERO_ADDRESS ? root : address;

    let alreadyClaimedToday = false;
    let lastClaimedSec = 0n;

    if (root !== ZERO_ADDRESS) {
      const [hasClaimed, lastClaimed] = await Promise.all([
        client.readContract({
          address: ubiContract,
          abi: ubiSchemeAbi,
          functionName: "hasClaimed",
          args: [root],
        }),
        client.readContract({
          address: ubiContract,
          abi: ubiSchemeAbi,
          functionName: "lastClaimed",
          args: [root],
        }),
      ]);
      alreadyClaimedToday = hasClaimed;
      lastClaimedSec = lastClaimed as bigint;
    }

    const whitelistingInfo = await this.getWhitelistingInfo(identityAddress);

    const currentContractDay =
      schemeStarted && periodStartBn > 0n
        ? (nowSec - periodStartBn) / SECONDS_PER_DAY
        : 0n;
    const nextClaimAt =
      periodStartBn + (currentContractDay + 1n) * SECONDS_PER_DAY;
    const secondsUntilNextClaim =
      nextClaimAt > nowSec ? nextClaimAt - nowSec : 0n;
    const inClaimCooldown = root !== ZERO_ADDRESS && alreadyClaimedToday;

    const reasons: string[] = [];

    if (schemePaused) {
      reasons.push("scheme paused");
    }
    if (!schemeStarted) {
      reasons.push("scheme not started");
    }
    if (root === ZERO_ADDRESS) {
      reasons.push("not whitelisted");
    } else if (alreadyClaimedToday) {
      const waitLabel = formatDuration(secondsUntilNextClaim);
      const atLabel = formatUnixDateTimeUtc(nextClaimAt);
      reasons.push(
        `already claimed this period; next claim in ${waitLabel} (${atLabel})`,
      );
    } else {
      if (!whitelistingInfo.isCurrentlyWhitelisted) {
        if (whitelistingInfo.reverification?.isReverificationOverdue) {
          reasons.push("reverification overdue");
        } else {
          reasons.push("identity not currently whitelisted");
        }
      }
      if (claimable === 0n) {
        reasons.push("no entitlement available");
      }
    }

    const isEligibleToClaim =
      root !== ZERO_ADDRESS &&
      !schemePaused &&
      schemeStarted &&
      claimable > 0n;

    const lastClaimedAt =
      lastClaimedSec > 0n ? formatUnixIso(lastClaimedSec) : null;
    const nextClaimAvailableAt = formatUnixIso(nextClaimAt);
    const nextClaimAvailableIn = formatDuration(secondsUntilNextClaim);

    return {
      address,
      contract: ubiContract,
      whitelistedRoot: root === ZERO_ADDRESS ? null : root,
      isConnectedWallet:
        root !== ZERO_ADDRESS &&
        root.toLowerCase() !== address.toLowerCase(),
      isEligibleToClaim,
      claimableAmount: claimable.toString(),
      claimableAmountFormatted:
        claimable > 0n ? `${formatUnits(claimable, G_DOLLAR_DECIMALS)} G$` : "0 G$",
      alreadyClaimedToday,
      inClaimCooldown,
      lastClaimedAt,
      nextClaimAvailableAt,
      secondsUntilNextClaim: secondsUntilNextClaim.toString(),
      nextClaimAvailableIn,
      ubiPeriodDay: (ubiPeriodDay as bigint).toString(),
      schemePaused,
      schemeStarted,
      estimatedDailyUbi: (estimatedDailyUbi as bigint).toString(),
      estimatedDailyUbiFormatted: `${formatUnits(estimatedDailyUbi as bigint, G_DOLLAR_DECIMALS)} G$`,
      currentDailyUbi: (dailyUbi as bigint).toString(),
      currentDailyUbiFormatted: `${formatUnits(dailyUbi as bigint, G_DOLLAR_DECIMALS)} G$`,
      reasons: isEligibleToClaim ? [] : reasons,
      identity: {
        checkedAddress: identityAddress,
        isCurrentlyWhitelisted: whitelistingInfo.isCurrentlyWhitelisted,
        statusLabel: whitelistingInfo.statusLabel,
        reverification: whitelistingInfo.reverification,
      },
    };
  }

  /**
   * Build an unsigned UBISchemeV2 `claim()` transaction for daily G$ UBI.
   * Validates whitelist, entitlement, and simulates gas before returning steps.
   */
  async prepareClaimUbi(from: `0x${string}`): Promise<SerializedPreparedFlow> {
    const eligibility = await this.getUbiClaimEligibility(from);
    if (!eligibility.isEligibleToClaim) {
      const detail =
        eligibility.reasons.length > 0
          ? eligibility.reasons.join("; ")
          : "not eligible to claim";
      throw new Error(`Cannot claim GoodDollar UBI: ${detail}.`);
    }

    const publicClient = this.getPublicClient();
    const claimData = taggedCalldata(
      encodeFunctionData({
        abi: ubiSchemeAbi,
        functionName: "claim",
      }),
    );

    await publicClient.estimateContractGas({
      account: from,
      address: GOODDOLLAR_UBI_SCHEME_ADDRESS,
      abi: ubiSchemeAbi,
      functionName: "claim",
    });

    const flow: PreparedFlow = {
      network: "mainnet",
      from,
      summary: `Claim daily GoodDollar UBI (${eligibility.claimableAmountFormatted})`,
      steps: [
        {
          kind: "contract",
          to: GOODDOLLAR_UBI_SCHEME_ADDRESS,
          data: claimData,
          value: "0",
          description: "Claim daily GoodDollar UBI",
        },
      ],
    };

    return serializePreparedFlow(flow);
  }

  private effectiveAuthCount(
    dateAuthenticated: number,
    authCount: number,
    optionsLength: number,
  ): number {
    if (dateAuthenticated < LEGACY_AUTH_CUTOFF) {
      return optionsLength - 1;
    }
    if (authCount >= optionsLength) {
      return 0;
    }
    return authCount;
  }

  private async fetchReverifyDaysOptions(
    client: ReturnType<CeloClientFactory["getClients"]>["public"],
    contract: typeof GOODDOLLAR_IDENTITY_ADDRESS,
  ): Promise<number[]> {
    const options: number[] = [];
    for (let index = 0; index < 8; index++) {
      try {
        const value = await client.readContract({
          address: contract,
          abi: goodDollarIdentityAbi,
          functionName: "reverifyDaysOptions",
          args: [BigInt(index)],
        });
        options.push(Number(value));
      } catch {
        break;
      }
    }
    return options;
  }

  private buildReverificationProgress(
    dateAuthenticated: number,
    currentReverificationPeriodDays: number,
    maxReverificationPeriodDays: number,
  ) {
    const nowSec = Math.floor(Date.now() / 1000);
    const daysSinceLastAuthentication = Math.floor(
      (nowSec - dateAuthenticated) / 86400,
    );
    const daysUntilReverificationRequired =
      currentReverificationPeriodDays - daysSinceLastAuthentication;
    const reverificationRequiredTimestamp =
      dateAuthenticated + currentReverificationPeriodDays * 86400;
    const isReverificationOverdue = daysUntilReverificationRequired < 0;
    const reverificationProgressPercent = Math.min(
      100,
      Math.max(
        0,
        Math.round(
          (daysSinceLastAuthentication / currentReverificationPeriodDays) *
            100,
        ),
      ),
    );

    return {
      daysSinceLastAuthentication,
      currentReverificationPeriodDays,
      maxReverificationPeriodDays,
      daysUntilReverificationRequired,
      reverificationRequiredOn: formatUnixDate(reverificationRequiredTimestamp),
      reverificationProgressPercent,
      isReverificationOverdue,
    };
  }
}
