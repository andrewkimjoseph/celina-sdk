[**@cnvlabskoxyz/celina-sdk**](../../README.md)

***

[@cnvlabskoxyz/celina-sdk](../../README.md) / [index](../README.md) / parsePrivateKeyEnv

# Function: parsePrivateKeyEnv()

> **parsePrivateKeyEnv**(`raw`, `envName`): `` `0x${string}` `` \| `undefined`

Defined in: [src/utils/normalize-private-key.ts:39](https://github.com/andrewkimjoseph/celina-sdk/blob/2b7487815780d780ca38b8d2b9ce505b311839e0/src/utils/normalize-private-key.ts#L39)

Parse and normalize a private key from an environment variable or config string.
Accepts 64 hex characters with or without a 0x prefix.

## Parameters

### raw

`string` \| `undefined`

Raw env value

### envName

`string`

Used in error messages when invalid

## Returns

`` `0x${string}` `` \| `undefined`

Normalized `0x`-prefixed key, or undefined when unset/blank
