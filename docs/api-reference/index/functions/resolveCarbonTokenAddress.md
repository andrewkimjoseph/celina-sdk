[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / resolveCarbonTokenAddress

# Function: resolveCarbonTokenAddress()

> **resolveCarbonTokenAddress**(`tokenService`, `tokenOrAddress`): `` `0x${string}` ``

Defined in: [src/utils/carbon-token.ts:21](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/utils/carbon-token.ts#L21)

Resolve a Carbon token symbol or address to a concrete `0x` ERC-20 address.
CELO registry entries map to WCELO/MENTO collateral (Carbon does not accept `"native"`).

## Parameters

### tokenService

[`TokenService`](../../services/token.service/classes/TokenService.md)

### tokenOrAddress

`string`

## Returns

`` `0x${string}` ``
