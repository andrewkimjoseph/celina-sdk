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
];
