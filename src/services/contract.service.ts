import {
  type Abi,
  type AbiFunction,
  decodeFunctionResult,
  encodeFunctionData,
} from "viem";
import type { CeloClientFactory } from "../clients/celo-client.js";
import { normalizeAddress } from "../utils/normalize-address.js";

export interface ContractCallParams {
  contractAddress: `0x${string}`;
  functionName: string;
  abi: Abi;
  functionArgs?: unknown[];
  fromAddress?: `0x${string}`;
  value?: string;
}

function findAbiFunction(abi: Abi, functionName: string): AbiFunction {
  const fn = abi.find(
    (item): item is AbiFunction =>
      item.type === "function" && item.name === functionName,
  );
  if (!fn) {
    throw new Error(`Function "${functionName}" not found in ABI`);
  }
  return fn;
}

export class ContractService {
  constructor(private readonly clientFactory: CeloClientFactory) {}

  async callFunction(params: ContractCallParams) {
    const contractAddress = normalizeAddress(
      params.contractAddress,
      "contract address",
    );
    const fromAddress = params.fromAddress
      ? normalizeAddress(params.fromAddress, "from address")
      : undefined;

    const { public: client } = this.clientFactory.getClients();
    const args = params.functionArgs ?? [];

    try {
      const result = await client.readContract({
        address: contractAddress,
        abi: params.abi,
        functionName: params.functionName,
        args: args as readonly unknown[],
        ...(fromAddress ? { account: fromAddress } : {}),
      });

      return {
        network: "mainnet" as const,
        contractAddress,
        functionName: params.functionName,
        result,
        success: true,
      };
    } catch (error) {
      return {
        network: "mainnet" as const,
        contractAddress,
        functionName: params.functionName,
        result: null,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async estimateGas(params: ContractCallParams & { fromAddress: `0x${string}` }) {
    const contractAddress = normalizeAddress(
      params.contractAddress,
      "contract address",
    );
    const fromAddress = normalizeAddress(params.fromAddress, "from address");

    const { public: client } = this.clientFactory.getClients();
    const args = params.functionArgs ?? [];
    const value = params.value ? BigInt(params.value) : 0n;

    try {
      const data = encodeFunctionData({
        abi: params.abi,
        functionName: params.functionName,
        args: args as readonly unknown[],
      });

      const gasEstimate = await client.estimateGas({
        account: fromAddress,
        to: contractAddress,
        data,
        value,
      });

      const gasPrice = await client.getGasPrice();
      const totalCost = gasEstimate * gasPrice;

      return {
        network: "mainnet" as const,
        contractAddress,
        functionName: params.functionName,
        gasEstimate: gasEstimate.toString(),
        gasPrice: gasPrice.toString(),
        totalCost: totalCost.toString(),
        success: true,
      };
    } catch (error) {
      return {
        network: "mainnet" as const,
        contractAddress,
        functionName: params.functionName,
        gasEstimate: "0",
        gasPrice: "0",
        totalCost: "0",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

/** Decode raw calldata result — exported for tests. */
export function decodeContractResult(
  abi: Abi,
  functionName: string,
  data: `0x${string}`,
) {
  const fn = findAbiFunction(abi, functionName);
  return decodeFunctionResult({ abi: [fn], functionName, data });
}
