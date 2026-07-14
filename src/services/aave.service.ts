/** Aave V3 on Celo: prepareSupply and prepareWithdraw return multi-step flows (approve + pool call). */
import { encodeFunctionData, erc20Abi, formatUnits } from "viem";
import { aavePoolAbi } from "../abis/aave-pool.js";
import type { CeloClientFactory, CeloClients } from "../clients/celo-client.js";
import {
  AAVE_ASSETS,
  AAVE_POOL,
  resolveAaveAsset,
  type AaveAsset,
} from "../config/aave.js";
import { appendCelinaCalldataTag } from "../config/celina-tag.js";
import {
  type PreparedFlow,
  type PreparedTx,
  serializePreparedFlow,
  type SerializedPreparedFlow,
} from "../types/prepared.js";
import { CHAIN } from "../config/chains.js";
import { TokenService } from "./token.service.js";

/** Aave V3 supplied balance reads and supply/withdraw prepared flows on Celo mainnet. */
export class AaveService {
  private readonly tokenService: TokenService;
  private readonly attributionTags?: string[];

  constructor(private readonly clientFactory: CeloClientFactory) {
    this.tokenService = new TokenService(clientFactory);
    this.attributionTags = clientFactory.getConfig().attributionTags;
  }

  private getPublicClient() {
    return this.clientFactory.getClients().public;
  }

  private async assertUnderlyingBalance(
    asset: AaveAsset,
    publicClient: CeloClients["public"],
    owner: `0x${string}`,
    amount: string,
  ) {
    const token = this.tokenService.resolveToken(asset.symbol);
    const required = this.tokenService.parseAmount(amount, token.decimals);

    const balance = await publicClient.readContract({
      address: asset.underlying,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [owner],
    });

    if (balance < required) {
      const celoHint =
        asset.symbol === "CELO"
          ? " Aave requires wrapped CELO (ERC-20), not native CELO."
          : "";
      throw new Error(
        `Insufficient ${asset.symbol} balance. Required ${amount} ${asset.symbol}, available ${balance.toString()} raw units.${celoHint}`,
      );
    }
  }

  private async readATokenBalance(
    asset: AaveAsset,
    publicClient: CeloClients["public"],
    owner: `0x${string}`,
  ): Promise<bigint> {
    return publicClient.readContract({
      address: asset.aToken,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [owner],
    });
  }

  private async assertATokenBalance(
    asset: AaveAsset,
    publicClient: CeloClients["public"],
    owner: `0x${string}`,
    amount: string,
  ) {
    const token = this.tokenService.resolveToken(asset.symbol);
    const required = this.tokenService.parseAmount(amount, token.decimals);

    const balance = await this.readATokenBalance(asset, publicClient, owner);

    if (balance < required) {
      throw new Error(
        `Insufficient Aave ${asset.symbol} supply balance. Required ${amount} ${asset.symbol}, available ${formatUnits(balance, token.decimals)} ${asset.symbol}.`,
      );
    }
  }

  /**
   * Supplied Aave V3 positions (aToken balances) for an address on Celo mainnet.
   * Amounts are in underlying token units including accrued interest.
   */
  async getBalances(
    address: `0x${string}`,
    options?: {
      tokens?: string[];
      includeZero?: boolean;
    },
  ) {
    const assets = options?.tokens
      ? options.tokens.map((token) => resolveAaveAsset(token))
      : Object.values(AAVE_ASSETS);

    const { public: client } = this.clientFactory.getClients();

    const results = await client.multicall({
      contracts: assets.map((asset) => ({
        address: asset.aToken,
        abi: erc20Abi,
        functionName: "balanceOf" as const,
        args: [address] as const,
      })),
      allowFailure: true,
    });

    const balances = assets.map((asset, index) => {
      const result = results[index];
      const token = this.tokenService.resolveToken(asset.symbol);

      if (result.status === "failure") {
        return {
          symbol: asset.symbol,
          underlying: asset.underlying,
          aToken: asset.aToken,
          raw: "0",
          formatted: "0",
          readError: true as const,
        };
      }

      const raw = result.result as bigint;
      return {
        symbol: asset.symbol,
        underlying: asset.underlying,
        aToken: asset.aToken,
        raw: raw.toString(),
        formatted: formatUnits(raw, token.decimals),
      };
    });

    const filtered = options?.includeZero
      ? balances
      : balances.filter((balance) => balance.raw !== "0");

    return {
      network: "mainnet" as const,
      address,
      market: AAVE_POOL,
      totalChecked: assets.length,
      balances: filtered,
    };
  }

