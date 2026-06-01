[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [types/prepared](../README.md) / SerializedPreparedFlow

# Interface: SerializedPreparedFlow

Defined in: [src/types/prepared.ts:26](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/types/prepared.ts#L26)

JSON-safe prepared flow returned by prepare* tools and chat APIs.
Consumers (celina-agent TxConfirmCard, wagmi) iterate steps and call sendTransaction.

## Extends

- `Omit`\<[`PreparedFlow`](PreparedFlow.md), `"steps"`\>

## Properties

### from

> **from**: `` `0x${string}` ``

Defined in: [src/types/prepared.ts:19](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/types/prepared.ts#L19)

#### Inherited from

[`PreparedFlow`](PreparedFlow.md).[`from`](PreparedFlow.md#from)

***

### network

> **network**: `"mainnet"`

Defined in: [src/types/prepared.ts:18](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/types/prepared.ts#L18)

#### Inherited from

[`PreparedFlow`](PreparedFlow.md).[`network`](PreparedFlow.md#network)

***

### preparedFlow

> **preparedFlow**: `true`

Defined in: [src/types/prepared.ts:28](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/types/prepared.ts#L28)

***

### steps

> **steps**: [`PreparedTx`](PreparedTx.md)[]

Defined in: [src/types/prepared.ts:27](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/types/prepared.ts#L27)

***

### summary

> **summary**: `string`

Defined in: [src/types/prepared.ts:17](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/types/prepared.ts#L17)

#### Inherited from

[`PreparedFlow`](PreparedFlow.md).[`summary`](PreparedFlow.md#summary)
