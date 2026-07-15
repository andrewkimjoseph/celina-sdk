/**
 * Token sends: estimateSend simulates gas; prepareSend builds unsigned tx steps.
 * Calldata is tagged with the ERC-8021 attribution suffix (see appendCelinaCalldataTag).
 */
import {
  encodeFunctionData,
  erc20Abi,
  parseEther,
  parseGwei,
  type Hex,
} from "viem";
import type { CeloClientFactory } from "../clients/celo-client.js";
import { CHAIN, MENTO_CELO_ADDRESS } from "../config/chains.js";
import { appendCelinaCalldataTag } from "../config/celina-tag.js";
import { normalizeAddress } from "../utils/normalize-address.js";
import {
  type PreparedFlow,
  serializePreparedFlow,
  type SerializedPreparedFlow,
} from "../types/prepared.js";
import { TokenService } from "./token.service.js";
import {
  insufficientBalanceEstimateMessage,
  isInsufficientBalanceSimulationError,
} from "../utils/transaction-errors.js";

export type SendEstimateResult = {
  network: "mainnet";
  from: `0x${string}`;
  to: `0x${string}`;
  token: string;
  amount: string;
  gas: string | null;
  insufficientBalance?: boolean;
  message?: string;
};

/** Token sends, gas fee reads, and `prepareSend` flows with CELINA calldata tags. */
export class TransactionService {
  private readonly tokenService: TokenService;
  private readonly attributionTags?: string[];

  constructor(private readonly clientFactory: CeloClientFactory) {
    this.tokenService = new TokenService(clientFactory);
    this.attributionTags = clientFactory.getConfig().attributionTags;
  }

  /**
   * Simulate gas for a CELO or ERC-20 transfer from `from`.
   * @param from - Sender wallet address
   * @param to - Recipient address
   * @param token - Symbol (e.g. `CELO`, `USDm`) or contract address
   * @param amount - Human-readable amount (e.g. `"10"`)
   * @returns Gas estimate in units as a decimal string, or a structured insufficient-balance result when simulation reverts.
   */
  async estimateSend(
    from: `0x${string}`,
    to: `0x${string}`,
    token: string,
    amount: string,
  ): Promise<SendEstimateResult> {
    const { public: client } = this.clientFactory.getClients();
    const resolved = this.tokenService.resolveToken(token);

    const base = {
      network: "mainnet" as const,
      from,
      to,
      token: resolved.symbol,
      amount,
    };

    try {
      if (resolved.address === "native") {
        const tokenAmount = parseEther(amount);
        const gas = await client.estimateContractGas({
          account: from,
          address: MENTO_CELO_ADDRESS,
          abi: erc20Abi,
          functionName: "transfer",
          args: [to, tokenAmount],
        });

        return { ...base, gas: gas.toString() };
      }

      const tokenAmount = this.tokenService.parseAmount(amount, resolved.decimals);
      const gas = await client.estimateContractGas({
        account: from,
        address: resolved.address,
        abi: erc20Abi,
        functionName: "transfer",
        args: [to, tokenAmount],
      });

      return { ...base, gas: gas.toString() };
    } catch (error) {
      if (isInsufficientBalanceSimulationError(error)) {
        return {
          ...base,
          gas: null,
          insufficientBalance: true,
          message: insufficientBalanceEstimateMessage(resolved.symbol),
        };
      }
      throw error;
    }
  }

  /**
   * Build an unsigned send flow (native CELO or ERC-20 transfer).
   * @param from - Sender wallet address (must match connected wallet when signing)
   * @param to - Recipient address
   * @param token - Symbol or contract address
   * @param amount - Human-readable amount
   * @returns Single-step `SerializedPreparedFlow` for wagmi `sendTransactionAsync`
   */
  async prepareSend(
    from: `0x${string}`,
    to: `0x${string}`,
    token: string,
    amount: string,
  ): Promise<SerializedPreparedFlow> {
    const resolved = this.tokenService.resolveToken(token);

    if (resolved.address === "native") {
      const tokenAmount = parseEther(amount);
      const data = appendCelinaCalldataTag(
        encodeFunctionData({
          abi: erc20Abi,
          functionName: "transfer",
          args: [to, tokenAmount],
        }),
        this.attributionTags,
      );

      const flow: PreparedFlow = {
        chainId: CHAIN.id,
        from,
        summary: `Send ${amount} CELO to ${to}`,
        steps: [
          {
            kind: "erc20",
            to: MENTO_CELO_ADDRESS,
            data,
            value: "0",
            description: `Send ${amount} CELO`,
          },
        ],
      };
      return serializePreparedFlow(flow);
    }

    const tokenAmount = this.tokenService.parseAmount(amount, resolved.decimals);
    const data = appendCelinaCalldataTag(
      encodeFunctionData({
        abi: erc20Abi,
        functionName: "transfer",
        args: [to, tokenAmount],
      }),
      this.attributionTags,
    );

    const flow: PreparedFlow = {
      chainId: CHAIN.id,
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

  /** Current gas fee data including EIP-1559 fees when supported. */
  async getGasFeeData() {
    const { public: client } = this.clientFactory.getClients();
    const [block, gasPrice] = await Promise.all([
      client.getBlock({ blockTag: "latest" }),
      client.getGasPrice(),
    ]);

    const baseFeePerGas = block.baseFeePerGas;

    if (baseFeePerGas) {
      const maxPriorityFeePerGas = parseGwei("2");
      const maxFeePerGas = baseFeePerGas * 2n + maxPriorityFeePerGas;

      return {
        network: "mainnet" as const,
        baseFeePerGas: baseFeePerGas.toString(),
        maxFeePerGas: maxFeePerGas.toString(),
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
        gasPrice: gasPrice.toString(),
        eip1559: true,
      };
    }

    return {
      network: "mainnet" as const,
      baseFeePerGas: "0",
      maxFeePerGas: gasPrice.toString(),
      maxPriorityFeePerGas: "0",
      gasPrice: gasPrice.toString(),
      eip1559: false,
    };
  }

  /** Generic transaction gas estimate (not token-transfer specific). */
  async estimateTransaction(params: {
    from: `0x${string}`;
    to: `0x${string}`;
    value?: string;
    data?: Hex;
  }) {
    const from = normalizeAddress(params.from, "from address");
    const to = normalizeAddress(params.to, "to address");
    const { public: client } = this.clientFactory.getClients();
    const value = params.value ? BigInt(params.value) : 0n;
    const data = params.data ?? "0x";

    let gasLimit: bigint;
    try {
      gasLimit = await client.estimateGas({
        account: from,
        to,
        value,
        data,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `Transaction gas estimation failed: ${message}. ` +
          "Ensure from/to addresses differ for empty transfers, or provide valid calldata.",
      );
    }

    const feeData = await this.getGasFeeData();
    const maxFee = BigInt(feeData.maxFeePerGas);
    const estimatedCost = gasLimit * maxFee;
    const estimatedCostCelo = Number(estimatedCost) / 1e18;

    return {
      network: "mainnet" as const,
      from,
      to,
      gasLimit: gasLimit.toString(),
      gasPrice: feeData.gasPrice,
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      estimatedCost: estimatedCost.toString(),
      estimatedCostFormatted: `${estimatedCostCelo} CELO`,
      isEip1559: feeData.eip1559,
    };
  }
}
