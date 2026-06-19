import { erc20Abi, type PublicClient } from "viem";

/** MiniPay fee currencies (USDT, USDm, USDC) — never CELO. */
export const MINIPAY_FEE_CURRENCIES = [
  { symbol: "USDT", address: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e" as const },
  { symbol: "USDm", address: "0x765de816845861e75a25fca122bb6898b8b1282a" as const },
  { symbol: "USDC", address: "0xceba9300f2b948710d2653dd7b07f33a8b32118c" as const },
] as const;

export type ResolveMiniPayFeeCurrencyOptions = {
  isMiniPay?: boolean;
  feeCurrency?: `0x${string}`;
};

/**
 * Resolve the fee currency for eth_estimateGas simulation.
 * MiniPay: highest stable balance (USDT tiebreak); no CELO fallback.
 * Other hosts: same stable heuristic, then native CELO when no stable balance.
 */
export async function resolveMiniPayFeeCurrency(
  publicClient: PublicClient,
  from: `0x${string}`,
  options?: ResolveMiniPayFeeCurrencyOptions,
): Promise<`0x${string}` | undefined> {
  if (options?.feeCurrency) {
    return options.feeCurrency;
  }

  const isMiniPay = options?.isMiniPay ?? false;

  const results = await publicClient.multicall({
    contracts: MINIPAY_FEE_CURRENCIES.map((token) => ({
      address: token.address,
      abi: erc20Abi,
      functionName: "balanceOf" as const,
      args: [from] as const,
    })),
    allowFailure: true,
  });

  let bestIndex = -1;
  let bestBalance = 0n;

  for (let i = 0; i < results.length; i++) {
    const result = results[i]!;
    if (result.status !== "success") {
      continue;
    }
    const balance = result.result as bigint;
    if (balance > bestBalance) {
      bestBalance = balance;
      bestIndex = i;
    } else if (balance === bestBalance && balance > 0n && bestIndex >= 0) {
      // USDT → USDm → USDC tiebreak (lower index wins)
      if (i < bestIndex) {
        bestIndex = i;
      }
    }
  }

  if (bestIndex >= 0 && bestBalance > 0n) {
    return MINIPAY_FEE_CURRENCIES[bestIndex]!.address;
  }

  if (isMiniPay) {
    throw new Error(
      "No stablecoin balance for gas. MiniPay requires USDT, USDm, or USDC to pay transaction fees.",
    );
  }

  return undefined;
}

/** Symbol for a known MiniPay fee currency address (for error messages). */
export function feeCurrencySymbol(address: `0x${string}` | undefined): string {
  if (!address) {
    return "CELO";
  }
  const lower = address.toLowerCase();
  const match = MINIPAY_FEE_CURRENCIES.find((t) => t.address.toLowerCase() === lower);
  if (match) {
    return match.symbol;
  }
  return address;
}
