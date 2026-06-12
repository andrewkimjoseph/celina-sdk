[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [types/prepared](../README.md) / PreparedTx

# Interface: PreparedTx

Defined in: [src/types/prepared.ts:4](https://github.com/andrewkimjoseph/celina-sdk/blob/671d3f90a836646c5a311cc0f8c6691cf3fc4dad/src/types/prepared.ts#L4)

Single unsigned transaction step in a prepared flow.

## Properties

### data?

> `optional` **data?**: `` `0x${string}` ``

Defined in: [src/types/prepared.ts:8](https://github.com/andrewkimjoseph/celina-sdk/blob/671d3f90a836646c5a311cc0f8c6691cf3fc4dad/src/types/prepared.ts#L8)

***

### description

> **description**: `string`

Defined in: [src/types/prepared.ts:11](https://github.com/andrewkimjoseph/celina-sdk/blob/671d3f90a836646c5a311cc0f8c6691cf3fc4dad/src/types/prepared.ts#L11)

***

### kind

> **kind**: [`PreparedTxKind`](../type-aliases/PreparedTxKind.md)

Defined in: [src/types/prepared.ts:6](https://github.com/andrewkimjoseph/celina-sdk/blob/671d3f90a836646c5a311cc0f8c6691cf3fc4dad/src/types/prepared.ts#L6)

Step category for UI and wallet routing.

***

### to

> **to**: `` `0x${string}` ``

Defined in: [src/types/prepared.ts:7](https://github.com/andrewkimjoseph/celina-sdk/blob/671d3f90a836646c5a311cc0f8c6691cf3fc4dad/src/types/prepared.ts#L7)

***

### value?

> `optional` **value?**: `string`

Defined in: [src/types/prepared.ts:10](https://github.com/andrewkimjoseph/celina-sdk/blob/671d3f90a836646c5a311cc0f8c6691cf3fc4dad/src/types/prepared.ts#L10)

Wei amount as decimal string for JSON serialization
