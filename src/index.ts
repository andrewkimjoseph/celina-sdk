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
import {
  AgentKarmaService,
  type AgentKarmaServiceConfig,
} from "./services/agentkarma.service.js";
import { AaveService } from "./services/aave.service.js";
import { BlockchainService } from "./services/blockchain.service.js";
import { ContractService } from "./services/contract.service.js";
import { EnsService } from "./services/ens.service.js";
import { GoodDollarService } from "./services/gooddollar.service.js";
import { GovernanceService } from "./services/governance.service.js";
import { HumannessService } from "./services/humanness.service.js";
import { MentoFxService } from "./services/mento-fx.service.js";
import { UniswapService } from "./services/uniswap.service.js";
import { NftService } from "./services/nft.service.js";
import { StakingService } from "./services/staking.service.js";
import { TokenService } from "./services/token.service.js";
import { TransactionService } from "./services/transaction.service.js";
import { SelfService } from "./services/self.service.js";
import { wrapServiceForAnalytics } from "./analytics/wrap-service.js";

/** Optional RPC overrides when creating a Celina client. */
export type CelinaClientOptions = Partial<SdkConfig> & {
  /**
   * Optional AgentKarma reputation adapter config (baseUrl, timeout, fetch, …).
   * Omit to read from https://agentkarma.io with SDK defaults.
   */
  agentKarma?: AgentKarmaServiceConfig;
};

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
  /** Aave V3 `getBalances`, `prepareSupply`, and `prepareWithdraw` on Celo. */
  aave: AaveService;
  /** GoodDollar IdentityV4 whitelist, UBI claims, and G$ ↔ USDm reserve swaps. */
  gooddollar: GoodDollarService;
  /** Celo and Ethereum ENS resolution. */
  ens: EnsService;
  /** Celo governance proposals, LockedGold locking, and voting. */
  governance: GovernanceService;
  /** Validator election staking reads and writes. */
  staking: StakingService;
  /** Dual-rail humanness verification (Self + GoodDollar). */
  humanness: HumannessService;
  /** ERC-721 / ERC-1155 NFT reads. */
  nft: NftService;
  /** Generic contract reads, gas estimates, and write prepares. */
  contract: ContractService;
  /** Self Agent ID on Celo mainnet (ai.self.xyz + on-chain registry). */
  self: SelfService;
  /**
   * Optional AgentKarma reputation insight (read-only, agentkarma.io).
   * Ecosystem adapter: Provider/Consumer karma, ERC-8004 Celo agents, and
   * local trust-policy checks. Never routes, signs, or holds custody.
   */
  agentKarma: AgentKarmaService;
}

/**
 * Create a Celina client for Celo mainnet reads and unsigned tx preparation.
 * No private keys — pass prepared `steps` to wagmi/viem for wallet signing.
 *
 * @remarks
 * **Server-side only.** Celina SDK includes server-native dependencies
 * (`@agentkarma/sdk`, `@celo/attribution-tags`) that cannot be bundled for
 * the browser. Import only from Node.js environments — API routes, background
 * workers, or CLI scripts.
 */
