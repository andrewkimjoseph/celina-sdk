[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/transaction.service](../README.md) / TransactionService

# Class: TransactionService

Defined in: [src/services/transaction.service.ts:29](https://github.com/andrewkimjoseph/celina-sdk/blob/e071b6ef176a1c725fb3cc7d17c5bc0b9767d108/src/services/transaction.service.ts#L29)

Token sends, gas fee reads, and `prepareSend` flows with CELINA calldata tags.

## Constructors

### Constructor

> **new TransactionService**(`clientFactory`): `TransactionService`

Defined in: [src/services/transaction.service.ts:32](https://github.com/andrewkimjoseph/celina-sdk/blob/e071b6ef176a1c725fb3cc7d17c5bc0b9767d108/src/services/transaction.service.ts#L32)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`TransactionService`

## Methods

### estimateSend()

> **estimateSend**(`from`, `to`, `token`, `amount`): `Promise`\<\{ `amount`: `string`; `from`: `` `0x${string}` ``; `gas`: `string`; `network`: `"mainnet"`; `to`: `` `0x${string}` ``; `token`: `string`; \}\>

Defined in: [src/services/transaction.service.ts:44](https://github.com/andrewkimjoseph/celina-sdk/blob/e071b6ef176a1c725fb3cc7d17c5bc0b9767d108/src/services/transaction.service.ts#L44)

Simulate gas for a CELO or ERC-20 transfer from `from`.

#### Parameters

##### from

`` `0x${string}` ``

Sender wallet address

##### to

`` `0x${string}` ``

Recipient address

##### token

`string`

Symbol (e.g. `CELO`, `USDm`) or contract address

##### amount

`string`

Human-readable amount (e.g. `"10"`)

#### Returns

`Promise`\<\{ `amount`: `string`; `from`: `` `0x${string}` ``; `gas`: `string`; `network`: `"mainnet"`; `to`: `` `0x${string}` ``; `token`: `string`; \}\>

Gas estimate in units as a decimal string

***

### estimateTransaction()

> **estimateTransaction**(`params`): `Promise`\<\{ `estimatedCost`: `string`; `estimatedCostFormatted`: `string`; `from`: `` `0x${string}` ``; `gasLimit`: `string`; `gasPrice`: `string`; `isEip1559`: `boolean`; `maxFeePerGas`: `string`; `maxPriorityFeePerGas`: `string`; `network`: `"mainnet"`; `to`: `` `0x${string}` ``; \}\>

Defined in: [src/services/transaction.service.ts:196](https://github.com/andrewkimjoseph/celina-sdk/blob/e071b6ef176a1c725fb3cc7d17c5bc0b9767d108/src/services/transaction.service.ts#L196)

Generic transaction gas estimate (not token-transfer specific).

#### Parameters

##### params

###### data?

`` `0x${string}` ``

###### from

`` `0x${string}` ``

###### to

`` `0x${string}` ``

###### value?

`string`

#### Returns

`Promise`\<\{ `estimatedCost`: `string`; `estimatedCostFormatted`: `string`; `from`: `` `0x${string}` ``; `gasLimit`: `string`; `gasPrice`: `string`; `isEip1559`: `boolean`; `maxFeePerGas`: `string`; `maxPriorityFeePerGas`: `string`; `network`: `"mainnet"`; `to`: `` `0x${string}` ``; \}\>

***

### getGasFeeData()

> **getGasFeeData**(): `Promise`\<\{ `baseFeePerGas`: `string`; `eip1559`: `boolean`; `gasPrice`: `string`; `maxFeePerGas`: `string`; `maxPriorityFeePerGas`: `string`; `network`: `"mainnet"`; \}\>

Defined in: [src/services/transaction.service.ts:162](https://github.com/andrewkimjoseph/celina-sdk/blob/e071b6ef176a1c725fb3cc7d17c5bc0b9767d108/src/services/transaction.service.ts#L162)

Current gas fee data including EIP-1559 fees when supported.

#### Returns

`Promise`\<\{ `baseFeePerGas`: `string`; `eip1559`: `boolean`; `gasPrice`: `string`; `maxFeePerGas`: `string`; `maxPriorityFeePerGas`: `string`; `network`: `"mainnet"`; \}\>

***

### prepareSend()

> **prepareSend**(`from`, `to`, `token`, `amount`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/transaction.service.ts:100](https://github.com/andrewkimjoseph/celina-sdk/blob/e071b6ef176a1c725fb3cc7d17c5bc0b9767d108/src/services/transaction.service.ts#L100)

Build an unsigned send flow (native CELO or ERC-20 transfer).

#### Parameters

##### from

`` `0x${string}` ``

Sender wallet address (must match connected wallet when signing)

##### to

`` `0x${string}` ``

Recipient address

##### token

`string`

Symbol or contract address

##### amount

`string`

Human-readable amount

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Single-step `SerializedPreparedFlow` for wagmi `sendTransactionAsync`
