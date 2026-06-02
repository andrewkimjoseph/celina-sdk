import { describe, expect, it } from "vitest";
import { resolveCarbonTokenAddress, normalizeCarbonWriteBody } from "../../src/utils/carbon-token.js";
import { TokenService } from "../../src/services/token.service.js";
import { CeloClientFactory } from "../../src/clients/celo-client.js";
import { resolveSdkConfig } from "../../src/config/sdk-config.js";
import { MENTO_CELO_ADDRESS } from "../../src/config/chains.js";

describe("carbon-token", () => {
  const tokenService = new TokenService(
    new CeloClientFactory(resolveSdkConfig({})),
  );

  it("maps CELO symbol to WCELO/MENTO address", () => {
    expect(resolveCarbonTokenAddress(tokenService, "CELO")).toBe(
      MENTO_CELO_ADDRESS,
    );
  });

  it("passes through 0x addresses unchanged", () => {
    const usdt = "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e";
    expect(resolveCarbonTokenAddress(tokenService, usdt)).toBe(usdt);
  });

  it("normalizes token fields in write bodies", () => {
    const body = normalizeCarbonWriteBody(tokenService, {
      wallet_address: "0x1111111111111111111111111111111111111111",
      base_token: "CELO",
      quote_token: "USDT",
      direction: "buy",
    });
    expect(body.base_token).toBe(MENTO_CELO_ADDRESS);
    expect(body.quote_token).toBe(
      "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
    );
  });
});
