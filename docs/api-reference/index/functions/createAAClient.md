[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / createAAClient

# Function: createAAClient()

> **createAAClient**(`options`): `Promise`\<[`AAClient`](../type-aliases/AAClient.md)\>

Defined in: [src/aa/create-aa-client.ts:102](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/aa/create-aa-client.ts#L102)

Create an ERC-4337 AA client on Celo mainnet (Simple Smart Account, EntryPoint 0.7).

Pass an explicit `gasSponsorship` provider object — credentials are app-owned
and never stored by Celina. v1 supports `provider: "pimlico"`.

Optional `attributionTags` are applied in `sendPreparedFlow` via
`appendCelinaCalldataTag` (same ERC-8021 format as `prepare*`). Omit them to
pass step calldata through unchanged.

## Parameters

### options

[`CreateAAClientOptions`](../type-aliases/CreateAAClientOptions.md)

## Returns

`Promise`\<[`AAClient`](../type-aliases/AAClient.md)\>
