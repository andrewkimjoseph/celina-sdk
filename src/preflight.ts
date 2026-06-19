/**
 * Browser-safe exports (no Node analytics / fs). Use in Celeste and other client bundles.
 */
export type {
  PreparedTx,
  SerializedPreparedFlow,
} from "./types/prepared.js";
export { isMiniPayBrowser } from "./utils/minipay.js";
export {
  simulatePreparedStep,
  simulatePreparedStepWithFeeCurrency,
  type SimulatePreparedStepParams,
} from "./utils/simulate-prepared-step.js";
export {
  feeCurrencySymbol,
  resolveMiniPayFeeCurrency,
  type ResolveMiniPayFeeCurrencyOptions,
} from "./utils/celo-fee-currency.js";
