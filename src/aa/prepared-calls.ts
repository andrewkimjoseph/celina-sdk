import type { PreparedTx } from "../types/prepared.js";
import type { UserOpCall } from "./types.js";

/** Map Celina prepared steps to smart-account `calls` (preserves tagged `data`). */
export function preparedStepsToUserOpCalls(steps: PreparedTx[]): UserOpCall[] {
  if (!steps.length) {
    throw new Error("prepared flow has no steps");
  }
  return steps.map((step) => {
    const value =
      step.value !== undefined && step.value !== ""
        ? BigInt(step.value)
        : undefined;
    return {
      to: step.to,
      ...(step.data !== undefined ? { data: step.data } : {}),
      ...(value !== undefined && value > 0n ? { value } : {}),
    };
  });
}
