[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / SdkConfig

# Interface: SdkConfig

Defined in: [src/config/sdk-config.ts:6](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/config/sdk-config.ts#L6)

RPC configuration for `createCelinaClient()`.

## Properties

### analyticsDeviceId?

> `optional` **analyticsDeviceId?**: `string`

Defined in: [src/config/sdk-config.ts:26](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/config/sdk-config.ts#L26)

`device_id` reported with telemetry events. When omitted, auto-detected from the
consuming package `package.json` name (sanitized, e.g. `celeste_ai`,
`andrewkimjoseph_celina_mcp`), then `celina_sdk`. Prefer setting this explicitly —
auto-detection can be unreliable in bundled/serverless deployments.

***

### analyticsEnabled?

> `optional` **analyticsEnabled?**: `boolean`

Defined in: [src/config/sdk-config.ts:19](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/config/sdk-config.ts#L19)

Read telemetry reported to celina-stats-api (default on).
Opt out with `analyticsEnabled: false`.

***

### analyticsWalletAddress?

> `optional` **analyticsWalletAddress?**: `string`

Defined in: [src/config/sdk-config.ts:31](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/config/sdk-config.ts#L31)

Default wallet for read telemetry `user_id` when args omit an address
(e.g. MCP session signer with `CELO_PRIVATE_KEY`).

***

### attributionTags?

> `optional` **attributionTags?**: `string`[]

Defined in: [src/config/sdk-config.ts:50](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/config/sdk-config.ts#L50)

Optional custom calldata attribution tags for ERC-8021 Schema 0 codes
after platform `celina` on prepared transaction steps (deduped, stable order).

App tags (e.g. `celeste_ai`) normalize to uppercase (`CELESTE_AI`) then lowercase codes.
Celo Builders on-chain tags matching `celo_<12 hex>` canonicalize to lowercase
(e.g. `celo_862c21dd97a7`). The literal tag `CELINA` is never duplicated.

***

### ethRpcUrl?

> `optional` **ethRpcUrl?**: `string`

Defined in: [src/config/sdk-config.ts:10](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/config/sdk-config.ts#L10)

Ethereum mainnet RPC for ENS resolution (optional).

***

### onchainStatsEnabled?

> `optional` **onchainStatsEnabled?**: `boolean`

Defined in: [src/config/sdk-config.ts:36](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/config/sdk-config.ts#L36)

Report successful writes to celina-stats-api (default on).
Opt out with `onchainStatsEnabled: false` or `CELINA_ONCHAIN_STATS_ENABLED=false`.

***

### rpcUrl

> **rpcUrl**: `string`

Defined in: [src/config/sdk-config.ts:8](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/config/sdk-config.ts#L8)

Celo mainnet JSON-RPC URL (default Forno).

***

### selfAgentPrivateKey?

> `optional` **selfAgentPrivateKey?**: `` `0x${string}` ``

Defined in: [src/config/sdk-config.ts:12](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/config/sdk-config.ts#L12)

Self Agent ID signing key (Node only; also reads `SELF_AGENT_PRIVATE_KEY`).

***

### selfApiBase?

> `optional` **selfApiBase?**: `string`

Defined in: [src/config/sdk-config.ts:14](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/config/sdk-config.ts#L14)

Self Agent ID REST API base (default https://app.ai.self.xyz).

***

### statsApiBaseUrl?

> `optional` **statsApiBaseUrl?**: `string`

Defined in: [src/config/sdk-config.ts:41](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/config/sdk-config.ts#L41)

Override celina-stats-api base URL (default `https://api.stats.usecelina.xyz`).
Also reads `CELINA_STATS_API_URL`.
