[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / checkAttributionInCalldata

# Function: checkAttributionInCalldata()

> **checkAttributionInCalldata**(`data`, `tag?`): [`AttributionCheckResult`](../type-aliases/AttributionCheckResult.md)

Defined in: [src/config/celina-tag.ts:215](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/config/celina-tag.ts#L215)

Decode ERC-8021 attribution from calldata with a lowercase `tags` list that mirrors `erc8021.codes`.
Prefer this for "what tags are on this tx?"; use [verifyAttributionInCalldata](verifyAttributionInCalldata.md) for the raw layer only.

## Parameters

### data

`` `0x${string}` ``

### tag?

`string`

## Returns

[`AttributionCheckResult`](../type-aliases/AttributionCheckResult.md)
