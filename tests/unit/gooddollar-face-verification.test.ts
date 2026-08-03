import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PublicClient, WalletClient } from "viem";
import { GoodDollarService } from "../../src/services/gooddollar.service.js";
import type { CeloClientFactory } from "../../src/clients/celo-client.js";
import type { GoodDollarIdentityGuidance } from "../../src/services/gooddollar-identity-guidance.js";

const generateFVLinkMock = vi.fn();

vi.mock("../../src/clients/citizen-sdk.js", () => ({
  IdentitySDK: vi.fn().mockImplementation(() => ({
    generateFVLink: generateFVLinkMock,
  })),
}));

const ACCOUNT = "0x5409ED021D9299bf6814279A6A1411A7e866A631" as const;
const CALLBACK = "https://example.com/callback";

function mockFactory(): CeloClientFactory {
  return {
    getClients: () => ({ public: {} as PublicClient }),
    getConfig: () => ({ rpcUrl: "https://forno.celo.org" }),
  } as unknown as CeloClientFactory;
}

function faceVerifyGuidance(): GoodDollarIdentityGuidance {
  return {
    signerAddress: ACCOUNT,
    isWhitelistedRoot: false,
    isConnectedWallet: false,
    recommendedAction: "face_verify",
    message: "Verify this wallet.",
  };
}

function alreadyVerifiedGuidance(): GoodDollarIdentityGuidance {
  return {
    signerAddress: ACCOUNT,
    isWhitelistedRoot: false,
    isConnectedWallet: true,
    whitelistedRoot: "0x1111111111111111111111111111111111111111",
    connectedTo: "0x1111111111111111111111111111111111111111",
    recommendedAction: "already_verified",
    message: "Already verified via root.",
  };
}

describe("GoodDollarService.getFaceVerificationLink", () => {
  beforeEach(() => {
    generateFVLinkMock.mockReset();
    generateFVLinkMock.mockResolvedValue("https://gooddollar.org/fv/link");
  });

  it("skips citizen-sdk when guidance says face verification is not needed", async () => {
    const service = new GoodDollarService(mockFactory());
    vi.spyOn(service, "getIdentityGuidance").mockResolvedValue(
      alreadyVerifiedGuidance(),
    );

    const result = await service.getFaceVerificationLink({
      publicClient: {} as PublicClient,
      walletClient: {} as WalletClient,
      accountAddress: ACCOUNT,
      callbackUrl: CALLBACK,
    });

    expect(result).toMatchObject({
      from: ACCOUNT,
      callbackUrl: CALLBACK,
      network: "celo-mainnet",
      skipped: true,
      reason: "already_verified",
    });
    expect(generateFVLinkMock).not.toHaveBeenCalled();
  });

  it("generates a link via citizen-sdk when face verification is required", async () => {
    const service = new GoodDollarService(mockFactory());
    vi.spyOn(service, "getIdentityGuidance").mockResolvedValue(
      faceVerifyGuidance(),
    );

    const publicClient = {} as PublicClient;
    const walletClient = {} as WalletClient;

    const result = await service.getFaceVerificationLink({
      publicClient,
      walletClient,
      accountAddress: ACCOUNT,
      callbackUrl: CALLBACK,
    });

    expect(generateFVLinkMock).toHaveBeenCalledWith(false, CALLBACK, 42220);
    expect(result).toMatchObject({
      from: ACCOUNT,
      callbackUrl: CALLBACK,
      link: "https://gooddollar.org/fv/link",
      network: "celo-mainnet",
      guidance: {
        recommendedAction: "face_verify",
        message: "Verify this wallet.",
      },
    });
  });
});
