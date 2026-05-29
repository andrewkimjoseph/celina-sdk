export type PreparedTxKind = "native" | "erc20" | "contract";

/** Single unsigned transaction step in a prepared flow. */
export interface PreparedTx {
  /** Step category for UI and wallet routing. */
  kind: PreparedTxKind;
  to: `0x${string}`;
  data?: `0x${string}`;
  /** Wei amount as decimal string for JSON serialization */
  value?: string;
  description: string;
}

/** In-memory prepared flow before JSON serialization. */
export interface PreparedFlow {
  steps: PreparedTx[];
  summary: string;
  network: "mainnet";
  from: `0x${string}`;
}

/**
 * JSON-safe prepared flow returned by prepare* tools and chat APIs.
 * Consumers (celina-agent TxConfirmCard, wagmi) iterate steps and call sendTransaction.
 */
export interface SerializedPreparedFlow extends Omit<PreparedFlow, "steps"> {
  steps: PreparedTx[];
  preparedFlow: true;
}

/** Marks a prepared flow as JSON-safe for API and chat tool responses. */
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
