import {
  createPublicClient,
  http,
  type Hex,
  type PrivateKeyAccount,
  type PublicClient,
} from "viem";
import { entryPoint07Address } from "viem/account-abstraction";
import { privateKeyToAccount } from "viem/accounts";
import { createSmartAccountClient } from "permissionless";
import { toSimpleSmartAccount } from "permissionless/accounts";
import { CHAIN, DEFAULT_RPC_URL } from "../config/chains.js";
import type {
  PreparedFlow,
  SerializedPreparedFlow,
} from "../types/prepared.js";
import { GasSponsorshipService } from "./gas-sponsorship.js";
import { preparedStepsToUserOpCalls } from "./prepared-calls.js";
import type {
  CreateAAClientOptions,
  GasSponsorshipProviderId,
  SendPreparedFlowOptions,
  SendPreparedFlowResult,
} from "./types.js";

function resolveOwner(owner: PrivateKeyAccount | Hex): PrivateKeyAccount {
  if (typeof owner === "string") {
    return privateKeyToAccount(owner);
  }
  return owner;
}

function defaultPublicClient(): PublicClient {
  return createPublicClient({
    chain: CHAIN,
    transport: http(DEFAULT_RPC_URL),
  }) as PublicClient;
}

/**
 * Derive the counterfactual Simple Smart Account address for an EOA owner
 * (EntryPoint 0.7) without submitting a UserOp.
 */
export async function deriveSmartAccountAddress(
  owner: PrivateKeyAccount | Hex,
  publicClient?: PublicClient,
): Promise<{
  eoaAddress: `0x${string}`;
  smartAccountAddress: `0x${string}`;
}> {
  const eoaAccount = resolveOwner(owner);
  const client = publicClient ?? defaultPublicClient();
  const smartAccount = await toSimpleSmartAccount({
    client,
    owner: eoaAccount,
    entryPoint: {
      address: entryPoint07Address,
      version: "0.7",
    },
  });
  return {
    eoaAddress: eoaAccount.address,
    smartAccountAddress: smartAccount.address,
  };
}

export type AAClient = {
  /** Gas sponsorship backend id (e.g. `"pimlico"`). */
  provider: GasSponsorshipProviderId;
  /** EOA that owns the smart account. */
  eoaAddress: `0x${string}`;
  /** Counterfactual / deployed Simple Smart Account address. */
  smartAccountAddress: `0x${string}`;
  /** Underlying sponsorship service (URLs, paymaster, fees). */
  gasSponsorship: GasSponsorshipService;
  /**
   * Tags applied in `sendPreparedFlow` via `appendCelinaCalldataTag`.
   * `undefined` means step `data` is passed through unchanged.
   */
  attributionTags: string[] | undefined;
  /**
   * Submit `prepare*` output (ordered `steps` / prepared transactions) as sponsored UserOp(s).
   * When `attributionTags` were set on this client, each step’s `data` is dual-tagged
   * before submit; otherwise `data` is used as-is (including tags from `prepare*`).
   */
  sendPreparedFlow: (
    flow: PreparedFlow | SerializedPreparedFlow,
    options?: SendPreparedFlowOptions,
  ) => Promise<SendPreparedFlowResult>;
};

/**
 * Create an ERC-4337 AA client on Celo mainnet (Simple Smart Account, EntryPoint 0.7).
 *
 * Pass an explicit `gasSponsorship` provider object — credentials are app-owned
 * and never stored by Celina. v1 supports `provider: "pimlico"`.
 *
 * Optional `attributionTags` are applied in `sendPreparedFlow` via
 * `appendCelinaCalldataTag` (same dual format as `prepare*`). Omit them to
 * pass step calldata through unchanged.
 */
export async function createAAClient(
  options: CreateAAClientOptions,
): Promise<AAClient> {
  const eoaAccount = resolveOwner(options.owner);
  const publicClient = options.publicClient ?? defaultPublicClient();
  const attributionTags = options.attributionTags;
  const gasSponsorship = new GasSponsorshipService(
    options.gasSponsorship,
    CHAIN.id,
  );

  const smartAccount = await toSimpleSmartAccount({
    client: publicClient,
    owner: eoaAccount,
    entryPoint: {
      address: entryPoint07Address,
      version: "0.7",
    },
  });

  const paymaster = gasSponsorship.getPaymasterClient();
  const smartAccountClient = createSmartAccountClient({
    account: smartAccount,
    chain: CHAIN,
    bundlerTransport: gasSponsorship.createBundlerTransport(),
    paymaster,
    userOperation: {
      estimateFeesPerGas: async () => gasSponsorship.estimateFeesPerGas(),
    },
  });

  async function sendPreparedFlow(
    flow: PreparedFlow | SerializedPreparedFlow,
    sendOptions?: SendPreparedFlowOptions,
  ): Promise<SendPreparedFlowResult> {
    const mode = sendOptions?.mode ?? "batch";
    const calls = preparedStepsToUserOpCalls(flow.steps, attributionTags);
    const userOpHashes: `0x${string}`[] = [];
    const transactionHashes: `0x${string}`[] = [];

    if (mode === "batch") {
      const userOpHash = await smartAccountClient.sendUserOperation({ calls });
      userOpHashes.push(userOpHash);
      const receipt = await smartAccountClient.waitForUserOperationReceipt({
        hash: userOpHash,
      });
      if (!receipt.success) {
        return { mode, userOpHashes, transactionHashes, success: false };
      }
      transactionHashes.push(receipt.receipt.transactionHash);
      return { mode, userOpHashes, transactionHashes, success: true };
    }

    for (const call of calls) {
      const userOpHash = await smartAccountClient.sendUserOperation({
        calls: [call],
      });
      userOpHashes.push(userOpHash);
      const receipt = await smartAccountClient.waitForUserOperationReceipt({
        hash: userOpHash,
      });
      if (!receipt.success) {
        return { mode, userOpHashes, transactionHashes, success: false };
      }
      transactionHashes.push(receipt.receipt.transactionHash);
    }
    return { mode, userOpHashes, transactionHashes, success: true };
  }

  return {
    provider: gasSponsorship.provider,
    eoaAddress: eoaAccount.address,
    smartAccountAddress: smartAccount.address,
    gasSponsorship,
    attributionTags,
    sendPreparedFlow,
  };
}
