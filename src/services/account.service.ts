/**
 * Account reads: native CELO balance, transaction nonce, contract detection,
 * and Celo Accounts registry status.
 */
import { encodeFunctionData } from "viem";
import { accountsAbi } from "../abis/accounts.js";
import { CELO_CORE_CONTRACTS } from "../config/celo-core-contracts.js";
import { appendCelinaCalldataTag } from "../config/celina-tag.js";
import type { CeloClientFactory } from "../clients/celo-client.js";
import { CHAIN } from "../config/chains.js";
import {
  type PreparedFlow,
  type PreparedTx,
  serializePreparedFlow,
  type SerializedPreparedFlow,
} from "../types/prepared.js";

/** CELO mainnet account snapshot for a wallet or contract address. */
export class AccountService {
  private readonly attributionTags?: string[];

  constructor(private readonly clientFactory: CeloClientFactory) {
    this.attributionTags = clientFactory.getConfig().attributionTags;
  }

  /**
   * Fetch CELO balance, nonce, and whether the address has contract bytecode.
   * @param address - Wallet or contract address on Celo mainnet
   * @returns Balance in wei and CELO, current nonce, and `isContract` flag
   */
  async getAccount(address: `0x${string}`) {
    const { public: client } = this.clientFactory.getClients();
    const [balance, nonce, bytecode] = await Promise.all([
      client.getBalance({ address }),
      client.getTransactionCount({ address }),
      client.getCode({ address }),
    ]);

    return {
      address,
      network: "mainnet",
      balanceWei: balance.toString(),
      balanceCelo: Number(balance) / 1e18,
      nonce,
      isContract: bytecode !== undefined && bytecode !== "0x",
    };
  }

  /**
   * Whether an address is registered in the Celo Accounts contract.
   * Required before LockedGold lock/unlock operations.
   */
  async getAccountRegistration(address: `0x${string}`) {
    const { public: client } = this.clientFactory.getClients();
    const isRegistered = await client.readContract({
      address: CELO_CORE_CONTRACTS.accounts,
      abi: accountsAbi,
      functionName: "isAccount",
      args: [address],
    });

    return {
      network: "mainnet" as const,
      address,
      isRegistered,
      accountsContract: CELO_CORE_CONTRACTS.accounts,
      message: isRegistered
        ? "Address is a registered Celo account."
        : "Address is not registered. Call createAccount before locking CELO or staking.",
    };
  }

  /**
   * Build unsigned Accounts.createAccount() step.
   */
  async prepareRegisterAccount(from: `0x${string}`): Promise<SerializedPreparedFlow> {
    const registration = await this.getAccountRegistration(from);
    if (registration.isRegistered) {
      throw new Error(`Address ${from} is already a registered Celo account.`);
    }

    const data = appendCelinaCalldataTag(
      encodeFunctionData({
        abi: accountsAbi,
        functionName: "createAccount",
      }),
      this.attributionTags,
    );

    const steps: PreparedTx[] = [
      {
        kind: "contract",
        to: CELO_CORE_CONTRACTS.accounts,
        data,
        description: "Register Celo account (Accounts.createAccount)",
      },
    ];

    const flow: PreparedFlow = {
      steps,
      summary: `Register ${from} as a Celo account`,
      chainId: CHAIN.id,
      from,
    };

    return serializePreparedFlow(flow);
  }
}
