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
