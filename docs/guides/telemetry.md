# Telemetry (celina-stats-api)

On **Node.js**, the SDK reports usage counts for **read** operations directly to [celina-stats-api](https://api.stats.usecelina.xyz) (`POST /events`), which writes them straight into its Supabase-backed stats store. Each event uses the same name as the corresponding Celina MCP tool (for example `get_stablecoin_balances`, `verify_self_agent`).

## What is sent

- Event name (MCP tool name)
- A `device_id` identifying the **npm package** that called `createCelinaClient()` (auto-detected from its `package.json` `name`, sanitized: strip leading `@`, replace `/` and `-` with `_`, e.g. `celeste_ai`, `andrewkimjoseph_celina_mcp`). Falls back to `celina_sdk` when detection fails. **Prefer setting `analyticsDeviceId` explicitly** — auto-detection walks the call stack to the nearest `package.json` and can misattribute events in bundled/serverless deployments (Next.js, Vercel, single-file bundles).
- A `user_id` set to the lowercase wallet `0x…` address when the read is wallet-scoped (no other args — wallet is only on `user_id`)
- No tool arguments or private keys

### Canonical device ids across the Celina ecosystem

The Celina ecosystem is the `celina-*` packages plus [celeste-ai](https://github.com/andrewkimjoseph/celeste-ai). Other apps that embed the SDK are consumers, not ecosystem members.

| Project | `device_id` | How it's set |
|---|---|---|
| celina-sdk (no override) | `celina_sdk` | Default fallback |
| celina-mcp | `andrewkimjoseph_celina_mcp[_<install-suffix>]` | `getMcpAnalyticsDeviceId()` (per-install anonymous suffix) |
| celina-api | `celina_api` (default), or caller-supplied | `X-Celina-Client` request header, sanitized |
| celina-bot | `celina_bot` | Sends `X-Celina-Client: celina_bot` to celina-api (doesn't embed the SDK directly) |
| celeste-ai | `celeste_ai` | Explicit `analyticsDeviceId` |

Consumers should follow this pattern: pass `analyticsDeviceId` explicitly in `createCelinaClient()` (or forward a caller id via a header, like celina-api/celina-bot do) rather than relying on auto-detection.

Wallet resolution order:

1. Wallet address extracted from the read call args (catalog-driven)
2. `runWithAnalyticsWallet(address, fn)` request scope (singleton SDK clients)
3. `analyticsWalletAddress` on `createCelinaClient()` (e.g. MCP session signer)

Writes and `prepare*` flows are not tracked (on-chain Celina attribution covers those — see [On-chain attribution](on-chain-attribution.md)). Successful mined writes are also reported (hash only) to [celina-stats-api](https://api.stats.usecelina.xyz) via `reportCelinaOnchainTxn` — see that same guide.

Custom `attributionTags` from client config appear in the calldata suffix on-chain, not in telemetry events.

## Default behavior

Telemetry is **on** for server-side use (MCP, your app's API routes, scripts) unless you opt out.

Browser bundles that import the SDK do not send events.

On **serverless** hosts (Vercel, AWS Lambda, Cloudflare Workers), do **not** await the report on the request path — that adds request round-trip time (or a hung timeout) to every read. Tracking is fire-and-forget; keep the isolate alive with `waitUntil(drainCelinaAnalytics())` (Workers) or `waitUntil` / `after(() => drainCelinaAnalytics())` (Vercel / Next).

### Singleton clients (e.g. Next.js API routes)

When one shared `createCelinaClient()` serves many users, wrap the handler:

```ts
import { runWithAnalyticsWallet, drainCelinaAnalytics } from "@andrewkimjoseph/celina-sdk";
import { after } from "next/server";

export async function POST(req: Request) {
  after(() => drainCelinaAnalytics());
  const { address } = await req.json();
  return runWithAnalyticsWallet(address, () => {
    // SDK reads inside this scope attach address as user_id
  });
}
```

## Opt out

```ts
const celina = createCelinaClient({
  analyticsEnabled: false,
});
```

## Overrides

| Option | Purpose |
|--------|---------|
| `analyticsDeviceId` in `createCelinaClient()` | Override auto-detected `device_id` (recommended for every non-SDK integration) |
| `analyticsWalletAddress` in `createCelinaClient()` | Default wallet for `user_id` when reads omit an address |
| `statsApiBaseUrl` in `createCelinaClient()` / `CELINA_STATS_API_URL` env | Override the celina-stats-api base URL (default `https://api.stats.usecelina.xyz`) |
