/** Carbon DeFi on Celo mainnet — contract addresses and API defaults. */

export const CARBON_CHAIN = "celo" as const;

export const DEFAULT_CARBON_REST_BASE_URL = "https://mcp.carbondefi.xyz";

/** Matches @bancor/carbon-sdk `ContractsConfig` for Celo (carbon-contracts deployments). */
export const CELO_CARBON_CONTRACTS = {
  carbonControllerAddress: "0x6619871118D144c1c28eC3b23036FC1f0829ed3a",
  voucherAddress: "0x5E994Ac7d65d81f51a76e0bB5a236C6fDA8dBF9A",
  /** Multicall3 on Celo mainnet. */
  multiCallAddress: "0xcA11bde05977b3631167028862bE2a173976CA11",
  carbonBatcherAddress: "0xa977879684EecE2015AE879DC120c8a1C00718f7",
} as const;

export const CELO_CHAIN_ID = 42220;
