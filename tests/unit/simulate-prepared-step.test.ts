import { encodeFunctionData, erc20Abi, maxUint256 } from "viem";
import { describe, expect, it, vi } from "vitest";
import { CELINA_DATA_SUFFIX } from "../../src/config/celina-tag.js";
import { simulatePreparedStep } from "../../src/simulation/simulate-prepared-step.js";

const account = "0xA3872860EE9FEaB369c1a5E911CeCc2F4c40f702" as const;
const feeCurrency = "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e" as const;

describe("simulatePreparedStep", () => {
  it("uses publicClient.call for generic steps", async () => {
    const call = vi.fn().mockResolvedValue("0x");
    const estimateGas = vi.fn();
    const publicClient = { call, estimateGas };

    await simulatePreparedStep(
      publicClient as never,
      {
        account,
        step: {
          kind: "contract",
          to: "0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402",
          data: "0xabcdef",
          value: "0",
          description: "Supply 100 USDT to Aave V3",
        },
      },
    );

    expect(call).toHaveBeenCalledWith({
      account,
      to: "0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402",
      data: "0xabcdef",
      value: 0n,
    });
    expect(estimateGas).not.toHaveBeenCalled();
  });

  it("uses estimateGas when feeCurrency is provided", async () => {
    const call = vi.fn();
    const estimateGas = vi.fn().mockResolvedValue(120_000n);
    const publicClient = { call, estimateGas };

    await simulatePreparedStep(
      publicClient as never,
      {
        account,
        step: {
          kind: "contract",
          to: "0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402",
          data: "0x",
          value: "0",
          description: "Supply 100 USDT to Aave V3",
        },
      },
      { feeCurrency },
    );

    expect(estimateGas).toHaveBeenCalledWith({
      account,
      to: "0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402",
      data: "0x",
      value: 0n,
      feeCurrency,
    });
    expect(call).not.toHaveBeenCalled();
  });

  it("simulates approve steps via call on token contract calldata", async () => {
    const spender = "0x1234567890123456789012345678901234567890" as const;
    const token = "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e" as const;
    const data = encodeFunctionData({
      abi: erc20Abi,
      functionName: "approve",
      args: [spender, maxUint256],
    });
    const tagged = `${data}${CELINA_DATA_SUFFIX.slice(2)}` as `0x${string}`;

    const call = vi.fn().mockResolvedValue("0x");
    const publicClient = { call, estimateGas: vi.fn() };

    await simulatePreparedStep(
      publicClient as never,
      {
        account,
        step: {
          kind: "erc20",
          to: token,
          data: tagged,
          value: "0",
          description: "Approve USDT",
        },
      },
    );

    expect(call).toHaveBeenCalledWith({
      account,
      to: token,
      data: tagged,
      value: 0n,
    });
  });

  it("throws a readable message on insufficient balance reverts", async () => {
    const publicClient = {
      call: vi.fn().mockRejectedValue(
        new Error("ERC20: transfer amount exceeds balance"),
      ),
      estimateGas: vi.fn(),
    };

    await expect(
      simulatePreparedStep(publicClient as never, {
        account,
        step: {
          kind: "contract",
          to: "0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402",
          data: "0x",
          value: "0",
          description: "Supply 981.84 USDT to Aave V3",
        },
      }),
    ).rejects.toThrow(/Simulation failed for "Supply 981.84 USDT to Aave V3": insufficient balance/);
  });
});
