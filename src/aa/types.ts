import type { Hex, PrivateKeyAccount, PublicClient } from "viem";

/** Supported gas sponsorship backends. Extends with new union members over time. */
export type GasSponsorshipProviderId = "pimlico";

/** Pimlico-specific credentials (app-owned; never stored by Celina). */
export type PimlicoGasSponsorshipConfig = {
  /** App-owned Pimlico API key. */
  apiKey: string;
};

/**
 * Explicit gas sponsorship config for {@link createAAClient}.
 * Discriminant `provider` selects which nested object is required.
 */
export type GasSponsorshipConfig = {
  provider: "pimlico";
  pimlico: PimlicoGasSponsorshipConfig;
};

/**
 * Options for {@link createAAClient}.
 * Does not accept `attributionTags` — set those on `createCelinaClient({ attributionTags })`
 * before calling `prepare*`.
 */
export type CreateAAClientOptions = {
  /** EOA owner of the Simple Smart Account (account or private key hex). */
  owner: PrivateKeyAccount | Hex;
  /** Explicit sponsorship provider + credentials. */
  gasSponsorship: GasSponsorshipConfig;
  /** Optional Celo public client; defaults to Forno mainnet. */
  publicClient?: PublicClient;
};

/** How to map prepared transactions (`prepare*` output / ordered `steps`) into UserOperations. */
export type SendPreparedFlowMode = "batch" | "sequential";

export type SendPreparedFlowOptions = {
  /**
   * How to submit the prepared transactions (`steps`).
   * `batch` (default): all steps in one UserOp.
   * `sequential`: one UserOp per step.
   */
  mode?: SendPreparedFlowMode;
};

export type UserOpCall = {
  to: `0x${string}`;
  data?: `0x${string}`;
  value?: bigint;
};

/** Result of submitting prepared transactions as sponsored UserOp(s). */
export type SendPreparedFlowResult = {
  mode: SendPreparedFlowMode;
  /** UserOperation hash(es) submitted to the bundler. */
  userOpHashes: `0x${string}`[];
  /** Transaction hash(es) from UserOp receipt(s). */
  transactionHashes: `0x${string}`[];
  success: boolean;
};
