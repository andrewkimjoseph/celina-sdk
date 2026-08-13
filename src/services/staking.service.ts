/**
 * Celo validator election staking: votes, groups, network totals,
 * and Election/LockedGold delegation writes.
 */
import { encodeFunctionData, isAddress, parseEther } from "viem";
import { accountsAbi } from "../abis/accounts.js";
import { electionAbi } from "../abis/election.js";
import { lockedGoldAbi } from "../abis/locked-gold.js";
import { validatorsMinimalAbi } from "../abis/validators-minimal.js";
import type { CeloClientFactory } from "../clients/celo-client.js";
import { CELO_CORE_CONTRACTS } from "../config/celo-core-contracts.js";
import { appendCelinaCalldataTag } from "../config/celina-tag.js";
import { CHAIN } from "../config/chains.js";
import {
  type PreparedFlow,
  type PreparedTx,
  serializePreparedFlow,
  type SerializedPreparedFlow,
} from "../types/prepared.js";
import { assertCeloAccountRegistered } from "../utils/celo-account.js";
import {
  formatAddress,
  formatCeloAmount,
  formatScorePercentage,
} from "../utils/celo-format.js";
import { findLesserAndGreaterAfterVote } from "../utils/election-vote-neighbors.js";
import { fromFixidity, percentToFixidity } from "../utils/fixidity.js";
import {
  assertStakeEligible,
  computeGroupVoteHeadroom,
  deriveStakeEligibility,
  type StakeEligibilityResult,
} from "../utils/stake-eligibility.js";
import { isCeloAccountRegistered } from "../utils/celo-account.js";
import {
  getGovernanceDelegates as fetchGovernanceDelegates,
  getGovernanceDelegateDetails as fetchGovernanceDelegateDetails,
  type GetGovernanceDelegatesOptions,
  type GovernanceDelegateDetailsResult,
  type GovernanceDelegatesResult,
} from "./governance-delegates.js";

export type { StakeEligibilityResult } from "../utils/stake-eligibility.js";
export type {
  GetGovernanceDelegatesOptions,
  GovernanceDelegate,
  GovernanceDelegateDetailsResult,
  GovernanceDelegateMetadata,
  GovernanceDelegatesResult,
} from "./governance-delegates.js";

const MAX_ELECTABLE_VALIDATORS = 110;
const MIN_INCREMENTAL_VOTE_AMOUNT = parseEther("0.000001");

function calculateGroupCapacity(
  groupMembers: number,
  totalLockedGold: bigint,
  totalValidators: number,
): bigint {
  if (totalValidators === 0) return 0n;
  const divisor = BigInt(Math.min(MAX_ELECTABLE_VALIDATORS, totalValidators));
  return (totalLockedGold * BigInt(groupMembers + 1)) / divisor;
}

/** Validator election staking reads and writes via Celo core contracts. */
export class StakingService {
  private readonly attributionTags?: string[];

  constructor(private readonly clientFactory: CeloClientFactory) {
    this.attributionTags = clientFactory.getConfig().attributionTags;
  }

  private getClient() {
    return this.clientFactory.getClients().public;
  }

