import { describe, expect, it } from "vitest";
import { SDK_OPERATIONS } from "./catalog/operations.js";
import { runSdkOperation } from "./runners/run-operation.js";

describe.each(SDK_OPERATIONS)("$id", (spec) => {
  it("live mainnet", async () => {
    const outcome = await runSdkOperation(spec);

    if (outcome.status === "skipped") {
      console.log(`[skip] ${spec.id}: ${outcome.reason}`);
      return;
    }

    if (outcome.status === "failed") {
      throw outcome.error;
    }

    expect(outcome.status).toBe("passed");
  });
});
