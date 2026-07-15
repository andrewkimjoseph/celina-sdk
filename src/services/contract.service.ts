/**
 * Generic contract reads, gas estimates, and write prepares — caller supplies the ABI.
 */
import {
  type Abi,
  type AbiFunction,
  decodeFunctionResult,
  encodeFunctionData,
} from "viem";
import type { CeloClientFactory } from "../clients/celo-client.js";
import { CHAIN } from "../config/chains.js";
import { appendCelinaCalldataTag } from "../config/celina-tag.js";
import { normalizeAddress } from "../utils/normalize-address.js";
import {
  type PreparedFlow,
  serializePreparedFlow,
  type SerializedPreparedFlow,
} from "../types/prepared.js";

/** Parameters for a contract call on Celo mainnet (read, estimate, or prepare write). */
export interface ContractCallParams {
  /** Target contract address. */
  contractAddress: `0x${string}`;
  /** ABI function name to invoke. */
  functionName: string;
  /** Contract ABI JSON (must include `functionName`). */
  abi: Abi;
  /** Positional arguments for the function (default `[]`). */
  functionArgs?: unknown[];
  /** Optional `msg.sender` for state-dependent view calls. */
  fromAddress?: `0x${string}`;
  /** Wei value as decimal string for payable calls (default `"0"`). */
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

function assertWritableFunction(fn: AbiFunction, functionName: string): void {
  const mutability = fn.stateMutability;
  if (mutability === "view" || mutability === "pure") {
    throw new Error(
      `Function "${functionName}" is ${mutability}; use call_contract_function for reads`,
    );
  }
}

/** Read, gas-estimate, and prepare helpers for arbitrary contracts. */
export class ContractService {
  private readonly attributionTags?: string[];

  constructor(private readonly clientFactory: CeloClientFactory) {
    this.attributionTags = clientFactory.getConfig().attributionTags;
  }

  /**
   * Simulate a read-only contract call (`eth_call`).
   * @param params - Contract address, ABI, function name, and optional args
   * @returns Decoded result on success; `{ success: false, error }` on revert
   */
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

  /**
   * Estimate gas for a contract call from `fromAddress`.
   * @param params - Same as `callFunction` plus required `fromAddress`
   * @returns Gas estimate, current gas price, and total cost in wei
   */
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

  /**
   * Build an unsigned single-step flow for a contract write (caller ABI).
   * Calldata includes the CELINA attribution suffix. Rejects `view`/`pure` ABI entries.
   * @param from - Sender wallet address (must match connected wallet when signing)
   * @param params - Contract address, ABI, function name, optional args and wei `value`
   * @returns Single-step `SerializedPreparedFlow` for wagmi or MCP `executePreparedFlow`
   */
  async prepareFunction(
    from: `0x${string}`,
    params: ContractCallParams,
  ): Promise<SerializedPreparedFlow> {
    const contractAddress = normalizeAddress(
      params.contractAddress,
      "contract address",
    );
    const sender = normalizeAddress(from, "from address");
    const fn = findAbiFunction(params.abi, params.functionName);
    assertWritableFunction(fn, params.functionName);

    const args = params.functionArgs ?? [];
    const value = params.value ?? "0";
    const data = appendCelinaCalldataTag(
      encodeFunctionData({
        abi: params.abi,
        functionName: params.functionName,
        args: args as readonly unknown[],
      }),
      this.attributionTags,
    );

    const flow: PreparedFlow = {
      chainId: CHAIN.id,
      from: sender,
      summary: `Call ${params.functionName} on ${contractAddress}`,
      steps: [
        {
          kind: "contract",
          to: contractAddress,
          data,
          value,
          description: `Call ${params.functionName}`,
        },
      ],
    };

    return serializePreparedFlow(flow);
  }
}

/**
 * Decode raw calldata result bytes using a single ABI function entry.
 * @param abi - Contract ABI containing `functionName`
 * @param functionName - Function whose return types define decoding
 * @param data - Hex return data from `eth_call`
 */
export function decodeContractResult(
  abi: Abi,
  functionName: string,
  data: `0x${string}`,
) {
  const fn = findAbiFunction(abi, functionName);
  return decodeFunctionResult({ abi: [fn], functionName, data });
}