  /**
   * Active and pending CELO vote balances per validator group for an account.
   * @param address - Staker wallet address
   * @returns Totals and per-group active/pending vote amounts
   * @throws When `address` is not a valid hex address
   */
  async getStakingBalances(address: `0x${string}`) {
    if (!isAddress(address)) {
      throw new Error(`Invalid address: ${address}`);
    }

    const client = this.getClient();
    const election = CELO_CORE_CONTRACTS.election;

    const groupAddresses = (await client.readContract({
      address: election,
      abi: electionAbi,
      functionName: "getGroupsVotedForByAccount",
      args: [address],
    })) as readonly `0x${string}`[];

    if (groupAddresses.length === 0) {
      return {
        network: "mainnet" as const,
        address,
        active: "0",
        pending: "0",
        total: "0",
        activeFormatted: formatCeloAmount(0n),
        pendingFormatted: formatCeloAmount(0n),
        totalFormatted: formatCeloAmount(0n),
        groups: [] as Array<{
          groupAddress: string;
          active: string;
          pending: string;
          total: string;
          activeFormatted: string;
          pendingFormatted: string;
          totalFormatted: string;
        }>,
      };
    }

    const calls = groupAddresses.flatMap((group) => [
      {
        address: election,
        abi: electionAbi,
        functionName: "getPendingVotesForGroupByAccount" as const,
        args: [group, address] as const,
      },
      {
        address: election,
        abi: electionAbi,
        functionName: "getActiveVotesForGroupByAccount" as const,
        args: [group, address] as const,
      },
    ]);

    const results = await client.multicall({ contracts: calls, allowFailure: true });

    let totalActive = 0n;
    let totalPending = 0n;
    const groups = groupAddresses.map((group, index) => {
      const pendingResult = results[index * 2];
      const activeResult = results[index * 2 + 1];

      const pending =
        pendingResult.status === "success" ? (pendingResult.result as bigint) : 0n;
      const active =
        activeResult.status === "success" ? (activeResult.result as bigint) : 0n;

      totalActive += active;
      totalPending += pending;

      return {
        groupAddress: group,
        active: active.toString(),
        pending: pending.toString(),
        total: (active + pending).toString(),
        activeFormatted: formatCeloAmount(active),
        pendingFormatted: formatCeloAmount(pending),
        totalFormatted: formatCeloAmount(active + pending),
      };
    });

    const total = totalActive + totalPending;

    return {
      network: "mainnet" as const,
      address,
      active: totalActive.toString(),
      pending: totalPending.toString(),
      total: total.toString(),
      activeFormatted: formatCeloAmount(totalActive),
      pendingFormatted: formatCeloAmount(totalPending),
      totalFormatted: formatCeloAmount(total),
      groups,
    };
  }

  /**
   * Pending stakes that can be activated in the current epoch.
   * @param address - Staker wallet address
   * @returns Groups with activatable pending votes and a summary message
   * @throws When `address` is not a valid hex address
   */
  async getActivatableStakes(address: `0x${string}`) {
    if (!isAddress(address)) {
      throw new Error(`Invalid address: ${address}`);
    }

    const balances = await this.getStakingBalances(address);
    const pendingGroups = balances.groups.filter((g) => g.pending !== "0");

    if (pendingGroups.length === 0) {
      return {
        network: "mainnet" as const,
        address,
        activatableGroups: [] as string[],
        groupToIsActivatable: {} as Record<string, boolean>,
        summary: {
          totalActivatableGroups: 0,
          totalPendingGroups: 0,
          message: "No pending stakes found",
        },
      };
    }

    const client = this.getClient();
    const election = CELO_CORE_CONTRACTS.election;

    const calls = pendingGroups.map((g) => ({
      address: election,
      abi: electionAbi,
      functionName: "hasActivatablePendingVotes" as const,
      args: [address, g.groupAddress as `0x${string}`] as const,
    }));

    const results = await client.multicall({ contracts: calls, allowFailure: true });

    const groupToIsActivatable: Record<string, boolean> = {};
    const activatableGroups: string[] = [];

    pendingGroups.forEach((group, index) => {
      const result = results[index];
      const isActivatable =
        result.status === "success" ? (result.result as boolean) : false;
      groupToIsActivatable[group.groupAddress] = isActivatable;
      if (isActivatable) activatableGroups.push(group.groupAddress);
    });

    return {
      network: "mainnet" as const,
      address,
      activatableGroups,
      groupToIsActivatable,
      summary: {
        totalActivatableGroups: activatableGroups.length,
        totalPendingGroups: pendingGroups.length,
        activatableGroupsFormatted: activatableGroups.map(formatAddress),
        message: `${activatableGroups.length} of ${pendingGroups.length} groups have stakes ready to activate`,
      },
    };
  }

