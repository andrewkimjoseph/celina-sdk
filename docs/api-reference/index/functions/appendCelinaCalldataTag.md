[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / appendCelinaCalldataTag

# Function: appendCelinaCalldataTag()

> **appendCelinaCalldataTag**(`data`, `attributionTags?`): `` `0x${string}` ``

Defined in: [src/config/celina-tag.ts:43](https://github.com/andrewkimjoseph/celina-sdk/blob/852f4654b3367c2e99db65ab17e2cfcd145a3d0e/src/config/celina-tag.ts#L43)

Append CELINA attribution suffix to calldata; no-op when empty or already tagged.

## Parameters

### data

`` `0x${string}` ``

Original transaction calldata.

### attributionTags?

`string`[]

Optional tags from `createCelinaClient({ attributionTags })`.
  Appended after `CELINA` as `CELINA|TAG1|TAG2`. App tags normalize uppercase;
  `celo_<12 hex>` tags canonicalize lowercase. Omitted or empty → suffix is `CELINA` only.

## Returns

`` `0x${string}` ``
