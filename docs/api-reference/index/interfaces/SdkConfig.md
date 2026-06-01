[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / SdkConfig

# Interface: SdkConfig

Defined in: [src/config/sdk-config.ts:2](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/config/sdk-config.ts#L2)

RPC configuration for `createCelinaClient()`.

## Properties

### amplitudeApiKey?

> `optional` **amplitudeApiKey?**: `string`

Defined in: [src/config/sdk-config.ts:18](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/config/sdk-config.ts#L18)

Override bundled Amplitude project API key.

***

### analyticsDeviceId?

> `optional` **analyticsDeviceId?**: `string`

Defined in: [src/config/sdk-config.ts:20](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/config/sdk-config.ts#L20)

Amplitude `device_id` (default `celina-sdk`).

***

### analyticsEnabled?

> `optional` **analyticsEnabled?**: `boolean`

Defined in: [src/config/sdk-config.ts:16](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/config/sdk-config.ts#L16)

Amplitude read telemetry (default on; opt out with `false` or `CELINA_ANALYTICS_DISABLED=1`).

***

### carbonRestBaseUrl?

> `optional` **carbonRestBaseUrl?**: `string`

Defined in: [src/config/sdk-config.ts:8](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/config/sdk-config.ts#L8)

Carbon DeFi REST API base URL (default https://mcp.carbondefi.xyz).

***

### carbonSdkFallback?

> `optional` **carbonSdkFallback?**: `boolean`

Defined in: [src/config/sdk-config.ts:10](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/config/sdk-config.ts#L10)

Enable @bancor/carbon-sdk fallback when REST fails (default true).

***

### ethRpcUrl?

> `optional` **ethRpcUrl?**: `string`

Defined in: [src/config/sdk-config.ts:6](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/config/sdk-config.ts#L6)

Ethereum mainnet RPC for ENS resolution (optional).

***

### rpcUrl

> **rpcUrl**: `string`

Defined in: [src/config/sdk-config.ts:4](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/config/sdk-config.ts#L4)

Celo mainnet JSON-RPC URL (default Forno).

***

### selfAgentPrivateKey?

> `optional` **selfAgentPrivateKey?**: `` `0x${string}` ``

Defined in: [src/config/sdk-config.ts:12](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/config/sdk-config.ts#L12)

Self Agent ID signing key (Node only; also reads `SELF_AGENT_PRIVATE_KEY`).

***

### selfApiBase?

> `optional` **selfApiBase?**: `string`

Defined in: [src/config/sdk-config.ts:14](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/config/sdk-config.ts#L14)

Self Agent ID REST API base (default https://app.ai.self.xyz).
