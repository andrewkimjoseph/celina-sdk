export type GoodDollarIdentityRecommendedAction =
  | "face_verify"
  | "connect_secondary"
  | "already_verified"
  | "use_verified_root_to_connect";

export type GoodDollarIdentityGuidance = {
  signerAddress: `0x${string}`;
  isWhitelistedRoot: boolean;
  isConnectedWallet: boolean;
  whitelistedRoot?: `0x${string}`;
  connectedTo?: `0x${string}`;
  recommendedAction: GoodDollarIdentityRecommendedAction;
  message: string;
};

export type GoodDollarIdentityGuidanceInput = {
  signerAddress: `0x${string}`;
  isWhitelisted: boolean;
  isWhitelistedRoot: boolean;
  isConnectedWallet: boolean;
  whitelistedRoot: `0x${string}` | null;
  connectedTo: `0x${string}` | null;
};

/** Derive next-step guidance for GoodDollar identity / humanness flows. */
export function deriveGoodDollarIdentityGuidance(
  input: GoodDollarIdentityGuidanceInput,
): GoodDollarIdentityGuidance {
  const base = {
    signerAddress: input.signerAddress,
    isWhitelistedRoot: input.isWhitelistedRoot,
    isConnectedWallet: input.isConnectedWallet,
    whitelistedRoot: input.whitelistedRoot ?? undefined,
    connectedTo: input.connectedTo ?? undefined,
  };

  if (input.isWhitelistedRoot && input.isWhitelisted) {
    return {
      ...base,
      recommendedAction: "connect_secondary",
      message:
        "This wallet is a whitelisted GoodDollar identity root. Face verification is not needed. " +
        "To link a secondary wallet, call execute_connect_gooddollar_identity with connected_account set to the wallet to link.",
    };
  }

  if (input.isConnectedWallet && input.isWhitelisted) {
    const root = input.whitelistedRoot ?? "unknown";
    return {
      ...base,
      recommendedAction: "already_verified",
      message:
        `This wallet is linked to GoodDollar identity root ${root} and inherits humanness. ` +
        "Face verification is not needed for this wallet.",
    };
  }

  return {
    ...base,
    recommendedAction: "face_verify",
    message:
      "This wallet is not GoodDollar verified. Use get_gooddollar_face_verification_link to verify this wallet as a new identity root. " +
      "If you already verified on a different wallet and want to link this one instead, set CELO_PRIVATE_KEY to the verified root wallet and call execute_connect_gooddollar_identity with connected_account set to this wallet.",
  };
}

export function shouldSkipFaceVerification(
  guidance: Pick<GoodDollarIdentityGuidance, "recommendedAction">,
): boolean {
  return (
    guidance.recommendedAction === "connect_secondary" ||
    guidance.recommendedAction === "already_verified"
  );
}

/** Build a connectIdentity error with path-specific remediation. */
export function buildConnectIdentityError(input: GoodDollarIdentityGuidanceInput): string {
  const guidance = deriveGoodDollarIdentityGuidance(input);

  if (input.isConnectedWallet && input.isWhitelisted) {
    const root = input.whitelistedRoot ?? "unknown";
    return (
      `Signer ${input.signerAddress} is a connected GoodDollar wallet linked to root ${root}. ` +
      "It cannot connect other wallets. To link a secondary wallet, set CELO_PRIVATE_KEY to the verified root and call execute_connect_gooddollar_identity."
    );
  }

  return (
    `Signer ${input.signerAddress} is not a whitelisted GoodDollar identity root. ` +
    guidance.message
  );
}

export const GOODDOLLAR_HUMANNESS_REMEDIATION =
  "Register a Self agent (register_self_agent), face-verify this wallet (get_gooddollar_face_verification_link), " +
  "or if already GoodDollar verified on another wallet, set CELO_PRIVATE_KEY to that verified root and link this wallet via execute_connect_gooddollar_identity.";
