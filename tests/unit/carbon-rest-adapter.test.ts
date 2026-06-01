import { describe, expect, it } from "vitest";
import {
  carbonRestToPreparedFlow,
  normalizeCarbonPrepareResult,
} from "../../src/utils/carbon-rest-adapter.js";

const FROM = "0x1111111111111111111111111111111111111111" as const;

describe("carbon-rest-adapter", () => {
  it("maps a single unsigned transaction to SerializedPreparedFlow", () => {
    const flow = carbonRestToPreparedFlow(FROM, {
      status: "ok",
      transaction: {
        to: "0x66198716B8DfA18620E1d0E0eF1d5035aC9A0B16",
        data: "0xdeadbeef",
        value: "0",
      },
    }, "Carbon limit order");

    expect(flow).toBeDefined();
    expect(flow!.from).toBe(FROM);
    expect(flow!.steps).toHaveLength(1);
    expect(flow!.steps[0].to).toBe(
      "0x66198716B8DfA18620E1d0E0eF1d5035aC9A0B16",
    );
    expect(flow!.steps[0].data).toBe("0xdeadbeef");
  });

  it("maps multiple transactions in order", () => {
    const flow = carbonRestToPreparedFlow(FROM, {
      status: "ok",
      transactions: [
        { to: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", data: "0x01" },
        { to: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", data: "0x02", value: "1000" },
      ],
    }, "Carbon approve + create");

    expect(flow!.steps).toHaveLength(2);
    expect(flow!.steps[1].value).toBe("1000");
    expect(flow!.steps[1].kind).toBe("native");
  });

  it("returns undefined when no unsigned txs are present", () => {
    const flow = carbonRestToPreparedFlow(
      FROM,
      { status: "ok", warnings: ["dry run"] },
      "No tx",
    );
    expect(flow).toBeUndefined();
  });

  it("normalizeCarbonPrepareResult preserves warnings and preview", () => {
    const result = normalizeCarbonPrepareResult(
      FROM,
      {
        status: "ok",
        warnings: ["price far from market"],
        strategy_preview: { type: "limit" },
        transaction: {
          to: "0x66198716B8DfA18620E1d0E0eF1d5035aC9A0B16",
          data: "0x",
        },
        extra_field: 42,
      },
      "Prepare",
    );

    expect(result.status).toBe("ok");
    expect(result.warnings).toEqual(["price far from market"]);
    expect(result.strategyPreview).toEqual({ type: "limit" });
    expect(result.preparedFlow).toBeDefined();
    expect(result.extra_field).toBe(42);
  });
});
