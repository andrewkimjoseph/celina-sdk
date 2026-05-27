import { isAddress } from "viem";
import { accountsAbi } from "../abis/accounts.js";
import { electionAbi } from "../abis/election.js";
import { lockedGoldAbi } from "../abis/locked-gold.js";
import { validatorsMinimalAbi } from "../abis/validators-minimal.js";
import type { CeloClientFactory } from "../clients/celo-client.js";
import { CELO_CORE_CONTRACTS } from "../config/celo-core-contracts.js";
import {
  formatAddress,
  formatCeloAmount,
  formatScorePercentage,
} from "../utils/celo-format.js";

const MAX_ELECTABLE_VALIDATORS = 110;

function calculateGroupCapacity(
  groupMembers: number,
  totalLockedGold: bigint,
  totalValidators: number,
): bigint {
  if (totalValidators === 0) return 0n;
  const divisor = BigInt(Math.min(MAX_ELECTABLE_VALIDATORS, totalValidators));
  return (totalLockedGold * BigInt(groupMembers + 1)) / divisor;
}

export class StakingService {
  constructor(private readonly clientFactory: CeloClientFactory) {}

  private getClient() {
    return this.clientFactory.getClients().public;
  }

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

  async getValidatorGroupDetails(groupAddress: `0x${string}`) {
    if (!isAddress(groupAddress)) {
      throw new Error(`Invalid group address: ${groupAddress}`);
    }

    const client = this.getClient();
    const election = CELO_CORE_CONTRACTS.election;
    const validators = CELO_CORE_CONTRACTS.validators;
    const accounts = CELO_CORE_CONTRACTS.accounts;
    const lockedGold = CELO_CORE_CONTRACTS.lockedGold;

    const [groupInfo, name, votes, eligibleGroups, totalLockedGold, allValidators] =
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
      lastSlashed,
      eligible,
      numMembers: members.length,
      numElected: votes > 0n ? members.length : 0,
      members: memberDetails,
    };
  }

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
}
