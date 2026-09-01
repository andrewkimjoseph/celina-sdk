<p align="center">
  <img src="https://raw.githubusercontent.com/andrewkimjoseph/celina/main/assets/celina-banner.svg" alt="Celina — Give your LLM a wallet on Celo">
</p>

# Celina SDK

> **Server-side only.** This package includes server-native dependencies (`@agentkarma/sdk`, `@celo/attribution-tags`) that cannot be bundled for the browser. Import it only from Node.js environments — API routes, background workers (BullMQ / Vercel Cron), or CLI scripts.

Celina is a third-party, open-source stack that gives an LLM read, prepare, and execute access to Celo mainnet through an SDK, an MCP server, and a REST API. This package is the SDK — a Celo mainnet library for frontend apps and agents: **reads**, **unsigned transaction preparation**, and optional **ERC-4337 AA** via `createAAClient` (app-owned gas sponsorship credentials).

Pair with [wagmi](https://wagmi.sh) / viem for EOA signing, or `createAAClient` for sponsored/batched UserOps.

Listed in the [official Celo MCP docs](https://docs.celo.org/build-on-celo/build-with-ai/mcp/celina).

## Stack

Celina is layered from chain logic through agent tooling:

| Layer | Package | Role |
|-------|---------|------|
| **SDK** | `@andrewkimjoseph/celina-sdk` | Reads, gas estimates, `prepare*` flows (`chainId: 42220`), ERC-8021 attribution, `createAAClient` |
| **MCP** | `@andrewkimjoseph/celina-mcp` | MCP tools for Cursor / Claude / LM Studio — stdio writes or hosted reads ([install guide](https://www.usecelina.xyz/mcp/local)) |
| **MCP remote** | `celina-mcp-remote` | Vercel Streamable HTTP + A2A — **48 hosted read/prepare tools**; no server-key writes; no sponsorship keys |

This repo is the **SDK**. Downstream packages depend on published npm semver (no local `file:` links in production).

## Install

```bash
npm i @andrewkimjoseph/celina-sdk
```

Requires Node.js ≥ 20.

## Package exports

| Export | Purpose |
|--------|---------|
| `@andrewkimjoseph/celina-sdk` | `createCelinaClient`, domain services, `parsePrivateKeyEnv` |
| `@andrewkimjoseph/celina-sdk/tools` | Shared LLM tool catalog (`ToolDefinition`, `filterToolDefinitions`) |
| `@andrewkimjoseph/celina-sdk/simulation` | `simulatePreparedStep` — dry-run prepared txs before broadcast |
| `@andrewkimjoseph/celina-sdk/a2a` | A2A agent card handler (used by celina-mcp-remote) |
| `@andrewkimjoseph/celina-sdk/oasf` | OASF manifest helpers for agent discovery |
| `@andrewkimjoseph/celina-sdk/testing` | Test harness entry for fork/integration tests |

### LLM tool catalog (v0.5+)

For MCP servers and chat APIs (Vercel AI SDK, etc.), import shared tool definitions from `@andrewkimjoseph/celina-sdk/tools` instead of redefining schemas. See [LLM tool catalog](docs/guides/tool-catalog.md) — includes the recommended **`dynamicTool`** pattern so TypeScript does not OOM on large tool sets.

### Sign-time simulation (v0.9.6+)

Before broadcasting prepared steps, call `simulatePreparedStep` from `@andrewkimjoseph/celina-sdk/simulation` — browser-safe, no Node analytics. See [Prepared-step simulation](docs/guides/prepared-step-simulation.md).

## Documentation

**Full docs:** [celina-sdk on GitBook](https://andrewkimjoseph.gitbook.io/celina-sdk)

- [Quick start](https://andrewkimjoseph.gitbook.io/celina-sdk/getting-started/quick-start)
- [LLM tool catalog](docs/guides/tool-catalog.md) — `@andrewkimjoseph/celina-sdk/tools` for MCP and AI SDK hosts
- [Architecture](docs/concepts/architecture.md) — client composition and stack
- [Prepared flows](docs/concepts/prepared-flows.md) — `SerializedPreparedFlow` (`chainId: 42220`), ERC-8021 Celina attribution
- [On-chain attribution](docs/guides/on-chain-attribution.md) — wire format, check vs verify, Celina vs AA tags
- [Account Abstraction](docs/guides/account-abstraction.md) — `createAAClient`, app-owned sponsorship, AA `attributionTags`
- [Prepared-step simulation](docs/guides/prepared-step-simulation.md) — `simulatePreparedStep` before wallet send
- [wagmi integration](https://andrewkimjoseph.gitbook.io/celina-sdk/guides/wagmi-integration)
- [GoodDollar](docs/guides/gooddollar.md) — UBI whitelist/claim and G$ ↔ USDm reserve swaps
- [Governance](docs/guides/governance.md) — lock CELO, vote, upvote, withdraw (humanness-gated)
- [Staking](docs/guides/staking.md) — validator election stake, Celo Mondo delegate directory, delegate/undelegate (humanness-gated)
- [Humanness](docs/guides/humanness.md) — dual-rail Self + GoodDollar gate for governance/staking writes
- [Self Agent ID](docs/guides/self-agent-id.md) — verify, register, refresh human-backed agents
- [AgentKarma reputation](docs/guides/agentkarma.md) — karma reads and counterparty trust policy
- [Telemetry](docs/guides/telemetry.md) — optional Amplitude read metrics (`device_id` per project, `user_id` per wallet; opt out with `analyticsEnabled: false`)
- [API reference](https://andrewkimjoseph.gitbook.io/celina-sdk/api-reference)

Docs source lives in [`docs/`](docs/) in this repository.

## Quick example

```ts
import { createCelinaClient } from "@andrewkimjoseph/celina-sdk";

const celina = createCelinaClient({
  attributionTags: ["celo_862c21dd97a7", "my_app"],
  // ERC-8021 → codes celina, celo_862c21dd97a7, my_app
});

await celina.token.getStablecoinBalances("0xYourAddress");

const flow = await celina.transaction.prepareSend("0xFrom", "0xTo", "USDm", "10");
// flow.steps → simulate each step, then wagmi sendTransactionAsync (see /simulation)

// GoodDollar UBI (reads + unsigned claim)
const eligibility = await celina.gooddollar.getUbiClaimEligibility("0xYourAddress");
const ubiFlow = await celina.gooddollar.prepareClaimUbi("0xYourAddress");

// GoodDollar reserve (G$ ↔ USDm — bonding curve, not Uniswap)
const reserveQuote = await celina.gooddollar.getReserveQuote("GoodDollar", "USDm", "1000");
// reserveQuote.protocol === "gooddollar_reserve"
const reserveFlow = await celina.gooddollar.prepareReserveSwap(
  "0xFrom",
  "GoodDollar",
  "USDm",
  "1000",
);

// Governance & staking (humanness-gated prepare* for browser signing)
const human = await celina.humanness.checkHumanness("0xYourAddress");
const proposals = await celina.governance.getProposals({ stage: "Queued" });
const groups = await celina.staking.getValidatorGroups();
const delegates = await celina.staking.getGovernanceDelegates({ search: "governance", limit: 5 });
```

## Prepared flows and calldata tagging

All `prepare*` methods return a **`SerializedPreparedFlow`**: ordered unsigned steps for the user's wallet.

Every step with calldata gets an **ERC-8021 Schema 0** attribution suffix via `appendCelinaCalldataTag` — sends, Mento FX, Uniswap, Aave, and GoodDollar. Pass `step.data` to wagmi unchanged.

Optional `attributionTags` in `createCelinaClient({ attributionTags: [...] })` set custom codes after platform `celina` (deduped, stable order). The same option on **`createAAClient`** tags at `sendPreparedFlow` time (omit for pass-through). Prepared flows expose **`chainId: 42220`**. List or check on-chain tags with `check_attribution_tag` (preferred) or `checkAttributionInCalldata`; use `verify_attribution_tag` / `verifyAttributionInCalldata` for raw layers (including historical legacy `CELINA|…` when present).

Before opening the wallet, simulate each step against current chain state with `@andrewkimjoseph/celina-sdk/simulation` (`simulatePreparedStep`). Local **celina-mcp** stdio writes use the same helper in `executePreparedFlow` before broadcast.

For **sponsored / batched UserOps**, use [`createAAClient`](docs/guides/account-abstraction.md) from `@andrewkimjoseph/celina-sdk/aa` with an app-owned gas sponsorship provider (v1: Pimlico). MCP does not host sponsorship API keys.

See [Prepared flows](docs/concepts/prepared-flows.md), [On-chain attribution](docs/guides/on-chain-attribution.md), [Prepared-step simulation](docs/guides/prepared-step-simulation.md), and [Account Abstraction](docs/guides/account-abstraction.md).

### MCP session wallet (not in the SDK)

Local **celina-mcp** stdio can configure **`CELO_PRIVATE_KEY`**, **`SELF_AGENT_PRIVATE_KEY`**, or **both**. With a key set, omit wallet params on many MCP tools and use **`get_wallet_address`** instead of shelling out for the signer. Pass optional `signer: "celo" | "self_agent"` on execute tools when both keys are configured. **Self-only** setups (no `CELO_PRIVATE_KEY`) are valid for governance/staking when the Self agent passes humanness — do not leave placeholder CELO keys in config.

The SDK always requires an explicit `0x…` from your app (e.g. wagmi). See [MCP session wallet](docs/guides/mcp-session-wallet.md). **Celeste AI** is an independent app built on this SDK + browser wallet signing — it does not use celina-mcp.

## GoodDollar

Identity whitelist reads, daily UBI entitlement, unsigned UBI claim, and **G$ ↔ USDm reserve swaps** via the on-chain MentoBroker bonding curve.

| Reads | Prepare |
|-------|---------|
| `getWhitelistingInfo`, `getUbiClaimEligibility`, `getReserveQuote` | `prepareClaimUbi`, `prepareReserveSwap` |

For **G$ ↔ USDm**, use `getReserveQuote` / `prepareReserveSwap` (or aggregated `getSwapQuoteWithFallback` from `@andrewkimjoseph/celina-sdk/tools`) — not Uniswap. For other G$ pairs (e.g. G$ → USDT), Uniswap v4 remains the AMM fallback.

MCP: `get_gooddollar_whitelisting_info`, `get_gooddollar_ubi_entitlement`, `get_gooddollar_reserve_quote`, `estimate_gooddollar_reserve_swap`, `execute_gooddollar_reserve_swap` (stdio write with server key); `claim_daily_gooddollar_ubi` (stdio UBI write). Browser apps: `prepareClaimUbi`, `prepareReserveSwap`, or `prepare_swap` + wagmi.

[GoodDollar guide](docs/guides/gooddollar.md)

## Related packages

- [`@andrewkimjoseph/celina-mcp`](https://www.usecelina.xyz/mcp/local) — MCP server (`get_wallet_address`, optional address on wallet-scoped tools); [install guide](https://www.usecelina.xyz/mcp/local)
- [`celina-mcp-remote`](../celina-mcp-remote/) — Vercel-hosted remote MCP endpoint (`https://mcp.usecelina.xyz/api/mcp`)
- [`@selfxyz/agent-sdk`](https://www.npmjs.com/package/@selfxyz/agent-sdk) — Self Agent ID browser flows

## Roadmap

- [x] Mento FX routing (`getFxQuote`, `estimateFx`, `prepareFx`)
- [x] Uniswap v4 swaps (`getSwapQuote`, `estimateSwap`, `prepareSwap`)
- [x] GoodDollar reserve swaps (`getReserveQuote`, `prepareReserveSwap`) — G$ ↔ USDm via MentoBroker
- [x] Aave tools (`getBalances` / MCP `get_aave_balances`, `prepareSupply`, `prepareWithdraw`) — USDT, WETH, USDm, USDC, CELO, EURm
- [x] Self proof verification (`verifySelfAgent`, `verifySelfRequest`, ai.self.xyz)
- [x] Self Agent ID (`lookupSelfAgent`, registration & lifecycle tools)
- [x] Governance (`prepareLockCelo`, `prepareVote`, `prepareUpvote`, revoke prepares — humanness-gated)
- [x] Staking (`prepareStake`, `prepareActivateStake`, delegate/undelegate prepares — humanness-gated)
- [x] Humanness dual-rail gate (`checkHumanness` — Self Agent ID or GoodDollar whitelist)
- [x] GoodDollar identity link, face verification, connect/disconnect wallet tools

## License

MIT
