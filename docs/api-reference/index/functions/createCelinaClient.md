[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / createCelinaClient

# Function: createCelinaClient()

> **createCelinaClient**(`opts?`): [`CelinaClient`](../interfaces/CelinaClient.md)

Defined in: [src/index.ts:68](https://github.com/andrewkimjoseph/celina-sdk/blob/c8c0fb8f17b5cd5514c6ff9cfdad7b0056765f2d/src/index.ts#L68)

Create a Celina client for Celo mainnet reads and unsigned tx preparation.
No private keys — pass prepared `steps` to wagmi/viem for wallet signing.

## Parameters

### opts?

`Partial`\<[`SdkConfig`](../interfaces/SdkConfig.md)\>

## Returns

[`CelinaClient`](../interfaces/CelinaClient.md)
