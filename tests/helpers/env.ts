import { privateKeyToAccount } from "viem/accounts";

export interface TestConfig {
  rpcUrl: string;
  ethRpcUrl?: string;
  analyticsEnabled?: boolean;
}

export function hasCeloWallet(): boolean {
  return Boolean(process.env.CELO_PRIVATE_KEY);
}

export function hasSelfAgentKey(): boolean {
  return Boolean(process.env.SELF_AGENT_PRIVATE_KEY);
}

export function allowsTestWrites(): boolean {
  return process.env.CELINA_TEST_WRITES === "1";
}

export function allowsDestructiveTests(): boolean {
  return process.env.CELINA_TEST_DESTRUCTIVE === "1";
}

export function getSignerAddress(): `0x${string}` | undefined {
  const key = process.env.CELO_PRIVATE_KEY;
  if (!key) {
    return undefined;
  }
  return privateKeyToAccount(key as `0x${string}`).address;
}

/** RPC URLs aligned with celina-mcp `loadConfig()`. */
export function loadTestConfig(): TestConfig {
  return {
    rpcUrl: process.env.CELO_RPC_URL_MAINNET ?? "https://forno.celo.org",
    ethRpcUrl: process.env.ETH_RPC_URL_MAINNET,
    analyticsEnabled: false,
  };
}
