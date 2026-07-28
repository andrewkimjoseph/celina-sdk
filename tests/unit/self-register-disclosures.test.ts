import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/clients/self-api.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../src/clients/self-api.js")>();
  return {
    ...actual,
    requestRegistration: vi.fn(),
  };
});

import { requestRegistration } from "../../src/clients/self-api.js";
import { SelfService } from "../../src/services/self.service.js";
import type { CeloClientFactory } from "../../src/clients/celo-client.js";

const requestRegistrationMock = vi.mocked(requestRegistration);

function mockFactory() {
  return {
    getClients: () => ({
      public: { readContract: vi.fn() },
    }),
  } as unknown as CeloClientFactory;
}

describe("SelfService.registerAgent disclosures", () => {
  beforeEach(() => {
    requestRegistrationMock.mockReset();
    requestRegistrationMock.mockResolvedValue({
      sessionToken: "tok",
      deepLink: "self://register/tok",
      scanUrl: "https://app.ai.self.xyz/scan/tok",
      expiresAt: new Date(Date.now() + 600_000).toISOString(),
      humanInstructions: ["Scan the QR"],
      agentAddress: "0x5409ED021D9299bf6814279A6A1411A7e866A631",
    });
  });

  it("defaults to minimumAge 18, nationality true, and ofac true", async () => {
    const service = new SelfService(mockFactory(), {});
    await service.registerAgent();

    expect(requestRegistrationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        disclosures: {
          minimumAge: 18,
          nationality: true,
          ofac: true,
        },
      }),
    );
  });

  it("allows explicit overrides", async () => {
    const service = new SelfService(mockFactory(), {});
    await service.registerAgent({
      minimumAge: 0,
      nationality: false,
      ofac: false,
    });

    expect(requestRegistrationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        disclosures: {
          minimumAge: 0,
          nationality: false,
          ofac: false,
        },
      }),
    );
  });
});
