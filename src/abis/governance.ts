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
] as const;

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
