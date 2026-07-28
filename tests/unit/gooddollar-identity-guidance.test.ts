import { describe, expect, it } from "vitest";
import {
  buildConnectIdentityError,
  deriveGoodDollarIdentityGuidance,
  shouldSkipFaceVerification,
} from "../../src/services/gooddollar-identity-guidance.js";

const ROOT = "0x1111111111111111111111111111111111111111" as const;
const CONNECTED = "0x2222222222222222222222222222222222222222" as const;
const UNVERIFIED = "0x3333333333333333333333333333333333333333" as const;

describe("deriveGoodDollarIdentityGuidance", () => {
  it("recommends connect_secondary for whitelisted root", () => {
    const guidance = deriveGoodDollarIdentityGuidance({
      signerAddress: ROOT,
      isWhitelisted: true,
      isWhitelistedRoot: true,
      isConnectedWallet: false,
      whitelistedRoot: ROOT,
      connectedTo: null,
    });

    expect(guidance.recommendedAction).toBe("connect_secondary");
    expect(shouldSkipFaceVerification(guidance)).toBe(true);
    expect(guidance.message).toContain("execute_connect_gooddollar_identity");
  });

  it("recommends already_verified for connected wallet with whitelisted root", () => {
    const guidance = deriveGoodDollarIdentityGuidance({
      signerAddress: CONNECTED,
      isWhitelisted: true,
      isWhitelistedRoot: false,
      isConnectedWallet: true,
      whitelistedRoot: ROOT,
      connectedTo: ROOT,
    });

    expect(guidance.recommendedAction).toBe("already_verified");
    expect(shouldSkipFaceVerification(guidance)).toBe(true);
    expect(guidance.message).toContain(ROOT);
  });

  it("recommends face_verify for unverified standalone wallet", () => {
    const guidance = deriveGoodDollarIdentityGuidance({
      signerAddress: UNVERIFIED,
      isWhitelisted: false,
      isWhitelistedRoot: false,
      isConnectedWallet: false,
      whitelistedRoot: null,
      connectedTo: null,
    });

    expect(guidance.recommendedAction).toBe("face_verify");
    expect(shouldSkipFaceVerification(guidance)).toBe(false);
    expect(guidance.message).toContain("get_gooddollar_face_verification_link");
    expect(guidance.message).toContain("execute_connect_gooddollar_identity");
  });
});

describe("buildConnectIdentityError", () => {
  it("explains verified root requirement for unverified signer", () => {
    const message = buildConnectIdentityError({
      signerAddress: UNVERIFIED,
      isWhitelisted: false,
      isWhitelistedRoot: false,
      isConnectedWallet: false,
      whitelistedRoot: null,
      connectedTo: null,
    });

    expect(message).toContain("not a whitelisted GoodDollar identity root");
    expect(message).toContain("get_gooddollar_face_verification_link");
    expect(message).toContain("execute_connect_gooddollar_identity");
  });

  it("explains connected wallet cannot connect others", () => {
    const message = buildConnectIdentityError({
      signerAddress: CONNECTED,
      isWhitelisted: true,
      isWhitelistedRoot: false,
      isConnectedWallet: true,
      whitelistedRoot: ROOT,
      connectedTo: ROOT,
    });

    expect(message).toContain("connected GoodDollar wallet");
    expect(message).toContain(ROOT);
    expect(message).toContain("verified root");
  });
});
