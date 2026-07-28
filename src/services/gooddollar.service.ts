/**
 * GoodDollar IdentityV4 whitelist, reverification reads, UBI claims, and reserve swaps on Celo mainnet.
 */
import {
  encodeFunctionData,
  erc20Abi,
  formatUnits,
  maxUint256,
  type Hex,
} from "viem";
import type { CeloClientFactory } from "../clients/celo-client.js";
import { goodDollarBrokerAbi } from "../abis/gooddollar-broker.js";
import { goodDollarIdentityAbi } from "../abis/gooddollar-identity.js";
import { ubiSchemeAbi } from "../abis/ubi-scheme.js";
import {
  GOODDOLLAR_CUSD_EXCHANGE_ID,
  GOODDOLLAR_IDENTITY_ADDRESS,
  GOODDOLLAR_MENTO_BROKER,
  GOODDOLLAR_MENTO_EXCHANGE_PROVIDER,
  GOODDOLLAR_RESERVE_COLLATERAL,
  GOODDOLLAR_TOKEN_ADDRESS,
  GOODDOLLAR_UBI_SCHEME_ADDRESS,
  isGoodDollarUsdReservePair,
} from "../config/gooddollar.js";
import { appendCelinaCalldataTag } from "../config/celina-tag.js";
import {
  type PreparedFlow,
  type PreparedTx,
  serializePreparedFlow,
  type SerializedPreparedFlow,
} from "../types/prepared.js";
import { CHAIN } from "../config/chains.js";
import {
  ALLOWANCE_MAPPING_SLOTS,
  erc20AllowanceStateOverride,
} from "../utils/erc20-allowance-storage.js";
import { TokenService, type ResolvedToken } from "./token.service.js";
import { formatUnixDate } from "../utils/format-date.js";
import { formatDuration } from "../utils/format-duration.js";
import {
  formatUnixDateTimeUtc,
  formatUnixIso,
} from "../utils/format-unix-datetime.js";
import { resolveUbiPeriodEligibility } from "../utils/gooddollar-ubi-period.js";

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

export type GoodDollarReserveAmountSide = "in" | "out";

/** Optional parameters for GoodDollar reserve swap prepares. */
export interface GoodDollarReserveSwapParams {
  /** Max slippage tolerance in percent (default `0.5`). */
  slippageTolerance?: number;
  /** Address receiving output tokens (default: `from`). */
  recipient?: `0x${string}`;
  /**
   * `in` (default): `amount` is token_in spend. `out`: `amount` is desired token_out;
   * SDK resolves required token_in via MentoBroker `getAmountIn`.
   */
  amountSide?: GoodDollarReserveAmountSide;
}

export interface GoodDollarReserveQuoteOptions {
  /** @deprecated Ignored; balance checks run on prepare/estimate only. */
  from?: `0x${string}`;
  amountSide?: GoodDollarReserveAmountSide;
}

const DEFAULT_RESERVE_SLIPPAGE = 0.5;

function trimDisplayDecimals(value: string): string {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return value;
  }
  if (Math.abs(num) >= 1000) {
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }
  if (Math.abs(num) >= 1) {
    return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
  }
  return num.toLocaleString(undefined, { maximumSignificantDigits: 6 });
}

function applySlippage(amountOut: bigint, slippagePercent: number): bigint {
  const bps = BigInt(Math.round(slippagePercent * 100));
  return (amountOut * (10000n - bps)) / 10000n;
}

function tokenAddress(token: ResolvedToken): `0x${string}` {
  if (token.address === "native") {
    throw new Error(`${token.symbol} is native CELO; GoodDollar reserve swaps require ERC-20 tokens.`);
  }
  return token.address;
}

/** GoodDollar IdentityV4 whitelist, reverification, daily UBI claim, and reserve swap preparation. */
export class GoodDollarService {
  private readonly tokenService: TokenService;
  private readonly attributionTags?: string[];

