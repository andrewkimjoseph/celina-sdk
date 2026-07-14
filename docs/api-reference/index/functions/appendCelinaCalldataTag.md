[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / appendCelinaCalldataTag

# Function: appendCelinaCalldataTag()

> **appendCelinaCalldataTag**(`data`, `attributionTags?`): `` `0x${string}` ``

Defined in: [src/config/celina-tag.ts:201](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/config/celina-tag.ts#L201)

Append dual Celina attribution suffixes to calldata (legacy UTF-8 + ERC-8021).

Used by `prepare*` when `createCelinaClient({ attributionTags })` is set, and by
`createAAClient({ attributionTags }).sendPreparedFlow` when AA tags are set.

## Parameters

### data

`` `0x${string}` ``

Original transaction calldata.

### attributionTags?

`string`[]

Optional custom tags (same list semantics on Celina or AA client).
  Legacy layer: `CELINA|TAG1|TAG2` (app tags uppercase, `celo_<12 hex>` lowercase).
  ERC-8021 layer: `toDataSuffix(["celina", ...])` with lowercase codes.
  Example: `["goclaim"]` → legacy `CELINA|GOCLAIM` + codes `celina`, `goclaim` (not bare UTF-8 `GOCLAIM`).

## Returns

`` `0x${string}` ``
