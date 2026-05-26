/**
 * Token sends: estimateSend simulates gas; prepareSend builds unsigned tx steps.
 * Calldata is tagged with CELINA_DATA_SUFFIX for on-chain attribution.
 */
import { concat, encodeFunctionData, erc20Abi, parseEther, type Hex } from "viem";
import type { CeloClientFactory } from "../clients/celo-client.js";
import { CELINA_DATA_SUFFIX } from "../config/celina-tag.js";
import {
  type PreparedFlow,
  serializePreparedFlow,
  type SerializedPreparedFlow,
} from "../types/prepared.js";
import { TokenService } from "./token.service.js";

function taggedCalldata(data: Hex): Hex {
  return concat([data, CELINA_DATA_SUFFIX]);
}

export class TransactionService {
  private readonly tokenService: TokenService;

  constructor(private readonly clientFactory: CeloClientFactory) {
    this.tokenService = new TokenService(clientFactory);
  }

  /** Simulate gas for a CELO or ERC-20 transfer from `from`. */
  async estimateSend(
    from: `0x${string}`,
    to: `0x${string}`,
    token: string,
    amount: string,
  ) {
    const { public: client } = this.clientFactory.getClients();
    const resolved = this.tokenService.resolveToken(token);

    if (resolved.address === "native") {
      const value = parseEther(amount);
      const gas = await client.estimateGas({
        account: from,
        to,
        value,
      });

      return {
        network: "mainnet" as const,
        from,
        to,
        token: resolved.symbol,
        amount,
        gas: gas.toString(),
      };
    }

    const tokenAmount = this.tokenService.parseAmount(amount, resolved.decimals);
    const gas = await client.estimateContractGas({
      account: from,
      address: resolved.address,
      abi: erc20Abi,
      functionName: "transfer",
      args: [to, tokenAmount],
    });

    return {
      network: "mainnet" as const,
      from,
      to,
      token: resolved.symbol,
      amount,
      gas: gas.toString(),
    };
  }

  /**
   * Build an unsigned send flow (native CELO or ERC-20 transfer).
   * Returns `SerializedPreparedFlow` for wagmi `sendTransaction`.
   */
  async prepareSend(
    from: `0x${string}`,
    to: `0x${string}`,
    token: string,
    amount: string,
  ): Promise<SerializedPreparedFlow> {
    const resolved = this.tokenService.resolveToken(token);

    if (resolved.address === "native") {
      const flow: PreparedFlow = {
        network: "mainnet",
        from,
        summary: `Send ${amount} CELO to ${to}`,
        steps: [
          {
            kind: "native",
            to,
            value: parseEther(amount).toString(),
            data: CELINA_DATA_SUFFIX,
            description: `Send ${amount} CELO`,
          },
        ],
      };
      return serializePreparedFlow(flow);
    }

    const tokenAmount = this.tokenService.parseAmount(amount, resolved.decimals);
    const data = taggedCalldata(
      encodeFunctionData({
        abi: erc20Abi,
        functionName: "transfer",
        args: [to, tokenAmount],
      }),
    );

    const flow: PreparedFlow = {
      network: "mainnet",
      from,
      summary: `Send ${amount} ${resolved.symbol} to ${to}`,
      steps: [
        {
          kind: "erc20",
          to: resolved.address,
          data,
          value: "0",
          description: `Transfer ${amount} ${resolved.symbol}`,
        },
      ],
    };
    return serializePreparedFlow(flow);
  }
}
