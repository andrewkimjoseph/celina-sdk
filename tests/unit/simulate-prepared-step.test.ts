import { encodeFunctionData, erc20Abi, maxUint256 } from "viem";
import { describe, expect, it, vi } from "vitest";
import { CELINA_DATA_SUFFIX } from "../../src/config/celina-tag.js";
import { simulatePreparedStep } from "../../src/utils/simulate-prepared-step.js";

const from = "0xA3872860EE9FEaB369c1a5E911CeCc2F4c40f702" as const;

describe("simulatePreparedStep", () => {
  it("runs estimateContractGas for approve steps", async () => {
    const spender = "0x1234567890123456789012345678901234567890" as const;
    const token = "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e" as const;
    const data = encodeFunctionData({
      abi: erc20Abi,
      functionName: "approve",
      args: [spender, maxUint256],
    });
    const tagged = `${data}${CELINA_DATA_SUFFIX.slice(2)}` as `0x${string}`;

    const estimateContractGas = vi.fn().mockResolvedValue(50_000n);
    const estimateGas = vi.fn();
    const publicClient = {
      estimateContractGas,
      estimateGas,
      multicall: vi.fn().mockResolvedValue([
        { status: "success", result: 1_000_000n },
        { status: "success", result: 0n },
        { status: "success", result: 0n },
      ]),
    };

    await simulatePreparedStep(publicClient as never, {
      from,
      step: {
        kind: "erc20",
        to: token,
        data: tagged,
        value: "0",
        description: "Approve USDT",
      },
      isMiniPay: true,
    });

    expect(estimateContractGas).toHaveBeenCalled();
    expect(estimateGas).not.toHaveBeenCalled();
  });

  it("throws friendly message on insufficient balance simulation", async () => {
    const publicClient = {
      estimateGas: vi.fn().mockRejectedValue(
        new Error("ERC20: transfer amount exceeds balance"),
      ),
      multicall: vi.fn().mockResolvedValue([
        { status: "success", result: 1_000_000n },
        { status: "success", result: 0n },
        { status: "success", result: 0n },
      ]),
    };

    await expect(
      simulatePreparedStep(publicClient as never, {
        from,
        step: {
          kind: "contract",
          to: "0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402",
          data: "0x",
          value: "0",
          description: "Supply 971 USDT to Aave V3",
        },
        isMiniPay: true,
      }),
    ).rejects.toThrow(/Preflight simulation failed/);
  });
});
