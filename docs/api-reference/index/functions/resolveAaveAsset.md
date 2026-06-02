[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / resolveAaveAsset

# Function: resolveAaveAsset()

> **resolveAaveAsset**(`token`): [`AaveAsset`](../type-aliases/AaveAsset.md)

Defined in: [src/config/aave.ts:66](https://github.com/andrewkimjoseph/celina-sdk/blob/66d378efc4d326c1d282d6fbce18abc9daeb353d/src/config/aave.ts#L66)

Resolve an Aave V3 Celo asset by symbol or underlying/aToken address.

## Parameters

### token

`string`

Registry symbol or hex address

## Returns

[`AaveAsset`](../type-aliases/AaveAsset.md)

## Throws

When the token is not listed in `AAVE_SUPPORTED_SYMBOLS`
