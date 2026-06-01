[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / createCelinaClient

# Function: createCelinaClient()

> **createCelinaClient**(`opts?`): [`CelinaClient`](../interfaces/CelinaClient.md)

Defined in: [src/index.ts:68](https://github.com/andrewkimjoseph/celina-sdk/blob/f8728c3a6e17d8fef70a1fbf6a9b27bff61756e1/src/index.ts#L68)

Create a Celina client for Celo mainnet reads and unsigned tx preparation.
No private keys — pass prepared `steps` to wagmi/viem for wallet signing.

## Parameters

### opts?

`Partial`\<[`SdkConfig`](../interfaces/SdkConfig.md)\>

## Returns

[`CelinaClient`](../interfaces/CelinaClient.md)
