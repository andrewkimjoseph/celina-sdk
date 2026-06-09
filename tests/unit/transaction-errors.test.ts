import { describe, expect, it } from "vitest";
import {
  insufficientBalanceEstimateMessage,
  isInsufficientBalanceSimulationError,
} from "../../src/utils/transaction-errors.js";

describe("isInsufficientBalanceSimulationError", () => {
  it("matches ERC20 exceeds balance reverts", () => {
    const error = new Error(
      'The contract function "transfer" reverted.\n\nError: ERC20: transfer amount exceeds balance',
    );
    expect(isInsufficientBalanceSimulationError(error)).toBe(true);
  });

  it("matches insufficient funds", () => {
    expect(
      isInsufficientBalanceSimulationError(new Error("insufficient funds for gas")),
    ).toBe(true);
  });

  it("rejects unrelated errors", () => {
    expect(isInsufficientBalanceSimulationError(new Error("network timeout"))).toBe(
      false,
    );
  });
});

describe("insufficientBalanceEstimateMessage", () => {
  it("includes the token symbol", () => {
    expect(insufficientBalanceEstimateMessage("USDm")).toContain("USDm");
  });
});
