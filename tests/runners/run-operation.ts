import { createCelinaClient } from "../../src/index.js";
import type { OperationSpec } from "../catalog/types.js";
import { getMainnetFixtures } from "../fixtures/mainnet.js";
import { getOperationSkipReason } from "../helpers/gating.js";
import { loadTestConfig } from "../helpers/env.js";

export interface RunOperationResult {
  status: "passed" | "skipped" | "failed";
  reason?: string;
  error?: unknown;
}

let sharedClient: ReturnType<typeof createCelinaClient> | undefined;

function getClient() {
  if (!sharedClient) {
    const config = loadTestConfig();
    sharedClient = createCelinaClient(config);
  }
  return sharedClient;
}

/** Run one SDK catalog operation with env gating and shared assertions. */
export async function runSdkOperation(
  spec: OperationSpec,
): Promise<RunOperationResult> {
  if (!spec.sdk) {
    return { status: "skipped", reason: "SDK invoke not defined for operation" };
  }

  const skipReason = getOperationSkipReason(spec);
  if (skipReason) {
    return { status: "skipped", reason: skipReason };
  }

  const client = getClient();
  const fixtures = await getMainnetFixtures(client);

  try {
    const result = await spec.sdk.invoke(client, fixtures);
    spec.assert(result, fixtures);
    return { status: "passed" };
  } catch (error) {
    return { status: "failed", error };
  }
}

export function resetSdkTestClient(): void {
  sharedClient = undefined;
}