export function createCelinaClient(opts?: CelinaClientOptions): CelinaClient {
  const config = resolveSdkConfig(opts);
  const clientFactory = new CeloClientFactory(config);
  const ensClientFactory = new EnsClientFactory(config);
  const tokenService = new TokenService(clientFactory);
  const wrap = <T extends object>(key: string, service: T) =>
    wrapServiceForAnalytics(key, service, config);
  const selfService = new SelfService(clientFactory, config);

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
    humanness: wrap("humanness", new HumannessService(clientFactory, selfService)),
    nft: wrap("nft", new NftService(clientFactory)),
    contract: wrap("contract", new ContractService(clientFactory)),
    self: wrap("self", selfService),
    // Optional ecosystem adapter. Not analytics-wrapped: AgentKarma is an
    // external reputation service, not a Celo on-chain read Celina tracks.
    agentKarma: new AgentKarmaService(opts?.agentKarma),
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
export type { StakeEligibilityResult, GetGovernanceDelegatesOptions, GovernanceDelegate, GovernanceDelegateMetadata, GovernanceDelegatesResult } from "./services/staking.service.js";
/** On-chain VoteValue enum names for governance voting. */
export type { VoteValueName } from "./abis/governance.js";
export { VOTE_VALUES, voteValueToInt } from "./abis/governance.js";
/** Humanness check result across Self and GoodDollar rails. */
export type {
  HumannessCheckResult,
  HumannessRailResult,
} from "./services/humanness.service.js";
export { assertHumanness } from "./services/humanness.service.js";
export { toFixidity, percentToFixidity, fromFixidity, FIXIDITY_ONE } from "./utils/fixidity.js";
export { findLesserAndGreaterAfterVote } from "./utils/election-vote-neighbors.js";
export { parsePrivateKeyEnv, tryParsePrivateKeyEnv } from "./utils/normalize-private-key.js";
/** Parameters for generic contract reads, estimates, and write prepares. */
export type { ContractCallParams } from "./services/contract.service.js";
/** Aave V3 Celo pool address and supported asset symbols. */
export {
  AAVE_POOL,
  AAVE_SUPPORTED_SYMBOLS,
  resolveAaveAsset,
} from "./config/aave.js";
export { CHAIN, DEFAULT_RPC_URL } from "./config/chains.js";
export {
  appendCelinaCalldataTag,
  attributionDecodeWindow,
  buildErc8021AttributionSuffix,
  checkAttributionInCalldata,
  collectAttributionTags,
  ERC_8021_MARKER,
  normalizeAttributionTags,
  stripErc8021SuffixIfPresent,
  toErc8021AttributionCodes,
  verifyAttributionInCalldata,
} from "./config/celina-tag.js";
export type {
  AttributionCheckResult,
  AttributionVerificationResult,
} from "./config/celina-tag.js";
export type { AaveAsset } from "./config/aave.js";
export {
  GOODDOLLAR_FACE_VERIFICATION_CALLBACK_URL,
  GOODDOLLAR_CUSD_EXCHANGE_ID,
  GOODDOLLAR_IDENTITY_ADDRESS,
  GOODDOLLAR_MENTO_BROKER,
  GOODDOLLAR_MENTO_EXCHANGE_PROVIDER,
  GOODDOLLAR_RESERVE_COLLATERAL,
  GOODDOLLAR_TOKEN_ADDRESS,
  GOODDOLLAR_UBI_SCHEME_ADDRESS,
  isGoodDollarUsdReservePair,
} from "./config/gooddollar.js";
export type { GoodDollarReserveSwapParams, GoodDollarReserveQuoteOptions, GoodDollarReserveAmountSide, GoodDollarIdentityGuidance, GoodDollarIdentityGuidanceInput, GoodDollarIdentityRecommendedAction, FaceVerificationLinkResult } from "./services/gooddollar.service.js";
export {
  deriveGoodDollarIdentityGuidance,
  shouldSkipFaceVerification,
  buildConnectIdentityError,
  GOODDOLLAR_HUMANNESS_REMEDIATION,
} from "./services/gooddollar-identity-guidance.js";
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
export { flushCelinaAnalytics } from "./analytics/amplitude.js";
export { runWithAnalyticsWallet } from "./analytics/wallet-context.js";
/** Optional read-only AgentKarma reputation adapter (agentkarma.io). */
export { AgentKarmaService } from "./services/agentkarma.service.js";
export type {
  /** Config for the AgentKarma adapter (baseUrl, timeout, fetch, headers). */
  AgentKarmaServiceConfig,
  /** Which karma face(s) to read: provider, consumer, or both. */
  AgentKarmaFace,
  /** Options for an AgentKarma karma read. */
  GetKarmaOptions,
  /** Local counterparty trust evaluation result. */
  CounterpartyDecision,
  /** AgentKarma Provider/Consumer karma snapshot. */
  KarmaSnapshot,
  /** Per-face karma data (score, trust tier, confidence badge, tiers). */
  KarmaFaceData,
  /** ERC-8004 Celo agent identity + reputation snapshot. */
  CeloAgentSnapshot,
  /** Local trust policy config (minScore, requireReceiptBacked, …). */
  TrustPolicy,
  /** Explainable allow/deny trust decision. */
  TrustDecision,
} from "./services/agentkarma.service.js";
