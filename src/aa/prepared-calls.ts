import { appendCelinaCalldataTag } from "../config/celina-tag.js";
import type { PreparedTx } from "../types/prepared.js";
import type { UserOpCall } from "./types.js";

/**
 * Map Celina prepared steps to smart-account `calls`.
 * When `attributionTags` is provided, each step's `data` is ERC-8021-tagged
 * via {@link appendCelinaCalldataTag}; otherwise `data` is preserved as-is.
 */
export function preparedStepsToUserOpCalls(
  steps: PreparedTx[],
  attributionTags?: string[],
): UserOpCall[] {
  if (!steps.length) {
    throw new Error("prepared flow has no steps");
  }
  const shouldTag = attributionTags !== undefined;
  return steps.map((step) => {
    const value =
      step.value !== undefined && step.value !== ""
        ? BigInt(step.value)
        : undefined;
    let data = step.data;
    if (shouldTag && data !== undefined) {
      data = appendCelinaCalldataTag(data, attributionTags);
    }
    return {
      to: step.to,
      ...(data !== undefined ? { data } : {}),
      ...(value !== undefined && value > 0n ? { value } : {}),
    };
  });
}