  constructor(private readonly clientFactory: CeloClientFactory) {
    this.tokenService = new TokenService(clientFactory);
    this.attributionTags = clientFactory.getConfig().attributionTags;
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
    const isWhitelistedRoot =
      link.root !== null &&
      link.root.toLowerCase() === address.toLowerCase();

    return {
      address,
      contract: GOODDOLLAR_IDENTITY_ADDRESS,
      whitelistedRoot: link.root,
      isConnectedWallet: link.isConnectedWallet,
      isWhitelistedRoot,
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

  private resolveReservePair(tokenIn: string, tokenOut: string) {
    if (!isGoodDollarUsdReservePair(tokenIn, tokenOut)) {
      throw new Error(
        `No GoodDollar reserve route for ${tokenIn} → ${tokenOut}. Supported: GoodDollar ↔ USDm.`,
      );
    }

    const resolvedIn = this.tokenService.resolveToken(tokenIn);
    const resolvedOut = this.tokenService.resolveToken(tokenOut);
    const tokenInAddr = tokenAddress(resolvedIn);
    const tokenOutAddr = tokenAddress(resolvedOut);

    const gdAddr = GOODDOLLAR_TOKEN_ADDRESS.toLowerCase();
    const collateralAddr = GOODDOLLAR_RESERVE_COLLATERAL.toLowerCase();
    const inLower = tokenInAddr.toLowerCase();
    const outLower = tokenOutAddr.toLowerCase();

    if (
      !(
        (inLower === gdAddr && outLower === collateralAddr) ||
        (inLower === collateralAddr && outLower === gdAddr)
      )
    ) {
      throw new Error(
        `No GoodDollar reserve route for ${resolvedIn.symbol} → ${resolvedOut.symbol}.`,
      );
    }

    return { resolvedIn, resolvedOut, tokenInAddr, tokenOutAddr };
  }

  private reserveOptions(params?: GoodDollarReserveSwapParams) {
    return {
      slippageTolerance: params?.slippageTolerance ?? DEFAULT_RESERVE_SLIPPAGE,
    };
  }

  private baseReserveQuoteFields(
    resolvedIn: ResolvedToken,
    resolvedOut: ResolvedToken,
    amountIn: string,
    expectedOutWei: bigint,
    amountSide: GoodDollarReserveAmountSide,
  ) {
    return {
      protocol: "gooddollar_reserve" as const,
      network: "mainnet" as const,
      tokenIn: resolvedIn.symbol,
      tokenOut: resolvedOut.symbol,
      amountIn,
      expectedOut: formatUnits(expectedOutWei, resolvedOut.decimals),
      amountSide,
      routeHops: 1,
      broker: GOODDOLLAR_MENTO_BROKER,
      exchangeProvider: GOODDOLLAR_MENTO_EXCHANGE_PROVIDER,
      exchangeId: GOODDOLLAR_CUSD_EXCHANGE_ID,
    };
  }

  private async resolveReserveAmount(
    client: ReturnType<CeloClientFactory["getClients"]>["public"],
    resolvedIn: ResolvedToken,
    resolvedOut: ResolvedToken,
    tokenInAddr: `0x${string}`,
    tokenOutAddr: `0x${string}`,
    amount: string,
    amountSide: GoodDollarReserveAmountSide = "in",
  ) {
    if (amountSide === "in") {
      const amountInWei = this.tokenService.parseAmount(amount, resolvedIn.decimals);
      const expectedOutWei = await client.readContract({
        address: GOODDOLLAR_MENTO_BROKER,
        abi: goodDollarBrokerAbi,
        functionName: "getAmountOut",
        args: [
          GOODDOLLAR_MENTO_EXCHANGE_PROVIDER,
          GOODDOLLAR_CUSD_EXCHANGE_ID,
          tokenInAddr,
          tokenOutAddr,
          amountInWei,
        ],
      });

      return {
        amountIn: amount,
        amountInWei,
        expectedOutWei,
        amountSide: "in" as const,
      };
    }

    const expectedOutWei = this.tokenService.parseAmount(amount, resolvedOut.decimals);
    const amountInWei = await client.readContract({
      address: GOODDOLLAR_MENTO_BROKER,
      abi: goodDollarBrokerAbi,
      functionName: "getAmountIn",
      args: [
        GOODDOLLAR_MENTO_EXCHANGE_PROVIDER,
        GOODDOLLAR_CUSD_EXCHANGE_ID,
        tokenInAddr,
        tokenOutAddr,
        expectedOutWei,
      ],
    });

    return {
      amountIn: trimDisplayDecimals(formatUnits(amountInWei, resolvedIn.decimals)),
      amountInWei,
      expectedOutWei,
      amountSide: "out" as const,
    };
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
    const { public: client } = this.clientFactory.getClients();
    const { resolvedIn, resolvedOut, tokenInAddr, tokenOutAddr } =
      this.resolveReservePair(tokenIn, tokenOut);
    const amountSide = options?.amountSide ?? "in";
    const resolved = await this.resolveReserveAmount(
      client,
      resolvedIn,
      resolvedOut,
      tokenInAddr,
      tokenOutAddr,
      amount,
      amountSide,
    );

    return this.baseReserveQuoteFields(
      resolvedIn,
      resolvedOut,
      resolved.amountIn,
      resolved.expectedOutWei,
      resolved.amountSide,
    );
  }

  private async buildReserveSwap(
    from: `0x${string}`,
    tokenIn: string,
    tokenOut: string,
    amount: string,
    params?: GoodDollarReserveSwapParams,
  ) {
    const { public: client } = this.clientFactory.getClients();
    const { resolvedIn, resolvedOut, tokenInAddr, tokenOutAddr } =
      this.resolveReservePair(tokenIn, tokenOut);
    const recipient = params?.recipient ?? from;
    const amountSide = params?.amountSide ?? "in";
    const { slippageTolerance } = this.reserveOptions(params);
    const resolved = await this.resolveReserveAmount(
      client,
      resolvedIn,
      resolvedOut,
      tokenInAddr,
      tokenOutAddr,
      amount,
      amountSide,
    );
    const { amountIn, amountInWei, expectedOutWei } = resolved;

    await this.tokenService.assertSpendableBalance(from, resolvedIn, amountIn, {
      spendToken: tokenInAddr,
    });

    const amountOutMin = applySlippage(expectedOutWei, slippageTolerance);

    const swapData = appendCelinaCalldataTag(
      encodeFunctionData({
        abi: goodDollarBrokerAbi,
        functionName: "swapIn",
        args: [
          GOODDOLLAR_MENTO_EXCHANGE_PROVIDER,
          GOODDOLLAR_CUSD_EXCHANGE_ID,
          tokenInAddr,
          tokenOutAddr,
          amountInWei,
          amountOutMin,
        ],
      }),
      this.attributionTags,
    );

    return {
      client,
      from,
      recipient,
      resolvedIn,
      resolvedOut,
      tokenInAddr,
      tokenOutAddr,
      amountIn,
      amountInWei,
      expectedOutWei,
      amountOutMin,
      swapData,
      slippageTolerance,
      amountSide: resolved.amountSide,
    };
  }

  private buildReserveApprovalData(): Hex {
    return appendCelinaCalldataTag(
      encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: [GOODDOLLAR_MENTO_BROKER, maxUint256],
      }),
      this.attributionTags,
    );
  }

