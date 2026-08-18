[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / tryParsePrivateKeyEnv

# Function: tryParsePrivateKeyEnv()

> **tryParsePrivateKeyEnv**(`raw`, `envName`): `object`

Defined in: [src/utils/normalize-private-key.ts:11](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/utils/normalize-private-key.ts#L11)

Parse and normalize a private key without throwing.
Accepts 64 hex characters with or without a 0x prefix.

## Parameters

### raw

`string` \| `undefined`

### envName

`string`

## Returns

`object`

### error?

> `optional` **error?**: `string`

### value?

> `optional` **value?**: `` `0x${string}` ``
