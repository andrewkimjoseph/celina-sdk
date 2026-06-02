import type { PreparedTx } from "../types/prepared.js";
import type { CarbonPrepareResult, CarbonRestSuccess, CarbonUnsignedTx } from "../types/carbon.js";
import { appendCelinaCalldataTag } from "../config/celina-tag.js";
import { serializePreparedFlow, type SerializedPreparedFlow } from "../types/prepared.js";

function asHex(value: string | undefined): `0x${string}` | undefined {
  if (!value) return undefined;
  const v = value.startsWith("0x") ? value : `0x${value}`;
  return v as `0x${string}`;
}

function collectUnsignedTxs(payload: Record<string, unknown>): CarbonUnsignedTx[] {
  const txs: CarbonUnsignedTx[] = [];
  const candidates = [
    payload.transaction,
    payload.unsigned_transaction,
    payload.unsignedTransaction,
  ];
  for (const single of candidates) {
    if (single && typeof single === "object") {
      txs.push(single as CarbonUnsignedTx);
    }
  }
  const many = payload.transactions;
  if (Array.isArray(many)) {
    for (const item of many) {
      if (item && typeof item === "object") txs.push(item as CarbonUnsignedTx);
    }
  }
  return txs;
}

function txToPreparedStep(tx: CarbonUnsignedTx, index: number): PreparedTx | null {
  const to = asHex(tx.to);
  if (!to) return null;
  const data = asHex(tx.data) ?? "0x";
  const value =
    tx.value !== undefined && tx.value !== null
      ? String(tx.value)
      : undefined;
  return {
    kind: value && value !== "0" ? "native" : "contract",
    to,
    data: data === "0x" ? undefined : appendCelinaCalldataTag(data),
    value,
    description: `Carbon transaction step ${index + 1}`,
  };
}

/**
 * Map Carbon REST write response to Celina `SerializedPreparedFlow` when unsigned txs are present.
 */
export function carbonRestToPreparedFlow(
  from: `0x${string}`,
  payload: CarbonRestSuccess,
  summary: string,
): SerializedPreparedFlow | undefined {
  const txs = collectUnsignedTxs(payload);
  const steps = txs
    .map((tx, i) => txToPreparedStep(tx, i))
    .filter((s): s is PreparedTx => s !== null);
  if (steps.length === 0) return undefined;
  return serializePreparedFlow({ from, steps, summary, network: "mainnet" });
}

export function normalizeCarbonPrepareResult(
  from: `0x${string}`,
  payload: CarbonRestSuccess,
  summary: string,
): CarbonPrepareResult {
  const warnings = Array.isArray(payload.warnings)
    ? payload.warnings.map(String)
    : [];
  const preparedFlow = carbonRestToPreparedFlow(from, payload, summary);
  const {
    status: _s,
    warnings: _w,
    transaction: _t,
    transactions: _ts,
    unsigned_transaction: _ut,
    unsignedTransaction: _ut2,
    ...rest
  } = payload;
  return {
    status: "ok",
    warnings,
    ...(preparedFlow ? { preparedFlow } : {}),
    ...(payload.strategy_preview !== undefined
      ? { strategyPreview: payload.strategy_preview }
      : {}),
    ...rest,
  };
}

export function extractWarnings(payload: Record<string, unknown>): string[] {
  if (!Array.isArray(payload.warnings)) return [];
  return payload.warnings.map(String);
}
