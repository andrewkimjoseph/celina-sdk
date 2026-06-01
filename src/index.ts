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
import { CarbonService } from "./services/carbon.service.js";
import { SelfService } from "./services/self.service.js";
import { wrapServiceForAnalytics } from "./analytics/wrap-service.js";

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
  /** Carbon DeFi maker strategies and taker trades on Celo (SDK + REST). */
  carbon: CarbonService;
  /** Self Agent ID on Celo mainnet (ai.self.xyz + on-chain registry). */
  self: SelfService;
}

/**
 * Create a Celina client for Celo mainnet reads and unsigned tx preparation.
 * No private keys — pass prepared `steps` to wagmi/viem for wallet signing.
 */
export function createCelinaClient(opts?: CelinaClientOptions): CelinaClient {
  const config = resolveSdkConfig(opts);
  const clientFactory = new CeloClientFactory(config);
  const ensClientFactory = new EnsClientFactory(config);
  const tokenService = new TokenService(clientFactory);
  const wrap = <T extends object>(key: string, service: T) =>
    wrapServiceForAnalytics(key, service, config);

  return {
    blockchain: wrap("blockchain", new BlockchainService(clientFactory)),
    account: wrap("account", new AccountService(clientFactory)),
    token: wrap("token", tokenService),
    transaction: wrap("transaction", new TransactionService(clientFactory)),
    mentoFx: wrap("mentoFx", new MentoFxService(clientFactory)),
    uniswap: wrap("uniswap", new UniswapService(clientFactory)),
    aave: wrap("aave", new AaveService(clientFactory)),
    gooddollar: wrap("gooddollar", new GoodDollarService(clientFactory)),
    ens: wrap("ens", new EnsService(ensClientFactory)),
    governance: wrap("governance", new GovernanceService(clientFactory)),
    staking: wrap("staking", new StakingService(clientFactory)),
    nft: wrap("nft", new NftService(clientFactory)),
    contract: wrap("contract", new ContractService(clientFactory)),
    carbon: wrap("carbon", new CarbonService(config, tokenService)),
    self: wrap("self", new SelfService(clientFactory, config)),
  };
}

export type {
  /** In-memory prepared flow before JSON serialization. */
  PreparedFlow,
  /** One step in a multi-step wallet signing flow. */
  PreparedTx,
  /** Discriminator for prepared transaction step kinds. */
  PreparedTxKind,
  /** JSON-safe prepared flow returned by prepare* methods. */
  SerializedPreparedFlow,
} from "./types/prepared.js";
export { serializePreparedFlow } from "./types/prepared.js";
/** RPC URLs for Celo and optional Ethereum ENS reads. */
export type { SdkConfig } from "./config/sdk-config.js";
/** Resolved Celo mainnet registry token metadata. */
export type { ResolvedToken } from "./services/token.service.js";
/** Slippage, deadline, and recipient options for Mento FX swaps. */
export type { MentoFxParams } from "./services/mento-fx.service.js";
/** Slippage, deadline, and recipient options for Uniswap v4 swaps. */
export type { UniswapSwapParams } from "./services/uniswap.service.js";
/** Pagination and metadata options for governance proposal lists. */
export type { GovernanceProposalsOptions } from "./services/governance.service.js";
/** Parameters for generic read-only contract calls. */
export type { ContractCallParams } from "./services/contract.service.js";
/** Aave V3 Celo pool address and supported asset symbols. */
export {
  AAVE_POOL,
  AAVE_SUPPORTED_SYMBOLS,
  resolveAaveAsset,
} from "./config/aave.js";
export type { AaveAsset } from "./config/aave.js";
export type {
  CarbonPrepareResult,
  CarbonRestSuccess,
} from "./types/carbon.js";
export type { CarbonWriteBody } from "./services/carbon.service.js";
export {
  CARBON_CHAIN,
  CELO_CARBON_CONTRACTS,
  DEFAULT_CARBON_REST_BASE_URL,
} from "./config/carbon.js";
export { CarbonRestError } from "./clients/carbon-rest.js";
export {
  SelfService,
  type VerifySelfAgentParams,
  type VerifySelfRequestParams,
  type RegisterSelfAgentParams,
} from "./services/self.service.js";
export {
  SelfApiError,
  SelfExpiredSessionError,
} from "./clients/self-api.js";
export type { SelfRegistrationMode } from "./config/self.js";
export {
  selfDemoUrl,
  SELF_DEMO_NETWORK,
  SELF_HEADERS,
} from "./config/self.js";
export {
  resolveSelfSessionLinks,
  formatSelfSessionLinksDisplay,
  type SelfSessionLinks,
} from "./utils/self-format.js";
export { clearSelfSessionsForTests } from "./services/self-session-store.js";