  /**
   * Paginated list of validator groups registered on Celo.
   * @param options.page - Page number (1-based)
   * @param options.pageSize - Groups per page (1–50, default 10)
   * @param options.offset - Alternative to `page`: zero-based offset
   * @param options.limit - Max groups when using `offset`
   * @returns Group addresses, vote totals, capacity, and pagination metadata
   */
  async getValidatorGroups(options?: {
    page?: number;
    pageSize?: number;
    offset?: number;
    limit?: number;
  }) {
    const pageSize = Math.min(Math.max(options?.pageSize ?? 10, 1), 50);

    let offset: number;
    let limit: number;

    if (options?.page !== undefined) {
      const page = Math.max(options.page, 1);
      offset = (page - 1) * pageSize;
      limit = pageSize;
    } else if (options?.offset !== undefined) {
      offset = Math.max(options.offset, 0);
      limit = Math.min(options?.limit ?? pageSize, 100);
    } else {
      offset = 0;
      limit = Math.min(options?.limit ?? pageSize, 100);
    }

    const client = this.getClient();
    const election = CELO_CORE_CONTRACTS.election;
    const validators = CELO_CORE_CONTRACTS.validators;
    const accounts = CELO_CORE_CONTRACTS.accounts;
    const lockedGold = CELO_CORE_CONTRACTS.lockedGold;

    let groupAddresses: readonly `0x${string}`[];
    let groupVotes: readonly bigint[] | null = null;

    try {
      const eligible = (await client.readContract({
        address: election,
        abi: electionAbi,
        functionName: "getTotalVotesForEligibleValidatorGroups",
      })) as readonly [readonly `0x${string}`[], readonly bigint[]];
      groupAddresses = eligible[0];
      groupVotes = eligible[1];
    } catch {
      groupAddresses = (await client.readContract({
        address: election,
        abi: electionAbi,
        functionName: "getEligibleValidatorGroups",
      })) as readonly `0x${string}`[];
    }

    const [totalVotes, totalLockedGold, allValidators] = await Promise.all([
      client.readContract({
        address: election,
        abi: electionAbi,
        functionName: "getTotalVotes",
      }) as Promise<bigint>,
      client
        .readContract({
          address: lockedGold,
          abi: lockedGoldAbi,
          functionName: "getTotalLockedGold",
        })
        .catch(() => 0n) as Promise<bigint>,
      client
        .readContract({
          address: validators,
          abi: validatorsMinimalAbi,
          functionName: "getRegisteredValidators",
        })
        .catch(() => [] as readonly `0x${string}`[]) as Promise<
        readonly `0x${string}`[]
      >,
    ]);

    const totalValidators = allValidators.length || MAX_ELECTABLE_VALIDATORS;
    const slice = groupAddresses.slice(offset, offset + limit);

    const groupCalls = slice.flatMap((group) => [
      {
        address: validators,
        abi: validatorsMinimalAbi,
        functionName: "getValidatorGroup" as const,
        args: [group] as const,
      },
      {
        address: accounts,
        abi: accountsAbi,
        functionName: "getName" as const,
        args: [group] as const,
      },
    ]);

    const groupResults = await client.multicall({
      contracts: groupCalls,
      allowFailure: true,
    });

    const groups = await Promise.all(
      slice.map(async (groupAddress, index) => {
        const groupInfoResult = groupResults[index * 2];
        const nameResult = groupResults[index * 2 + 1];

        const members =
          groupInfoResult.status === "success"
            ? (
                groupInfoResult.result as readonly [
                  readonly `0x${string}`[],
                  bigint,
                  bigint,
                  string,
                  readonly bigint[],
                  bigint,
                  bigint,
                ]
              )[0]
            : [];
        const name =
          nameResult.status === "success"
            ? (nameResult.result as string)
            : `${groupAddress.slice(0, 10)}...`;

        let votes: bigint = groupVotes?.[offset + index] ?? 0n;
        if (groupVotes === null) {
          votes = (await client.readContract({
            address: election,
            abi: electionAbi,
            functionName: "getActiveVotesForGroup",
            args: [groupAddress],
          })) as bigint;
        }

        const numMembers = members.length;
        const capacity = calculateGroupCapacity(
          numMembers,
          totalLockedGold || totalVotes,
          totalValidators,
        );

        return {
          address: groupAddress,
          name,
          votes: votes.toString(),
          votesFormatted: formatCeloAmount(votes),
          numMembers,
          capacity: capacity.toString(),
          capacityFormatted: formatCeloAmount(capacity),
          addressFormatted: formatAddress(groupAddress),
        };
      }),
    );

    const total = groupAddresses.length;
    const currentPage = options?.page ?? Math.floor(offset / pageSize) + 1;

    return {
      network: "mainnet" as const,
      groups,
      totalVotes: totalVotes.toString(),
      totalVotesFormatted: formatCeloAmount(totalVotes),
      pagination: {
        total,
        page: currentPage,
        pageSize,
        totalPages: Math.max(Math.ceil(total / pageSize), 1),
        offset,
        limit,
        hasMore: offset + limit < total,
      },
    };
  }

