/**
 * Account reads: native CELO balance, transaction nonce, and contract detection.
 */
import type { CeloClientFactory } from "../clients/celo-client.js";

/** CELO mainnet account snapshot for a wallet or contract address. */
export class AccountService {
  constructor(private readonly clientFactory: CeloClientFactory) {}

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
}