  private async estimateReserveSwapGas(
    client: ReturnType<CeloClientFactory["getClients"]>["public"],
    from: `0x${string}`,
    swapData: Hex,
    tokenInAddr: `0x${string}`,
    approvalNeeded: boolean,
  ): Promise<string> {
    const swapEstimateRequest = {
      account: from,
      to: GOODDOLLAR_MENTO_BROKER,
      data: swapData,
      value: 0n,
    };

    if (!approvalNeeded) {
      const gas = await client.estimateGas(swapEstimateRequest);
      return gas.toString();
    }

    for (const mappingSlot of ALLOWANCE_MAPPING_SLOTS) {
      try {
        const gas = await client.estimateGas({
          ...swapEstimateRequest,
          stateOverride: erc20AllowanceStateOverride(
            tokenInAddr,
            from,
            GOODDOLLAR_MENTO_BROKER,
            maxUint256,
            mappingSlot,
          ),
        });
        return gas.toString();
      } catch (error) {
        const isLast = mappingSlot === ALLOWANCE_MAPPING_SLOTS.at(-1);
        if (isLast) {
          throw error;
        }
      }
    }

    throw new Error(
      "Could not estimate GoodDollar reserve swap gas: failed to simulate ERC-20 allowance for this token.",
    );
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
    const built = await this.buildReserveSwap(from, tokenIn, tokenOut, amount, params);
    const {
      client,
      resolvedIn,
      resolvedOut,
      tokenInAddr,
      amountInWei,
      expectedOutWei,
      amountOutMin,
      swapData,
      slippageTolerance,
      recipient,
    } = built;

    const allowance = await client.readContract({
      address: tokenInAddr,
      abi: erc20Abi,
      functionName: "allowance",
      args: [from, GOODDOLLAR_MENTO_BROKER],
    });

    const approvalNeeded = allowance < amountInWei;
    const approvalGas = approvalNeeded
      ? (
          await client.estimateGas({
            account: from,
            to: tokenInAddr,
            data: this.buildReserveApprovalData(),
          })
        ).toString()
      : undefined;

    const swapGas = await this.estimateReserveSwapGas(
      client,
      from,
      swapData,
      tokenInAddr,
      approvalNeeded,
    );

    const approvalGasBig = approvalGas ? BigInt(approvalGas) : 0n;
    const totalGas = (approvalGasBig + BigInt(swapGas)).toString();

    return {
      ...this.baseReserveQuoteFields(
        resolvedIn,
        resolvedOut,
        built.amountIn,
        expectedOutWei,
        built.amountSide,
      ),
      from,
      recipient,
      amountOutMin: formatUnits(amountOutMin, resolvedOut.decimals),
      approvalNeeded,
      approvalGas,
      swapGas,
      totalGas,
      slippageTolerance,
    };
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
  ): Promise<SerializedPreparedFlow> {
    const built = await this.buildReserveSwap(from, tokenIn, tokenOut, amount, params);
    const {
      client,
      resolvedIn,
      resolvedOut,
      tokenInAddr,
      amountInWei,
      expectedOutWei,
      swapData,
      recipient,
    } = built;

    const displayIn = trimDisplayDecimals(built.amountIn);
    const displayOut = trimDisplayDecimals(
      formatUnits(expectedOutWei, resolvedOut.decimals),
    );

    const steps: PreparedTx[] = [];

    const allowance = await client.readContract({
      address: tokenInAddr,
      abi: erc20Abi,
      functionName: "allowance",
      args: [from, GOODDOLLAR_MENTO_BROKER],
    });

    if (allowance < amountInWei) {
      steps.push({
        kind: "erc20",
        to: tokenInAddr,
        data: this.buildReserveApprovalData(),
        value: "0",
        description: `Approve ${resolvedIn.symbol} for GoodDollar reserve`,
      });
    }

    steps.push({
      kind: "contract",
      to: GOODDOLLAR_MENTO_BROKER,
      data: swapData,
      value: "0",
      description: `Swap ${displayIn} ${resolvedIn.symbol} → ~${displayOut} ${resolvedOut.symbol} via GoodDollar reserve`,
    });

    await this.estimateReserveSwapGas(
      client,
      from,
      swapData,
      tokenInAddr,
      allowance < amountInWei,
    );

    const flow: PreparedFlow = {
      chainId: CHAIN.id,
      from,
      summary: `GoodDollar reserve: ${displayIn} ${resolvedIn.symbol} → ${displayOut} ${resolvedOut.symbol}${recipient !== from ? ` (recipient ${recipient})` : ""}`,
      steps,
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

  /**
   * Link a secondary wallet to the caller's whitelisted GoodDollar identity.
   * The whitelisted root must be the signer (`from`).
   */
  async prepareConnectIdentity(
    from: `0x${string}`,
    connectedAccount: `0x${string}`,
  ): Promise<SerializedPreparedFlow> {
    const whitelisting = await this.getWhitelistingInfo(from);
    if (!whitelisting.isWhitelisted) {
      throw new Error(
        `Signer ${from} is not a whitelisted GoodDollar identity root. ` +
          "Use get_gooddollar_face_verification_link to verify first.",
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
