export const accountsAbi = [
  {
    type: "function",
    name: "getName",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isAccount",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "createAccount",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;