  /**
   * Detailed validator group profile including member validators and scores.
   * @param groupAddress - Validator group contract address
   * @returns Group name, votes, capacity, eligibility, and member list
   * @throws When `groupAddress` is not a valid hex address
   */
  async getValidatorGroupDetails(groupAddress: `0x${string}`) {
    if (!isAddress(groupAddress)) {
      throw new Error(`Invalid group address: ${groupAddress}`);
    }

    const client = this.getClient();
    const election = CELO_CORE_CONTRACTS.election;
    const validators = CELO_CORE_CONTRACTS.validators;
    const accounts = CELO_CORE_CONTRACTS.accounts;
    const lockedGold = CELO_CORE_CONTRACTS.lockedGold;

    const [groupInfo, name, votes, eligibleGroups, totalLockedGold, allValidators, totalVotesForGroup] =
      await Promise.all([
        client.readContract({
          address: validators,
          abi: validatorsMinimalAbi,
          functionName: "getValidatorGroup",
          args: [groupAddress],
        }) as Promise<
          readonly [
            readonly `0x${string}`[],
            bigint,
            bigint,
            string,
            readonly bigint[],
            bigint,
            bigint,
          ]
        >,
        client
          .readContract({
            address: accounts,
            abi: accountsAbi,
            functionName: "getName",
            args: [groupAddress],
          })
          .catch(() => `${groupAddress.slice(0, 10)}...`) as Promise<string>,
        client.readContract({
          address: election,
          abi: electionAbi,
          functionName: "getActiveVotesForGroup",
          args: [groupAddress],
        }) as Promise<bigint>,
        client.readContract({
          address: election,
          abi: electionAbi,
          functionName: "getEligibleValidatorGroups",
        }) as Promise<readonly `0x${string}`[]>,
        client
          .readContract({
            address: lockedGold,
            abi: lockedGoldAbi,
            functionName: "getTotalLockedGold",
          })
          .catch(() => 0n) as Promise<bigint>,
        client
          .readContract({
            address: validators,
            abi: validatorsMinimalAbi,
            functionName: "getRegisteredValidators",
          })
          .catch(() => [] as readonly `0x${string}`[]) as Promise<
          readonly `0x${string}`[]
        >,
        client.readContract({
          address: election,
          abi: electionAbi,
          functionName: "getTotalVotesForGroup",
          args: [groupAddress],
        }) as Promise<bigint>,
      ]);

    const members = groupInfo[0];
    const lastSlashed =
      groupInfo[2] > 0n ? Number(groupInfo[2]) * 1000 : null;
    const totalValidators = allValidators.length || MAX_ELECTABLE_VALIDATORS;
    const capacity = calculateGroupCapacity(
      members.length,
      totalLockedGold || votes,
      totalValidators,
    );
    const voteHeadroom = computeGroupVoteHeadroom(capacity, totalVotesForGroup);

    const memberCalls = members.flatMap((member) => [
      {
        address: validators,
        abi: validatorsMinimalAbi,
        functionName: "getValidator" as const,
        args: [member] as const,
      },
      {
        address: accounts,
        abi: accountsAbi,
        functionName: "getName" as const,
        args: [member] as const,
      },
    ]);

    const memberResults = await client.multicall({
      contracts: memberCalls,
      allowFailure: true,
    });

    const memberDetails = members.map((member, index) => {
      const validatorResult = memberResults[index * 2];
      const nameResult = memberResults[index * 2 + 1];

      if (validatorResult.status !== "success") {
        return {
          address: member,
          addressFormatted: formatAddress(member),
          name: `${member.slice(0, 10)}...`,
          score: "0",
          scoreFormatted: "0%",
          signer: null as string | null,
          status: votes > 0n ? "ELECTED" : "NOT_ELECTED",
        };
      }

      const validatorInfo = validatorResult.result as readonly [
        `0x${string}`,
        `0x${string}`,
        `0x${string}`,
        bigint,
        `0x${string}`,
      ];
      const memberName =
        nameResult.status === "success"
          ? (nameResult.result as string)
          : `${member.slice(0, 10)}...`;

      return {
        address: member,
        addressFormatted: formatAddress(member),
        name: memberName,
        score: validatorInfo[3].toString(),
        scoreFormatted: formatScorePercentage(validatorInfo[3]),
        signer: validatorInfo[4],
        status: votes > 0n ? "ELECTED" : "NOT_ELECTED",
      };
    });

    const eligible = eligibleGroups.some(
      (g) => g.toLowerCase() === groupAddress.toLowerCase(),
    );

    return {
      network: "mainnet" as const,
      address: groupAddress,
      name,
      votes: votes.toString(),
      votesFormatted: formatCeloAmount(votes),
      capacity: capacity.toString(),
      capacityFormatted: formatCeloAmount(capacity),
      canReceiveVotes: voteHeadroom.toString(),
      canReceiveVotesFormatted: formatCeloAmount(voteHeadroom),
      lastSlashed,
      eligible,
      numMembers: members.length,
      numElected: votes > 0n ? members.length : 0,
      members: memberDetails,
    };
  }

