import {
  type Hex,
  type PublicClient,
  type StateOverride,
} from "viem";
import type { PreparedTx } from "../types/prepared.js";
import { isInsufficientBalanceSimulationError } from "../utils/transaction-errors.js";

/** Optional host overrides for Celo fee abstraction or custom state. */
export type SimulatePreparedStepOptions = {
  /** Celo fee-abstraction currency — host-provided, never auto-resolved by the SDK. */
  feeCurrency?: `0x${string}`;
  stateOverride?: StateOverride;
};

export type SimulatePreparedStepParams = {
  account: `0x${string}`;
  step: PreparedTx;
};

/** Backoff between simulation retries after a failed `eth_call` / `estimateGas`. */
export type SimulatePreparedStepRetryOptions = {
  /** Delays in ms after each failed attempt. Default: 750, 1500, 3000. */
  delaysMs?: readonly number[];
};

const DEFAULT_RETRY_DELAYS_MS = [750, 1500, 3000] as const;

/**
 * Thrown when a multi-step prepared flow fails after one or more steps already
 * broadcast. Carries confirmed hashes so hosts can report partial progress.
 */
export class PreparedFlowExecutionError extends Error {
  readonly stepHashes: `0x${string}`[];
  readonly stepCount?: number;

  constructor(
    message: string,
    stepHashes: `0x${string}`[] = [],
    stepCount?: number,
  ) {
    super(message);
    this.name = "PreparedFlowExecutionError";
    this.stepHashes = stepHashes;
    this.stepCount = stepCount;
  }
}

export function isPreparedFlowExecutionError(
  error: unknown,
): error is PreparedFlowExecutionError {
  return (
    error instanceof PreparedFlowExecutionError ||
    (error instanceof Error &&
      error.name === "PreparedFlowExecutionError" &&
      Array.isArray((error as PreparedFlowExecutionError).stepHashes))
  );
}

function stepRequest(
  account: `0x${string}`,
  step: PreparedTx,
): {
  account: `0x${string}`;
  to: `0x${string}`;
  data: Hex;
  value: bigint;
} {
  return {
    account,
    to: step.to,
    data: (step.data ?? "0x") as Hex,
    value: step.value ? BigInt(step.value) : 0n,
  };
}

function simulationErrorMessage(step: PreparedTx, cause: unknown): string {
  const base = cause instanceof Error ? cause.message : String(cause);

  if (isInsufficientBalanceSimulationError(cause)) {
    return (
      `Simulation failed for "${step.description}": insufficient balance. (${base})`
    );
  }

  return `Simulation failed for "${step.description}": ${base}`;
}

/**
 * Simulate a prepared transaction step against current chain state.
 * Throws when the transaction would revert — call immediately before send.
 */
export async function simulatePreparedStep(
  publicClient: PublicClient,
  params: SimulatePreparedStepParams,
  options?: SimulatePreparedStepOptions,
): Promise<void> {
  const request = stepRequest(params.account, params.step);
  const stateOverride = options?.stateOverride;

  try {
    if (options?.feeCurrency) {
      await publicClient.estimateGas({
        ...request,
        feeCurrency: options.feeCurrency,
        ...(stateOverride ? { stateOverride } : {}),
      } as Parameters<PublicClient["estimateGas"]>[0]);
      return;
    }

    await publicClient.call({
      ...request,
      ...(stateOverride ? { stateOverride } : {}),
    });
  } catch (error) {
    throw new Error(simulationErrorMessage(params.step, error));
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Simulate a prepared step, retrying on failure to absorb RPC replica lag
 * after a prior approval is mined. Genuine reverts still fail after retries.
 */
export async function simulatePreparedStepWithRetry(
  publicClient: PublicClient,
  params: SimulatePreparedStepParams,
  options?: SimulatePreparedStepOptions,
  retry?: SimulatePreparedStepRetryOptions,
): Promise<void> {
  const delaysMs = retry?.delaysMs ?? DEFAULT_RETRY_DELAYS_MS;
  let lastError: unknown;

  for (let attempt = 0; attempt <= delaysMs.length; attempt++) {
    if (attempt > 0) {
      await sleep(delaysMs[attempt - 1]!);
    }

    try {
      await simulatePreparedStep(publicClient, params, options);
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}
