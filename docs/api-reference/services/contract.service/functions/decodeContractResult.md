[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/contract.service](../README.md) / decodeContractResult

# Function: decodeContractResult()

> **decodeContractResult**(`abi`, `functionName`, `data`): readonly `unknown`[]

Defined in: [src/services/contract.service.ts:152](https://github.com/andrewkimjoseph/celina-sdk/blob/671d3f90a836646c5a311cc0f8c6691cf3fc4dad/src/services/contract.service.ts#L152)

Decode raw calldata result bytes using a single ABI function entry.

## Parameters

### abi

`Abi`

Contract ABI containing `functionName`

### functionName

`string`

Function whose return types define decoding

### data

`` `0x${string}` ``

Hex return data from `eth_call`

## Returns

readonly `unknown`[]
