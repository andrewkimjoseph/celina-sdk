[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / parsePrivateKeyEnv

# Function: parsePrivateKeyEnv()

> **parsePrivateKeyEnv**(`raw`, `envName`): `` `0x${string}` `` \| `undefined`

Defined in: [src/utils/normalize-private-key.ts:11](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/utils/normalize-private-key.ts#L11)

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
