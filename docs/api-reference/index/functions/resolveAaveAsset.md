[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / resolveAaveAsset

# Function: resolveAaveAsset()

> **resolveAaveAsset**(`token`): [`AaveAsset`](../type-aliases/AaveAsset.md)

Defined in: [src/config/aave.ts:66](https://github.com/andrewkimjoseph/celina-sdk/blob/970ab720c805303ead8b20406c6579ecdcf2193a/src/config/aave.ts#L66)

Resolve an Aave V3 Celo asset by symbol or underlying/aToken address.

## Parameters

### token

`string`

Registry symbol or hex address

## Returns

[`AaveAsset`](../type-aliases/AaveAsset.md)

## Throws

When the token is not listed in `AAVE_SUPPORTED_SYMBOLS`
