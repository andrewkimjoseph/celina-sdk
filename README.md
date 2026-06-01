# Celina SDK

Celina-linked mainnet library for frontend apps: **reads** and **unsigned transaction preparation** (no private keys).

Pair with [wagmi](https://wagmi.sh) / viem — users sign prepared transactions in their wallet.

## Install

```bash
npm i @andrewkimjoseph/celina-sdk
```

Requires Node.js ≥ 20.

## Documentation

**Full docs:** [celina-sdk on GitBook](https://andrewkimjoseph.gitbook.io/celina-sdk)

- [Quick start](https://andrewkimjoseph.gitbook.io/celina-sdk/getting-started/quick-start)
- [wagmi integration](https://andrewkimjoseph.gitbook.io/celina-sdk/guides/wagmi-integration)
- [Carbon DeFi on Celo](docs/guides/carbon.md) — hybrid Carbon REST + `@bancor/carbon-sdk` (25 operations)
- [Self Agent ID](docs/guides/self-agent-id.md) — verify, register, and refresh human-backed agents on Celo
- [Telemetry](docs/guides/telemetry.md) — optional Amplitude read metrics (opt out with `CELINA_ANALYTICS_DISABLED=1`)
- [API reference](https://andrewkimjoseph.gitbook.io/celina-sdk/api-reference)

Docs source lives in [`docs/`](docs/) in this repository.

## Quick example

```ts
import { createCelinaClient } from "@andrewkimjoseph/celina-sdk";

const celina = createCelinaClient();

await celina.token.getStablecoinBalances("0xYourAddress");

const flow = await celina.transaction.prepareSend("0xFrom", "0xTo", "USDm", "10");
// flow.steps → pass to wagmi sendTransaction

// Carbon DeFi (reads + unsigned strategy/trade prep)
const strategies = await celina.carbon.getStrategies("0xYourAddress");
const prepared = await celina.carbon.prepareLimitOrder({
  wallet_address: "0xYourAddress",
  base_token: "CELO",
  quote_token: "USDC",
  direction: "buy",
  price: 0.5,
  budget: 100,
});
// prepared.preparedFlow?.steps → same signing flow; check prepared.warnings
```

## Carbon DeFi

Hybrid **Carbon REST** (`https://mcp.carbondefi.xyz`) plus **`@bancor/carbon-sdk`** fallback for trade quotes and taker swaps when REST is unavailable. All 25 operations target Celo mainnet; no private keys — `prepare*` returns unsigned flows for the user’s wallet.

| Reads (`celina.carbon`) | Prepare (unsigned) |
|-------------------------|-------------------|
| `getStrategies`, `getStrategy`, `getTradeQuote`, `explorePair`, `resolveToken`, `getActivity`, `findOpportunities`, `getProtocolStats`, `getPriceHistory`, `simulateStrategy`, `help`, `learn` | `prepareLimitOrder`, `prepareRangeOrder`, `prepareRecurringStrategy`, `prepareConcentratedStrategy`, `prepareFullRangeStrategy`, `prepareRepriceStrategy`, `prepareEditStrategy`, `prepareDepositBudget`, `prepareWithdrawBudget`, `preparePauseStrategy`, `prepareResumeStrategy`, `prepareDeleteStrategy`, `prepareTrade` |

Set `CARBON_API_BASE_URL` to override the REST base. Hosted [celina-mcp](https://mcp.usecelina.xyz/api/mcp) exposes the 12 read tools only; use this SDK or local MCP stdio for all `prepare*` methods.

Full workflow, MCP tool names, and env vars: [Carbon DeFi guide](docs/guides/carbon.md).

## Related packages

- [`@andrewkimjoseph/celina-mcp`](https://www.npmjs.com/package/@andrewkimjoseph/celina-mcp) — MCP server for IDE/CLI agents
- [`@selfxyz/agent-sdk`](https://www.npmjs.com/package/@selfxyz/agent-sdk) — Self Agent ID

## License

MIT
