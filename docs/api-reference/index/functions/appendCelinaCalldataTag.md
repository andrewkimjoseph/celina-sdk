[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / appendCelinaCalldataTag

# Function: appendCelinaCalldataTag()

> **appendCelinaCalldataTag**(`data`, `attributionTags?`): `` `0x${string}` ``

Defined in: [src/config/celina-tag.ts:281](https://github.com/andrewkimjoseph/celina-sdk/blob/803e5c819a719bbad9f14a8e908c65269e1b7f36/src/config/celina-tag.ts#L281)

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
