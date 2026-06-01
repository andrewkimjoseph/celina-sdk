import type { SerializedPreparedFlow } from "./prepared.js";

/** Carbon REST success envelope (tool-specific fields merged). */
export type CarbonRestSuccess = {
  status: "ok";
  warnings?: string[];
  [key: string]: unknown;
};

export type CarbonRestError = {
  error: string;
  status?: string;
  message?: string;
};

export type CarbonUnsignedTx = {
  to?: string;
  data?: string;
  value?: string | number;
  chainId?: number;
  gasLimit?: string | number;
  maxFeePerGas?: string | number;
  maxPriorityFeePerGas?: string | number;
  nonce?: number;
};

/** Write-tool response after REST → Celina adapter. */
export interface CarbonPrepareResult {
  status: "ok";
  warnings: string[];
  preparedFlow?: SerializedPreparedFlow;
  strategyPreview?: unknown;
  /** Remaining Carbon API fields (market price, simulation, etc.). */
  [key: string]: unknown;
}
