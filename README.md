# Celina SDK

**`@andrewkimjoseph/celina-sdk@0.4.8`** — Celo mainnet library for frontend apps and agents: **reads** and **unsigned transaction preparation** (no private keys).

Pair with [wagmi](https://wagmi.sh) / viem — users sign prepared transactions in their wallet.

## Stack

Celina is layered from chain logic through agent tooling:

| Layer | Package | Role |
|-------|---------|------|
| **SDK** | `@andrewkimjoseph/celina-sdk` | Reads, gas estimates, `prepare*` flows, Carbon REST + SDK hybrid |
| **MCP** | `@andrewkimjoseph/celina-mcp` | MCP tools for Cursor / Claude / LM Studio — stdio writes or hosted reads + Carbon prepare |
| **MCP host** | `celina-mcp-host` | Vercel Streamable HTTP — hosted reads + Carbon prepare (72 tools); no server-key writes or `execute_carbon_*` |

This repo is the **SDK**. Downstream packages depend on published npm semver (no local `file:` links in production).

## Install

```bash
npm i @andrewkimjoseph/celina-sdk
```

Requires Node.js ≥ 20.

## Documentation

**Full docs:** [celina-sdk on GitBook](https://andrewkimjoseph.gitbook.io/celina-sdk)

- [Quick start](https://andrewkimjoseph.gitbook.io/celina-sdk/getting-started/quick-start)
- [Architecture](docs/concepts/architecture.md) — client composition and stack
- [Prepared flows](docs/concepts/prepared-flows.md) — `SerializedPreparedFlow`, CELINA calldata tag
- [wagmi integration](https://andrewkimjoseph.gitbook.io/celina-sdk/guides/wagmi-integration)
- [Carbon DeFi on Celo](docs/guides/carbon.md) — hybrid REST + `@bancor/carbon-sdk` (25 operations)
- [GoodDollar UBI](docs/guides/gooddollar.md) — whitelist, daily entitlement, `prepareClaimUbi`
- [Self Agent ID](docs/guides/self-agent-id.md) — verify, register, refresh human-backed agents
- [Telemetry](docs/guides/telemetry.md) — optional Amplitude read metrics (`CELINA_ANALYTICS_DISABLED=1`)
- [API reference](https://andrewkimjoseph.gitbook.io/celina-sdk/api-reference)

Docs source lives in [`docs/`](docs/) in this repository.

## Quick example

```ts
import { createCelinaClient } from "@andrewkimjoseph/celina-sdk";

const celina = createCelinaClient();

await celina.token.getStablecoinBalances("0xYourAddress");

const flow = await celina.transaction.prepareSend("0xFrom", "0xTo", "USDm", "10");
// flow.steps → pass to wagmi sendTransaction (calldata includes CELINA attribution suffix)

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
// prepared.preparedFlow?.steps — controller + approve steps, all tagged
// prepared.deep_link — Carbon trade UI reference (optional)
// prepared.warnings — always surface to the user

// GoodDollar UBI (reads + unsigned claim)
const eligibility = await celina.gooddollar.getUbiClaimEligibility("0xYourAddress");
const ubiFlow = await celina.gooddollar.prepareClaimUbi("0xYourAddress");
```

## Prepared flows and calldata tagging

All `prepare*` methods return a **`SerializedPreparedFlow`**: ordered unsigned steps for the user's wallet.

Every step with calldata gets a **CELINA attribution suffix** (`appendCelinaCalldataTag`) — sends, Mento FX, Uniswap, Aave, GoodDollar, and **Carbon controller transactions** (not just ERC-20 approvals). Pass `step.data` to wagmi unchanged.

See [Prepared flows](docs/concepts/prepared-flows.md).

## Carbon DeFi

Hybrid **Carbon REST** (`https://mcp.carbondefi.xyz`) plus **`@bancor/carbon-sdk`** fallback for trade quotes and taker swaps when REST is unavailable. All 25 operations target Celo mainnet.

| Reads (`celina.carbon`) | Prepare (unsigned) |
|-------------------------|-------------------|
| `getStrategies`, `getStrategy`, `getTradeQuote`, `explorePair`, `resolveToken`, `getActivity`, `findOpportunities`, `getProtocolStats`, `getPriceHistory`, `simulateStrategy`, `help`, `learn` | 13 `prepare*` methods — limit/range/recurring/concentrated/full-range orders, edit/reprice/deposit/withdraw/pause/resume/delete, taker `prepareTrade` |

- Token symbols are **normalized to `0x` addresses** before Carbon REST (avoids ENS resolution errors on Celo).
- **`finalizeCarbonPrepare(carbon, wallet, prepared, orderMeta)`** — merges ERC-20 approve steps via `buildExecutionSteps` into `preparedFlow.steps` (used by MCP `prepare_carbon_*` and browser apps).
- **`deep_link`** on prepare responses — Carbon REST trade/disposable UI URL (reference only; signing is via your wallet flow).
- **`carbonActivityDeepLink(wallet)`** — post-execution activity explorer on [celo.carbondefi.xyz](https://celo.carbondefi.xyz).

Set `CARBON_API_BASE_URL` to override the REST base. Hosted MCP exposes **72 tools** (reads + Carbon prepare); `execute_carbon_*` requires local stdio with `CELO_PRIVATE_KEY`.

### MCP session wallet (not in the SDK)

Local **celina-mcp** with `CELO_PRIVATE_KEY` can omit wallet params on many tools and use **`get_wallet_address`** instead of shelling out for the signer. The SDK always requires an explicit `0x…` from your app (e.g. wagmi). See [MCP session wallet](docs/guides/mcp-session-wallet.md). **Celeste AI** is an independent app built on this SDK + browser wallet signing — it does not use celina-mcp.

Full workflow: [Carbon DeFi guide](docs/guides/carbon.md).

## GoodDollar UBI

Identity whitelist reads, daily entitlement checks, and unsigned `UBISchemeV2.claim()` preparation. One claim per verified identity per day.

| Reads | Prepare |
|-------|---------|
| `getWhitelistingInfo`, `getUbiClaimEligibility` | `prepareClaimUbi` |

MCP: `get_gooddollar_whitelisting_info`, `get_gooddollar_ubi_entitlement` (read); `claim_daily_gooddollar_ubi` (stdio write with server key). Browser apps: `prepareClaimUbi` + wagmi.

[GoodDollar guide](docs/guides/gooddollar.md)

## Related packages

- [`@andrewkimjoseph/celina-mcp`](https://www.npmjs.com/package/@andrewkimjoseph/celina-mcp) `@0.8.5` — MCP server (`get_wallet_address`, optional address on wallet-scoped tools; 85 tools stdio, 72 hosted)
- [`celina-mcp-host`](../celina-mcp-host/) — Vercel-hosted MCP endpoint (`https://mcp.usecelina.xyz/api/mcp`) — reads + Carbon prepare
- [`@selfxyz/agent-sdk`](https://www.npmjs.com/package/@selfxyz/agent-sdk) — Self Agent ID browser flows

## License

MIT