  /**
   * Network-wide total active staking votes across all validator groups.
   * @returns Total votes in wei and human-readable CELO formatting
   */
  async getTotalStakingInfo() {
    const client = this.getClient();
    const totalVotes = (await client.readContract({
      address: CELO_CORE_CONTRACTS.election,
      abi: electionAbi,
      functionName: "getTotalVotes",
    })) as bigint;

    return {
      network: "mainnet" as const,
      totalVotes: totalVotes.toString(),
      totalVotesCelo: Number(totalVotes / 10n ** 18n),
      totalVotesFormatted: formatCeloAmount(totalVotes),
      summary: {
        networkParticipation: formatCeloAmount(totalVotes),
        message: `Total network staking participation: ${formatCeloAmount(totalVotes)}`,
      },
    };
  }

  /** Governance vote delegation info from LockedGold for an address. */
  async getDelegationInfo(address: `0x${string}`) {
    if (!isAddress(address)) {
      throw new Error(`Invalid address: ${address}`);
    }

    const client = this.getClient();
    const lockedGold = CELO_CORE_CONTRACTS.lockedGold;

    const [totalDelegatedFraction, delegatees, votingPower] = await Promise.all([
      client.readContract({
        address: lockedGold,
        abi: lockedGoldAbi,
        functionName: "getAccountTotalDelegatedFraction",
        args: [address],
      }),
      client.readContract({
        address: lockedGold,
        abi: lockedGoldAbi,
        functionName: "getDelegateesOfDelegator",
        args: [address],
      }),
      client.readContract({
        address: lockedGold,
        abi: lockedGoldAbi,
        functionName: "getAccountTotalGovernanceVotingPower",
        args: [address],
      }),
    ]);

    const delegateeDetails = await Promise.all(
      (delegatees as readonly `0x${string}`[]).map(async (delegatee) => {
        const info = await client.readContract({
          address: lockedGold,
          abi: lockedGoldAbi,
          functionName: "getDelegatorDelegateeInfo",
          args: [address, delegatee],
        });
        const [fraction, currentAmount] = info as readonly [bigint, bigint];
        return {
          delegatee,
          fraction: fraction.toString(),
          fractionPercent: (fromFixidity(fraction) * 100).toFixed(2),
          currentAmount: currentAmount.toString(),
          currentAmountFormatted: formatCeloAmount(currentAmount),
        };
      }),
    );

    return {
      network: "mainnet" as const,
      address,
      totalDelegatedFraction: totalDelegatedFraction.toString(),
      totalDelegatedPercent: (fromFixidity(totalDelegatedFraction) * 100).toFixed(2),
      governanceVotingPower: votingPower.toString(),
      governanceVotingPowerFormatted: formatCeloAmount(votingPower),
      delegatees: delegateeDetails,
    };
  }

  /**
   * Curated Celo Mondo governance delegate directory with optional LockedGold stats.
   * Off-chain directory — not an on-chain registry; any address can receive delegation.
   */
  async getGovernanceDelegates(
    options?: GetGovernanceDelegatesOptions,
  ): Promise<GovernanceDelegatesResult> {
    return fetchGovernanceDelegates(this.getClient(), options);
  }

