import { describe, expect, it } from "vitest";
import {
  assertSnakeCaseInputKeys,
  getMcpToolNames,
  getToolDefinition,
} from "../../src/tools/catalog.js";
import type { ToolRuntime } from "../../src/tools/types.js";

const AGENTKARMA_TOOLS = [
  "get_agentkarma_reputation",
  "get_agentkarma_celo_agent",
  "check_agentkarma_counterparty",
] as const;

const SUBJECT = "0x1234567890abcdef1234567890abcdef12345678";

/** Minimal runtime: a stub agentKarma plus a passthrough wallet resolver. */
function fakeRuntime(agentKarma: Record<string, unknown>): ToolRuntime {
  return {
    celina: { agentKarma } as never,
    resolveWallet: (input?: { address?: string; wallet_address?: string }) =>
      (input?.address ?? input?.wallet_address ?? "0x") as `0x${string}`,
  } as unknown as ToolRuntime;
}

describe("AgentKarma tool catalog", () => {
  it("registers all three AgentKarma tools on the MCP surface", () => {
    const mcp = getMcpToolNames();
    for (const name of AGENTKARMA_TOOLS) {
      expect(mcp, `missing ${name}`).toContain(name);
    }
  });

  it("exposes them as read-only, idempotent, open-world reads with no env", () => {
    for (const name of AGENTKARMA_TOOLS) {
      const def = getToolDefinition(name);
      expect(def, `missing ${name}`).toBeDefined();
      expect(def!.families).toEqual(["read"]);
      expect(def!.surfaces).toEqual(["mcp"]);
      expect(def!.mcp?.annotations).toMatchObject({
        readOnlyHint: true,
        idempotentHint: true,
        openWorldHint: true,
      });
      expect(def!.mcp?.annotations?.destructiveHint).toBeUndefined();
      expect(def!.requiresEnv ?? []).toEqual([]);
      expect(() => assertSnakeCaseInputKeys(def!)).not.toThrow();
    }
  });

  it("coerces and validates check_agentkarma_counterparty inputs", () => {
    const def = getToolDefinition("check_agentkarma_counterparty")!;
    const parsed = def.inputSchema.parse({
      address: SUBJECT,
      face: "consumer",
      min_score: "80",
      require_receipt_backed: "true",
    });
    expect(parsed).toMatchObject({
      face: "consumer",
      min_score: 80,
      require_receipt_backed: true,
    });
    // Blank score is treated as omitted (the bespoke optionalScoreSchema branch).
    expect(
      (def.inputSchema.parse({ address: SUBJECT, min_score: "" }) as {
        min_score?: number;
      }).min_score,
    ).toBeUndefined();
    // Out-of-range / negative score is rejected.
    expect(() => def.inputSchema.parse({ address: SUBJECT, min_score: 150 })).toThrow();
    expect(() => def.inputSchema.parse({ address: SUBJECT, min_score: -1 })).toThrow();
    // Unknown face is rejected.
    expect(() => def.inputSchema.parse({ address: SUBJECT, face: "bogus" })).toThrow();
    // The subject address is required (no signer fallback for external reads).
    expect(() => def.inputSchema.parse({ face: "provider" })).toThrow();
  });

  it("get_agentkarma_reputation calls getKarma with the subject and face", async () => {
    const calls: unknown[] = [];
    const runtime = fakeRuntime({
      getKarma: async (wallet: string, opts: unknown) => {
        calls.push([wallet, opts]);
        return { address: wallet };
      },
    });
    const def = getToolDefinition("get_agentkarma_reputation")!;
    const out = await def.handler(runtime, { address: SUBJECT, face: "provider" });

    expect(calls[0]).toEqual([SUBJECT, { face: "provider" }]);
    expect(out).toEqual({ address: SUBJECT });
  });

  it("get_agentkarma_reputation defaults the face to both", async () => {
    const calls: unknown[] = [];
    const runtime = fakeRuntime({
      getKarma: async (wallet: string, opts: unknown) => {
        calls.push([wallet, opts]);
        return {};
      },
    });
    const def = getToolDefinition("get_agentkarma_reputation")!;
    await def.handler(runtime, { address: SUBJECT });

    expect(calls[0]).toEqual([SUBJECT, { face: "both" }]);
  });

  it("get_agentkarma_celo_agent calls getCeloAgent with the numeric id", async () => {
    const calls: unknown[] = [];
    const runtime = fakeRuntime({
      getCeloAgent: async (agentId: number) => {
        calls.push(agentId);
        return { agentId };
      },
    });
    const def = getToolDefinition("get_agentkarma_celo_agent")!;
    const out = await def.handler(runtime, { agent_id: 9058 });

    expect(calls[0]).toBe(9058);
    expect(out).toEqual({ agentId: 9058 });
  });

  it("check_agentkarma_counterparty maps inputs onto a trust policy", async () => {
    const calls: unknown[] = [];
    const runtime = fakeRuntime({
      evaluateCounterparty: async (wallet: string, policy: unknown) => {
        calls.push([wallet, policy]);
        return {
          chain: "celo",
          wallet,
          decision: { allowed: false, reasons: ["nope"], observed: {} },
          snapshot: { address: wallet },
        };
      },
    });
    const def = getToolDefinition("check_agentkarma_counterparty")!;
    const out = (await def.handler(runtime, {
      address: SUBJECT,
      face: "consumer",
      min_score: 80,
      require_receipt_backed: true,
    })) as { chain: string; decision: { allowed: boolean } };

    expect(calls[0]).toEqual([
      SUBJECT,
      { face: "consumer", minScore: 80, requireReceiptBacked: true },
    ]);
    expect(out.chain).toBe("celo");
    expect(out.decision.allowed).toBe(false);
  });

  it("check_agentkarma_counterparty leaves face undefined when omitted (SDK defaults provider)", async () => {
    const calls: Array<{ face?: unknown }> = [];
    const runtime = fakeRuntime({
      evaluateCounterparty: async (wallet: string, policy: { face?: unknown }) => {
        calls.push(policy);
        return {
          chain: "celo",
          wallet,
          decision: { allowed: true, reasons: [], observed: {} },
          snapshot: { address: wallet },
        };
      },
    });
    const def = getToolDefinition("check_agentkarma_counterparty")!;
    await def.handler(runtime, { address: SUBJECT });

    expect(calls[0].face).toBeUndefined();
  });
});
