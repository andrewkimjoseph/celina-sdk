[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [types/prepared](../README.md) / PreparedTx

# Interface: PreparedTx

Defined in: [src/types/prepared.ts:9](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/types/prepared.ts#L9)

One unsigned transaction in a prepared list (`steps`).
Calldata may already include Celina ERC-8021 attribution from `prepare*`.

## Properties

### data?

> `optional` **data?**: `` `0x${string}` ``

Defined in: [src/types/prepared.ts:13](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/types/prepared.ts#L13)

***

### description

> **description**: `string`

Defined in: [src/types/prepared.ts:16](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/types/prepared.ts#L16)

***

### kind

> **kind**: [`PreparedTxKind`](../type-aliases/PreparedTxKind.md)

Defined in: [src/types/prepared.ts:11](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/types/prepared.ts#L11)

Step category for UI and wallet routing.

***

### to

> **to**: `` `0x${string}` ``

Defined in: [src/types/prepared.ts:12](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/types/prepared.ts#L12)

***

### value?

> `optional` **value?**: `string`

Defined in: [src/types/prepared.ts:15](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/types/prepared.ts#L15)

Wei amount as decimal string for JSON serialization
