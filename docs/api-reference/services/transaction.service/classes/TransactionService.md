[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/transaction.service](../README.md) / TransactionService

# Class: TransactionService

Defined in: [src/services/transaction.service.ts:44](https://github.com/andrewkimjoseph/celina-sdk/blob/c4138c1333e37c3188f9b6d876cbd4e95b2408f1/src/services/transaction.service.ts#L44)

Token sends, gas fee reads, and `prepareSend` flows with CELINA calldata tags.

## Constructors

### Constructor

> **new TransactionService**(`clientFactory`): `TransactionService`

Defined in: [src/services/transaction.service.ts:47](https://github.com/andrewkimjoseph/celina-sdk/blob/c4138c1333e37c3188f9b6d876cbd4e95b2408f1/src/services/transaction.service.ts#L47)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`TransactionService`

## Methods

### estimateSend()

> **estimateSend**(`from`, `to`, `token`, `amount`): `Promise`\<[`SendEstimateResult`](../type-aliases/SendEstimateResult.md)\>

Defined in: [src/services/transaction.service.ts:59](https://github.com/andrewkimjoseph/celina-sdk/blob/c4138c1333e37c3188f9b6d876cbd4e95b2408f1/src/services/transaction.service.ts#L59)

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

`Promise`\<[`SendEstimateResult`](../type-aliases/SendEstimateResult.md)\>

Gas estimate in units as a decimal string, or a structured insufficient-balance result when simulation reverts.

***

### estimateTransaction()

> **estimateTransaction**(`params`): `Promise`\<\{ `estimatedCost`: `string`; `estimatedCostFormatted`: `string`; `from`: `` `0x${string}` ``; `gasLimit`: `string`; `gasPrice`: `string`; `isEip1559`: `boolean`; `maxFeePerGas`: `string`; `maxPriorityFeePerGas`: `string`; `network`: `"mainnet"`; `to`: `` `0x${string}` ``; \}\>

Defined in: [src/services/transaction.service.ts:217](https://github.com/andrewkimjoseph/celina-sdk/blob/c4138c1333e37c3188f9b6d876cbd4e95b2408f1/src/services/transaction.service.ts#L217)

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

Defined in: [src/services/transaction.service.ts:183](https://github.com/andrewkimjoseph/celina-sdk/blob/c4138c1333e37c3188f9b6d876cbd4e95b2408f1/src/services/transaction.service.ts#L183)

Current gas fee data including EIP-1559 fees when supported.

#### Returns

`Promise`\<\{ `baseFeePerGas`: `string`; `eip1559`: `boolean`; `gasPrice`: `string`; `maxFeePerGas`: `string`; `maxPriorityFeePerGas`: `string`; `network`: `"mainnet"`; \}\>

***

### prepareSend()

> **prepareSend**(`from`, `to`, `token`, `amount`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/transaction.service.ts:121](https://github.com/andrewkimjoseph/celina-sdk/blob/c4138c1333e37c3188f9b6d876cbd4e95b2408f1/src/services/transaction.service.ts#L121)

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
