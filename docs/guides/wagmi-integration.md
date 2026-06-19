# wagmi integration

Celina SDK prepares unsigned transactions. wagmi signs and broadcasts them from the user's wallet.

## Why `sendTransactionAsync`?

Use **`sendTransactionAsync`** from `useSendTransaction()`, not `sendTransaction`. Celina prepared flows are often multi-step (approve → action), and each step needs:

- an **awaitable hash** to track progress and pass to `waitForTransactionReceipt`
- **sequential signing** — wait for confirmation before the next step
- **`try/catch`** when the user rejects in their wallet

`sendTransaction` (non-async) is callback/state-oriented and does not return a hash from the call site, so it is a poor fit for looping over `flow.steps`.

If you use viem directly (no wagmi hook), the same step shape maps to **`walletClient.sendTransaction`** — see [viem without wagmi](#viem-without-wagmi) below.

## Basic pattern

```ts
import { createCelinaClient } from "@andrewkimjoseph/celina-sdk";
import { useSendTransaction, useAccount } from "wagmi";

const celina = createCelinaClient();

async function executePreparedFlow(
  sendTransactionAsync: ReturnType<typeof useSendTransaction>["sendTransactionAsync"],
  flow: Awaited<ReturnType<typeof celina.transaction.prepareSend>>,
) {
  for (const step of flow.steps) {
    const hash = await sendTransactionAsync({
      to: step.to,
      data: step.data,
      value: step.value ? BigInt(step.value) : undefined,
    });
    // Wait for confirmation before next step in multi-step flows
    console.log(`Confirmed: ${hash}`);
  }
}
```

## React hook example

```tsx
import { createCelinaClient } from "@andrewkimjoseph/celina-sdk";
import { useSendTransaction, useAccount } from "wagmi";
import { useState } from "react";

const celina = createCelinaClient();

export function SendButton({ to, token, amount }: { to: `0x${string}`; token: string; amount: string }) {
  const { address } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const [status, setStatus] = useState<string>("");

  async function handleSend() {
    if (!address) return;

    setStatus("Preparing...");
    const flow = await celina.transaction.prepareSend(address, to, token, amount);

    setStatus(flow.summary);

    for (let i = 0; i < flow.steps.length; i++) {
      const step = flow.steps[i];
      setStatus(`Signing step ${i + 1}/${flow.steps.length}: ${step.description}`);

      await sendTransactionAsync({
        to: step.to,
        data: step.data,
        value: step.value ? BigInt(step.value) : undefined,
      });
    }

    setStatus("Done");
  }

  return (
    <button onClick={handleSend} disabled={!address}>
      Send {amount} {token}
    </button>
  );
}
```

## Multi-step flows

Some prepare methods return multiple steps (approve + action):

| Method | Steps when approval needed |
|--------|---------------------------|
| `mentoFx.prepareFx` | approve → swap |
| `uniswap.prepareSwap` | approve → Permit2 approve → swap |
| `aave.prepareSupply` | approve → supply |

**Sign steps in order.** Wait for each transaction to confirm before sending the next — the swap/supply will fail if the approval is not yet mined.

Simulate each step immediately before signing to avoid gas spent on reverts. See [Prepared-step simulation](prepared-step-simulation.md).

```ts
import { simulatePreparedStep } from "@andrewkimjoseph/celina-sdk/simulation";
import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "./wagmi-config";

for (const step of flow.steps) {
  await simulatePreparedStep(publicClient, {
    account: address,
    step,
  });

  const hash = await sendTransactionAsync({
    to: step.to,
    data: step.data,
    value: step.value ? BigInt(step.value) : undefined,
  });
  const receipt = await waitForTransactionReceipt(config, { hash });
  if (receipt.status === "reverted") {
    throw new Error(`Transaction reverted: ${hash}`);
  }
}
```

## Estimates before prepare

Use estimate methods to show gas costs before the user commits:

```ts
const estimate = await celina.transaction.estimateSend(from, to, "USDm", "10");
console.log(`Estimated gas: ${estimate.gas}`);

const fxEstimate = await celina.mentoFx.estimateFx(from, "USDm", "EURm", "100");
console.log(`Approval needed: ${fxEstimate.approvalNeeded}`);

const swapEstimate = await celina.uniswap.estimateSwap(from, "USDC", "USDT", "100");
console.log(`Approval steps: ${swapEstimate.approvalStepsNeeded}`);
```

## Error handling

- **User rejects signature** — wagmi throws; catch and show a friendly message.
- **Insufficient balance** — prepare methods may throw during balance checks; `simulatePreparedStep` catches reverts before the wallet opens.
- **Wrong `from` address** — always pass the connected wallet address as `from`.

```ts
try {
  const flow = await celina.aave.prepareSupply(address, "USDm", "100");
  await executePreparedFlow(sendTransactionAsync, flow);
} catch (error) {
  if (error instanceof Error) {
    setStatus(error.message);
  }
}
```

## viem without wagmi

If you use viem directly with a wallet client:

```ts
import { createWalletClient, custom } from "viem";
import { celo } from "viem/chains";

const walletClient = createWalletClient({
  chain: celo,
  transport: custom(window.ethereum),
});

for (const step of flow.steps) {
  await walletClient.sendTransaction({
    account: flow.from,
    to: step.to,
    data: step.data,
    value: step.value ? BigInt(step.value) : undefined,
  });
}
```

## Related guides

- [Send tokens](send-tokens.md)
- [Mento FX](mento-fx.md)
- [Uniswap v4](uniswap.md)
- [Aave](aave.md)
- [Prepared flows](../concepts/prepared-flows.md)
- [Prepared-step simulation](prepared-step-simulation.md)
