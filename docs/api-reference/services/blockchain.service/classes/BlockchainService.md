[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/blockchain.service](../README.md) / BlockchainService

# Class: BlockchainService

Defined in: [src/services/blockchain.service.ts:61](https://github.com/andrewkimjoseph/celina-sdk/blob/e071b6ef176a1c725fb3cc7d17c5bc0b9767d108/src/services/blockchain.service.ts#L61)

Celo mainnet block and transaction queries.

## Constructors

### Constructor

> **new BlockchainService**(`clientFactory`): `BlockchainService`

Defined in: [src/services/blockchain.service.ts:62](https://github.com/andrewkimjoseph/celina-sdk/blob/e071b6ef176a1c725fb3cc7d17c5bc0b9767d108/src/services/blockchain.service.ts#L62)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`BlockchainService`

## Methods

### getBlock()

> **getBlock**(`blockId`, `options?`): `Promise`\<\{ `gasLimit`: `string`; `gasUsed`: `string`; `gasUtilization`: `number`; `hash`: `` `0x${string}` `` \| `null`; `miner`: `` `0x${string}` ``; `number`: `string` \| `undefined`; `parentHash`: `` `0x${string}` ``; `timestamp`: `string`; `transactionCount`: `number`; `transactions`: (`` `0x${string}` `` \| \{ `blockNumber`: `string` \| `undefined`; `from`: `` `0x${string}` ``; `gas`: `string`; `gasPrice`: `string` \| `undefined`; `gasPriceGwei`: `number` \| `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `nonce`: `number`; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null` \| `undefined`; `type`: `string` \| `undefined`; `value`: `string`; `valueCelo`: `number`; \})[] \| `undefined`; \}\>

Defined in: [src/services/blockchain.service.ts:91](https://github.com/andrewkimjoseph/celina-sdk/blob/e071b6ef176a1c725fb3cc7d17c5bc0b9767d108/src/services/blockchain.service.ts#L91)

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

`Promise`\<\{ `gasLimit`: `string`; `gasUsed`: `string`; `gasUtilization`: `number`; `hash`: `` `0x${string}` `` \| `null`; `miner`: `` `0x${string}` ``; `number`: `string` \| `undefined`; `parentHash`: `` `0x${string}` ``; `timestamp`: `string`; `transactionCount`: `number`; `transactions`: (`` `0x${string}` `` \| \{ `blockNumber`: `string` \| `undefined`; `from`: `` `0x${string}` ``; `gas`: `string`; `gasPrice`: `string` \| `undefined`; `gasPriceGwei`: `number` \| `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `nonce`: `number`; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null` \| `undefined`; `type`: `string` \| `undefined`; `value`: `string`; `valueCelo`: `number`; \})[] \| `undefined`; \}\>

Block header fields and optional transaction list

#### Throws

When the block is not found

***

### getLatestBlocks()

> **getLatestBlocks**(`count?`, `offset?`): `Promise`\<`object`[]\>

Defined in: [src/services/blockchain.service.ts:151](https://github.com/andrewkimjoseph/celina-sdk/blob/e071b6ef176a1c725fb3cc7d17c5bc0b9767d108/src/services/blockchain.service.ts#L151)

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

Defined in: [src/services/blockchain.service.ts:68](https://github.com/andrewkimjoseph/celina-sdk/blob/e071b6ef176a1c725fb3cc7d17c5bc0b9767d108/src/services/blockchain.service.ts#L68)

Celo mainnet chain id, latest block number, and current gas price.

#### Returns

`Promise`\<\{ `blockNumber`: `string`; `chainId`: `number`; `gasPriceWei`: `string`; `network`: `string`; \}\>

Network metadata including `chainId`, `blockNumber`, and `gasPriceWei`

***

### getTransaction()

> **getTransaction**(`hash`): `Promise`\<\{ `blockNumber`: `string` \| `undefined`; `from`: `` `0x${string}` ``; `gas`: `string`; `gasPrice`: `string` \| `undefined`; `gasPriceGwei`: `number` \| `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `nonce`: `number`; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null` \| `undefined`; `type`: `string` \| `undefined`; `value`: `string`; `valueCelo`: `number`; \} \| \{ `blockNumber`: `string` \| `undefined`; `from`: `` `0x${string}` ``; `gas`: `string`; `gasEfficiency`: `number`; `gasPrice`: `string` \| `undefined`; `gasPriceGwei`: `number` \| `undefined`; `gasUsed`: `string`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `nonce`: `number`; `status?`: `string`; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null` \| `undefined`; `type`: `string` \| `undefined`; `value`: `string`; `valueCelo`: `number`; \}\>

Defined in: [src/services/blockchain.service.ts:187](https://github.com/andrewkimjoseph/celina-sdk/blob/e071b6ef176a1c725fb3cc7d17c5bc0b9767d108/src/services/blockchain.service.ts#L187)

Fetch a transaction and its receipt by hash.

#### Parameters

##### hash

`` `0x${string}` ``

Transaction hash

#### Returns

`Promise`\<\{ `blockNumber`: `string` \| `undefined`; `from`: `` `0x${string}` ``; `gas`: `string`; `gasPrice`: `string` \| `undefined`; `gasPriceGwei`: `number` \| `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `nonce`: `number`; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null` \| `undefined`; `type`: `string` \| `undefined`; `value`: `string`; `valueCelo`: `number`; \} \| \{ `blockNumber`: `string` \| `undefined`; `from`: `` `0x${string}` ``; `gas`: `string`; `gasEfficiency`: `number`; `gasPrice`: `string` \| `undefined`; `gasPriceGwei`: `number` \| `undefined`; `gasUsed`: `string`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `nonce`: `number`; `status?`: `string`; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null` \| `undefined`; `type`: `string` \| `undefined`; `value`: `string`; `valueCelo`: `number`; \}\>

Transaction fields, gas efficiency, and receipt status when mined

#### Throws

When the transaction is not found
