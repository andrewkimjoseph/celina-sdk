[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / checkAttributionInCalldata

# Function: checkAttributionInCalldata()

> **checkAttributionInCalldata**(`data`, `tag?`): [`AttributionCheckResult`](../type-aliases/AttributionCheckResult.md)

Defined in: [src/config/celina-tag.ts:258](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/config/celina-tag.ts#L258)

Decode attribution from calldata with a unified custom `tags` list.
Prefer this for “what tags are on this tx?”; use [verifyAttributionInCalldata](verifyAttributionInCalldata.md) for the raw layers only.

## Parameters

### data

`` `0x${string}` ``

### tag?

`string`

## Returns

[`AttributionCheckResult`](../type-aliases/AttributionCheckResult.md)
