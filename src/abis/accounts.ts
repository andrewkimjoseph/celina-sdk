export const accountsAbi = [
  {
    type: "function",
    name: "getName",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
] as const;
