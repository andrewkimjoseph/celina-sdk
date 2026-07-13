[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / appendCelinaCalldataTag

# Function: appendCelinaCalldataTag()

> **appendCelinaCalldataTag**(`data`, `attributionTags?`): `` `0x${string}` ``

Defined in: [src/config/celina-tag.ts:166](https://github.com/andrewkimjoseph/celina-sdk/blob/15eb03644ed64e7dabf36462c8a85f34a3beaae2/src/config/celina-tag.ts#L166)

Append legacy UTF-8 and ERC-8021 attribution suffixes to calldata.

## Parameters

### data

`` `0x${string}` ``

Original transaction calldata.

### attributionTags?

`string`[]

Optional tags from `createCelinaClient({ attributionTags })`.
  Legacy layer: `CELINA|TAG1|TAG2` (app tags uppercase, `celo_<12 hex>` lowercase).
  ERC-8021 layer: `toDataSuffix(["celina", ...])` with lowercase codes.

## Returns

`` `0x${string}` ``
