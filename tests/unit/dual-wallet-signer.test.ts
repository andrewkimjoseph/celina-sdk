import { describe, expect, it, vi } from "vitest";
import { getToolDefinition, getToolInputSchemaShape } from "../../src/tools/catalog.js";
import type { ToolRuntime } from "../../src/tools/types.js";

const CELO_ADDRESS = "0x1111111111111111111111111111111111111111" as const;
const SELF_AGENT_ADDRESS = "0x2222222222222222222222222222222222222222" as const;

function buildRuntime(overrides: Partial<ToolRuntime> = {}): ToolRuntime {
  return {
    celina: {} as ToolRuntime["celina"],
    resolveWallet: () => CELO_ADDRESS,
    executors: {
      transaction: {
        estimateSend: vi.fn().mockResolvedValue({ ok: true }),
        sendToken: vi.fn().mockResolvedValue({ ok: true }),
      },
    },
    mcpWallet: {
      address: CELO_ADDRESS,
      hasWallet: true,
      signer: "celo",
      wallets: {
        celo: { address: CELO_ADDRESS },
        self_agent: { address: SELF_AGENT_ADDRESS },
      },
    },
    ...overrides,
  } as ToolRuntime;
}

describe("dual-wallet signer support", () => {
  it("send_token, estimate_send, get_wallet_address, and execute_register_celo_account all accept an optional signer field", () => {
    for (const name of [
      "send_token",
      "estimate_send",
      "get_wallet_address",
      "execute_register_celo_account",
    ]) {
      const definition = getToolDefinition(name);
      expect(definition, `missing tool ${name}`).toBeDefined();
      const shape = getToolInputSchemaShape(definition!);
      expect(shape, `${name}: missing input schema shape`).toHaveProperty("signer");
    }
  });

  it("get_wallet_address returns the default signer's address plus every configured wallet when signer is omitted", async () => {
    const definition = getToolDefinition("get_wallet_address")!;
    const result = (await definition.handler(buildRuntime(), {})) as Record<string, unknown>;

    expect(result.wallet_address).toBe(CELO_ADDRESS);
    expect(result.source).toBe("CELO_PRIVATE_KEY");
    expect(result.wallets).toEqual({
      celo: { address: CELO_ADDRESS },
      self_agent: { address: SELF_AGENT_ADDRESS },
    });
  });

  it("get_wallet_address resolves the self_agent wallet explicitly, independent of the default signer", async () => {
    const definition = getToolDefinition("get_wallet_address")!;
    const result = (await definition.handler(buildRuntime(), {
      signer: "self_agent",
    })) as Record<string, unknown>;

    expect(result.wallet_address).toBe(SELF_AGENT_ADDRESS);
    expect(result.source).toBe("SELF_AGENT_PRIVATE_KEY");
  });

  it("get_wallet_address throws a clear error when the requested signer's key is not configured", async () => {
    const definition = getToolDefinition("get_wallet_address")!;
    const runtime = buildRuntime({
      mcpWallet: {
        address: CELO_ADDRESS,
        hasWallet: true,
        signer: "celo",
        wallets: { celo: { address: CELO_ADDRESS } },
      },
    });

    await expect(
      definition.handler(runtime, { signer: "self_agent" }),
    ).rejects.toThrow(/SELF_AGENT_PRIVATE_KEY/);
  });

  it("send_token threads the signer through to the transaction executor", async () => {
    const definition = getToolDefinition("send_token")!;
    const runtime = buildRuntime();
    runtime.celina = {
      ens: {
        resolveAddressOrEns: vi.fn().mockResolvedValue({ address: SELF_AGENT_ADDRESS }),
      },
    } as unknown as ToolRuntime["celina"];

    await definition.handler(runtime, {
      to: SELF_AGENT_ADDRESS,
      token: "CELO",
      amount: "5.2",
      signer: "celo",
    });

    expect(runtime.executors!.transaction!.sendToken).toHaveBeenCalledWith(
      SELF_AGENT_ADDRESS,
      "CELO",
      "5.2",
      "celo",
    );
  });

  it("estimate_send threads the signer through to the transaction executor", async () => {
    const definition = getToolDefinition("estimate_send")!;
    const runtime = buildRuntime();
    runtime.celina = {
      ens: {
        resolveAddressOrEns: vi.fn().mockResolvedValue({ address: SELF_AGENT_ADDRESS }),
      },
    } as unknown as ToolRuntime["celina"];

    await definition.handler(runtime, {
      to: SELF_AGENT_ADDRESS,
      token: "CELO",
      amount: "5.2",
      signer: "self_agent",
    });

    expect(runtime.executors!.transaction!.estimateSend).toHaveBeenCalledWith(
      SELF_AGENT_ADDRESS,
      "CELO",
      "5.2",
      "self_agent",
    );
  });
});
