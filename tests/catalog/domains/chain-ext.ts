import assert from "node:assert/strict";
import type { OperationSpec } from "../types.js";
import { assertArray, assertHasKeys } from "../../helpers/assert.js";

export const governanceOperations: OperationSpec[] = [
  {
    id: "governance.getGovernanceProposals",
    domain: "governance",
    layer: "read",
    sdk: {
      invoke: (client) =>
        client.governance.getGovernanceProposals({ page: 1, pageSize: 5 }),
    },
    mcp: {
      tool: "get_governance_proposals",
      arguments: () => ({ page: 1, page_size: 5 }),
    },
    assert: (result) => {
      const obj = assertHasKeys(result, ["proposals", "pagination"]);
      assert.equal(Array.isArray(obj.proposals), true);
    },
  },
  {
    id: "governance.getProposalDetails",
    domain: "governance",
    layer: "read",
    sdk: {
      invoke: (client, fx) =>
        client.governance.getProposalDetails(fx.proposalId),
    },
    mcp: {
      tool: "get_proposal_details",
      arguments: (fx) => ({ proposal_id: fx.proposalId }),
    },
    assert: (result) => {
      assertHasKeys(result, ["proposal"]);
    },
  },
  {
    id: "governance.getLockedCeloBalance",
    domain: "governance",
    layer: "read",
    sdk: {
      invoke: (client, fx) => client.governance.getLockedCeloBalance(fx.wallet),
    },
    mcp: { tool: "get_locked_celo_balance", arguments: (fx) => ({ address: fx.wallet }) },
    assert: (result) => assertHasKeys(result, ["totalLocked"]),
  },
  {
    id: "governance.getPendingWithdrawals",
    domain: "governance",
    layer: "read",
    sdk: {
      invoke: (client, fx) => client.governance.getPendingWithdrawals(fx.wallet),
    },
    mcp: { tool: "get_pending_withdrawals", arguments: (fx) => ({ address: fx.wallet }) },
    assert: (result) => assertHasKeys(result, ["withdrawals"]),
  },
  {
    id: "governance.getVotableProposals",
    domain: "governance",
    layer: "read",
    sdk: { invoke: (client) => client.governance.getVotableProposals() },
    mcp: { tool: "get_votable_proposals", arguments: () => ({}) },
    assert: (result) => assertHasKeys(result, ["proposals"]),
  },
  {
    id: "governance.getGovernanceVotes",
    domain: "governance",
    layer: "read",
    sdk: {
      invoke: (client, fx) => client.governance.getGovernanceVotes(fx.wallet),
    },
    mcp: {
      tool: "get_governance_votes",
      arguments: (fx) => ({ address: fx.wallet }),
    },
    assert: (result) => assertHasKeys(result, ["referendumVotes", "upvote", "message"]),
  },
  {
    id: "governance.prepareLockCelo",
    domain: "governance",
    layer: "prepare",
    sdk: {
      invoke: (client, fx) =>
        client.governance.prepareLockCelo(fx.wallet, "0.01"),
    },
    assert: (result) => assertHasKeys(result, ["steps"]),
  },
  {
    id: "governance.executeLockCelo",
    domain: "governance",
    layer: "write",
    requiresWrites: true,
    requiresEnv: ["CELO_PRIVATE_KEY"],
    skip: () => undefined,
    sdk: {
      invoke: async (client, fx) => {
        const humanness = await client.humanness.checkHumanness(fx.wallet);
        if (!humanness.isHumanOverall) {
          return { skipped: true, reason: "signer not humanness-verified" };
        }
        return client.governance.prepareLockCelo(fx.wallet, "0.1");
      },
    },
    mcp: {
      tool: "execute_lock_celo",
      arguments: () => ({ amount: "0.1" }),
    },
    assert: (result) => {
      if (typeof result === "object" && result && "skipped" in result) return;
      assertHasKeys(result, ["steps"]);
    },
  },
  {
    id: "governance.executeVote",
    domain: "governance",
    layer: "write",
    requiresWrites: true,
    requiresEnv: ["CELO_PRIVATE_KEY"],
    skip: () => {
      return "No deterministic Referendum proposal — check get_votable_proposals manually";
    },
    sdk: {
      invoke: (client, fx) =>
        client.governance.prepareVote(fx.wallet, 1, "Abstain"),
    },
    mcp: {
      tool: "execute_vote",
      arguments: () => ({ proposal_id: 1, vote: "Abstain" }),
    },
    assert: (result) => assertHasKeys(result, ["steps"]),
  },
  {
    id: "governance.prepareUpvote",
    domain: "governance",
    layer: "prepare",
    sdk: {
      invoke: (client, fx) => client.governance.prepareUpvote(fx.wallet, 1),
    },
    assert: (result) => assertHasKeys(result, ["steps"]),
  },
  {
    id: "governance.prepareRevokeGovernanceVotes",
    domain: "governance",
    layer: "prepare",
    sdk: {
      invoke: (client, fx) =>
        client.governance.prepareRevokeGovernanceVotes(fx.wallet),
    },
    assert: (result) => assertHasKeys(result, ["steps"]),
  },
  {
    id: "governance.prepareRevokeGovernanceUpvote",
    domain: "governance",
    layer: "prepare",
    sdk: {
      invoke: (client, fx) =>
        client.governance.prepareRevokeGovernanceUpvote(fx.wallet),
    },
    assert: (result) => assertHasKeys(result, ["steps"]),
  },
  {
    id: "governance.executeUpvote",
    domain: "governance",
    layer: "write",
    requiresWrites: true,
    requiresEnv: ["CELO_PRIVATE_KEY"],
    skip: () => "Pick a Queued proposal from get_governance_proposals manually",
    sdk: {
      invoke: (client, fx) => client.governance.prepareUpvote(fx.wallet, 1),
    },
    mcp: { tool: "execute_upvote", arguments: () => ({ proposal_id: 1 }) },
    assert: (result) => assertHasKeys(result, ["steps"]),
  },
  {
    id: "governance.executeRevokeGovernanceVotes",
    domain: "governance",
    layer: "write",
    requiresWrites: true,
    requiresEnv: ["CELO_PRIVATE_KEY"],
    skip: () => "Requires active referendum votes — check get_governance_votes",
    sdk: {
      invoke: (client, fx) =>
        client.governance.prepareRevokeGovernanceVotes(fx.wallet),
    },
    mcp: { tool: "execute_revoke_governance_votes", arguments: () => ({}) },
    assert: (result) => assertHasKeys(result, ["steps"]),
  },
  {
    id: "governance.executeRevokeGovernanceUpvote",
    domain: "governance",
    layer: "write",
    requiresWrites: true,
    requiresEnv: ["CELO_PRIVATE_KEY"],
    skip: () => "Requires an active queue upvote — check get_governance_votes",
    sdk: {
      invoke: (client, fx) =>
        client.governance.prepareRevokeGovernanceUpvote(fx.wallet),
    },
    mcp: { tool: "execute_revoke_governance_upvote", arguments: () => ({}) },
    assert: (result) => assertHasKeys(result, ["steps"]),
  },
  {
    id: "governance.executeWithdrawCelo",
    domain: "governance",
    layer: "write",
    requiresWrites: true,
    requiresEnv: ["CELO_PRIVATE_KEY"],
    skip: () => "Re-run after a pending withdrawal matures (3-day timelock)",
    sdk: {
      invoke: (client, fx) => client.governance.prepareWithdrawCelo(fx.wallet),
    },
    mcp: { tool: "execute_withdraw_celo", arguments: () => ({}) },
    assert: (result) => assertHasKeys(result, ["steps"]),
  },
  {
    id: "humanness.checkHumanness",
    domain: "humanness",
    layer: "read",
    sdk: {
      invoke: (client, fx) => client.humanness.checkHumanness(fx.wallet),
    },
    mcp: { tool: "check_humanness", arguments: (fx) => ({ address: fx.wallet }) },
    assert: (result) => assertHasKeys(result, ["isHumanOverall"]),
  },
  {
    id: "account.getAccountRegistration",
    domain: "account",
    layer: "read",
    sdk: {
      invoke: (client, fx) => client.account.getAccountRegistration(fx.wallet),
    },
    mcp: {
      tool: "get_celo_account_registration",
      arguments: (fx) => ({ address: fx.wallet }),
    },
    assert: (result) => assertHasKeys(result, ["isRegistered"]),
  },
];

