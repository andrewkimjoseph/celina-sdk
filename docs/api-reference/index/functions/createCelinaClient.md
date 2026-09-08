[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / createCelinaClient

# Function: createCelinaClient()

> **createCelinaClient**(`opts?`): [`CelinaClient`](../interfaces/CelinaClient.md)

Defined in: [src/index.ts:91](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/index.ts#L91)

Create a Celina client for Celo mainnet reads and unsigned tx preparation.
No private keys — pass prepared `steps` to wagmi/viem for wallet signing.

## Parameters

### opts?

[`CelinaClientOptions`](../type-aliases/CelinaClientOptions.md)

## Returns

[`CelinaClient`](../interfaces/CelinaClient.md)

## Remarks

**Server-side only.** Celina SDK includes server-native dependencies
(`@agentkarma/sdk`, `@celo/attribution-tags`) that cannot be bundled for
the browser. Import only from Node.js environments — API routes, background
workers, or CLI scripts.