  private async needsApproval(
    underlying: `0x${string}`,
    from: `0x${string}`,
    amountWei: bigint,
  ): Promise<boolean> {
    const publicClient = this.getPublicClient();
    const allowance = await publicClient.readContract({
      address: underlying,
      abi: erc20Abi,
      functionName: "allowance",
      args: [from, AAVE_POOL],
    });
    return allowance < amountWei;
  }

  /**
   * Build unsigned Aave V3 supply steps (approve + supply when needed).
   * @param from - Supplier wallet address
   * @param token - Aave asset symbol (e.g. `USDm`, `USDC`); `CELO` uses wrapped CELO (WCELO)
   * @param amount - Human-readable supply amount
   * @returns 1–2 step `SerializedPreparedFlow`; CELO must be wrapped ERC-20, not native
   */
  async prepareSupply(
    from: `0x${string}`,
    token: string,
    amount: string,
  ): Promise<SerializedPreparedFlow> {
    const asset = resolveAaveAsset(token);
    const publicClient = this.getPublicClient();

    await this.assertUnderlyingBalance(asset, publicClient, from, amount);

    const resolved = this.tokenService.resolveToken(asset.symbol);
    const amountWei = this.tokenService.parseAmount(amount, resolved.decimals);
    const steps: PreparedTx[] = [];

    if (await this.needsApproval(asset.underlying, from, amountWei)) {
      const approveData = appendCelinaCalldataTag(
        encodeFunctionData({
          abi: erc20Abi,
          functionName: "approve",
          args: [AAVE_POOL, amountWei],
        }),
        this.attributionTags,
      );
      steps.push({
        kind: "erc20",
        to: asset.underlying,
        data: approveData,
        value: "0",
        description: `Approve ${amount} ${asset.symbol} for Aave`,
      });
    }

    const supplyData = appendCelinaCalldataTag(
      encodeFunctionData({
        abi: aavePoolAbi,
        functionName: "supply",
        args: [asset.underlying, amountWei, from, 0],
      }),
      this.attributionTags,
    );

    steps.push({
      kind: "contract",
      to: AAVE_POOL,
      data: supplyData,
      value: "0",
      description: `Supply ${amount} ${asset.symbol} to Aave V3`,
    });

    const flow: PreparedFlow = {
      chainId: CHAIN.id,
      from,
      summary: `Supply ${amount} ${asset.symbol} to Aave V3 on Celo`,
      steps,
    };

    return serializePreparedFlow(flow);
  }

  /**
   * Build unsigned Aave V3 withdraw step on Celo.
   * @param from - Withdrawer wallet address
   * @param token - Aave asset symbol
   * @param amount - Human-readable withdraw amount (omit when using `withdrawMax`)
   * @param withdrawMax - When true, withdraws full supplied aToken balance
   * @returns Single-step `SerializedPreparedFlow`
   */
  async prepareWithdraw(
    from: `0x${string}`,
    token: string,
    amount: string | undefined,
    withdrawMax?: boolean,
  ): Promise<SerializedPreparedFlow> {
    const asset = resolveAaveAsset(token);
    const publicClient = this.getPublicClient();

    if (!withdrawMax && !amount) {
      throw new Error("Provide amount or set withdrawMax to true.");
    }

    if (!withdrawMax && amount) {
      await this.assertATokenBalance(asset, publicClient, from, amount);
    }

    const resolved = this.tokenService.resolveToken(asset.symbol);
    const amountWei = withdrawMax
      ? await this.readATokenBalance(asset, publicClient, from)
      : this.tokenService.parseAmount(amount!, resolved.decimals);

    if (amountWei === 0n) {
      throw new Error(`No supplied ${asset.symbol} balance to withdraw.`);
    }

    const withdrawData = appendCelinaCalldataTag(
      encodeFunctionData({
        abi: aavePoolAbi,
        functionName: "withdraw",
        args: [asset.underlying, amountWei, from],
      }),
      this.attributionTags,
    );

    const amountLabel = withdrawMax ? "max" : amount!;
    const flow: PreparedFlow = {
      chainId: CHAIN.id,
      from,
      summary: `Withdraw ${amountLabel} ${asset.symbol} from Aave V3 on Celo`,
      steps: [
        {
          kind: "contract",
          to: AAVE_POOL,
          data: withdrawData,
          value: "0",
          description: `Withdraw ${amountLabel} ${asset.symbol} from Aave`,
        },
      ],
    };

    return serializePreparedFlow(flow);
  }
}