export const stakingOperations: OperationSpec[] = [
  {
    id: "staking.getStakingBalances",
    domain: "staking",
    layer: "read",
    sdk: {
      invoke: (client, fx) => client.staking.getStakingBalances(fx.wallet),
    },
    mcp: {
      tool: "get_staking_balances",
      arguments: (fx) => ({ address: fx.wallet }),
    },
    assert: (result) => {
      assertHasKeys(result, ["address", "groups"]);
    },
  },
  {
    id: "staking.getActivatableStakes",
    domain: "staking",
    layer: "read",
    sdk: {
      invoke: (client, fx) => client.staking.getActivatableStakes(fx.wallet),
    },
    mcp: {
      tool: "get_activatable_stakes",
      arguments: (fx) => ({ address: fx.wallet }),
    },
    assert: (result) => {
      assertHasKeys(result, ["activatableGroups"]);
    },
  },
  {
    id: "staking.getValidatorGroups",
    domain: "staking",
    layer: "read",
    sdk: {
      invoke: (client) =>
        client.staking.getValidatorGroups({ page: 1, pageSize: 5 }),
    },
    mcp: {
      tool: "get_validator_groups",
      arguments: () => ({ page: 1, page_size: 5 }),
    },
    assert: (result) => {
      const obj = assertHasKeys(result, ["groups"]);
      assertArray(obj.groups);
    },
  },
  {
    id: "staking.getValidatorGroupDetails",
    domain: "staking",
    layer: "read",
    sdk: {
      invoke: (client, fx) =>
        client.staking.getValidatorGroupDetails(fx.validatorGroup),
    },
    mcp: {
      tool: "get_validator_group_details",
      arguments: (fx) => ({ group_address: fx.validatorGroup }),
    },
    assert: (result) => {
      assertHasKeys(result, ["address", "name"]);
    },
  },
  {
    id: "staking.getTotalStakingInfo",
    domain: "staking",
    layer: "read",
    sdk: {
      invoke: (client) => client.staking.getTotalStakingInfo(),
    },
    mcp: {
      tool: "get_total_staking_info",
      arguments: () => ({}),
    },
    assert: (result) => {
      assertHasKeys(result, ["totalVotes"]);
    },
  },
  {
    id: "staking.getDelegationInfo",
    domain: "staking",
    layer: "read",
    sdk: {
      invoke: (client, fx) => client.staking.getDelegationInfo(fx.wallet),
    },
    mcp: { tool: "get_delegation_info", arguments: (fx) => ({ address: fx.wallet }) },
    assert: (result) => assertHasKeys(result, ["delegatees"]),
  },
  {
    id: "staking.getStakeEligibility",
    domain: "staking",
    layer: "read",
    sdk: {
      invoke: (client, fx) =>
        client.staking.getStakeEligibility(fx.wallet, fx.validatorGroup, "0.01"),
    },
    mcp: {
      tool: "get_stake_eligibility",
      arguments: (fx) => ({
        group_address: fx.validatorGroup,
        amount: "0.01",
        address: fx.wallet,
      }),
    },
    assert: (result) => {
      const obj = assertHasKeys(result, [
        "canStake",
        "reasons",
        "canReceiveVotes",
      ]);
      assert.equal(typeof obj.canStake, "boolean");
      assert.equal(Array.isArray(obj.reasons), true);
    },
  },
  {
    id: "staking.getStakeEligibility.cLabs",
    domain: "staking",
    layer: "read",
    sdk: {
      invoke: (client, fx) =>
        client.staking.getStakeEligibility(
          fx.wallet,
          "0xE09632da4dEAFb3DA2Cd6939F31c98607fCCdBC5",
          "1",
        ),
    },
    mcp: {
      tool: "get_stake_eligibility",
      arguments: (fx) => ({
        group_address: "0xE09632da4dEAFb3DA2Cd6939F31c98607fCCdBC5",
        amount: "1",
        address: fx.wallet,
      }),
    },
    assert: (result) => {
      const obj = assertHasKeys(result, [
        "canStake",
        "reasons",
        "canReceiveVotes",
        "groupName",
      ]);
      assert.equal(typeof obj.canStake, "boolean");
      assert.equal(Array.isArray(obj.reasons), true);
    },
  },
  {
    id: "staking.prepareStake",
    domain: "staking",
    layer: "prepare",
    sdk: {
      invoke: (client, fx) =>
        client.staking.prepareStake(fx.wallet, fx.validatorGroup, "0.01"),
    },
    assert: (result) => assertHasKeys(result, ["steps"]),
  },
  {
    id: "staking.executeActivateStake",
    domain: "staking",
    layer: "write",
    requiresWrites: true,
    requiresEnv: ["CELO_PRIVATE_KEY"],
    skip: () => "Skip until an epoch boundary passes and pending stake is activatable",
    sdk: {
      invoke: (client, fx) =>
        client.staking.prepareActivateStake(fx.wallet, fx.validatorGroup),
    },
    mcp: {
      tool: "execute_activate_stake",
      arguments: (fx) => ({ group_address: fx.validatorGroup }),
    },
    assert: (result) => assertHasKeys(result, ["steps"]),
  },
];

