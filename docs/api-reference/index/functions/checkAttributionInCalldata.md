[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / checkAttributionInCalldata

# Function: checkAttributionInCalldata()

> **checkAttributionInCalldata**(`data`, `tag?`): [`AttributionCheckResult`](../type-aliases/AttributionCheckResult.md)

Defined in: [src/config/celina-tag.ts:178](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/config/celina-tag.ts#L178)

Decode attribution from calldata with a unified custom `tags` list.
Prefer this for “what tags are on this tx?”; use [verifyAttributionInCalldata](verifyAttributionInCalldata.md) for the raw layers only.

## Parameters

### data

`` `0x${string}` ``

### tag?

`string`

## Returns

[`AttributionCheckResult`](../type-aliases/AttributionCheckResult.md)
