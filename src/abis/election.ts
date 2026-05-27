export const electionAbi = [
  {
    type: "function",
    name: "getGroupsVotedForByAccount",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPendingVotesForGroupByAccount",
    inputs: [
      { name: "group", type: "address" },
      { name: "account", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getActiveVotesForGroupByAccount",
    inputs: [
      { name: "group", type: "address" },
      { name: "account", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasActivatablePendingVotes",
    inputs: [
      { name: "account", type: "address" },
      { name: "group", type: "address" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getEligibleValidatorGroups",
    inputs: [],
    outputs: [{ name: "", type: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getActiveVotesForGroup",
    inputs: [{ name: "group", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTotalVotesForEligibleValidatorGroups",
    inputs: [],
    outputs: [
      { name: "groups", type: "address[]" },
      { name: "votes", type: "uint256[]" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTotalVotes",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getElectableValidators",
    inputs: [],
    outputs: [
      { name: "min", type: "uint256" },
      { name: "max", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "canReceiveVotes",
    inputs: [{ name: "group", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
] as const;
