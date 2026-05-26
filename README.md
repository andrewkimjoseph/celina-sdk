# Celina SDK

Celina-linked mainnet library for frontend apps: **reads** and **unsigned transaction preparation** (no private keys).

Pair with [wagmi](https://wagmi.sh) / viem in the browser — users sign prepared transactions in their wallet.

## Install

```bash
npm i @andrewkimjoseph/celina-sdk
```

Requires Node.js ≥ 20.

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

// Prepare unsigned txs (user signs in wallet)
const flow = await celina.transaction.prepareSend(
  "0xFrom",
  "0xTo",
  "USDm",
  "10",
);
// flow.steps → pass to wagmi sendTransaction
```

## API

| Service | Reads | Prepare (unsigned) |
|---------|-------|---------------------|
| `blockchain` | network status, blocks, transactions | — |
| `account` | CELO balance, nonce | — |
| `token` | balances, token info, stablecoins | — |
| `ens` | resolve ENS names | — |
| `gooddollar` | whitelist status | — |
| `transaction` | `estimateSend(from, …)` | `prepareSend(from, …)` |
| `mentoFx` | `getFxQuote`, `estimateFx(from, …)` | `prepareFx(from, …)` |
| `aave` | — | `prepareSupply(from, …)`, `prepareWithdraw(from, …)` |

Prepared flows return `{ preparedFlow: true, steps, summary, from, network }` with JSON-safe `value` strings.

## For developers

### Architecture

`createCelinaClient()` wires `CeloClientFactory` and `EnsClientFactory` into domain services. The SDK never holds or uses private keys — it only performs public RPC reads and builds unsigned transaction payloads for a caller-supplied `from` address.

Consumers (e.g. [celina-agent](../celina-agent)) pass prepared `steps` to wagmi/viem for wallet signing.

### Directory map

| Path | Purpose |
|------|---------|
| `src/index.ts` | Public entry — `createCelinaClient()` and type exports |
| `src/clients/` | viem public clients (Celo + Ethereum for ENS) |
| `src/config/` | Token registry (`chains.ts`), Aave/GoodDollar constants |
| `src/services/` | Domain logic — reads and `prepare*` methods |
| `src/types/prepared.ts` | `SerializedPreparedFlow` contract for chat/API consumers |
| `src/utils/` | Shared helpers (allowance simulation, formatting) |

### Prepared flow contract

`prepareSend`, `prepareFx`, `prepareSupply`, and `prepareWithdraw` return:

```ts
{
  preparedFlow: true,
  steps: PreparedTx[],   // ordered txs for wagmi sendTransaction
  summary: string,       // human-readable label for UI
  from: `0x${string}`,
  network: "mainnet",
}
```

Each `PreparedTx` has `kind`, `to`, optional `data`, optional `value` (wei as decimal string for JSON), and `description`. Multi-step flows (e.g. ERC-20 approve + swap) appear as multiple steps in order.

### Adding a service

1. Create `src/services/my-feature.service.ts` accepting `CeloClientFactory` in the constructor.
2. Register the instance in `src/index.ts` on `CelinaClient`.
3. Export public types from `src/index.ts` if needed by consumers.
4. Run `npm run build` and bump the package version before publishing.

### Publishing

```bash
npm version patch   # or minor/major — cannot republish an existing version
npm publish --access public
```

## Related packages

- [`@andrewkimjoseph/celina-mcp`](https://www.npmjs.com/package/@andrewkimjoseph/celina-mcp) — MCP server for IDE/CLI agents (server-key writes + Self Agent ID)
- [`@selfxyz/agent-sdk`](https://www.npmjs.com/package/@selfxyz/agent-sdk) — Self Agent ID (separate from this SDK)

## License

MIT
