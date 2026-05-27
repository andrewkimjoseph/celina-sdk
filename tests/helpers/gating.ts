import type { OperationSpec } from "../catalog/types.js";
import {
  allowsDestructiveTests,
  allowsTestWrites,
  hasCeloWallet,
  hasSelfAgentKey,
} from "./env.js";

const ENV_CHECKS: Record<
  NonNullable<OperationSpec["requiresEnv"]>[number],
  () => boolean
> = {
  CELO_PRIVATE_KEY: hasCeloWallet,
  SELF_AGENT_PRIVATE_KEY: hasSelfAgentKey,
};

/** Returns a skip reason when the operation should not run, otherwise undefined. */
export function getOperationSkipReason(spec: OperationSpec): string | undefined {
  if (spec.requiresDestructive && !allowsDestructiveTests()) {
    return "Set CELINA_TEST_DESTRUCTIVE=1 to run destructive Self lifecycle tests";
  }

  if (spec.requiresWrites && !allowsTestWrites()) {
    return "Set CELINA_TEST_WRITES=1 to run on-chain write tests";
  }

  if (spec.requiresEnv) {
    for (const requirement of spec.requiresEnv) {
      if (!ENV_CHECKS[requirement]()) {
        return `Missing ${requirement}`;
      }
    }
  }

  return spec.skip?.() ?? undefined;
}