  /** Mondo profile (if listed) plus on-chain LockedGold stats for a delegate address. */
  async getGovernanceDelegateDetails(
    address: `0x${string}`,
  ): Promise<GovernanceDelegateDetailsResult> {
    if (!isAddress(address)) {
      throw new Error(`Invalid address: ${address}`);
    }
    return fetchGovernanceDelegateDetails(this.getClient(), address);
  }

  private async fetchGroupVoteHeadroom(groupAddress: `0x${string}`): Promise<bigint> {
    const client = this.getClient();
    const election = CELO_CORE_CONTRACTS.election;
    const validators = CELO_CORE_CONTRACTS.validators;
    const lockedGold = CELO_CORE_CONTRACTS.lockedGold;

    const [groupInfoResult, totalVotesForGroup, totalLockedGold, allValidators] =
      await Promise.all([
        client
          .readContract({
            address: validators,
            abi: validatorsMinimalAbi,
            functionName: "getValidatorGroup",
            args: [groupAddress],
          })
          .catch(() => null) as Promise<
          | readonly [
              readonly `0x${string}`[],
              bigint,
              bigint,
              string,
              readonly bigint[],
              bigint,
              bigint,
            ]
          | null
        >,
        client.readContract({
          address: election,
          abi: electionAbi,
          functionName: "getTotalVotesForGroup",
          args: [groupAddress],
        }) as Promise<bigint>,
        client
          .readContract({
            address: lockedGold,
            abi: lockedGoldAbi,
            functionName: "getTotalLockedGold",
          })
          .catch(() => 0n) as Promise<bigint>,
        client
          .readContract({
            address: validators,
            abi: validatorsMinimalAbi,
            functionName: "getRegisteredValidators",
          })
          .catch(() => [] as readonly `0x${string}`[]) as Promise<
          readonly `0x${string}`[]
        >,
      ]);

    const numMembers = groupInfoResult?.[0]?.length ?? 0;
    const totalValidators = allValidators.length || MAX_ELECTABLE_VALIDATORS;
    const capacity = calculateGroupCapacity(
      numMembers,
      totalLockedGold || totalVotesForGroup,
      totalValidators,
    );

    return computeGroupVoteHeadroom(capacity, totalVotesForGroup);
  }

  private buildStep(
    to: `0x${string}`,
    data: `0x${string}`,
    description: string,
  ): PreparedTx {
    return { kind: "contract", to, data, description };
  }

  private toPreparedFlow(
    from: `0x${string}`,
    steps: PreparedTx[],
    summary: string,
  ): SerializedPreparedFlow {
    const flow: PreparedFlow = {
      steps,
      summary,
      chainId: CHAIN.id,
      from,
    };
    return serializePreparedFlow(flow);
  }

  private async fetchEligibleGroupsWithVotes() {
    const client = this.getClient();
    const election = CELO_CORE_CONTRACTS.election;

    const eligible = (await client.readContract({
      address: election,
      abi: electionAbi,
      functionName: "getTotalVotesForEligibleValidatorGroups",
    })) as readonly [readonly `0x${string}`[], readonly bigint[]];

    return eligible[0].map((address, index) => ({
      address,
      votes: eligible[1][index] ?? 0n,
    }));
  }

