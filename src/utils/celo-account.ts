/**
 * Celo Accounts registry precondition helpers.
 */
import { accountsAbi } from "../abis/accounts.js";
import { CELO_CORE_CONTRACTS } from "../config/celo-core-contracts.js";
import type { CeloClientFactory } from "../clients/celo-client.js";

export async function isCeloAccountRegistered(
  clientFactory: CeloClientFactory,
  address: `0x${string}`,
): Promise<boolean> {
  const client = clientFactory.getClients().public;
  return client.readContract({
    address: CELO_CORE_CONTRACTS.accounts,
    abi: accountsAbi,
    functionName: "isAccount",
    args: [address],
  }) as Promise<boolean>;
}

export async function assertCeloAccountRegistered(
  clientFactory: CeloClientFactory,
  address: `0x${string}`,
): Promise<void> {
  const registered = await isCeloAccountRegistered(clientFactory, address);
  if (!registered) {
    throw new Error(
      `Address ${address} is not a registered Celo account. ` +
        "Call prepare_register_celo_account or execute_register_celo_account first.",
    );
  }
}
