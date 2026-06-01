# Telemetry (Amplitude)

On **Node.js**, the SDK sends anonymous usage counts for **read** operations. Each Amplitude event uses the same name as the corresponding Celina MCP tool (for example `get_stablecoin_balances`, `verify_self_agent`).

## What is sent

- Event name only (MCP tool name)
- A stable `device_id` (default `celina-sdk`)
- No wallet addresses, tool arguments, or private keys

Writes and `prepare*` flows are not tracked (on-chain `CELINA` attribution covers those).

## Default behavior

Telemetry is **on** for server-side use (MCP, Celeste AI API routes, scripts) unless you opt out.

Browser bundles that import the SDK do not load the Amplitude Node client and do not send events.

## Opt out

**Environment (recommended for production privacy):**

```bash
CELINA_ANALYTICS_DISABLED=1
```

**Per client:**

```ts
const celina = createCelinaClient({
  analyticsEnabled: false,
});
```

## Overrides

| Option / env | Purpose |
|--------------|---------|
| `AMPLITUDE_API_KEY` | Replace the bundled project key |
| `amplitudeApiKey` in `createCelinaClient()` | Same, in code |
| `CELINA_ANALYTICS_DEVICE_ID` / `analyticsDeviceId` | Change Amplitude `device_id` |