  /**
   * Check whether a stake with the given amount would succeed before execute_stake.
   * Uses computed group headroom and Election.canReceiveVotes(group, amount),
   * non-voting locked balance, and account registration.
   */
  async getStakeEligibility(
    address: `0x${string}`,
    groupAddress: `0x${string}`,
    amount: string,
  ): Promise<StakeEligibilityResult> {
    if (!isAddress(address)) {
      throw new Error(`Invalid address: ${address}`);
    }
    if (!isAddress(groupAddress)) {
      throw new Error(`Invalid group address: ${groupAddress}`);
    }

    const amountWei = parseEther(amount);
    const client = this.getClient();
    const election = CELO_CORE_CONTRACTS.election;
    const accounts = CELO_CORE_CONTRACTS.accounts;
    const lockedGold = CELO_CORE_CONTRACTS.lockedGold;

    const [
      voteHeadroom,
      canReceiveAmount,
      nonvotingLocked,
      accountRegistered,
      eligibleGroups,
      groupName,
    ] = await Promise.all([
      this.fetchGroupVoteHeadroom(groupAddress),
      client.readContract({
        address: election,
        abi: electionAbi,
        functionName: "canReceiveVotes",
        args: [groupAddress, amountWei],
      }) as Promise<boolean>,
      client.readContract({
        address: lockedGold,
        abi: lockedGoldAbi,
        functionName: "getAccountNonvotingLockedGold",
        args: [address],
      }) as Promise<bigint>,
      isCeloAccountRegistered(this.clientFactory, address),
      client.readContract({
        address: election,
        abi: electionAbi,
        functionName: "getEligibleValidatorGroups",
      }) as Promise<readonly `0x${string}`[]>,
      client
        .readContract({
          address: accounts,
          abi: accountsAbi,
          functionName: "getName",
          args: [groupAddress],
        })
        .catch(() => undefined) as Promise<string | undefined>,
    ]);

    const inEligibleGroups = eligibleGroups.some(
      (g) => g.toLowerCase() === groupAddress.toLowerCase(),
    );

    return deriveStakeEligibility({
      address,
      groupAddress,
      groupName: groupName || undefined,
      amount,
      amountWei,
      canReceiveVotes: voteHeadroom,
      canReceiveAmount,
      nonvotingLocked,
      accountRegistered,
      inEligibleGroups,
    });
  }

  async prepareStake(
    from: `0x${string}`,
    groupAddress: `0x${string}`,
    amount: string,
  ): Promise<SerializedPreparedFlow> {
    const eligibility = await this.getStakeEligibility(from, groupAddress, amount);
    assertStakeEligible(eligibility);

    const amountWei = parseEther(amount);
    const groups = await this.fetchEligibleGroupsWithVotes();
    const { lesser, greater } = findLesserAndGreaterAfterVote(
      groups,
      groupAddress,
      amountWei,
    );

    const data = appendCelinaCalldataTag(
      encodeFunctionData({
        abi: electionAbi,
        functionName: "vote",
        args: [groupAddress, amountWei, lesser, greater],
      }),
      this.attributionTags,
    );

    return this.toPreparedFlow(
      from,
      [
        this.buildStep(
          CELO_CORE_CONTRACTS.election,
          data,
          `Stake ${amount} CELO with validator group ${formatAddress(groupAddress)}`,
        ),
      ],
      `Stake ${amount} CELO with ${groupAddress}`,
    );
  }

  async prepareActivateStake(
    from: `0x${string}`,
    groupAddress: `0x${string}`,
  ): Promise<SerializedPreparedFlow> {
    await assertCeloAccountRegistered(this.clientFactory, from);
    if (!isAddress(groupAddress)) {
      throw new Error(`Invalid group address: ${groupAddress}`);
    }

    const activatable = await this.getActivatableStakes(from);
    if (!activatable.activatableGroups.includes(groupAddress)) {
      throw new Error(
        `No activatable pending stake for group ${groupAddress}. Wait for the next epoch boundary.`,
      );
    }

    const data = appendCelinaCalldataTag(
      encodeFunctionData({
        abi: electionAbi,
        functionName: "activate",
        args: [groupAddress],
      }),
      this.attributionTags,
    );

    return this.toPreparedFlow(
      from,
      [
        this.buildStep(
          CELO_CORE_CONTRACTS.election,
          data,
          `Activate pending stake for ${formatAddress(groupAddress)}`,
        ),
      ],
      `Activate stake for ${groupAddress}`,
    );
  }

