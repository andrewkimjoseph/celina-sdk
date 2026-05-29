[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [types/prepared](../README.md) / SerializedPreparedFlow

# Interface: SerializedPreparedFlow

Defined in: [src/types/prepared.ts:25](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/types/prepared.ts#L25)

JSON-safe prepared flow returned by prepare* tools and chat APIs.
Consumers (celina-agent TxConfirmCard, wagmi) iterate steps and call sendTransaction.

## Extends

- `Omit`\<[`PreparedFlow`](PreparedFlow.md), `"steps"`\>

## Properties

### from

> **from**: `` `0x${string}` ``

Defined in: [src/types/prepared.ts:18](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/types/prepared.ts#L18)

#### Inherited from

[`PreparedFlow`](PreparedFlow.md).[`from`](PreparedFlow.md#from)

***

### network

> **network**: `"mainnet"`

Defined in: [src/types/prepared.ts:17](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/types/prepared.ts#L17)

#### Inherited from

[`PreparedFlow`](PreparedFlow.md).[`network`](PreparedFlow.md#network)

***

### preparedFlow

> **preparedFlow**: `true`

Defined in: [src/types/prepared.ts:27](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/types/prepared.ts#L27)

***

### steps

> **steps**: [`PreparedTx`](PreparedTx.md)[]

Defined in: [src/types/prepared.ts:26](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/types/prepared.ts#L26)

***

### summary

> **summary**: `string`

Defined in: [src/types/prepared.ts:16](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/types/prepared.ts#L16)

#### Inherited from

[`PreparedFlow`](PreparedFlow.md).[`summary`](PreparedFlow.md#summary)
