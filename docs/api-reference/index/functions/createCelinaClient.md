[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / createCelinaClient

# Function: createCelinaClient()

> **createCelinaClient**(`opts?`): [`CelinaClient`](../interfaces/CelinaClient.md)

Defined in: [src/index.ts:65](https://github.com/andrewkimjoseph/celina-sdk/blob/671d3f90a836646c5a311cc0f8c6691cf3fc4dad/src/index.ts#L65)

Create a Celina client for Celo mainnet reads and unsigned tx preparation.
No private keys — pass prepared `steps` to wagmi/viem for wallet signing.

## Parameters

### opts?

`Partial`\<[`SdkConfig`](../interfaces/SdkConfig.md)\>

## Returns

[`CelinaClient`](../interfaces/CelinaClient.md)