  async prepareUnstake(
    from: `0x${string}`,
    groupAddress: `0x${string}`,
    amount: string,
  ): Promise<SerializedPreparedFlow> {
    await assertCeloAccountRegistered(this.clientFactory, from);
    if (!isAddress(groupAddress)) {
      throw new Error(`Invalid group address: ${groupAddress}`);
    }

    const amountWei = parseEther(amount);
    const balances = await this.getStakingBalances(from);
    const group = balances.groups.find(
      (g) => g.groupAddress.toLowerCase() === groupAddress.toLowerCase(),
    );
    if (!group) {
      throw new Error(`No stake found for group ${groupAddress}`);
    }

    const groupIndex = balances.groups.findIndex(
      (g) => g.groupAddress.toLowerCase() === groupAddress.toLowerCase(),
    );
    const pending = BigInt(group.pending);
    const groups = await this.fetchEligibleGroupsWithVotes();
    const steps: PreparedTx[] = [];
    let amountRemaining = amountWei;

    const pendingToRevoke =
      pending < amountRemaining ? pending : amountRemaining;
    if (pendingToRevoke > 0n) {
      const { lesser, greater } = findLesserAndGreaterAfterVote(
        groups,
        groupAddress,
        -pendingToRevoke,
      );
      const data = appendCelinaCalldataTag(
        encodeFunctionData({
          abi: electionAbi,
          functionName: "revokePending",
          args: [groupAddress, pendingToRevoke, lesser, greater, BigInt(groupIndex)],
        }),
        this.attributionTags,
      );
      steps.push(
        this.buildStep(
          CELO_CORE_CONTRACTS.election,
          data,
          `Revoke ${formatCeloAmount(pendingToRevoke)} pending stake from ${formatAddress(groupAddress)}`,
        ),
      );
      amountRemaining -= pendingToRevoke;
    }

    if (amountRemaining >= MIN_INCREMENTAL_VOTE_AMOUNT) {
      const { lesser, greater } = findLesserAndGreaterAfterVote(
        groups,
        groupAddress,
        -amountRemaining,
      );
      const data = appendCelinaCalldataTag(
        encodeFunctionData({
          abi: electionAbi,
          functionName: "revokeActive",
          args: [groupAddress, amountRemaining, lesser, greater, BigInt(groupIndex)],
        }),
        this.attributionTags,
      );
      steps.push(
        this.buildStep(
          CELO_CORE_CONTRACTS.election,
          data,
          `Revoke ${formatCeloAmount(amountRemaining)} active stake from ${formatAddress(groupAddress)}`,
        ),
      );
    }

    if (steps.length === 0) {
      throw new Error("Unstake amount too small or no stake available.");
    }

    return this.toPreparedFlow(
      from,
      steps,
      `Unstake ${amount} CELO from ${groupAddress}`,
    );
  }

  async prepareDelegatePower(
    from: `0x${string}`,
    delegatee: `0x${string}`,
    percent: number,
  ): Promise<SerializedPreparedFlow> {
    await assertCeloAccountRegistered(this.clientFactory, from);
    if (!isAddress(delegatee)) {
      throw new Error(`Invalid delegatee address: ${delegatee}`);
    }
    if (percent <= 0 || percent > 100) {
      throw new Error("Delegation percent must be between 0 and 100.");
    }

    const fraction = percentToFixidity(percent);
    const data = appendCelinaCalldataTag(
      encodeFunctionData({
        abi: lockedGoldAbi,
        functionName: "delegateGovernanceVotes",
        args: [delegatee, fraction],
      }),
      this.attributionTags,
    );

    return this.toPreparedFlow(
      from,
      [
        this.buildStep(
          CELO_CORE_CONTRACTS.lockedGold,
          data,
          `Delegate ${percent}% governance voting power to ${formatAddress(delegatee)}`,
        ),
      ],
      `Delegate ${percent}% power to ${delegatee}`,
    );
  }

  async prepareUndelegatePower(
    from: `0x${string}`,
    delegatee: `0x${string}`,
    percent: number,
  ): Promise<SerializedPreparedFlow> {
    await assertCeloAccountRegistered(this.clientFactory, from);
    if (!isAddress(delegatee)) {
      throw new Error(`Invalid delegatee address: ${delegatee}`);
    }
    if (percent <= 0 || percent > 100) {
      throw new Error("Undelegation percent must be between 0 and 100.");
    }

    const fraction = percentToFixidity(percent);
    const data = appendCelinaCalldataTag(
      encodeFunctionData({
        abi: lockedGoldAbi,
        functionName: "revokeDelegatedGovernanceVotes",
        args: [delegatee, fraction],
      }),
      this.attributionTags,
    );

    return this.toPreparedFlow(
      from,
      [
        this.buildStep(
          CELO_CORE_CONTRACTS.lockedGold,
          data,
          `Revoke ${percent}% delegated power from ${formatAddress(delegatee)}`,
        ),
      ],
      `Undelegate ${percent}% from ${delegatee}`,
    );
  }
}
