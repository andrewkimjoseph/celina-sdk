[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/blockchain.service](../README.md) / BlockchainService

# Class: BlockchainService

Defined in: [src/services/blockchain.service.ts:7](https://github.com/andrewkimjoseph/celina-sdk/blob/f8728c3a6e17d8fef70a1fbf6a9b27bff61756e1/src/services/blockchain.service.ts#L7)

Celo mainnet block and transaction queries.

## Constructors

### Constructor

> **new BlockchainService**(`clientFactory`): `BlockchainService`

Defined in: [src/services/blockchain.service.ts:8](https://github.com/andrewkimjoseph/celina-sdk/blob/f8728c3a6e17d8fef70a1fbf6a9b27bff61756e1/src/services/blockchain.service.ts#L8)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`BlockchainService`

## Methods

### getBlock()

> **getBlock**(`blockId`, `options?`): `Promise`\<\{ `gasLimit`: `string`; `gasUsed`: `string`; `gasUtilization`: `number`; `hash`: `` `0x${string}` `` \| `null`; `miner`: `` `0x${string}` ``; `number`: `string` \| `undefined`; `parentHash`: `` `0x${string}` ``; `timestamp`: `string`; `transactionCount`: `number`; `transactions`: `` `0x${string}` ``[] \| `undefined`; \}\>

Defined in: [src/services/blockchain.service.ts:37](https://github.com/andrewkimjoseph/celina-sdk/blob/f8728c3a6e17d8fef70a1fbf6a9b27bff61756e1/src/services/blockchain.service.ts#L37)

Fetch a block by number, hash, or tag.

#### Parameters

##### blockId

`string` \| `number`

Block number, hash, `latest`, or `pending`

##### options?

###### includeTransactions?

`boolean`

When true, include full transaction objects

#### Returns

`Promise`\<\{ `gasLimit`: `string`; `gasUsed`: `string`; `gasUtilization`: `number`; `hash`: `` `0x${string}` `` \| `null`; `miner`: `` `0x${string}` ``; `number`: `string` \| `undefined`; `parentHash`: `` `0x${string}` ``; `timestamp`: `string`; `transactionCount`: `number`; `transactions`: `` `0x${string}` ``[] \| `undefined`; \}\>

Block header fields and optional transaction list

#### Throws

When the block is not found

***

### getLatestBlocks()

> **getLatestBlocks**(`count?`, `offset?`): `Promise`\<`object`[]\>

Defined in: [src/services/blockchain.service.ts:91](https://github.com/andrewkimjoseph/celina-sdk/blob/f8728c3a6e17d8fef70a1fbf6a9b27bff61756e1/src/services/blockchain.service.ts#L91)

List recent blocks ending at the chain tip (newest last in the array).

#### Parameters

##### count?

`number` = `5`

Number of blocks to return (1–100, default 5)

##### offset?

`number` = `0`

Skip this many blocks from the tip before collecting

#### Returns

`Promise`\<`object`[]\>

Summary fields per block (no full transaction payloads)

***

### getNetworkStatus()

> **getNetworkStatus**(): `Promise`\<\{ `blockNumber`: `string`; `chainId`: `number`; `gasPriceWei`: `string`; `network`: `string`; \}\>

Defined in: [src/services/blockchain.service.ts:14](https://github.com/andrewkimjoseph/celina-sdk/blob/f8728c3a6e17d8fef70a1fbf6a9b27bff61756e1/src/services/blockchain.service.ts#L14)

Celo mainnet chain id, latest block number, and current gas price.

#### Returns

`Promise`\<\{ `blockNumber`: `string`; `chainId`: `number`; `gasPriceWei`: `string`; `network`: `string`; \}\>

Network metadata including `chainId`, `blockNumber`, and `gasPriceWei`

***

### getTransaction()

> **getTransaction**(`hash`): `Promise`\<\{ `blockNumber`: `string`; `from`: `` `0x${string}` ``; `gas`: `string`; `gasEfficiency`: `number`; `gasPrice`: `string` \| `undefined`; `gasPriceGwei`: `number` \| `undefined`; `gasUsed`: `string`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `nonce`: `number`; `status`: `"success"` \| `"reverted"`; `to`: `` `0x${string}` `` \| `null`; `value`: `string`; `valueCelo`: `number`; \}\>

Defined in: [src/services/blockchain.service.ts:127](https://github.com/andrewkimjoseph/celina-sdk/blob/f8728c3a6e17d8fef70a1fbf6a9b27bff61756e1/src/services/blockchain.service.ts#L127)

Fetch a transaction and its receipt by hash.

#### Parameters

##### hash

`` `0x${string}` ``

Transaction hash

#### Returns

`Promise`\<\{ `blockNumber`: `string`; `from`: `` `0x${string}` ``; `gas`: `string`; `gasEfficiency`: `number`; `gasPrice`: `string` \| `undefined`; `gasPriceGwei`: `number` \| `undefined`; `gasUsed`: `string`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `nonce`: `number`; `status`: `"success"` \| `"reverted"`; `to`: `` `0x${string}` `` \| `null`; `value`: `string`; `valueCelo`: `number`; \}\>

Transaction fields, gas efficiency, and receipt status when mined

#### Throws

When the transaction is not found
