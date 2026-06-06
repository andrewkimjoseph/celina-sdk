[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / resolveAaveAsset

# Function: resolveAaveAsset()

> **resolveAaveAsset**(`token`): [`AaveAsset`](../type-aliases/AaveAsset.md)

Defined in: [src/config/aave.ts:66](https://github.com/andrewkimjoseph/celina-sdk/blob/e071b6ef176a1c725fb3cc7d17c5bc0b9767d108/src/config/aave.ts#L66)

Resolve an Aave V3 Celo asset by symbol or underlying/aToken address.

## Parameters

### token

`string`

Registry symbol or hex address

## Returns

[`AaveAsset`](../type-aliases/AaveAsset.md)

## Throws

When the token is not listed in `AAVE_SUPPORTED_SYMBOLS`
