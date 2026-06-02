import { describe, expect, it } from "vitest";
import { encodeFunctionData, erc20Abi, parseEther } from "viem";
import { CeloClientFactory } from "../../src/clients/celo-client.js";
import { MENTO_CELO_ADDRESS } from "../../src/config/chains.js";
import { CELINA_DATA_SUFFIX } from "../../src/config/celina-tag.js";
import { resolveSdkConfig } from "../../src/config/sdk-config.js";
import { TransactionService } from "../../src/services/transaction.service.js";

describe("TransactionService.prepareSend", () => {
  const service = new TransactionService(
    new CeloClientFactory(resolveSdkConfig({})),
  );
  const from = "0x1111111111111111111111111111111111111111" as const;
  const to = "0x2222222222222222222222222222222222222222" as const;

  it("routes CELO through GoldToken ERC-20 transfer (token duality)", async () => {
    const amount = "0.5";
    const flow = await service.prepareSend(from, to, "CELO", amount);
    const step = flow.steps[0]!;

    expect(step.kind).toBe("erc20");
    expect(step.to).toBe(MENTO_CELO_ADDRESS);
    expect(step.value).toBe("0");

    const expectedTransfer = encodeFunctionData({
      abi: erc20Abi,
      functionName: "transfer",
      args: [to, parseEther(amount)],
    });
    expect(step.data?.startsWith(expectedTransfer)).toBe(true);
    expect(step.data?.endsWith(CELINA_DATA_SUFFIX.slice(2))).toBe(true);
  });

  it("keeps ERC-20 sends on the token contract", async () => {
    const flow = await service.prepareSend(from, to, "USDT", "1");
    const step = flow.steps[0]!;

    expect(step.kind).toBe("erc20");
    expect(step.to).toBe("0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e");
    expect(step.value).toBe("0");
  });
});
