# createCelinaClient

[**@andrewkimjoseph/celina-sdk**](../../)

***

[@andrewkimjoseph/celina-sdk](../../) / [index](https://github.com/andrewkimjoseph/celina-sdk/blob/main/docs/api-reference/index/README.md) / createCelinaClient

## Function: createCelinaClient()

> **createCelinaClient**(`opts?`): [`CelinaClient`](../interfaces/CelinaClient.md)

Defined in: [src/index.ts:81](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/index.ts#L81)

Create a Celina client for Celo mainnet reads and unsigned tx preparation. No private keys — pass prepared `steps` to wagmi/viem for wallet signing.

### Parameters

#### opts?

[`CelinaClientOptions`](../type-aliases/CelinaClientOptions.md)

### Returns

[`CelinaClient`](../interfaces/CelinaClient.md)
