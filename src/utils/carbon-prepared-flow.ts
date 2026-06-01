import type { PreparedTx } from "../types/prepared.js";
import {
  serializePreparedFlow,
  type SerializedPreparedFlow,
} from "../types/prepared.js";

type EthersLikeTx = {
  to?: string | null;
  data?: string | null;
  value?: bigint | string | number | null;
};

/**
 * Map @bancor/carbon-sdk `PopulatedTransaction` to Celina prepared flow (SDK fallback path).
 */
export function populatedTransactionToPreparedFlow(
  from: `0x${string}`,
  tx: EthersLikeTx,
  summary: string,
): SerializedPreparedFlow {
  const to = (tx.to ?? "") as `0x${string}`;
  const data = tx.data ? (tx.data as `0x${string}`) : undefined;
  const value =
    tx.value !== undefined && tx.value !== null
      ? String(tx.value)
      : undefined;

  const step: PreparedTx = {
    kind: value && value !== "0" ? "native" : "contract",
    to,
    data,
    value,
    description: summary,
  };

  return serializePreparedFlow({
    from,
    steps: [step],
    summary,
    network: "mainnet",
  });
}
