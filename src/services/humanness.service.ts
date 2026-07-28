/**
 * Dual-rail humanness verification: Self Agent ID or GoodDollar IdentityV4.
 */
import { isAddress } from "viem";
import type { CeloClientFactory } from "../clients/celo-client.js";
import { GOODDOLLAR_HUMANNESS_REMEDIATION } from "./gooddollar-identity-guidance.js";
import { GOODDOLLAR_IDENTITY_ADDRESS } from "../config/gooddollar.js";
import { goodDollarIdentityAbi } from "../abis/gooddollar-identity.js";
import { SelfService } from "./self.service.js";

export interface HumannessRailResult {
  checked: boolean;
  isHuman: boolean;
  agentId?: number;
  whitelistedRoot?: `0x${string}`;
  reason?: string;
}

export interface HumannessCheckResult {
  signerAddress: `0x${string}`;
  selfAgent: HumannessRailResult;
  goodDollar: HumannessRailResult;
  isHumanOverall: boolean;
}

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

/** Address-bound humanness gate across Self and GoodDollar rails. */
export class HumannessService {
  constructor(
    private readonly clientFactory: CeloClientFactory,
    private readonly selfService: SelfService,
  ) {}

  /**
   * Check whether an address passes humanness on either Self or GoodDollar.
   * @param signerAddress - The address that will sign on-chain actions
   */
  async checkHumanness(signerAddress: `0x${string}`): Promise<HumannessCheckResult> {
    if (!isAddress(signerAddress)) {
      throw new Error(`Invalid address: ${signerAddress}`);
    }

    const [selfAgent, goodDollar] = await Promise.all([
      this.checkSelfRail(signerAddress),
      this.checkGoodDollarRail(signerAddress),
    ]);

    return {
      signerAddress,
      selfAgent,
      goodDollar,
      isHumanOverall: selfAgent.isHuman || goodDollar.isHuman,
    };
  }

  private async checkSelfRail(signerAddress: `0x${string}`): Promise<HumannessRailResult> {
    try {
      const result = await this.selfService.verifyAgent({
        agentAddress: signerAddress,
        requireOfac: true,
        requireAge: 18,
      });
      if (result.verified) {
        return {
          checked: true,
          isHuman: true,
          agentId:
            "agent_id" in result && typeof result.agent_id === "number"
              ? result.agent_id
              : undefined,
        };
      }
      return {
        checked: true,
        isHuman: false,
        reason:
          "reason" in result && typeof result.reason === "string"
            ? result.reason
            : "Self agent not verified",
      };
    } catch (error) {
      return {
        checked: true,
        isHuman: false,
        reason: error instanceof Error ? error.message : "Self verification failed",
      };
    }
  }

  private async checkGoodDollarRail(
    signerAddress: `0x${string}`,
  ): Promise<HumannessRailResult> {
    const client = this.clientFactory.getClients().public;

    try {
      const root = (await client.readContract({
        address: GOODDOLLAR_IDENTITY_ADDRESS,
        abi: goodDollarIdentityAbi,
        functionName: "getWhitelistedRoot",
        args: [signerAddress],
      })) as `0x${string}`;

      const identityAddress =
        root !== ZERO_ADDRESS ? root : signerAddress;

      const isWhitelisted = await client.readContract({
        address: GOODDOLLAR_IDENTITY_ADDRESS,
        abi: goodDollarIdentityAbi,
        functionName: "isWhitelisted",
        args: [identityAddress],
      });

      if (isWhitelisted) {
        return {
          checked: true,
          isHuman: true,
          whitelistedRoot: root !== ZERO_ADDRESS ? root : signerAddress,
        };
      }

      return {
        checked: true,
        isHuman: false,
        whitelistedRoot: root !== ZERO_ADDRESS ? root : undefined,
        reason: "GoodDollar identity not whitelisted",
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (
        message.includes("revert") &&
        (message.includes("reverify") || message.includes("out of bounds"))
      ) {
        return {
          checked: true,
          isHuman: false,
          reason: "reverify-index-out-of-bounds",
        };
      }
      return {
        checked: true,
        isHuman: false,
        reason: message,
      };
    }
  }
}

/** Throw when humanness check fails, with remediation pointers. */
export function assertHumanness(result: HumannessCheckResult): void {
  if (result.isHumanOverall) return;

  throw new Error(
    `Humanness verification failed for ${result.signerAddress}. ` +
      `Self: ${result.selfAgent.reason ?? "not verified"}. ` +
      `GoodDollar: ${result.goodDollar.reason ?? "not whitelisted"}. ` +
      "Register a Self agent (register_self_agent) or verify with GoodDollar. " +
      GOODDOLLAR_HUMANNESS_REMEDIATION,
  );
}
