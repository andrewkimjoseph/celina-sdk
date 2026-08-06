[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / SdkConfig

# Interface: SdkConfig

Defined in: [src/config/sdk-config.ts:6](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/config/sdk-config.ts#L6)

RPC configuration for `createCelinaClient()`.

## Properties

### amplitudeApiKey?

> `optional` **amplitudeApiKey?**: `string`

Defined in: [src/config/sdk-config.ts:18](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/config/sdk-config.ts#L18)

Override bundled Amplitude project API key.

***

### analyticsDeviceId?

> `optional` **analyticsDeviceId?**: `string`

Defined in: [src/config/sdk-config.ts:24](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/config/sdk-config.ts#L24)

Amplitude `device_id`. When omitted, auto-detected from the consuming package
`package.json` name (sanitized, e.g. `celeste_ai`, `andrewkimjoseph_celina_mcp`),
then `celina-sdk`.

***

### analyticsEnabled?

> `optional` **analyticsEnabled?**: `boolean`

Defined in: [src/config/sdk-config.ts:16](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/config/sdk-config.ts#L16)

Amplitude read telemetry (default on; opt out with `analyticsEnabled: false`).

***

### analyticsWalletAddress?

> `optional` **analyticsWalletAddress?**: `string`

Defined in: [src/config/sdk-config.ts:29](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/config/sdk-config.ts#L29)

Default wallet for read telemetry `user_id` when args omit an address
(e.g. MCP session signer with `CELO_PRIVATE_KEY`).

***

### attributionTags?

> `optional` **attributionTags?**: `string`[]

Defined in: [src/config/sdk-config.ts:38](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/config/sdk-config.ts#L38)

Optional custom calldata attribution tags for ERC-8021 Schema 0 codes
after platform `celina` on prepared transaction steps (deduped, stable order).

App tags (e.g. `celeste_ai`) normalize to uppercase (`CELESTE_AI`) then lowercase codes.
Celo Builders on-chain tags matching `celo_<12 hex>` canonicalize to lowercase
(e.g. `celo_862c21dd97a7`). The literal tag `CELINA` is never duplicated.

***

### ethRpcUrl?

> `optional` **ethRpcUrl?**: `string`

Defined in: [src/config/sdk-config.ts:10](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/config/sdk-config.ts#L10)

Ethereum mainnet RPC for ENS resolution (optional).

***

### rpcUrl

> **rpcUrl**: `string`

Defined in: [src/config/sdk-config.ts:8](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/config/sdk-config.ts#L8)

Celo mainnet JSON-RPC URL (default Forno).

***

### selfAgentPrivateKey?

> `optional` **selfAgentPrivateKey?**: `` `0x${string}` ``

Defined in: [src/config/sdk-config.ts:12](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/config/sdk-config.ts#L12)

Self Agent ID signing key (Node only; also reads `SELF_AGENT_PRIVATE_KEY`).

***

### selfApiBase?

> `optional` **selfApiBase?**: `string`

Defined in: [src/config/sdk-config.ts:14](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/config/sdk-config.ts#L14)

Self Agent ID REST API base (default https://app.ai.self.xyz).
