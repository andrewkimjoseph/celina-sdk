/** Minimal Aave V3 AaveProtocolDataProvider ABI — reserve supply/borrow cap reads. */
export const aaveDataProviderAbi = [
  {
    type: "function",
    name: "getReserveCaps",
    inputs: [{ name: "asset", type: "address" }],
    outputs: [
      { name: "borrowCap", type: "uint256" },
      { name: "supplyCap", type: "uint256" },
    ],
    stateMutability: "view",
  },
] as const;
