# Mento FX

Swap stablecoins via Mento FX on Celo mainnet.

**G$ ↔ USDm is not Mento FX** — use the [GoodDollar reserve](gooddollar.md) (`getReserveQuote` / `get_gooddollar_reserve_quote`) for that pair.

## Get a quote (no wallet)

```ts
const quote = await celina.mentoFx.getFxQuote("USDm", "EURm", "100");

console.log(quote.expectedOut);  // expected output amount
console.log(quote.tokenIn);      // "USDm"
console.log(quote.tokenOut);     // "EURm"
console.log(quote.routeHops);    // number of routing hops
```

## Estimate gas

```ts
const estimate = await celina.mentoFx.estimateFx(from, "USDm", "EURm", "100");

console.log(estimate.approvalNeeded);  // true if approve step required
console.log(estimate.approvalGas);     // gas for approve (if needed)
console.log(estimate.fxGas);           // gas for swap
console.log(estimate.amountOutMin);    // minimum output with slippage
```

## Prepare and sign

```ts
const flow = await celina.mentoFx.prepareFx(from, "USDm", "EURm", "100");

// May be 1 step (swap only) or 2 steps (approve + swap)
for (const step of flow.steps) {
  await sendTransactionAsync({
    to: step.to,
    data: step.data,
    value: step.value ? BigInt(step.value) : undefined,
  });
}
```

## Options

Pass optional `MentoFxParams` as the fifth argument:

```ts
const flow = await celina.mentoFx.prepareFx(
  from,
  "USDm",
  "EURm",
  "100",
  {
    slippageTolerance: 0.5,    // percent, default 0.5
    deadlineMinutes: 5,        // default 5
    recipient: "0xOtherAddress", // default: from
  },
);
```

| Param | Default | Description |
|-------|---------|-------------|
| `slippageTolerance` | `0.5` | Max slippage in percent |
| `deadlineMinutes` | `5` | Swap deadline from now |
| `recipient` | `from` | Address receiving output tokens |

## Supported pairs

Any pair with a Mento FX route on Celo mainnet. Common examples: `USDm` ↔ `EURm`, `USDm` ↔ `cUSD`, `cEUR` ↔ `EURm`.

If no route exists, the SDK throws: `No Mento FX route for X → Y`.

## Market hours

Mento FX markets can close. Quotes and prepares throw when the market is closed:

```
Mento FX market is currently closed. FX quotes and execution are unavailable until the market reopens.
```

## Multi-step approval

When the user has not approved the Mento router to spend their input token, `prepareFx` returns two steps:

1. **Approve** — ERC-20 approval for the input token
2. **Swap** — Mento FX swap execution

Wait for the approval to confirm before sending the swap transaction.

## Related

- [wagmi integration](wagmi-integration.md)
- [Prepared flows](../concepts/prepared-flows.md)
- [MentoFxService API](../api-reference/services/mento-fx.service/classes/MentoFxService.md)
