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
4. **`prepare_carbon_*`** — build unsigned flows; surface **`warnings`** from the API before the user signs.
5. Sign and broadcast via your wallet (Wagmi, viem, etc.) using `preparedFlow.steps`.

## SDK usage

```ts
import { createCelinaClient } from "@andrewkimjoseph/celina-sdk";

const celina = createCelinaClient({ rpcUrl: process.env.CELO_RPC_URL });

// Read (REST)
const strategies = await celina.carbon.getStrategies(wallet);

// Prepare (REST → SerializedPreparedFlow)
const prepared = await celina.carbon.prepareLimitOrder({
  wallet_address: wallet,
  base_token: "0x471EcE3750Da237a93B120cEadFa0b8eA6E3E25", // CELO
  quote_token: "0xcebA9300f2b948710d2653dd7D87747AdA2aA3b", // USDC
  direction: "buy",
  price: 0.5,
  budget: 100,
});

for (const warning of prepared.warnings) console.warn(warning);
if (prepared.preparedFlow) {
  for (const step of prepared.preparedFlow.steps) {
    // send via wallet
  }
}
```

Use **0x addresses** on Celo when symbols fail to resolve.

## Environment

| Variable | Purpose |
|----------|---------|
| `CARBON_API_BASE_URL` | Override REST base (default `https://mcp.carbondefi.xyz`) |
| `CARBON_SDK_FALLBACK` | Set to `false` to disable SDK fallback for trades |
| `CELO_RPC_URL` | Required for SDK fallback paths |

## MCP tools (25)

Registered in `celina-mcp` (`src/tools/carbon.tools.ts`). Hosted MCP (`celina-mcp-host`) exposes the **12 read** rows only (`carbonWritesEnabled: false`).

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

## Contract addresses (Celo mainnet)

Configured in `celina-sdk/src/config/carbon.ts` (controller, voucher, batcher, multicall). Confirm with [Carbon deployments](https://docs.carbondefi.xyz/contracts-and-functions/contracts/deployments/mainnet-contracts) when upgrading `@bancor/carbon-sdk`.
