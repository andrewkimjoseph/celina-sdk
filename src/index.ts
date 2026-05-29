/**
 * Celina SDK public entry point.
 *
 * createCelinaClient() composes read-only viem clients and domain services.
 * No private keys or signing — use prepare* methods for unsigned tx payloads.
 */
import { CeloClientFactory } from "./clients/celo-client.js";
import { EnsClientFactory } from "./clients/ens-client.js";
import { resolveSdkConfig, type SdkConfig } from "./config/sdk-config.js";
import { AccountService } from "./services/account.service.js";
import { AaveService } from "./services/aave.service.js";
import { BlockchainService } from "./services/blockchain.service.js";
import { ContractService } from "./services/contract.service.js";
import { EnsService } from "./services/ens.service.js";
import { GoodDollarService } from "./services/gooddollar.service.js";
import { GovernanceService } from "./services/governance.service.js";
import { MentoFxService } from "./services/mento-fx.service.js";
import { UniswapService } from "./services/uniswap.service.js";
import { NftService } from "./services/nft.service.js";
import { StakingService } from "./services/staking.service.js";
import { TokenService } from "./services/token.service.js";
import { TransactionService } from "./services/transaction.service.js";

/** Optional RPC overrides when creating a Celina client. */
export type CelinaClientOptions = Partial<SdkConfig>;

/** Domain services for Celo mainnet reads and unsigned transaction preparation. */
export interface CelinaClient {
  /** Blocks, transactions, and network status. */
  blockchain: BlockchainService;
  /** CELO balance and nonce for an address. */
  account: AccountService;
  /** Token balances, metadata, and stablecoin scans. */
  token: TokenService;
  /** Send estimates, gas fees, and `prepareSend` flows. */
  transaction: TransactionService;
  /** Mento FX quotes, estimates, and `prepareFx` flows. */
  mentoFx: MentoFxService;
  /** Uniswap v4 quotes, estimates, and `prepareSwap` flows. */
  uniswap: UniswapService;
  /** Aave V3 `prepareSupply` and `prepareWithdraw` flows on Celo. */
  aave: AaveService;
  /** GoodDollar IdentityV4 whitelist status. */
  gooddollar: GoodDollarService;
  /** Celo and Ethereum ENS resolution. */
  ens: EnsService;
  /** Celo governance proposals and details. */
  governance: GovernanceService;
  /** Validator election staking reads. */
  staking: StakingService;
  /** ERC-721 / ERC-1155 NFT reads. */
  nft: NftService;
  /** Generic read-only contract calls and gas estimates. */
  contract: ContractService;
}

/**
 * Create a Celina client for Celo mainnet reads and unsigned tx preparation.
 * No private keys — pass prepared `steps` to wagmi/viem for wallet signing.
 */
export function createCelinaClient(opts?: CelinaClientOptions): CelinaClient {
  const config = resolveSdkConfig(opts);
  const clientFactory = new CeloClientFactory(config);
  const ensClientFactory = new EnsClientFactory(config);

  return {
    blockchain: new BlockchainService(clientFactory),
    account: new AccountService(clientFactory),
    token: new TokenService(clientFactory),
    transaction: new TransactionService(clientFactory),
    mentoFx: new MentoFxService(clientFactory),
    uniswap: new UniswapService(clientFactory),
    aave: new AaveService(clientFactory),
    gooddollar: new GoodDollarService(clientFactory),
    ens: new EnsService(ensClientFactory),
    governance: new GovernanceService(clientFactory),
    staking: new StakingService(clientFactory),
    nft: new NftService(clientFactory),
    contract: new ContractService(clientFactory),
  };
}

export type {
  PreparedFlow,
  PreparedTx,
  PreparedTxKind,
  SerializedPreparedFlow,
} from "./types/prepared.js";
export { serializePreparedFlow } from "./types/prepared.js";
export type { SdkConfig } from "./config/sdk-config.js";
export type { ResolvedToken } from "./services/token.service.js";
export type { MentoFxParams } from "./services/mento-fx.service.js";
export type { UniswapSwapParams } from "./services/uniswap.service.js";
export type { GovernanceProposalsOptions } from "./services/governance.service.js";
export type { ContractCallParams } from "./services/contract.service.js";
