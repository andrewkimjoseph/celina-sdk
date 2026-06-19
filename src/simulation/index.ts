/**
 * Browser-safe prepared-step simulation (no Node analytics / wallet product logic).
 */
export type { PreparedTx } from "../types/prepared.js";
export {
  simulatePreparedStep,
  type SimulatePreparedStepOptions,
  type SimulatePreparedStepParams,
} from "./simulate-prepared-step.js";
