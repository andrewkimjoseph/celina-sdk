import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import type { PublicClient } from "viem";
import {
  GOODDOLLAR_MENTO_BROKER,
  GOODDOLLAR_TOKEN_ADDRESS,
  createGoodDollarReserveClient,
} from "../../src/browser/gooddollar-reserve.js";
import { checkAttributionInCalldata } from "../../src/config/celina-tag.js";

const FROM = "0x0000000000000000000000000000000000000001" as const;
const SRC_ROOT = resolve(process.cwd(), "src");
const ENTRY = resolve(SRC_ROOT, "browser/gooddollar-reserve.ts");

function resolveRelative(fromFile: string, spec: string): string {
  const base = resolve(dirname(fromFile), spec.replace(/\.js$/, ""));
  const candidates = [`${base}.ts`, `${base}.tsx`, join(base, "index.ts")];
  const found = candidates.find((candidate) => existsSync(candidate));
  if (!found) {
    throw new Error(`Could not resolve ${spec} from ${fromFile}`);
  }
  return found;
}

function collectGraph(file: string, seen = new Set<string>()): { files: string[]; packages: string[] } {
  if (seen.has(file)) {
    return { files: [], packages: [] };
  }
  seen.add(file);
  const source = readFileSync(file, "utf8");
  const specs = [
    ...source.matchAll(/from\s+["']([^"']+)["']/g),
    ...source.matchAll(/import\s+["']([^"']+)["']/g),
    ...source.matchAll(/import\(\s*["']([^"']+)["']\s*\)/g),
  ].map((match) => match[1] ?? "");

  const files = [file];
  const packages: string[] = [];
  for (const spec of specs) {
    if (!spec || spec.startsWith("node:")) continue;
    if (spec.startsWith(".")) {
      const next = collectGraph(resolveRelative(file, spec), seen);
      files.push(...next.files);
      packages.push(...next.packages);
    } else {
      packages.push(spec);
    }
  }
  return { files, packages };
}

function mockPublicClient(options?: {
  amountOut?: bigint;
  amountIn?: bigint;
  allowance?: bigint;
  balance?: bigint;
}) {
  const amountOut = options?.amountOut ?? 2_000000000000000000n;
  const amountIn = options?.amountIn ?? 5000000000000000000n;
  const allowance = options?.allowance ?? 0n;
  const balance = options?.balance ?? 10n ** 24n;
  const readContract = vi.fn(async (request: { functionName: string }) => {
    switch (request.functionName) {
      case "getAmountOut":
        return amountOut;
      case "getAmountIn":
        return amountIn;
      case "allowance":
        return allowance;
      case "balanceOf":
        return balance;
      default:
        throw new Error(`unexpected read ${request.functionName}`);
    }
  });
  const estimateGas = vi.fn(async (request: { stateOverride?: unknown; to?: string }) => {
    if (request.stateOverride) return 80_000n;
    if (request.to?.toLowerCase() === GOODDOLLAR_TOKEN_ADDRESS.toLowerCase()) return 45_000n;
    return 21_000n;
  });
  return {
    client: { readContract, estimateGas } as unknown as PublicClient,
    readContract,
    estimateGas,
  };
}

