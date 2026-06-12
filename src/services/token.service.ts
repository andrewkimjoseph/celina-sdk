/**
 * Token registry lookups and balance reads on Celo mainnet.
 */
import { erc20Abi, formatUnits, parseUnits } from "viem";
import {
  findKnownToken,
  KNOWN_TOKEN_SYMBOLS,
  resolveStablecoins,
  suggestKnownTokens,
} from "../config/chains.js";
import type { CeloClientFactory } from "../clients/celo-client.js";
import { normalizeAddress } from "../utils/normalize-address.js";

/** Resolved Celo mainnet registry token (symbol, address, decimals). */
export interface ResolvedToken {
  /** Registry address, or `"native"` for CELO. */
  address: `0x${string}` | "native";
  /** Canonical registry symbol (e.g. `USDm`, `GoodDollar`). */
  symbol: string;
  /** Token decimals for amount parsing. */
  decimals: number;
}

/** Celo mainnet token registry lookups and balance reads. */
export class TokenService {
  constructor(private readonly clientFactory: CeloClientFactory) {}

  /**
   * Resolve a Celo mainnet registry token by symbol, alias, or registry address.
   * @throws If the token is not in the Celo registry
   */
  resolveToken(token: string): ResolvedToken {
    const known = findKnownToken(token.trim());
    if (!known) {
      const suggestions = suggestKnownTokens(token);
      if (suggestions.length > 0) {
        throw new Error(
          `Unknown token "${token}" on Celo mainnet. Did you mean ${suggestions.map((entry) => entry.symbol).join(", ")}?`,
        );
      }

      throw new Error(
        `Unknown token "${token}" on Celo mainnet. Use ${KNOWN_TOKEN_SYMBOLS.join(", ")}.`,
      );
    }

    return {
      address: known.address,
      symbol: known.symbol,
      decimals: known.decimals,
    };
  }

  /** Fetch registry token metadata on Celo mainnet. */
  async getTokenInfo(token: string) {
    const resolved = this.resolveToken(token);

    return {
      network: "mainnet" as const,
      address: resolved.address,
      name: resolved.address === "native" ? "Celo" : resolved.symbol,
      symbol: resolved.symbol,
      decimals: resolved.decimals,
    };
  }

  /** CELO and ERC-20 balances for registry tokens (defaults: CELO, USDm). */
  async getBalances(
    address: `0x${string}`,
    tokens: string[] = ["CELO", "USDm"],
  ) {
    const { public: client } = this.clientFactory.getClients();

    const balances = await Promise.all(
      tokens.map(async (tokenInput) => {
        const token = this.resolveToken(tokenInput);

        if (token.address === "native") {
          const balance = await client.getBalance({ address });
          return {
            token: token.symbol,
            address: "native" as const,
            raw: balance.toString(),
            formatted: formatUnits(balance, token.decimals),
          };
        }

        const balance = await client.readContract({
          address: token.address,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [address],
        });

        return {
          token: token.symbol,
          address: token.address,
          raw: balance.toString(),
          formatted: formatUnits(balance, token.decimals),
        };
      }),
    );

    return { network: "mainnet" as const, address, balances };
  }

  /**
   * Scan fiat-pegged registry stablecoins for an address; omits zero balances by default.
   * GoodDollar and WETH are excluded — use `getTokenBalance` or GoodDollar tools.
   * @param address - Wallet to scan
   * @param options.stablecoins - Subset of registry symbols to check
   * @param options.includeZero - Include tokens with zero balance
   */
  async getStablecoinBalances(
    address: `0x${string}`,
    options?: {
      stablecoins?: string[];
      includeZero?: boolean;
    },
  ) {
    const coins = resolveStablecoins(options?.stablecoins);
    const { public: client } = this.clientFactory.getClients();

    const results = await client.multicall({
      contracts: coins.map((coin) => ({
        address: coin.address,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address],
      })),
      allowFailure: true,
    });

    const balances = coins.map((coin, index) => {
      const result = results[index];

      if (result.status === "failure") {
        return {
          symbol: coin.symbol,
          address: coin.address,
          issuer: coin.issuer,
          useCase: coin.useCase,
          raw: "0",
          formatted: "0",
          readError: true,
        };
      }

      const raw = result.result as bigint;
      return {
        symbol: coin.symbol,
        address: coin.address,
        issuer: coin.issuer,
        useCase: coin.useCase,
        raw: raw.toString(),
        formatted: formatUnits(raw, coin.decimals),
      };
    });

    const stablecoins = options?.includeZero
      ? balances
      : balances.filter((balance) => balance.raw !== "0");

    return {
      network: "mainnet",
      address,
      totalChecked: coins.length,
      stablecoins,
    };
  }

  /** Balance for a Celo mainnet registry token (symbol or registry address). */
  async getTokenBalance(token: string, accountAddress: `0x${string}`) {
    const resolved = this.resolveToken(token);
    const account = normalizeAddress(accountAddress, "account address");
    const { public: client } = this.clientFactory.getClients();

    if (resolved.address === "native") {
      const balance = await client.getBalance({ address: account });
      return {
        network: "mainnet" as const,
        tokenAddress: "native" as const,
        accountAddress: account,
        name: "Celo",
        symbol: "CELO",
        decimals: resolved.decimals,
        raw: balance.toString(),
        formatted: formatUnits(balance, resolved.decimals),
      };
    }

    const balance = await client.readContract({
      address: resolved.address,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [account],
    });

    return {
      network: "mainnet" as const,
      tokenAddress: resolved.address,
      accountAddress: account,
      name: resolved.symbol,
      symbol: resolved.symbol,
      decimals: resolved.decimals,
      raw: balance.toString(),
      formatted: formatUnits(balance, resolved.decimals),
    };
  }

  /**
   * Parse a human-readable amount string to base units for the given decimals.
   * @param amount - Decimal string (e.g. `"10"` or `"0.05"`)
   * @param decimals - Token decimals from `resolveToken`
   */
  parseAmount(amount: string, decimals: number): bigint {
    return parseUnits(amount, decimals);
  }

  /**
   * Ensure `owner` holds at least `amount` of the input token before swap/route work.
   * @param spendToken - ERC-20 to check (defaults to registry address; use WCELO when swapping native CELO)
   */
  async assertSpendableBalance(
    owner: `0x${string}`,
    resolved: ResolvedToken,
    amount: string,
    options?: {
      spendToken?: `0x${string}` | "native";
      hint?: string;
    },
  ): Promise<void> {
    const { public: client } = this.clientFactory.getClients();
    const required = this.parseAmount(amount, resolved.decimals);
    const spend = options?.spendToken ?? resolved.address;

    const balance =
      spend === "native"
        ? await client.getBalance({ address: owner })
        : await client.readContract({
            address: spend,
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [owner],
          });

    if (balance < required) {
      const available = formatUnits(balance, resolved.decimals);
      throw new Error(
        `Insufficient ${resolved.symbol} balance. Required ${amount} ${resolved.symbol}, available ${available}.${options?.hint ?? ""}`,
      );
    }
  }
}
