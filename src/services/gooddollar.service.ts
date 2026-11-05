/**
 * GoodDollar IdentityV4 whitelist, reverification reads, UBI claims, and reserve swaps on Celo mainnet.
 */
import {
  encodeFunctionData,
  formatUnits,
  type PublicClient,
  type WalletClient,
} from "viem";
import type { CeloClientFactory } from "../clients/celo-client.js";
import { IdentitySDK } from "../clients/citizen-sdk.js";
import { goodDollarIdentityAbi } from "../abis/gooddollar-identity.js";
import { ubiSchemeAbi } from "../abis/ubi-scheme.js";
import {
  GOODDOLLAR_IDENTITY_ADDRESS,
  GOODDOLLAR_UBI_SCHEME_ADDRESS,
} from "../config/gooddollar.js";
import { appendCelinaCalldataTag } from "../config/celina-tag.js";
import {
  type PreparedFlow,
  serializePreparedFlow,
  type SerializedPreparedFlow,
} from "../types/prepared.js";
import { CHAIN } from "../config/chains.js";
import {
  createGoodDollarReserveClient,
  type GoodDollarReserveQuoteOptions,
  type GoodDollarReserveSwapParams,
} from "../browser/gooddollar-reserve.js";
import { formatUnixDate } from "../utils/format-date.js";
import { formatDuration } from "../utils/format-duration.js";
import {
  formatUnixDateTimeUtc,
  formatUnixIso,
} from "../utils/format-unix-datetime.js";
import { resolveUbiPeriodEligibility } from "../utils/gooddollar-ubi-period.js";
import {
  buildConnectIdentityError,
  deriveGoodDollarIdentityGuidance,
  shouldSkipFaceVerification,
  type GoodDollarIdentityGuidance,
} from "./gooddollar-identity-guidance.js";

export type {
  GoodDollarIdentityGuidance,
  GoodDollarIdentityGuidanceInput,
  GoodDollarIdentityRecommendedAction,
} from "./gooddollar-identity-guidance.js";
export {
  deriveGoodDollarIdentityGuidance,
  shouldSkipFaceVerification,
  buildConnectIdentityError,
  GOODDOLLAR_HUMANNESS_REMEDIATION,
} from "./gooddollar-identity-guidance.js";

const SECONDS_PER_DAY = 86400n;

const G_DOLLAR_DECIMALS = 18;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

export type FaceVerificationLinkResult = {
  from: `0x${string}`;
  callbackUrl: string;
  link?: string;
  network: "celo-mainnet";
  skipped?: boolean;
  reason?: string;
  guidance?: {
    recommendedAction: string;
    message: string;
    whitelistedRoot?: `0x${string}`;
    connectedTo?: `0x${string}`;
  };
};

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

export type {
  GoodDollarReserveAmountSide,
  GoodDollarReserveQuoteOptions,
  GoodDollarReserveSwapParams,
} from "../browser/gooddollar-reserve.js";

/** GoodDollar IdentityV4 whitelist, reverification, daily UBI claim, and reserve swap preparation. */
export class GoodDollarService {
  private readonly attributionTags?: string[];

  constructor(private readonly clientFactory: CeloClientFactory) {
    this.attributionTags = clientFactory.getConfig().attributionTags;
  }

  private reserveClient() {
    return createGoodDollarReserveClient(this.getPublicClient(), {
      attributionTags: this.attributionTags,
    });
  }

  private getPublicClient() {
    return this.clientFactory.getClients().public;
  }

  private async resolveWhitelistedRoot(address: `0x${string}`) {
    const client = this.getPublicClient();
    const rootResult = await client.readContract({
      address: GOODDOLLAR_IDENTITY_ADDRESS,
      abi: goodDollarIdentityAbi,
      functionName: "getWhitelistedRoot",
      args: [address],
    });
    const root = rootResult as `0x${string}`;
    const hasRoot = root !== ZERO_ADDRESS;
    const identityAddress = hasRoot ? root : address;
    return {
      queried: address,
      root: hasRoot ? root : null,
      identityAddress,
      isConnectedWallet:
        hasRoot && root.toLowerCase() !== address.toLowerCase(),
      isWhitelistedRoot:
        hasRoot && root.toLowerCase() === address.toLowerCase(),
    };
  }

