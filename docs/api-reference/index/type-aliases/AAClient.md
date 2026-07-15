[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / AAClient

# Type Alias: AAClient

> **AAClient** = `object`

Defined in: [src/aa/create-aa-client.ts:67](https://github.com/andrewkimjoseph/celina-sdk/blob/803e5c819a719bbad9f14a8e908c65269e1b7f36/src/aa/create-aa-client.ts#L67)

## Properties

### attributionTags

> **attributionTags**: `string`[] \| `undefined`

Defined in: [src/aa/create-aa-client.ts:80](https://github.com/andrewkimjoseph/celina-sdk/blob/803e5c819a719bbad9f14a8e908c65269e1b7f36/src/aa/create-aa-client.ts#L80)

Tags applied in `sendPreparedFlow` via `appendCelinaCalldataTag`.
`undefined` means step `data` is passed through unchanged.

***

### eoaAddress

> **eoaAddress**: `` `0x${string}` ``

Defined in: [src/aa/create-aa-client.ts:71](https://github.com/andrewkimjoseph/celina-sdk/blob/803e5c819a719bbad9f14a8e908c65269e1b7f36/src/aa/create-aa-client.ts#L71)

EOA that owns the smart account.

***

### gasSponsorship

> **gasSponsorship**: [`GasSponsorshipService`](../classes/GasSponsorshipService.md)

Defined in: [src/aa/create-aa-client.ts:75](https://github.com/andrewkimjoseph/celina-sdk/blob/803e5c819a719bbad9f14a8e908c65269e1b7f36/src/aa/create-aa-client.ts#L75)

Underlying sponsorship service (URLs, paymaster, fees).

***

### provider

> **provider**: [`GasSponsorshipProviderId`](GasSponsorshipProviderId.md)

Defined in: [src/aa/create-aa-client.ts:69](https://github.com/andrewkimjoseph/celina-sdk/blob/803e5c819a719bbad9f14a8e908c65269e1b7f36/src/aa/create-aa-client.ts#L69)

Gas sponsorship backend id (e.g. `"pimlico"`).

***

### sendPreparedFlow

> **sendPreparedFlow**: (`flow`, `options?`) => `Promise`\<[`SendPreparedFlowResult`](SendPreparedFlowResult.md)\>

Defined in: [src/aa/create-aa-client.ts:86](https://github.com/andrewkimjoseph/celina-sdk/blob/803e5c819a719bbad9f14a8e908c65269e1b7f36/src/aa/create-aa-client.ts#L86)

Submit `prepare*` output (ordered `steps` / prepared transactions) as sponsored UserOp(s).
When `attributionTags` were set on this client, each step’s `data` is dual-tagged
before submit; otherwise `data` is used as-is (including tags from `prepare*`).

#### Parameters

##### flow

[`PreparedFlow`](../../types/prepared/interfaces/PreparedFlow.md) \| [`SerializedPreparedFlow`](../../types/prepared/interfaces/SerializedPreparedFlow.md)

##### options?

[`SendPreparedFlowOptions`](SendPreparedFlowOptions.md)

#### Returns

`Promise`\<[`SendPreparedFlowResult`](SendPreparedFlowResult.md)\>

***

### smartAccountAddress

> **smartAccountAddress**: `` `0x${string}` ``

Defined in: [src/aa/create-aa-client.ts:73](https://github.com/andrewkimjoseph/celina-sdk/blob/803e5c819a719bbad9f14a8e908c65269e1b7f36/src/aa/create-aa-client.ts#L73)

Counterfactual / deployed Simple Smart Account address.
