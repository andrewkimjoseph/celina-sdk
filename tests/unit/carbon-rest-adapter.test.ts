import { describe, expect, it } from "vitest";
import { carbonActivityDeepLink } from "../../src/config/carbon.js";
import {
  appendCelinaCalldataTag,
  CELINA_DATA_SUFFIX,
} from "../../src/config/celina-tag.js";
import {
  carbonRestToPreparedFlow,
  normalizeCarbonPrepareResult,
} from "../../src/utils/carbon-rest-adapter.js";
import { populatedTransactionToPreparedFlow } from "../../src/utils/carbon-prepared-flow.js";

const FROM = "0x1111111111111111111111111111111111111111" as const;

function expectCelinaTagged(data: string | undefined) {
  expect(data).toBeDefined();
  expect(data!.endsWith(CELINA_DATA_SUFFIX.slice(2))).toBe(true);
}

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
    expect(flow!.steps[0].data?.startsWith("0xdeadbeef")).toBe(true);
    expectCelinaTagged(flow!.steps[0].data);
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
    expectCelinaTagged(flow!.steps[0].data);
    expectCelinaTagged(flow!.steps[1].data);
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

  it("maps unsigned_transaction field from Carbon REST", () => {
    const flow = carbonRestToPreparedFlow(
      FROM,
      {
        status: "ok",
        unsigned_transaction: {
          to: "0x6619871118D144c1c28eC3b23036FC1f0829ed3a",
          data: "0xabcdef",
          value: "0",
        },
      },
      "Carbon limit order",
    );

    expect(flow).toBeDefined();
    expect(flow!.steps).toHaveLength(1);
    expect(flow!.steps[0].to).toBe(
      "0x6619871118D144c1c28eC3b23036FC1f0829ed3a",
    );
    expect(flow!.steps[0].data?.startsWith("0xabcdef")).toBe(true);
    expectCelinaTagged(flow!.steps[0].data);
  });

  it("does not double-tag calldata that already includes CELINA suffix", () => {
    const tagged = appendCelinaCalldataTag("0xdeadbeef");
    const flow = carbonRestToPreparedFlow(FROM, {
      status: "ok",
      transaction: {
        to: "0x66198716B8DfA18620E1d0E0eF1d5035aC9A0B16",
        data: tagged,
        value: "0",
      },
    }, "Carbon limit order");

    expect(flow!.steps[0].data).toBe(tagged);
  });

  it("normalizeCarbonPrepareResult with unsigned_transaction", () => {
    const result = normalizeCarbonPrepareResult(
      FROM,
      {
        status: "ok",
        warnings: ["Allowance insufficient"],
        strategy_preview: { type: "limit_order" },
        unsigned_transaction: {
          to: "0x6619871118D144c1c28eC3b23036FC1f0829ed3a",
          data: "0xf727473a",
          value: "0",
        },
      },
      "Carbon limit order",
    );

    expect(result.preparedFlow?.steps).toHaveLength(1);
    expectCelinaTagged(result.preparedFlow?.steps[0].data);
    expect(result.strategyPreview).toEqual({ type: "limit_order" });
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

  it("normalizeCarbonPrepareResult preserves REST deep_link unchanged", () => {
    const tradeLink =
      "https://celo.carbondefi.xyz/trade/disposable?base=0x471EcE3750Da237f93B8E339c536989b8978a438&direction=buy";
    const result = normalizeCarbonPrepareResult(
      FROM,
      {
        status: "ok",
        warnings: [],
        deep_link: tradeLink,
        transaction: {
          to: "0x66198716B8DfA18620E1d0E0eF1d5035aC9A0B16",
          data: "0x",
        },
      },
      "Carbon limit order",
    );

    expect(result.deep_link).toBe(tradeLink);
  });

  it("carbonActivityDeepLink builds activity explorer URL", () => {
    expect(carbonActivityDeepLink(FROM)).toBe(
      `https://celo.carbondefi.xyz/explore/activity?search=${FROM}`,
    );
  });
});

describe("populatedTransactionToPreparedFlow", () => {
  it("tags SDK fallback transaction calldata with CELINA suffix", () => {
    const flow = populatedTransactionToPreparedFlow(
      FROM,
      {
        to: "0x6619871118D144c1c28eC3b23036FC1f0829ed3a",
        data: "0xabc123",
        value: 0n,
      },
      "Carbon taker swap",
    );

    expect(flow.steps).toHaveLength(1);
    expect(flow.steps[0].data?.startsWith("0xabc123")).toBe(true);
    expectCelinaTagged(flow.steps[0].data);
  });
});
