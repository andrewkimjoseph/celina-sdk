import type { CarbonService } from "../services/carbon.service.js";
import type { CarbonPrepareResult } from "../types/carbon.js";
import type { SerializedPreparedFlow } from "../types/prepared.js";

export type FinalizedCarbonPrepareFlow = SerializedPreparedFlow & {
  deep_link?: string;
  warnings?: string[];
  strategyPreview?: unknown;
};

/** Merge Carbon REST prepare + ERC-20 approve steps for external wallet signing. */
export async function finalizeCarbonPrepare(
  carbon: Pick<CarbonService, "buildExecutionSteps">,
  from: `0x${string}`,
  prepared: CarbonPrepareResult,
  orderMeta: Record<string, unknown>,
): Promise<FinalizedCarbonPrepareFlow> {
  const steps = await carbon.buildExecutionSteps(from, prepared, orderMeta);
  if (!prepared.preparedFlow) {
    throw new Error("Carbon prepare returned no transaction steps.");
  }

  return {
    ...prepared.preparedFlow,
    steps,
    ...(prepared.deep_link ? { deep_link: String(prepared.deep_link) } : {}),
    ...(prepared.warnings?.length ? { warnings: prepared.warnings } : {}),
    ...(prepared.strategyPreview !== undefined
      ? { strategyPreview: prepared.strategyPreview }
      : {}),
  };
}
