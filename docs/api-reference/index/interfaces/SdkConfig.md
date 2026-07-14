[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / SdkConfig

# Interface: SdkConfig

Defined in: [src/config/sdk-config.ts:4](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/config/sdk-config.ts#L4)

RPC configuration for `createCelinaClient()`.

## Properties

### amplitudeApiKey?

> `optional` **amplitudeApiKey?**: `string`

Defined in: [src/config/sdk-config.ts:16](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/config/sdk-config.ts#L16)

Override bundled Amplitude project API key.

***

### analyticsDeviceId?

> `optional` **analyticsDeviceId?**: `string`

Defined in: [src/config/sdk-config.ts:22](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/config/sdk-config.ts#L22)

Amplitude `device_id`. When omitted, auto-detected from the consuming package
`package.json` name (sanitized, e.g. `celeste_ai`, `andrewkimjoseph_celina_mcp`),
then `celina-sdk`.

***

### analyticsEnabled?

> `optional` **analyticsEnabled?**: `boolean`

Defined in: [src/config/sdk-config.ts:14](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/config/sdk-config.ts#L14)

Amplitude read telemetry (default on; opt out with `analyticsEnabled: false`).

***

### analyticsWalletAddress?

> `optional` **analyticsWalletAddress?**: `string`

Defined in: [src/config/sdk-config.ts:27](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/config/sdk-config.ts#L27)

Default wallet for read telemetry `user_id` when args omit an address
(e.g. MCP session signer with `CELO_PRIVATE_KEY`).

***

### attributionTags?

> `optional` **attributionTags?**: `string`[]

Defined in: [src/config/sdk-config.ts:38](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/config/sdk-config.ts#L38)

Optional custom calldata attribution tags appended after the base `CELINA`
suffix on prepared transaction steps (`CELINA|TAG1|TAG2`, deduped, stable order).
An ERC-8021 Schema 0 suffix (`toDataSuffix`) is also appended for Celo ecosystem
leaderboards and `verifyTx` compatibility.

App tags (e.g. `celeste_ai`) normalize to uppercase (`CELESTE_AI`).
Celo Builders on-chain tags matching `celo_<12 hex>` canonicalize to lowercase
(e.g. `celo_862c21dd97a7`). The literal tag `CELINA` is never duplicated.

***

### ethRpcUrl?

> `optional` **ethRpcUrl?**: `string`

Defined in: [src/config/sdk-config.ts:8](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/config/sdk-config.ts#L8)

Ethereum mainnet RPC for ENS resolution (optional).

***

### rpcUrl

> **rpcUrl**: `string`

Defined in: [src/config/sdk-config.ts:6](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/config/sdk-config.ts#L6)

Celo mainnet JSON-RPC URL (default Forno).

***

### selfAgentPrivateKey?

> `optional` **selfAgentPrivateKey?**: `` `0x${string}` ``

Defined in: [src/config/sdk-config.ts:10](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/config/sdk-config.ts#L10)

Self Agent ID signing key (Node only; also reads `SELF_AGENT_PRIVATE_KEY`).

***

### selfApiBase?

> `optional` **selfApiBase?**: `string`

Defined in: [src/config/sdk-config.ts:12](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/config/sdk-config.ts#L12)

Self Agent ID REST API base (default https://app.ai.self.xyz).
