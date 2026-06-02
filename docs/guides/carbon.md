# Carbon DeFi on Celo (hybrid SDK + REST)

Celina exposes all 25 Carbon DeFi operations on **Celo mainnet** through a hybrid stack:

- **Carbon REST** (`https://mcp.carbondefi.xyz`) — primary path for reads, analytics, simulation, help, and unsigned transaction preparation. Every request includes `chain: "celo"`.
- **@bancor/carbon-sdk** — Celo contract configuration, cache sync, and **fallback** for trade quotes and taker swaps when REST is unavailable.

## Rate limits

The public Carbon API enforces about **30 requests per minute** per client IP (see [server info](https://mcp.carbondefi.xyz/info)). For high-frequency agents:

- Call `get_carbon_strategies` / `explore_carbon_pair` sparingly; cache results briefly in your app layer.
- Prefer SDK fallback only for `get_carbon_trade_quote` and `prepare_carbon_trade` when REST returns 5xx or rate-limit errors.

## Agent workflow

1. **`get_carbon_strategies`** — list existing maker strategies for the wallet.
2. **`explore_carbon_pair`** or **`get_carbon_trade_quote`** — understand liquidity and pricing (quote per base; buy budget in quote, sell budget in base).
3. **`simulate_carbon_strategy`** — backtest before committing capital (REST-only).
4. **`prepare_carbon_*`** — build unsigned flows (approve + Carbon controller steps via `finalizeCarbonPrepare`); surface **`warnings`** and **`deep_link`**. No private key.
5. **`execute_carbon_*`** (celina-mcp stdio only) — prepare + sign/broadcast with `CELO_PRIVATE_KEY`.

Token symbols (`CELO`, `USDT`, …) are normalized to concrete `0x` addresses before Carbon REST (CELO → WCELO/MENTO collateral). Do not call Carbon REST directly with bare symbols.

## SDK usage

```ts
import { createCelinaClient } from "@andrewkimjoseph/celina-sdk";

const celina = createCelinaClient({ rpcUrl: process.env.CELO_RPC_URL });

// Read (REST)
const strategies = await celina.carbon.getStrategies(wallet);

// Prepare (REST → SerializedPreparedFlow) — symbols OK
const prepared = await celina.carbon.prepareLimitOrder({
  wallet_address: wallet,
  base_token: "CELO",
  quote_token: "USDC",
  direction: "buy",
  price: 0.5,
  budget: 100,
  market_price: 0.55,
});

for (const warning of prepared.warnings) console.warn(warning);

// Local signing (MCP or custom app with private key)
const steps = await celina.carbon.buildExecutionSteps(wallet, prepared, {
  direction: "buy",
  base_token: "CELO",
  quote_token: "USDC",
  budget: 100,
});
// send steps via viem/wagmi
```

## Environment

| Variable | Purpose |
|----------|---------|
| `CARBON_API_BASE_URL` | Override REST base (default `https://mcp.carbondefi.xyz`) |
| `CARBON_SDK_FALLBACK` | Set to `false` to disable SDK fallback for trades |
| `CELO_RPC_URL` | Required for SDK fallback paths |

## finalizeCarbonPrepare

MCP `prepare_carbon_*` and browser apps should call **`finalizeCarbonPrepare`** after REST prepare to merge allowance checks into a complete signing sequence:

```ts
import { createCelinaClient, finalizeCarbonPrepare } from "@andrewkimjoseph/celina-sdk";

const prepared = await celina.carbon.prepareLimitOrder({ wallet_address, ... });
const preparedFlow = await finalizeCarbonPrepare(
  celina.carbon,
  wallet_address,
  prepared,
  { wallet_address, ... },
);
// preparedFlow.steps → approve (if needed) + Carbon controller tx(s), all CELINA-tagged
```

Requires Celo RPC for allowance reads; no private key.

## MCP tools (38 Carbon on stdio; 72 tools on hosted endpoint)

Hosted catalog includes all Carbon reads and `prepare_carbon_*` (no `execute_carbon_*`). Local stdio adds `execute_carbon_*` and server-key writes. With `CELO_PRIVATE_KEY`, omit `wallet_address` on Carbon reads/prepare or call **`get_wallet_address`** — see [MCP session wallet](mcp-session-wallet.md).

Registered in `celina-mcp` (`src/tools/carbon.tools.ts`).

| Surface | Carbon tools |
|---------|----------------|
| **Hosted** (`celina-mcp-host`) | 12 read + 13 `prepare_carbon_*` — no `execute_carbon_*` |
| **Local stdio** | All 38 Carbon tools (prepare + execute with `CELO_PRIVATE_KEY`) |

| MCP tool | SDK method (approx.) |
|----------|----------------------|
| `get_carbon_strategies` | `carbon.getStrategies` |
| `get_carbon_strategy` | `carbon.getStrategy` |
| `get_carbon_trade_quote` | `carbon.getTradeQuote` |
| `explore_carbon_pair` | `carbon.explorePair` |
| `resolve_carbon_token` | `carbon.resolveToken` |
| `get_carbon_activity` | `carbon.getActivity` |
| `find_carbon_opportunities` | `carbon.findOpportunities` |
| `get_carbon_protocol_stats` | `carbon.getProtocolStats` |
| `get_carbon_price_history` | `carbon.getPriceHistory` |
| `simulate_carbon_strategy` | `carbon.simulateStrategy` |
| `carbon_help` | `carbon.help` |
| `carbon_learn` | `carbon.learn` |
| `prepare_carbon_limit_order` | `carbon.prepareLimitOrder` |
| `prepare_carbon_range_order` | `carbon.prepareRangeOrder` |
| `prepare_carbon_recurring_strategy` | `carbon.prepareRecurringStrategy` |
| `prepare_carbon_concentrated_strategy` | `carbon.prepareConcentratedStrategy` |
| `prepare_carbon_full_range_strategy` | `carbon.prepareFullRangeStrategy` |
| `prepare_carbon_reprice_strategy` | `carbon.prepareRepriceStrategy` |
| `prepare_carbon_edit_strategy` | `carbon.prepareEditStrategy` |
| `prepare_carbon_deposit_budget` | `carbon.prepareDepositBudget` |
| `prepare_carbon_withdraw_budget` | `carbon.prepareWithdrawBudget` |
| `prepare_carbon_pause_strategy` | `carbon.preparePauseStrategy` |
| `prepare_carbon_resume_strategy` | `carbon.prepareResumeStrategy` |
| `prepare_carbon_delete_strategy` | `carbon.prepareDeleteStrategy` |
| `prepare_carbon_trade` | `carbon.prepareTrade` |
| `execute_carbon_limit_order` | `carbonWrite.executeLimitOrder` (MCP) |
| `execute_carbon_range_order` | `carbonWrite.executeRangeOrder` (MCP) |
| `execute_carbon_recurring_strategy` | `carbonWrite.executeRecurringStrategy` (MCP) |
| `execute_carbon_concentrated_strategy` | `carbonWrite.executeConcentratedStrategy` (MCP) |
| `execute_carbon_full_range_strategy` | `carbonWrite.executeFullRangeStrategy` (MCP) |
| `execute_carbon_reprice_strategy` | `carbonWrite.executeRepriceStrategy` (MCP) |
| `execute_carbon_edit_strategy` | `carbonWrite.executeEditStrategy` (MCP) |
| `execute_carbon_deposit_budget` | `carbonWrite.executeDepositBudget` (MCP) |
| `execute_carbon_withdraw_budget` | `carbonWrite.executeWithdrawBudget` (MCP) |
| `execute_carbon_pause_strategy` | `carbonWrite.executePauseStrategy` (MCP) |
| `execute_carbon_resume_strategy` | `carbonWrite.executeResumeStrategy` (MCP) |
| `execute_carbon_delete_strategy` | `carbonWrite.executeDeleteStrategy` (MCP) |
| `execute_carbon_trade` | `carbonWrite.executeTrade` (MCP) |

## Contract addresses (Celo mainnet)

Configured in `celina-sdk/src/config/carbon.ts` (controller, voucher, batcher, multicall). Confirm with [Carbon deployments](https://docs.carbondefi.xyz/contracts-and-functions/contracts/deployments/mainnet-contracts) when upgrading `@bancor/carbon-sdk`.
