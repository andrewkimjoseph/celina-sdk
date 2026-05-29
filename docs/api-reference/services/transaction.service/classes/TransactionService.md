[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/transaction.service](../README.md) / TransactionService

# Class: TransactionService

Defined in: [src/services/transaction.service.ts:27](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/transaction.service.ts#L27)

## Constructors

### Constructor

> **new TransactionService**(`clientFactory`): `TransactionService`

Defined in: [src/services/transaction.service.ts:30](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/transaction.service.ts#L30)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`TransactionService`

## Methods

### estimateSend()

> **estimateSend**(`from`, `to`, `token`, `amount`): `Promise`\<\{ `amount`: `string`; `from`: `` `0x${string}` ``; `gas`: `string`; `network`: `"mainnet"`; `to`: `` `0x${string}` ``; `token`: `string`; \}\>

Defined in: [src/services/transaction.service.ts:42](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/transaction.service.ts#L42)

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

Defined in: [src/services/transaction.service.ts:183](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/transaction.service.ts#L183)

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

Defined in: [src/services/transaction.service.ts:149](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/transaction.service.ts#L149)

Current gas fee data including EIP-1559 fees when supported.

#### Returns

`Promise`\<\{ `baseFeePerGas`: `string`; `eip1559`: `boolean`; `gasPrice`: `string`; `maxFeePerGas`: `string`; `maxPriorityFeePerGas`: `string`; `network`: `"mainnet"`; \}\>

***

### prepareSend()

> **prepareSend**(`from`, `to`, `token`, `amount`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/transaction.service.ts:96](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/transaction.service.ts#L96)

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

Single-step `SerializedPreparedFlow` for wagmi `sendTransaction`
