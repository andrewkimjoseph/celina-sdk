# Prepared-step simulation

Simulate each prepared transaction step against current chain state **immediately before** the wallet signs and broadcasts it. If simulation throws, the transaction would likely revert on-chain — do not open the wallet.

Import from `@andrewkimjoseph/celina-sdk/simulation` (browser-safe; no Node analytics).

## When to simulate

| Timing | Correct? | Why |
|--------|----------|-----|
| Inside `prepare*` at build time | No | Chain state changes before the user confirms; multi-step flows need prior steps mined first |
| Right before each `sendTransactionAsync` | Yes | Uses latest state; catches reverts before gas is spent |
| After mining only | Partial | `receipt.status === 'success'` is still required, but gas is already spent on reverts |

For approve → action flows (Aave supply, Mento FX, Uniswap):

1. Simulate and send step 1 (approve)
2. Wait for confirmation
3. Simulate and send step 2 (supply/swap) — simulating step 2 before step 1 mines falsely fails with insufficient allowance

## Basic usage

```ts
import { simulatePreparedStep } from "@andrewkimjoseph/celina-sdk/simulation";
import { useSendTransaction, usePublicClient } from "wagmi";

const { sendTransactionAsync } = useSendTransaction();
const publicClient = usePublicClient(); // viem PublicClient — or createPublicClient in non-wagmi apps

for (const step of flow.steps) {
  await simulatePreparedStep(publicClient!, {
    account: address,
    step,
  });

  const hash = await sendTransactionAsync({
    to: step.to,
    data: step.data,
    value: step.value ? BigInt(step.value) : undefined,
  });

  const receipt = await publicClient!.waitForTransactionReceipt({ hash });
  if (receipt.status === "reverted") {
    throw new Error(`Transaction reverted: ${hash}`);
  }
}
```

## Celo fee abstraction (optional)

Hosts that pay gas in an ERC-20 (fee abstraction wallets) can pass `feeCurrency` — the SDK does **not** resolve which token to use:

```ts
await simulatePreparedStep(
  publicClient,
  { account: address, step },
  { feeCurrency: hostResolvedFeeCurrency },
);
```

When `feeCurrency` is set, simulation uses `estimateGas` (Celo nodes model fee-abstraction gas accounting). Otherwise it uses `publicClient.call`.

Wallet-specific logic (MiniPay detection, gas buffer when spend token equals fee token) belongs in your app, not in the SDK.

## Layered approach

1. **Prepare-time checks** — `prepare*` methods and `estimate*` catch obvious issues early (balance, quotes)
2. **Sign-time simulation** — `simulatePreparedStep` before each send (this guide)
3. **Post-mine receipt check** — safety net if simulation missed an edge case

## MCP server

Local stdio MCP with `CELO_PRIVATE_KEY` calls the same helper in `executePreparedFlow` before `wallet.sendTransaction`. No `feeCurrency` — the server wallet pays CELO gas.

## Related

- [wagmi integration](wagmi-integration.md)
- [Prepared flows](../concepts/prepared-flows.md)
