[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / createCelinaClient

# Function: createCelinaClient()

> **createCelinaClient**(`opts?`): [`CelinaClient`](../interfaces/CelinaClient.md)

Defined in: [src/index.ts:81](https://github.com/andrewkimjoseph/celina-sdk/blob/2666667daf96a6fd5a7d6a6940f387cab3e7887d/src/index.ts#L81)

Create a Celina client for Celo mainnet reads and unsigned tx preparation.
No private keys — pass prepared `steps` to wagmi/viem for wallet signing.

## Parameters

### opts?

[`CelinaClientOptions`](../type-aliases/CelinaClientOptions.md)

## Returns

[`CelinaClient`](../interfaces/CelinaClient.md)