describe("gooddollar reserve browser module", () => {
  it("does not import citizen-sdk, AgentKarma, or GoodDollarService", () => {
    const graph = collectGraph(ENTRY);
    const joined = [...graph.files, ...graph.packages].join("\n");
    expect(joined).not.toMatch(/citizen-sdk/);
    expect(joined).not.toMatch(/@agentkarma\/sdk/);
    expect(joined).not.toMatch(/gooddollar\.service/);
    expect(graph.files.some((file) => file.endsWith("browser/gooddollar-reserve.ts"))).toBe(true);
    expect(graph.files.some((file) => file.endsWith("services/token.service.ts"))).toBe(true);
  });

  it("quotes an exact-in G$ → USDm swap without reading a balance", async () => {
    const { client, readContract } = mockPublicClient();
    const reserve = createGoodDollarReserveClient(client);
    const quote = await reserve.getReserveQuote("GoodDollar", "USDm", "1000");

    expect(quote).toMatchObject({
      protocol: "gooddollar_reserve",
      network: "mainnet",
      tokenIn: "GoodDollar",
      tokenOut: "USDm",
      amountIn: "1000",
      expectedOut: "2",
      amountSide: "in",
      routeHops: 1,
      broker: GOODDOLLAR_MENTO_BROKER,
    });
    expect(readContract.mock.calls.map((call) => call[0].functionName)).toEqual(["getAmountOut"]);
  });

  it("quotes exact-out by resolving amount in", async () => {
    const { client } = mockPublicClient({ amountIn: 2_000000000000000000n });
    const reserve = createGoodDollarReserveClient(client);
    const quote = await reserve.getReserveQuote("USDm", "GoodDollar", "1", {
      amountSide: "out",
    });

    expect(quote.amountSide).toBe("out");
    expect(quote.tokenIn).toBe("USDm");
    expect(quote.tokenOut).toBe("GoodDollar");
    expect(quote.amountIn).toBe("2");
    expect(quote.expectedOut).toBe("1");
  });

  it("rejects pairs outside G$ ↔ USDm", async () => {
    const { client } = mockPublicClient();
    const reserve = createGoodDollarReserveClient(client);
    await expect(reserve.getReserveQuote("GoodDollar", "USDT", "1")).rejects.toThrow(
      /No GoodDollar reserve route/,
    );
  });

  it("prepares an approval plus tagged swap when allowance is short", async () => {
    const { client, estimateGas } = mockPublicClient();
    const reserve = createGoodDollarReserveClient(client, {
      attributionTags: ["goodreserve"],
    });
    const flow = await reserve.prepareReserveSwap(FROM, "GoodDollar", "USDm", "10");

    expect(flow.preparedFlow).toBe(true);
    expect(flow.chainId).toBe(42220);
    expect(flow.steps).toHaveLength(2);
    expect(flow.steps[0]?.kind).toBe("erc20");
    expect(flow.steps[0]?.to.toLowerCase()).toBe(GOODDOLLAR_TOKEN_ADDRESS.toLowerCase());
    expect(flow.steps[1]?.kind).toBe("contract");
    expect(flow.steps[1]?.to.toLowerCase()).toBe(GOODDOLLAR_MENTO_BROKER.toLowerCase());
    expect(checkAttributionInCalldata(flow.steps[0]!.data!, "goodreserve").tags).toEqual([
      "celina",
      "goodreserve",
    ]);
    expect(checkAttributionInCalldata(flow.steps[1]!.data!, "celina").matched).toBe(true);
    expect(estimateGas).toHaveBeenCalled();
  });

  it("skips approval when allowance already covers the spend", async () => {
    const { client } = mockPublicClient({ allowance: 10n ** 30n });
    const reserve = createGoodDollarReserveClient(client);
    const flow = await reserve.prepareReserveSwap(FROM, "USDm", "GoodDollar", "1");
    expect(flow.steps).toHaveLength(1);
    expect(flow.steps[0]?.kind).toBe("contract");
  });

  it("estimates approval and swap gas and applies default slippage", async () => {
    const { client } = mockPublicClient({ amountOut: 1_000000000000000000n });
    const reserve = createGoodDollarReserveClient(client);
    const estimate = await reserve.estimateReserveSwap(FROM, "GoodDollar", "USDm", "10");

    expect(estimate.approvalNeeded).toBe(true);
    expect(estimate.approvalGas).toBe("45000");
    expect(estimate.swapGas).toBe("80000");
    expect(estimate.totalGas).toBe("125000");
    expect(estimate.slippageTolerance).toBe(0.5);
    expect(estimate.expectedOut).toBe("1");
    expect(estimate.amountOutMin).toBe("0.995");
  });

  it("throws when the wallet cannot cover the spend", async () => {
    const { client } = mockPublicClient({ balance: 1n });
    const reserve = createGoodDollarReserveClient(client);
    await expect(
      reserve.estimateReserveSwap(FROM, "GoodDollar", "USDm", "10"),
    ).rejects.toThrow(/Insufficient GoodDollar balance/);
  });
});

describe("package export ./gooddollar-reserve", () => {
  it("points at the built browser module", () => {
    const packageJson = JSON.parse(
      readFileSync(resolve(process.cwd(), "package.json"), "utf8"),
    ) as { exports: Record<string, { types: string; import: string; default: string }> };
    expect(packageJson.exports["./gooddollar-reserve"]).toEqual({
      types: "./build/browser/gooddollar-reserve.d.ts",
      import: "./build/browser/gooddollar-reserve.js",
      default: "./build/browser/gooddollar-reserve.js",
    });
  });
});
