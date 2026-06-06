# Quick start

## 1. Create a client

```ts
import { createCelinaClient } from "@andrewkimjoseph/celina-sdk";

const celina = createCelinaClient({
  rpcUrl: "https://forno.celo.org",
  ethRpcUrl: "https://ethereum.publicnode.com", // optional, for ENS
});
```

## 2. Read on-chain data

```ts
// Stablecoin balances for an address
const balances = await celina.token.getStablecoinBalances("0xYourAddress");

// Mento FX quote (no wallet needed)
const quote = await celina.mentoFx.getFxQuote("USDm", "EURm", "100");

// Uniswap v4 quote (no wallet needed)
const swapQuote = await celina.uniswap.getSwapQuote("USDC", "USDT", "100");

// GoodDollar reserve quote — G$ ↔ USDm (no wallet needed)
const reserveQuote = await celina.gooddollar.getReserveQuote("GoodDollar", "USDm", "1000");
```

## 3. Prepare an unsigned transaction

```ts
const flow = await celina.transaction.prepareSend(
  "0xFromAddress",
  "0xToAddress",
  "USDm",
  "10",
);

console.log(flow.summary);
// "Send 10 USDm to 0xToAddress"

console.log(flow.steps.length);
// 1 (single ERC-20 transfer)
```

## 4. Sign with wagmi

Pass each step to wagmi's `sendTransactionAsync`:

```ts
import { useSendTransaction } from "wagmi";

const { sendTransactionAsync } = useSendTransaction();

for (const step of flow.steps) {
  await sendTransactionAsync({
    to: step.to,
    data: step.data,
    value: step.value ? BigInt(step.value) : undefined,
  });
}
```

See [wagmi integration](../guides/wagmi-integration.md) for error handling, multi-step flows, and React patterns.

## Next steps

- [Configuration](configuration.md) — RPC URLs and client options
- [Prepared flows](../concepts/prepared-flows.md) — flow shape and step fields
- [Send tokens](../guides/send-tokens.md) — CELO vs ERC-20 sends
