/** Minimal Validators ABI for group and member reads (full ABI in validators.json). */
export const validatorsMinimalAbi = [
  {
    type: "function",
    name: "getRegisteredValidators",
    inputs: [],
    outputs: [{ name: "", type: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getValidator",
    inputs: [{ name: "validator", type: "address" }],
    outputs: [
      { name: "ecdsaPublicKey", type: "bytes" },
      { name: "blsPublicKey", type: "bytes" },
      { name: "affiliation", type: "address" },
      { name: "score", type: "uint256" },
      { name: "signer", type: "address" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getValidatorGroup",
    inputs: [{ name: "group", type: "address" }],
    outputs: [
      { name: "members", type: "address[]" },
      { name: "commission", type: "uint256" },
      { name: "lastSlashed", type: "uint256" },
      { name: "name", type: "string" },
      { name: "membersHistory", type: "uint256[]" },
      { name: "membersHistoryLength", type: "uint256" },
      { name: "slashingMultiplier", type: "uint256" },
    ],
    stateMutability: "view",
  },
] as const;
