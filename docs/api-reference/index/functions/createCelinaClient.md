[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / createCelinaClient

# Function: createCelinaClient()

> **createCelinaClient**(`opts?`): [`CelinaClient`](../interfaces/CelinaClient.md)

Defined in: [src/index.ts:61](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/index.ts#L61)

Create a Celina client for Celo mainnet reads and unsigned tx preparation.
No private keys — pass prepared `steps` to wagmi/viem for wallet signing.

## Parameters

### opts?

`Partial`\<[`SdkConfig`](../interfaces/SdkConfig.md)\>

## Returns

[`CelinaClient`](../interfaces/CelinaClient.md)
