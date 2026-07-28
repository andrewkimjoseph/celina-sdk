import {
  createPublicClient,
  createTestClient,
  createWalletClient,
  http,
  type PublicClient,
} from "viem";
import { mnemonicToAccount } from "viem/accounts";
import { celo } from "viem/chains";
import { ANVIL_BASE_HOST, TEST_MNEMONIC } from "./constants.js";

export const pool = Number(process.env.VITEST_POOL_ID ?? 1);

export const anvil = {
  ...celo,
  rpcUrls: {
    default: {
      http: [`http://${ANVIL_BASE_HOST}/${pool}`],
      webSocket: [`ws://${ANVIL_BASE_HOST}/${pool}`],
    },
    public: {
      http: [`http://${ANVIL_BASE_HOST}/${pool}`],
      webSocket: [`ws://${ANVIL_BASE_HOST}/${pool}`],
    },
  },
} as unknown as typeof celo;

export const testClient = createTestClient({
  chain: anvil,
  mode: "anvil",
  account: mnemonicToAccount(TEST_MNEMONIC),
  transport: http(),
});

export const publicClient = createPublicClient({
  chain: anvil,
  batch: { multicall: { batchSize: 2048 } },
  transport: http(),
}) as PublicClient;

export const walletClient = createWalletClient({
  chain: anvil,
  account: mnemonicToAccount(TEST_MNEMONIC),
  transport: http(),
});

export function freshAccount(index = 1) {
  return mnemonicToAccount(TEST_MNEMONIC, { addressIndex: index });
}
