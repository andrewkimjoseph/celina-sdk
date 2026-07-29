export const governanceAbi = [
  {
    type: "function",
    name: "getQueue",
    inputs: [],
    outputs: [
      { name: "", type: "uint256[]" },
      { name: "", type: "uint256[]" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getDequeue",
    inputs: [],
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getProposal",
    inputs: [{ name: "proposalId", type: "uint256" }],
    outputs: [
      { name: "proposer", type: "address" },
      { name: "deposit", type: "uint256" },
      { name: "timestamp", type: "uint256" },
      { name: "transactionCount", type: "uint256" },
      { name: "descriptionURL", type: "string" },
      { name: "networkWeight", type: "uint256" },
      { name: "approved", type: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getProposalStage",
    inputs: [{ name: "proposalId", type: "uint256" }],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getVoteTotals",
    inputs: [{ name: "proposalId", type: "uint256" }],
    outputs: [
      { name: "yes", type: "uint256" },
      { name: "no", type: "uint256" },
      { name: "abstain", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAmountOfGoldUsedForVoting",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getVoteRecord",
    inputs: [
      { name: "account", type: "address" },
      { name: "index", type: "uint256" },
    ],
    outputs: [
      { name: "proposalId", type: "uint256" },
      { name: "deprecatedValue", type: "uint256" },
      { name: "deprecatedWeight", type: "uint256" },
      { name: "yesVotes", type: "uint256" },
      { name: "noVotes", type: "uint256" },
      { name: "abstainVotes", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUpvoteRecord",
    inputs: [{ name: "account", type: "address" }],
    outputs: [
      { name: "proposalId", type: "uint256" },
      { name: "weight", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isDequeuedProposal",
    inputs: [
      { name: "proposalId", type: "uint256" },
      { name: "index", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "vote",
    inputs: [
      { name: "proposalId", type: "uint256" },
      { name: "index", type: "uint256" },
      { name: "value", type: "uint8" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

/** On-chain VoteValue enum order: None=0, Abstain=1, No=2, Yes=3. */
export const VOTE_VALUES = ["None", "Abstain", "No", "Yes"] as const;
export type VoteValueName = (typeof VOTE_VALUES)[number];

export function voteValueToInt(vote: VoteValueName): number {
  const index = VOTE_VALUES.indexOf(vote);
  if (index === -1) {
    throw new Error(`Invalid vote value: ${vote}. Expected None, Abstain, No, or Yes.`);
  }
  return index;
}

/** On-chain proposal stage enum (Celo Governance). */
export const PROPOSAL_STAGES = [
  "None",
  "Queued",
  "Approval",
  "Referendum",
  "Execution",
  "Executed",
  "Expiration",
  "Rejected",
  "Withdrawn",
] as const;

export type ProposalStageName = (typeof PROPOSAL_STAGES)[number];

export function proposalStageName(stage: number): ProposalStageName {
  return PROPOSAL_STAGES[stage] ?? "None";
}
