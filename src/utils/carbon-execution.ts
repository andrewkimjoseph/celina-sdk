import { encodeFunctionData, erc20Abi } from "viem";
import { CELO_CARBON_CONTRACTS } from "../config/carbon.js";
import { appendCelinaCalldataTag } from "../config/celina-tag.js";
import type { CeloClientFactory } from "../clients/celo-client.js";
import type { CarbonPrepareResult } from "../types/carbon.js";
import type { PreparedTx } from "../types/prepared.js";
import type { TokenService } from "../services/token.service.js";
import { resolveCarbonTokenAddress } from "./carbon-token.js";

const CARBON_CONTROLLER = CELO_CARBON_CONTRACTS.carbonControllerAddress;

type ApprovalSpec = {
  token: string;
  amount: string | number;
};

function collectApprovalSpecs(meta: Record<string, unknown>): ApprovalSpec[] {
  const specs: ApprovalSpec[] = [];
  const direction = meta.direction as string | undefined;

  if (direction === "buy" && meta.quote_token != null && meta.budget != null) {
    specs.push({
      token: String(meta.quote_token),
      amount: meta.budget as string | number,
    });
  } else if (
    direction === "sell" &&
    meta.base_token != null &&
    meta.budget != null
  ) {
    specs.push({
      token: String(meta.base_token),
      amount: meta.budget as string | number,
    });
  }

  if (meta.buy_budget != null && meta.quote_token != null) {
    specs.push({
      token: String(meta.quote_token),
      amount: meta.buy_budget as string | number,
    });
  }
  if (meta.sell_budget != null && meta.base_token != null) {
    specs.push({
      token: String(meta.base_token),
      amount: meta.sell_budget as string | number,
    });
  }

  const sourceToken = meta.source_token ?? meta.token_in;
  if (sourceToken != null && meta.amount != null) {
    specs.push({
      token: String(sourceToken),
      amount: meta.amount as string | number,
    });
  }

  if (meta.token != null && meta.budget != null) {
    specs.push({
      token: String(meta.token),
      amount: meta.budget as string | number,
    });
  }

  return specs;
}

async function needsApproval(
  clientFactory: CeloClientFactory,
  owner: `0x${string}`,
  tokenAddress: `0x${string}`,
  amountWei: bigint,
): Promise<boolean> {
  const { public: client } = clientFactory.getClients();
  const allowance = await client.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "allowance",
    args: [owner, CARBON_CONTROLLER],
  });
  return allowance < amountWei;
}

async function buildApprovalSteps(
  from: `0x${string}`,
  tokenService: TokenService,
  clientFactory: CeloClientFactory,
  specs: ApprovalSpec[],
): Promise<PreparedTx[]> {
  const steps: PreparedTx[] = [];
  const seen = new Set<string>();

  for (const spec of specs) {
    const tokenAddress = resolveCarbonTokenAddress(tokenService, spec.token);
    const key = `${tokenAddress}:${spec.amount}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const resolved = tokenService.resolveToken(spec.token);
    const amountWei = tokenService.parseAmount(
      String(spec.amount),
      resolved.decimals,
    );

    if (!(await needsApproval(clientFactory, from, tokenAddress, amountWei))) {
      continue;
    }

    const approveData = appendCelinaCalldataTag(
      encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: [CARBON_CONTROLLER, amountWei],
      }),
    );

    steps.push({
      kind: "erc20",
      to: tokenAddress,
      data: approveData,
      value: "0",
      description: `Approve ${spec.amount} ${resolved.symbol} for Carbon DeFi`,
    });
  }

  return steps;
}

/**
 * Merge ERC-20 approval steps (when needed) with Carbon REST prepared steps for local signing.
 */
export async function buildCarbonExecutionSteps(
  from: `0x${string}`,
  prepared: CarbonPrepareResult,
  orderMeta: Record<string, unknown>,
  deps: {
    tokenService: TokenService;
    clientFactory: CeloClientFactory;
  },
): Promise<PreparedTx[]> {
  const carbonSteps = prepared.preparedFlow?.steps;
  if (!carbonSteps?.length) {
    throw new Error(
      "Carbon prepare response did not include unsigned transaction steps.",
    );
  }

  const approvalSteps = await buildApprovalSteps(
    from,
    deps.tokenService,
    deps.clientFactory,
    collectApprovalSpecs(orderMeta),
  );

  return [...approvalSteps, ...carbonSteps];
}
