# SdkConfig

[**@andrewkimjoseph/celina-sdk**](../../)

***

[@andrewkimjoseph/celina-sdk](../../) / [index](https://github.com/andrewkimjoseph/celina-sdk/blob/main/docs/api-reference/index/README.md) / SdkConfig

## Interface: SdkConfig

Defined in: [src/config/sdk-config.ts:4](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/config/sdk-config.ts#L4)

RPC configuration for `createCelinaClient()`.

### Properties

#### amplitudeApiKey?

> `optional` **amplitudeApiKey?**: `string`

Defined in: [src/config/sdk-config.ts:16](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/config/sdk-config.ts#L16)

Override bundled Amplitude project API key.

***

#### analyticsDeviceId?

> `optional` **analyticsDeviceId?**: `string`

Defined in: [src/config/sdk-config.ts:22](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/config/sdk-config.ts#L22)

Amplitude `device_id`. When omitted, auto-detected from the consuming package `package.json` name (sanitized, e.g. `celeste_ai`, `andrewkimjoseph_celina_mcp`), then `celina-sdk`.

***

#### analyticsEnabled?

> `optional` **analyticsEnabled?**: `boolean`

Defined in: [src/config/sdk-config.ts:14](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/config/sdk-config.ts#L14)

Amplitude read telemetry (default on; opt out with `analyticsEnabled: false`).

***

#### analyticsWalletAddress?

> `optional` **analyticsWalletAddress?**: `string`

Defined in: [src/config/sdk-config.ts:27](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/config/sdk-config.ts#L27)

Default wallet for read telemetry `user_id` when args omit an address (e.g. MCP session signer with `CELO_PRIVATE_KEY`).

***

#### ethRpcUrl?

> `optional` **ethRpcUrl?**: `string`

Defined in: [src/config/sdk-config.ts:8](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/config/sdk-config.ts#L8)

Ethereum mainnet RPC for ENS resolution (optional).

***

#### rpcUrl

> **rpcUrl**: `string`

Defined in: [src/config/sdk-config.ts:6](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/config/sdk-config.ts#L6)

Celo mainnet JSON-RPC URL (default Forno).

***

#### selfAgentPrivateKey?

> `optional` **selfAgentPrivateKey?**: `` `0x${string}` ``

Defined in: [src/config/sdk-config.ts:10](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/config/sdk-config.ts#L10)

Self Agent ID signing key (Node only; also reads `SELF_AGENT_PRIVATE_KEY`).

***

#### selfApiBase?

> `optional` **selfApiBase?**: `string`

Defined in: [src/config/sdk-config.ts:12](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/config/sdk-config.ts#L12)

Self Agent ID REST API base (default https://app.ai.self.xyz).
