import { parseEther } from "viem";
import { celo } from "viem/chains";

export const FORK_BLOCK_NUMBER = 29162229n;

export const ANVIL_CHAIN_ID = celo.id;
export const ANVIL_FORK_URL =
  process.env.CELO_ARCHIVE_RPC_URL ??
  "https://public-archive-nodes.celo-testnet.org";

export const ANVIL_BASE_HOST = "127.0.0.1:8545";

export const TEST_MNEMONIC =
  "concert load couple harbor equip island argue ramp clarify fence smart topic";
export const TEST_BALANCE = parseEther("1000");
export const TEST_GAS_PRICE = 0;
export const TEST_GAS_LIMIT = 20_000_000n;

export const TEST_ADDRESSES = [
  "0x5409ED021D9299bf6814279A6A1411A7e866A631",
  "0x6Ecbe1DB9EF729CBe972C83Fb886247691Fb6beb",
] as const;

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;
