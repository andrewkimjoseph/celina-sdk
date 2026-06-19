import { encodeFunctionData, erc20Abi, maxUint256 } from "viem";
import { describe, expect, it } from "vitest";
import { CELINA_DATA_SUFFIX } from "../../src/config/celina-tag.js";
import {
  parseTaggedErc20Approve,
  stripCelinaCalldataSuffix,
} from "../../src/utils/erc20-allowance-storage.js";

describe("parseTaggedErc20Approve", () => {
  const spender = "0x1234567890123456789012345678901234567890" as const;
  const token = "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e" as const;

  it("parses approve calldata with CELINA suffix", () => {
    const data = encodeFunctionData({
      abi: erc20Abi,
      functionName: "approve",
      args: [spender, maxUint256],
    });
    const tagged = `${data}${CELINA_DATA_SUFFIX.slice(2)}` as `0x${string}`;

    const parsed = parseTaggedErc20Approve({
      kind: "erc20",
      to: token,
      data: tagged,
      value: "0",
      description: "Approve USDT",
    });

    expect(parsed).toEqual({
      token,
      spender,
      amount: maxUint256,
    });
  });

  it("stripCelinaCalldataSuffix removes suffix", () => {
    const data = "0x095ea7b3" as `0x${string}`;
    const tagged = `${data}${CELINA_DATA_SUFFIX.slice(2)}` as `0x${string}`;
    expect(stripCelinaCalldataSuffix(tagged)).toBe(data);
  });
});
