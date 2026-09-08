[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / appendCelinaCalldataTag

# Function: appendCelinaCalldataTag()

> **appendCelinaCalldataTag**(`data`, `attributionTags?`): `` `0x${string}` ``

Defined in: [src/config/celina-tag.ts:238](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/config/celina-tag.ts#L238)

Append Celina ERC-8021 Schema 0 attribution to calldata (no legacy UTF-8 `CELINA|...`).

Used by `prepare*` when `createCelinaClient({ attributionTags })` is set, and by
`createAAClient({ attributionTags }).sendPreparedFlow` when AA tags are set.

## Parameters

### data

`` `0x${string}` ``

Original transaction calldata.

### attributionTags?

`string`[]

Optional custom tags (same list semantics on Celina or AA client).
  ERC-8021: `toDataSuffix(["celina", ...])` with lowercase codes.
  Example: `["goclaim"]` -> codes `celina`, `goclaim`.
  Existing legacy UTF-8 on `data` is left in place; a matching ERC-8021 suffix is ensured.

## Returns

`` `0x${string}` ``