export const nftOperations: OperationSpec[] = [
  {
    id: "nft.getNftInfo",
    domain: "nft",
    layer: "read",
    sdk: {
      invoke: (client, fx) =>
        client.nft.getNftInfo(fx.saidContract, fx.saidTokenId),
    },
    mcp: {
      tool: "get_nft_info",
      arguments: (fx) => ({
        contract_address: fx.saidContract,
        token_id: fx.saidTokenId,
      }),
    },
    assert: (result) => {
      assertHasKeys(result, ["contractAddress", "tokenId"]);
    },
  },
  {
    id: "nft.getNftBalance",
    domain: "nft",
    layer: "read",
    sdk: {
      invoke: (client, fx) =>
        client.nft.getNftBalance(fx.saidContract, fx.saidOwner),
    },
    mcp: {
      tool: "get_nft_balance",
      arguments: (fx) => ({
        contract_address: fx.saidContract,
        address: fx.saidOwner,
      }),
    },
    assert: (result) => {
      assertHasKeys(result, ["balance"]);
    },
  },
];

export const contractOperations: OperationSpec[] = [
  {
    id: "contract.callFunction",
    domain: "contract",
    layer: "read",
    sdk: {
      invoke: (client, fx) =>
        client.contract.callFunction({
          contractAddress: fx.usdm,
          abi: fx.erc20SymbolAbi,
          functionName: "symbol",
          functionArgs: [],
        }),
    },
    mcp: {
      tool: "call_contract_function",
      arguments: (fx) => ({
        contract_address: fx.usdm,
        abi: fx.erc20SymbolAbi,
        function_name: "symbol",
        function_args: [],
      }),
    },
    assert: (result) => {
      assertHasKeys(result, ["result"]);
    },
  },
  {
    id: "contract.estimateGas",
    domain: "contract",
    layer: "read",
    requiresEnv: ["CELO_PRIVATE_KEY"],
    sdk: {
      invoke: (client, fx) =>
        client.contract.estimateGas({
          contractAddress: fx.usdm,
          abi: fx.erc20SymbolAbi,
          functionName: "symbol",
          functionArgs: [],
          fromAddress: fx.signerAddress ?? fx.wallet,
        }),
    },
    mcp: {
      tool: "estimate_contract_gas",
      arguments: (fx) => ({
        contract_address: fx.usdm,
        abi: fx.erc20SymbolAbi,
        function_name: "symbol",
        function_args: [],
        from_address: fx.signerAddress ?? fx.wallet,
      }),
    },
    assert: (result) => {
      assertHasKeys(result, ["gasEstimate"]);
    },
  },
  {
    id: "contract.prepareFunction",
    domain: "contract",
    layer: "prepare",
    requiresEnv: ["CELO_PRIVATE_KEY"],
    sdk: {
      invoke: (client, fx) => {
        const from = fx.signerAddress ?? fx.wallet;
        return client.contract.prepareFunction(from, {
          contractAddress: fx.usdm,
          abi: [
            {
              type: "function",
              name: "approve",
              stateMutability: "nonpayable",
              inputs: [
                { name: "spender", type: "address" },
                { name: "amount", type: "uint256" },
              ],
              outputs: [{ type: "bool" }],
            },
          ],
          functionName: "approve",
          functionArgs: [from, 0n],
        });
      },
    },
    assert: (result) => {
      assertHasKeys(result, ["from", "steps"]);
    },
  },
];
