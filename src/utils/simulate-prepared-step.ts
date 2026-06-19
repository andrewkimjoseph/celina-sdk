import { erc20Abi, type Hex, type PublicClient } from "viem";
import { feeCurrencySymbol, resolveMiniPayFeeCurrency } from "./celo-fee-currency.js";
import { parseTaggedErc20Approve } from "./erc20-allowance-storage.js";
import type { PreparedTx } from "../types/prepared.js";
import { isInsufficientBalanceSimulationError } from "./transaction-errors.js";

export type SimulatePreparedStepParams = {
  from: `0x${string}`;
  step: PreparedTx;
  isMiniPay?: boolean;
  feeCurrency?: `0x${string}`;
};

function simulationErrorMessage(
  step: PreparedTx,
  feeCurrency: `0x${string}` | undefined,
  cause: unknown,
): string {
  const feeLabel = feeCurrencySymbol(feeCurrency);
  const base =
    cause instanceof Error ? cause.message : String(cause);

  if (isInsufficientBalanceSimulationError(cause)) {
    return (
      `Preflight simulation failed for "${step.description}": insufficient balance. ` +
      `Leave headroom for gas when paying fees in ${feeLabel}. (${base})`
    );
  }

  return `Preflight simulation failed for "${step.description}": ${base}`;
}

async function estimateStepGas(
  publicClient: PublicClient,
  from: `0x${string}`,
  step: PreparedTx,
  feeCurrency: `0x${string}` | undefined,
): Promise<void> {
  const value = step.value ? BigInt(step.value) : 0n;
  const data = (step.data ?? "0x") as Hex;

  const approve = parseTaggedErc20Approve(step);
  if (approve) {
    await publicClient.estimateContractGas({
      account: from,
      address: approve.token,
      abi: erc20Abi,
      functionName: "approve",
      args: [approve.spender, approve.amount],
      ...(feeCurrency ? { feeCurrency } : {}),
    });
    return;
  }

  const request = {
    account: from,
    to: step.to,
    data,
    value,
    ...(feeCurrency ? { feeCurrency } : {}),
  };

  await publicClient.estimateGas(request);
}

/**
 * Simulate a prepared transaction step before broadcast.
 * Throws when eth_estimateGas would revert (e.g. spend token = fee currency, no gas headroom).
 */
export async function simulatePreparedStep(
  publicClient: PublicClient,
  params: SimulatePreparedStepParams,
): Promise<void> {
  const { from, step, isMiniPay = false } = params;
  const feeCurrency =
    params.feeCurrency ??
    (await resolveMiniPayFeeCurrency(publicClient, from, { isMiniPay }));

  try {
    await estimateStepGas(publicClient, from, step, feeCurrency);
  } catch (error) {
    throw new Error(simulationErrorMessage(step, feeCurrency, error));
  }
}

/**
 * Resolve fee currency and simulate — for hosts that need the resolved value on send (MCP).
 */
export async function simulatePreparedStepWithFeeCurrency(
  publicClient: PublicClient,
  params: SimulatePreparedStepParams,
): Promise<`0x${string}` | undefined> {
  const { from, isMiniPay = false } = params;
  const feeCurrency =
    params.feeCurrency ??
    (await resolveMiniPayFeeCurrency(publicClient, from, { isMiniPay }));

  try {
    await estimateStepGas(publicClient, from, params.step, feeCurrency);
  } catch (error) {
    throw new Error(simulationErrorMessage(params.step, feeCurrency, error));
  }

  return feeCurrency;
}