  private async fetchWhitelistingData(identityAddress: `0x${string}`) {
    const { public: client } = this.clientFactory.getClients();
    const contract = GOODDOLLAR_IDENTITY_ADDRESS;

    const [
      identityResult,
      isWhitelisted,
      maxReverificationPeriodDays,
      reverifyDaysOptions,
    ] = await Promise.all([
      client.readContract({
        address: contract,
        abi: goodDollarIdentityAbi,
        functionName: "identities",
        args: [identityAddress],
      }),
      client.readContract({
        address: contract,
        abi: goodDollarIdentityAbi,
        functionName: "isWhitelisted",
        args: [identityAddress],
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
      contract,
      isWhitelisted,
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
   * Recommended next step for GoodDollar identity / humanness on a wallet.
   */
  async getIdentityGuidance(address: `0x${string}`): Promise<GoodDollarIdentityGuidance> {
    const [link, whitelisting] = await Promise.all([
      this.getIdentityLink(address),
      this.getWhitelistingInfo(address),
    ]);

    return deriveGoodDollarIdentityGuidance({
      signerAddress: address,
      isWhitelisted: whitelisting.isWhitelisted,
      isWhitelistedRoot: link.isWhitelistedRoot,
      isConnectedWallet: link.isConnectedWallet,
      whitelistedRoot: link.whitelistedRoot,
      connectedTo: link.connectedTo,
    });
  }

  /**
   * Generate a GoodDollar face verification link for a wallet that needs first-time verification.
   * Callers supply viem clients with a local account — the SDK does not read private keys.
   */
  async getFaceVerificationLink(params: {
    publicClient: PublicClient;
    walletClient: WalletClient;
    accountAddress: `0x${string}`;
    callbackUrl: string;
  }): Promise<FaceVerificationLinkResult> {
    const { publicClient, walletClient, accountAddress, callbackUrl } = params;
    const guidance = await this.getIdentityGuidance(accountAddress);

    if (shouldSkipFaceVerification(guidance)) {
      return {
        from: accountAddress,
        callbackUrl,
        network: "celo-mainnet",
        skipped: true,
        reason: guidance.recommendedAction,
        guidance: {
          recommendedAction: guidance.recommendedAction,
          message: guidance.message,
          whitelistedRoot: guidance.whitelistedRoot,
          connectedTo: guidance.connectedTo,
        },
      };
    }

    if (!IdentitySDK) {
      throw new Error("@goodsdks/citizen-sdk IdentitySDK export not found.");
    }

    // Use direct construction — IdentitySDK.init() always returns the base class
    // and signs via RPC personal_sign, which Forno does not support.
    const sdk = new IdentitySDK({
      publicClient: publicClient as never,
      walletClient: walletClient as never,
      env: "production",
    });

    const link = await sdk.generateFVLink(false, callbackUrl, 42220);

    return {
      from: accountAddress,
      callbackUrl,
      link,
      network: "celo-mainnet",
      guidance: {
        recommendedAction: guidance.recommendedAction,
        message: guidance.message,
      },
    };
  }

  /**
   * How a wallet links to GoodDollar IdentityV4 (root vs connected account).
   * @param address - Wallet to inspect
   */
  async getIdentityLink(address: `0x${string}`) {
    const client = this.getPublicClient();
    const link = await this.resolveWhitelistedRoot(address);

    const [connectedTo, isWhitelisted] = await Promise.all([
      client.readContract({
        address: GOODDOLLAR_IDENTITY_ADDRESS,
        abi: goodDollarIdentityAbi,
        functionName: "connectedAccounts",
        args: [address],
      }),
      client.readContract({
        address: GOODDOLLAR_IDENTITY_ADDRESS,
        abi: goodDollarIdentityAbi,
        functionName: "isWhitelisted",
        args: [link.identityAddress],
      }),
    ]);

    const connectedToAddr = connectedTo as `0x${string}`;

    return {
      address,
      contract: GOODDOLLAR_IDENTITY_ADDRESS,
      whitelistedRoot: link.root,
      isConnectedWallet: link.isConnectedWallet,
      isWhitelistedRoot: link.isWhitelistedRoot,
      connectedTo:
        connectedToAddr !== ZERO_ADDRESS ? connectedToAddr : null,
      checkedAddress: link.identityAddress,
      isWhitelisted,
    };
  }

  /**
   * GoodDollar IdentityV4 whitelist status and reverification progress for a wallet.
   * Resolves connected wallets via Identity `getWhitelistedRoot`.
   * @param address - Wallet to check against IdentityV4
   * @returns On-chain status, whitelist dates, field descriptions, and reverification timeline
   */
  async getWhitelistingInfo(address: `0x${string}`) {
    const link = await this.resolveWhitelistedRoot(address);
    const data = await this.fetchWhitelistingData(link.identityAddress);

    return {
      address,
      whitelistedRoot: link.root,
      isConnectedWallet: link.isConnectedWallet,
      isWhitelistedRoot: link.isWhitelistedRoot,
      checkedAddress: link.identityAddress,
      ...data,
    };
  }

  /**
   * Daily UBI claim eligibility for a wallet against UBISchemeV2 on Celo.
   * Resolves connected wallets via Identity `getWhitelistedRoot`.
   */
  async getUbiClaimEligibility(address: `0x${string}`) {
    const client = this.getPublicClient();
    const ubiContract = GOODDOLLAR_UBI_SCHEME_ADDRESS;
    const link = await this.resolveWhitelistedRoot(address);
    const root = link.root;

    const [
      claimableAmount,
      schemePaused,
      periodStart,
      estimatedDailyUbi,
      dailyUbi,
      ubiPeriodDay,
      whitelistingData,
    ] = await Promise.all([
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
      this.fetchWhitelistingData(link.identityAddress),
    ]);

    const claimable = claimableAmount as bigint;
    const periodStartBn = periodStart as bigint;
    const nowSec = BigInt(Math.floor(Date.now() / 1000));
    const schemeStarted = nowSec >= periodStartBn;

    const contractDay = ubiPeriodDay as bigint;
    const computedDay =
      schemeStarted && periodStartBn > 0n
        ? (nowSec - periodStartBn) / SECONDS_PER_DAY
        : 0n;

    let claimedForOnChainDay = false;
    let lastClaimedSec = 0n;

    if (root !== null) {
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
      claimedForOnChainDay = hasClaimed;
      lastClaimedSec = lastClaimed as bigint;
    }

    const periodState = resolveUbiPeriodEligibility({
      contractDay,
      computedDay,
      claimedForOnChainDay,
      hasRoot: root !== null,
      schemePaused,
      schemeStarted,
      isWhitelisted: whitelistingData.isWhitelisted,
      claimable,
    });

    const { alreadyClaimedToday, inClaimCooldown } = periodState;
    const nextClaimAt =
      periodStartBn + (computedDay + 1n) * SECONDS_PER_DAY;
    const secondsUntilNextClaim =
      inClaimCooldown && nextClaimAt > nowSec ? nextClaimAt - nowSec : 0n;

    const reasons: string[] = [];

    if (schemePaused) {
      reasons.push("scheme paused");
    }
    if (!schemeStarted) {
      reasons.push("scheme not started");
    }
    if (root === null) {
      reasons.push("not whitelisted");
    } else if (alreadyClaimedToday) {
      const waitLabel = formatDuration(secondsUntilNextClaim);
      const atLabel = formatUnixDateTimeUtc(nextClaimAt);
      reasons.push(
        `already claimed this period; next claim in ${waitLabel} (${atLabel})`,
      );
    } else {
      if (!whitelistingData.isWhitelisted) {
        if (whitelistingData.reverification?.isReverificationOverdue) {
          reasons.push("reverification overdue");
        } else {
          reasons.push("identity not currently whitelisted");
        }
      }
      if (claimable === 0n) {
        reasons.push("no entitlement available");
      }
    }

    const isEligibleToClaim = periodState.isEligibleToClaim;

    const lastClaimedAt =
      lastClaimedSec > 0n ? formatUnixIso(lastClaimedSec) : null;
    const nextClaimAvailableAt = formatUnixIso(nextClaimAt);
    const nextClaimAvailableIn = formatDuration(secondsUntilNextClaim);

    return {
      address,
      contract: ubiContract,
      whitelistedRoot: root,
      isConnectedWallet: link.isConnectedWallet,
      isWhitelistedRoot: link.isWhitelistedRoot,
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
        checkedAddress: link.identityAddress,
        isWhitelisted: whitelistingData.isWhitelisted,
        isWhitelistedRoot: link.isWhitelistedRoot,
        statusLabel: whitelistingData.statusLabel,
        reverification: whitelistingData.reverification,
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
    const claimData = appendCelinaCalldataTag(
      encodeFunctionData({
        abi: ubiSchemeAbi,
        functionName: "claim",
      }),
      this.attributionTags,
    );

    await publicClient.estimateContractGas({
      account: from,
      address: GOODDOLLAR_UBI_SCHEME_ADDRESS,
      abi: ubiSchemeAbi,
      functionName: "claim",
    });

    const summary = eligibility.isConnectedWallet && eligibility.whitelistedRoot
      ? `Claim daily GoodDollar UBI (${eligibility.claimableAmountFormatted}) via connected wallet → root ${eligibility.whitelistedRoot}`
      : `Claim daily GoodDollar UBI (${eligibility.claimableAmountFormatted})`;

    const flow: PreparedFlow = {
      chainId: CHAIN.id,
      from,
      summary,
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

  /**
   * Expected GoodDollar reserve output for G$ ↔ USDm — no wallet required.
   * Balance checks run on prepare/estimate only.
   */
  async getReserveQuote(
    tokenIn: string,
    tokenOut: string,
    amount: string,
    options?: GoodDollarReserveQuoteOptions,
  ) {
    return this.reserveClient().getReserveQuote(tokenIn, tokenOut, amount, options);
  }

  /**
   * Simulate gas for a GoodDollar reserve swap from `from`, including approval if needed.
   */
  async estimateReserveSwap(
    from: `0x${string}`,
    tokenIn: string,
    tokenOut: string,
    amount: string,
    params?: GoodDollarReserveSwapParams,
  ) {
    return this.reserveClient().estimateReserveSwap(from, tokenIn, tokenOut, amount, params);
  }

  /**
   * Build unsigned GoodDollar reserve swap steps (approve + swapIn when needed).
   */
  async prepareReserveSwap(
    from: `0x${string}`,
    tokenIn: string,
    tokenOut: string,
    amount: string,
    params?: GoodDollarReserveSwapParams,
  ) {
    return this.reserveClient().prepareReserveSwap(from, tokenIn, tokenOut, amount, params);
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

  /**
   * Link a secondary wallet to the caller's whitelisted GoodDollar identity.
   * The whitelisted root must be the signer (`from`).
   */
  async prepareConnectIdentity(
    from: `0x${string}`,
    connectedAccount: `0x${string}`,
  ): Promise<SerializedPreparedFlow> {
    const [link, whitelisting] = await Promise.all([
      this.getIdentityLink(from),
      this.getWhitelistingInfo(from),
    ]);

    if (!whitelisting.isWhitelisted || !link.isWhitelistedRoot) {
      throw new Error(
        buildConnectIdentityError({
          signerAddress: from,
          isWhitelisted: whitelisting.isWhitelisted,
          isWhitelistedRoot: link.isWhitelistedRoot,
          isConnectedWallet: link.isConnectedWallet,
          whitelistedRoot: link.whitelistedRoot,
          connectedTo: link.connectedTo,
        }),
      );
    }

    const data = appendCelinaCalldataTag(
      encodeFunctionData({
        abi: goodDollarIdentityAbi,
        functionName: "connectAccount",
        args: [connectedAccount],
      }),
      this.attributionTags,
    );

    const flow: PreparedFlow = {
      steps: [
        {
          kind: "contract",
          to: GOODDOLLAR_IDENTITY_ADDRESS,
          data,
          description: `Connect ${connectedAccount} to GoodDollar identity ${from}`,
        },
      ],
      summary: `Connect ${connectedAccount} to GoodDollar identity`,
      chainId: CHAIN.id,
      from,
    };

    return serializePreparedFlow(flow);
  }

  /**
   * Disconnect a secondary wallet from a GoodDollar identity.
   * Callable by the root or the connected account.
   */
  async prepareDisconnectIdentity(
    from: `0x${string}`,
    connectedAccount: `0x${string}`,
  ): Promise<SerializedPreparedFlow> {
    const data = appendCelinaCalldataTag(
      encodeFunctionData({
        abi: goodDollarIdentityAbi,
        functionName: "disconnectAccount",
        args: [connectedAccount],
      }),
      this.attributionTags,
    );

    const flow: PreparedFlow = {
      steps: [
        {
          kind: "contract",
          to: GOODDOLLAR_IDENTITY_ADDRESS,
          data,
          description: `Disconnect ${connectedAccount} from GoodDollar identity`,
        },
      ],
      summary: `Disconnect ${connectedAccount} from GoodDollar identity`,
      chainId: CHAIN.id,
      from,
    };

    return serializePreparedFlow(flow);
  }
}
