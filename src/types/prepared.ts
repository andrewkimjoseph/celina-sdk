import { CHAIN } from "../config/chains.js";

export type PreparedTxKind = "native" | "erc20" | "contract";

/**
 * One unsigned transaction in a prepared list (`steps`).
 * Calldata may already include Celina ERC-8021 attribution from `prepare*`.
 */
export interface PreparedTx {
  /** Step category for UI and wallet routing. */
  kind: PreparedTxKind;
  to: `0x${string}`;
  data?: `0x${string}`;
  /** Wei amount as decimal string for JSON serialization */
  value?: string;
  description: string;
}

/**
 * Prepared flow = ordered unsigned transactions ready to sign (wagmi/EOA) or
 * submit as UserOps (`createAAClient.sendPreparedFlow`) — not a runtime workflow engine.
 * The primary payload is `steps`.
 */
export interface PreparedFlow {
  steps: PreparedTx[];
  summary: string;
  /** Celo chain id (`celo.id` / {@link CHAIN}.id); always `42220` for Celina today. */
  chainId: typeof CHAIN.id;
  from: `0x${string}`;
}

/**
 * Prepared flow = ordered unsigned transactions ready to sign or submit as UserOps —
 * not a runtime workflow engine. JSON-safe form returned by `prepare*` tools and chat APIs.
 * Primary payload is `steps`. Consumers simulate each step (see `@andrewkimjoseph/celina-sdk/simulation`),
 * then call `sendTransactionAsync` (wagmi), `walletClient.sendTransaction` (viem), or
 * `createAAClient().sendPreparedFlow` for sponsored UserOps.
 */
export interface SerializedPreparedFlow extends Omit<PreparedFlow, "steps"> {
  steps: PreparedTx[];
  preparedFlow: true;
}

/**
 * Marks an ordered prepared-transaction list as JSON-safe for API and chat tool responses.
 * @param flow - In-memory prepared transactions (`PreparedFlow`) to serialize
 */
export function serializePreparedFlow(flow: PreparedFlow): SerializedPreparedFlow {
  return {
    ...flow,
    preparedFlow: true,
    steps: flow.steps.map((step) => ({
      ...step,
      value: step.value?.toString(),
    })),
  };
}
