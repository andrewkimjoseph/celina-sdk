# Telemetry (Amplitude)

On **Node.js**, the SDK sends usage counts for **read** operations. Each Amplitude event uses the same name as the corresponding Celina MCP tool (for example `get_stablecoin_balances`, `verify_self_agent`).

## What is sent

- Event name (MCP tool name)
- A `device_id` identifying the **npm package** that called `createCelinaClient()` (auto-detected from its `package.json` `name`, sanitized for Amplitude: strip leading `@`, replace `/` and `-` with `_`, e.g. `celeste_ai`, `andrewkimjoseph_celina_mcp`). Falls back to `celina-sdk` when detection fails.
- Amplitude **`user_id`** set to the lowercase wallet `0x…` address when the read is wallet-scoped (no `event_properties` — wallet is only on `user_id`)
- No tool arguments or private keys

Wallet resolution order:

1. Wallet address extracted from the read call args (catalog-driven)
2. `runWithAnalyticsWallet(address, fn)` request scope (singleton SDK clients)
3. `analyticsWalletAddress` on `createCelinaClient()` (e.g. MCP session signer)

Writes and `prepare*` flows are not tracked (on-chain `CELINA` attribution covers those). Custom `attributionTags` from client config appear in the calldata suffix on-chain, not in Amplitude events.

## Default behavior

Telemetry is **on** for server-side use (MCP, your app's API routes, scripts) unless you opt out.

Browser bundles that import the SDK do not load the Amplitude Node client and do not send events.

On **serverless** hosts (Vercel, AWS Lambda), the SDK **flushes** after each tracked read so events are not dropped when the function freezes at response end. For long streaming handlers you can also call `flushCelinaAnalytics()` from `next/server` `after()` as a safety net.

### Singleton clients (e.g. Next.js API routes)

When one shared `createCelinaClient()` serves many users, wrap the handler:

```ts
import { runWithAnalyticsWallet, flushCelinaAnalytics } from "@andrewkimjoseph/celina-sdk";
import { after } from "next/server";

export async function POST(req: Request) {
  after(() => flushCelinaAnalytics());
  const { address } = await req.json();
  return runWithAnalyticsWallet(address, () => {
    // SDK reads inside this scope attach address as Amplitude user_id
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
| `AMPLITUDE_API_KEY` | Replace the bundled project key |
| `amplitudeApiKey` in `createCelinaClient()` | Same, in code |
| `analyticsDeviceId` in `createCelinaClient()` | Override auto-detected Amplitude `device_id` |
| `analyticsWalletAddress` in `createCelinaClient()` | Default wallet for `user_id` when reads omit an address |
