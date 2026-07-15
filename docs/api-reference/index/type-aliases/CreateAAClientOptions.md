[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / CreateAAClientOptions

# Type Alias: CreateAAClientOptions

> **CreateAAClientOptions** = `object`

Defined in: [src/aa/types.ts:28](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/aa/types.ts#L28)

Options for [createAAClient](../functions/createAAClient.md).

Set `attributionTags` here for hand-built prepared steps (tagged at `sendPreparedFlow`).
For `prepare*` flows, you can set the same tags on `createCelinaClient` instead —
use one consistent list per send path so suffixes do not stack with mismatched tags.

## Properties

### attributionTags?

> `optional` **attributionTags?**: `string`[]

Defined in: [src/aa/types.ts:40](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/aa/types.ts#L40)

Optional custom tags applied via `appendCelinaCalldataTag` on each step's `data`
in `sendPreparedFlow` (ERC-8021 Schema 0). When omitted, step data
is passed through unchanged.

***

### gasSponsorship

> **gasSponsorship**: [`GasSponsorshipConfig`](GasSponsorshipConfig.md)

Defined in: [src/aa/types.ts:32](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/aa/types.ts#L32)

Explicit sponsorship provider + credentials.

***

### owner

> **owner**: `PrivateKeyAccount` \| `Hex`

Defined in: [src/aa/types.ts:30](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/aa/types.ts#L30)

EOA owner of the Simple Smart Account (account or private key hex).

***

### publicClient?

> `optional` **publicClient?**: `PublicClient`

Defined in: [src/aa/types.ts:34](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/aa/types.ts#L34)

Optional Celo public client; defaults to Forno mainnet.
