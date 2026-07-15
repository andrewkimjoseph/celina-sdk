# Send tokens

Use `celina.transaction.prepareSend` to build unsigned CELO or ERC-20 transfer flows.

## Basic send

```ts
const flow = await celina.transaction.prepareSend(
  from,           // user's wallet address
  "0xRecipient",
  "USDm",         // symbol or contract address
  "10",           // human-readable amount
);
```

Returns a single-step flow for both native CELO and ERC-20 tokens.

## CELO vs ERC-20

On Celo, CELO uses **token duality**: native balance and the GoldToken ERC-20 contract (`0x471E…`) share the same balance. `prepareSend` routes CELO through GoldToken `transfer` (same shape as USDT and other ERC-20 sends) so wallets and fee-abstraction paths handle it reliably.

| Token type | `kind` | `to` | `value` |
|------------|--------|------|---------|
| CELO | `erc20` | GoldToken (`0x471E…`) | `"0"` (amount in calldata) |
| ERC-20 (USDm, USDT, etc.) | `erc20` | token contract | `"0"` |

Token symbols are resolved via the built-in registry (`CELO`, `USDm`, `cUSD`, `cEUR`, etc.) or by contract address.

```ts
// Native CELO
await celina.transaction.prepareSend(from, to, "CELO", "1");

// ERC-20 stablecoin
await celina.transaction.prepareSend(from, to, "USDm", "50");
```

## Estimate gas first

```ts
const estimate = await celina.transaction.estimateSend(from, to, "USDm", "10");
console.log(estimate.gas); // gas units as string
```

## Sign with wagmi

```ts
const flow = await celina.transaction.prepareSend(from, to, "USDm", "10");

for (const step of flow.steps) {
  await sendTransactionAsync({
    to: step.to,
    data: step.data,
    value: step.value ? BigInt(step.value) : undefined,
  });
}
```

## Celina attribution

Transfer calldata includes Celina **ERC-8021** Schema 0 attribution. No changes needed before signing. For optional custom tags, check vs verify tools, and AA tagging, see [On-chain attribution](on-chain-attribution.md), [Configuration](../getting-started/configuration.md), and [Prepared flows](../concepts/prepared-flows.md).

Before signing, call `simulatePreparedStep` for each step — see [Prepared-step simulation](prepared-step-simulation.md).

## Related

- [Prepared-step simulation](prepared-step-simulation.md)
- [wagmi integration](wagmi-integration.md)
- [Prepared flows](../concepts/prepared-flows.md)
- [transaction API](../api-reference/services/transaction.service/classes/TransactionService.md)
