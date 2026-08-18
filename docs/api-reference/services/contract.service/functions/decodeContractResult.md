[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/contract.service](../README.md) / decodeContractResult

# Function: decodeContractResult()

> **decodeContractResult**(`abi`, `functionName`, `data`): readonly `unknown`[]

Defined in: [src/services/contract.service.ts:220](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/contract.service.ts#L220)

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
