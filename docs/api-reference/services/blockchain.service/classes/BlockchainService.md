[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/blockchain.service](../README.md) / BlockchainService

# Class: BlockchainService

Defined in: [src/services/blockchain.service.ts:3](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/blockchain.service.ts#L3)

## Constructors

### Constructor

> **new BlockchainService**(`clientFactory`): `BlockchainService`

Defined in: [src/services/blockchain.service.ts:4](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/blockchain.service.ts#L4)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`BlockchainService`

## Methods

### getBlock()

> **getBlock**(`blockId`, `options?`): `Promise`\<\{ `gasLimit`: `string`; `gasUsed`: `string`; `gasUtilization`: `number`; `hash`: `` `0x${string}` `` \| `null`; `miner`: `` `0x${string}` ``; `number`: `string` \| `undefined`; `parentHash`: `` `0x${string}` ``; `timestamp`: `string`; `transactionCount`: `number`; `transactions`: `` `0x${string}` ``[] \| `undefined`; \}\>

Defined in: [src/services/blockchain.service.ts:23](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/blockchain.service.ts#L23)

#### Parameters

##### blockId

`string` \| `number`

##### options?

###### includeTransactions?

`boolean`

#### Returns

`Promise`\<\{ `gasLimit`: `string`; `gasUsed`: `string`; `gasUtilization`: `number`; `hash`: `` `0x${string}` `` \| `null`; `miner`: `` `0x${string}` ``; `number`: `string` \| `undefined`; `parentHash`: `` `0x${string}` ``; `timestamp`: `string`; `transactionCount`: `number`; `transactions`: `` `0x${string}` ``[] \| `undefined`; \}\>

***

### getLatestBlocks()

> **getLatestBlocks**(`count?`, `offset?`): `Promise`\<`object`[]\>

Defined in: [src/services/blockchain.service.ts:71](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/blockchain.service.ts#L71)

#### Parameters

##### count?

`number` = `5`

##### offset?

`number` = `0`

#### Returns

`Promise`\<`object`[]\>

***

### getNetworkStatus()

> **getNetworkStatus**(): `Promise`\<\{ `blockNumber`: `string`; `chainId`: `number`; `gasPriceWei`: `string`; `network`: `string`; \}\>

Defined in: [src/services/blockchain.service.ts:7](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/blockchain.service.ts#L7)

Celo mainnet chain id, latest block, and gas price.

#### Returns

`Promise`\<\{ `blockNumber`: `string`; `chainId`: `number`; `gasPriceWei`: `string`; `network`: `string`; \}\>

***

### getTransaction()

> **getTransaction**(`hash`): `Promise`\<\{ `blockNumber`: `string`; `from`: `` `0x${string}` ``; `gas`: `string`; `gasEfficiency`: `number`; `gasPrice`: `string` \| `undefined`; `gasPriceGwei`: `number` \| `undefined`; `gasUsed`: `string`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `nonce`: `number`; `status`: `"success"` \| `"reverted"`; `to`: `` `0x${string}` `` \| `null`; `value`: `string`; `valueCelo`: `number`; \}\>

Defined in: [src/services/blockchain.service.ts:101](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/blockchain.service.ts#L101)

#### Parameters

##### hash

`` `0x${string}` ``

#### Returns

`Promise`\<\{ `blockNumber`: `string`; `from`: `` `0x${string}` ``; `gas`: `string`; `gasEfficiency`: `number`; `gasPrice`: `string` \| `undefined`; `gasPriceGwei`: `number` \| `undefined`; `gasUsed`: `string`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `nonce`: `number`; `status`: `"success"` \| `"reverted"`; `to`: `` `0x${string}` `` \| `null`; `value`: `string`; `valueCelo`: `number`; \}\>
