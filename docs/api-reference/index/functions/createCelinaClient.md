[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / createCelinaClient

# Function: createCelinaClient()

> **createCelinaClient**(`opts?`): [`CelinaClient`](../interfaces/CelinaClient.md)

Defined in: [src/index.ts:90](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/index.ts#L90)

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
