# Aave on Celo

Supply and withdraw assets on Aave V3 via unsigned transaction flows.

## Supply

```ts
const flow = await celina.aave.prepareSupply(from, "USDm", "100");
```

Returns 1–2 steps:

1. **Approve** (if allowance insufficient) — approve Aave pool to spend underlying
2. **Supply** — deposit into Aave V3

```ts
for (const step of flow.steps) {
  await sendTransactionAsync({
    to: step.to,
    data: step.data,
    value: step.value ? BigInt(step.value) : undefined,
  });
}
```

## Withdraw

Partial withdraw:

```ts
const flow = await celina.aave.prepareWithdraw(from, "USDm", "50");
```

Withdraw full supplied balance:

```ts
const flow = await celina.aave.prepareWithdraw(from, "USDm", undefined, true);
// or
const flow = await celina.aave.prepareWithdraw(from, "USDm", undefined, /* withdrawMax */ true);
```

Withdraw returns a single step (no approval needed).

## Supported assets

Assets are resolved by symbol via the Aave config on Celo. Common tokens include `USDm`, `USDC`, `USDT`, and wrapped `CELO`.

Use `resolveToken` symbols from the token registry — see [TokenService](../api-reference/services/token.service/classes/TokenService.md).

## Important: CELO must be wrapped

Aave on Celo uses **wrapped CELO (ERC-20)**, not native CELO. If the user holds native CELO, they must wrap it first. Supplying native CELO will fail with:

```
Insufficient CELO balance. ... Aave requires wrapped CELO (ERC-20), not native CELO.
```

## Balance checks

`prepareSupply` checks underlying token balance before building steps. `prepareWithdraw` checks aToken balance for partial withdraws.

## Multi-step supply

When allowance is insufficient, supply flows include an approve step first. Wait for approval confirmation before sending the supply transaction — same pattern as [Mento FX](mento-fx.md).

## Related

- [wagmi integration](wagmi-integration.md)
- [Prepared flows](../concepts/prepared-flows.md)
- [AaveService API](../api-reference/services/aave.service/classes/AaveService.md)
