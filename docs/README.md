# Celina SDK

Celina-linked mainnet library for frontend apps: **reads** and **unsigned transaction preparation** (no private keys).

Pair with [wagmi](https://wagmi.sh) / viem in the browser — users sign prepared transactions in their wallet.

## What you can do

| Category | Examples |
|----------|----------|
| **Reads** | Token balances, Mento FX quotes, Uniswap v4 quotes, governance proposals, ENS resolution, Carbon DeFi strategies/pairs/stats |
| **Estimates** | Gas for sends, FX swaps, Uniswap swaps, generic contract calls |
| **Prepare** | Unsigned tx flows for sends, Mento FX, Uniswap v4, Aave supply/withdraw, Carbon strategies and taker trades |

The SDK never holds or uses private keys. Call `prepare*` methods with the user's wallet address, then pass the returned `steps` to wagmi for signing.

## Quick start

```ts
import { createCelinaClient } from "@andrewkimjoseph/celina-sdk";

const celina = createCelinaClient({
  rpcUrl: "https://forno.celo.org",
  ethRpcUrl: "https://ethereum.publicnode.com", // optional, for ENS
});

// Reads
await celina.token.getStablecoinBalances("0xYourAddress");
await celina.mentoFx.getFxQuote("USDm", "EURm", "100");
await celina.uniswap.getSwapQuote("USDC", "USDT", "100");

// Prepare unsigned txs (user signs in wallet)
const flow = await celina.transaction.prepareSend(
  "0xFrom",
  "0xTo",
  "USDm",
  "10",
);
// flow.steps → pass to wagmi sendTransaction
```

See [Quick start](getting-started/quick-start.md) and [wagmi integration](guides/wagmi-integration.md) for the full signing flow.

## API overview

| Service | Reads | Prepare (unsigned) |
|---------|-------|---------------------|
| `blockchain` | network status, blocks, transactions | — |
| `account` | CELO balance, nonce | — |
| `token` | balances, token info, stablecoins | — |
| `ens` | resolve ENS names | — |
| `gooddollar` | whitelist status | — |
| `transaction` | gas fees, estimates | `prepareSend` |
| `mentoFx` | `getFxQuote`, `estimateFx` | `prepareFx` |
| `uniswap` | `getSwapQuote`, `estimateSwap` | `prepareSwap` |
| `aave` | — | `prepareSupply`, `prepareWithdraw` |
| `governance` | proposals list, details | — |
| `staking` | balances, validator groups | — |
| `nft` | NFT info, balance | — |
| `contract` | `callFunction`, `estimateGas` | — |
| `carbon` | strategies, pair explore, quotes, simulation, help | `prepareLimitOrder`, `prepareRecurringStrategy`, `prepareTrade`, and 10 more — see [Carbon guide](guides/carbon.md) |

Full method signatures are in [API reference](api-reference/README.md).

## Related packages

- [`@andrewkimjoseph/celina-mcp`](https://www.npmjs.com/package/@andrewkimjoseph/celina-mcp) — MCP server for IDE/CLI agents (server-key writes + Self Agent ID)
- [`@selfxyz/agent-sdk`](https://www.npmjs.com/package/@selfxyz/agent-sdk) — Self Agent ID (separate from this SDK)
