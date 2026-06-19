# Uniswap v4

Swap tokens via Uniswap v4 on Celo mainnet (Universal Router + Permit2).

Use this when Mento FX has no route — for example `GoodDollar` → `USDT`.

For **GoodDollar ↔ USDm**, prefer the [GoodDollar reserve](gooddollar.md) via `get_swap_quote` or `get_gooddollar_reserve_quote` — Uniswap v4 pools for that pair are typically illiquid.

## Get a quote (no wallet)

```ts
const quote = await celina.uniswap.getSwapQuote("GoodDollar", "USDT", "1000");

console.log(quote.expectedOut);   // expected output amount
console.log(quote.routeHops);       // number of pools in the route
console.log(quote.indexSource);     // "subgraph" or "onchain"
console.log(quote.route.pools);     // pool keys used for routing
```

## Estimate gas

```ts
const estimate = await celina.uniswap.estimateSwap(from, "GoodDollar", "USDT", "1000");

console.log(estimate.approvalStepsNeeded); // 0–2 (ERC-20 + Permit2)
console.log(estimate.approvalGas);         // gas per approval step
console.log(estimate.swapGas);             // gas for the swap
console.log(estimate.amountOutMin);        // minimum output with slippage
```

## Prepare and sign

```ts
const flow = await celina.uniswap.prepareSwap(from, "GoodDollar", "USDT", "1000");

// May be 1 step (swap only) or up to 3 steps (approve + Permit2 + swap)
for (const step of flow.steps) {
  await sendTransactionAsync({
    to: step.to,
    data: step.data,
    value: step.value ? BigInt(step.value) : undefined,
  });
}
```

## Options

Pass optional `UniswapSwapParams` as the fifth argument:

```ts
const flow = await celina.uniswap.prepareSwap(
  from,
  "USDC",
  "USDT",
  "100",
  {
    slippageTolerance: 0.5,       // percent, default 0.5
    deadlineMinutes: 5,           // default 5
    recipient: "0xOtherAddress", // default: from
  },
);
```

| Param | Default | Description |
|-------|---------|-------------|
| `slippageTolerance` | `0.5` | Max slippage in percent |
| `deadlineMinutes` | `5` | Swap deadline from now |
| `recipient` | `from` | Address receiving output tokens |

## Routing

The SDK discovers v4 pools via the Celo v4 subgraph when available, otherwise by probing hub-token pairs on-chain (`StateView`). It quotes single- and multi-hop paths (up to two hops) with the v4 quoter and picks the best output.

Native CELO is routed through WCELO (`0x471E…`) — the user must hold WCELO, not native CELO, as swap input.

If no route exists, the SDK throws: `No Uniswap v4 route for X → Y`.

## Multi-step approval

When Permit2 is not yet set up for the input token, `prepareSwap` may return up to three steps:

1. **Approve** — ERC-20 approval for Permit2
2. **Permit2 approve** — allow Universal Router to spend via Permit2
3. **Swap** — Uniswap v4 swap execution

Wait for each step to confirm before sending the next.

## Mento FX vs Uniswap

| | Mento FX | Uniswap v4 |
|---|----------|--------------|
| Best for | Mento stables (USDm, EURm, cUSD, …) | General AMM pairs, exotic tokens |
| Pricing | Oracle-based FX | AMM pool price + LP fees |
| Typical steps | 1–2 | 1–3 |

For apps that support both, quote Mento FX and Uniswap in parallel and pick the better `expectedOut`.

Before signing, call `simulatePreparedStep` for each step — see [Prepared-step simulation](prepared-step-simulation.md).

## Related

- [Prepared-step simulation](prepared-step-simulation.md)
- [wagmi integration](wagmi-integration.md)
- [Prepared flows](../concepts/prepared-flows.md)
- [Mento FX](mento-fx.md)
- [UniswapService API](../api-reference/services/uniswap.service/classes/UniswapService.md)
