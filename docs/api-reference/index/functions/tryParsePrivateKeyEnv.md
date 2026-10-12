[**@cnvlabskoxyz/celina-sdk**](../../README.md)

***

[@cnvlabskoxyz/celina-sdk](../../README.md) / [index](../README.md) / tryParsePrivateKeyEnv

# Function: tryParsePrivateKeyEnv()

> **tryParsePrivateKeyEnv**(`raw`, `envName`): `object`

Defined in: [src/utils/normalize-private-key.ts:11](https://github.com/andrewkimjoseph/celina-sdk/blob/2b7487815780d780ca38b8d2b9ce505b311839e0/src/utils/normalize-private-key.ts#L11)

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
