import { describe, expect, it } from "vitest";
import { appendCelinaCalldataTag } from "../../src/config/celina-tag.js";
import { GasSponsorshipService } from "../../src/aa/gas-sponsorship.js";
import { preparedStepsToUserOpCalls } from "../../src/aa/prepared-calls.js";
import type { PreparedTx } from "../../src/types/prepared.js";

describe("GasSponsorshipService", () => {
  it("builds Pimlico RPC URL for Celo mainnet", () => {
    const service = new GasSponsorshipService({
      provider: "pimlico",
      pimlico: { apiKey: "test-key" },
    });
    expect(service.provider).toBe("pimlico");
    expect(service.getRpcUrl(42220)).toBe(
      "https://api.pimlico.io/v2/42220/rpc?apikey=test-key",
    );
  });

  it("rejects empty Pimlico apiKey", () => {
    expect(
      () =>
        new GasSponsorshipService({
          provider: "pimlico",
          pimlico: { apiKey: "  " },
        }),
    ).toThrow(/apiKey is required/);
  });
});

describe("preparedStepsToUserOpCalls", () => {
  it("maps prepared steps and preserves tagged calldata when tags omitted", () => {
    const tagged = appendCelinaCalldataTag("0xabcdef", ["celo_862c21dd97a7"]);
    const steps: PreparedTx[] = [
      {
        kind: "erc20",
        to: "0x765de816845861e75a25fca122bb6898b8b1282a",
        data: tagged,
        description: "approve",
      },
      {
        kind: "contract",
        to: "0x16b321ed7634e6eac14424b43fe145a041175703",
        data: "0x1234",
        value: "0",
        description: "swap",
      },
    ];

    const calls = preparedStepsToUserOpCalls(steps);
    expect(calls).toHaveLength(2);
    expect(calls[0]?.data).toBe(tagged);
    expect(calls[0]?.to).toBe("0x765de816845861e75a25fca122bb6898b8b1282a");
    expect(calls[1]?.data).toBe("0x1234");
    expect(calls[1]?.value).toBeUndefined();
  });

  it("tags untagged step data when attributionTags are provided", () => {
    const steps: PreparedTx[] = [
      {
        kind: "contract",
        to: "0x16b321ed7634e6eac14424b43fe145a041175703",
        data: "0xabcdef",
        description: "claim",
      },
    ];
    const calls = preparedStepsToUserOpCalls(steps, ["goclaim"]);
    const expected = appendCelinaCalldataTag("0xabcdef", ["goclaim"]);
    expect(calls[0]?.data).toBe(expected);
  });

  it("leaves data unchanged when already dual-tagged with the same tags", () => {
    const tagged = appendCelinaCalldataTag("0xabcdef", ["goclaim"]);
    const steps: PreparedTx[] = [
      {
        kind: "contract",
        to: "0x16b321ed7634e6eac14424b43fe145a041175703",
        data: tagged,
        description: "claim",
      },
    ];
    const calls = preparedStepsToUserOpCalls(steps, ["goclaim"]);
    expect(calls[0]?.data).toBe(tagged);
  });

  it("includes non-zero value as bigint", () => {
    const calls = preparedStepsToUserOpCalls([
      {
        kind: "native",
        to: "0x1111111111111111111111111111111111111111",
        value: "1000",
        description: "send",
      },
    ]);
    expect(calls[0]?.value).toBe(1000n);
  });

  it("rejects empty steps", () => {
    expect(() => preparedStepsToUserOpCalls([])).toThrow(/no steps/);
  });
});
