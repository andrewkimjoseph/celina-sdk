[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / buildCelinaAttributionTag

# ~~Function: buildCelinaAttributionTag()~~

> **buildCelinaAttributionTag**(`tags?`): `string`

Defined in: [src/config/celina-tag.ts:45](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/config/celina-tag.ts#L45)

Build deterministic legacy UTF-8 tag string (`CELINA` / `CELINA|TAG…`).

## Parameters

### tags?

`string`[]

## Returns

`string`

## Deprecated

Prefer ERC-8021 via [appendCelinaCalldataTag](appendCelinaCalldataTag.md) / [toErc8021AttributionCodes](toErc8021AttributionCodes.md). Kept for historical decode helpers and tests.
