[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/contract.service](../README.md) / ContractService

# Class: ContractService

Defined in: [src/services/contract.service.ts:41](https://github.com/andrewkimjoseph/celina-sdk/blob/e071b6ef176a1c725fb3cc7d17c5bc0b9767d108/src/services/contract.service.ts#L41)

Read-only and gas-estimation helpers for arbitrary contracts.

## Constructors

### Constructor

> **new ContractService**(`clientFactory`): `ContractService`

Defined in: [src/services/contract.service.ts:42](https://github.com/andrewkimjoseph/celina-sdk/blob/e071b6ef176a1c725fb3cc7d17c5bc0b9767d108/src/services/contract.service.ts#L42)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`ContractService`

## Methods

### callFunction()

> **callFunction**(`params`): `Promise`\<\{ `contractAddress`: `` `0x${string}` ``; `error?`: `undefined`; `functionName`: `string`; `network`: `"mainnet"`; `result`: `unknown`; `success`: `boolean`; \} \| \{ `contractAddress`: `` `0x${string}` ``; `error`: `string`; `functionName`: `string`; `network`: `"mainnet"`; `result`: `null`; `success`: `boolean`; \}\>

Defined in: [src/services/contract.service.ts:49](https://github.com/andrewkimjoseph/celina-sdk/blob/e071b6ef176a1c725fb3cc7d17c5bc0b9767d108/src/services/contract.service.ts#L49)

Simulate a read-only contract call (`eth_call`).

#### Parameters

##### params

[`ContractCallParams`](../interfaces/ContractCallParams.md)

Contract address, ABI, function name, and optional args

#### Returns

`Promise`\<\{ `contractAddress`: `` `0x${string}` ``; `error?`: `undefined`; `functionName`: `string`; `network`: `"mainnet"`; `result`: `unknown`; `success`: `boolean`; \} \| \{ `contractAddress`: `` `0x${string}` ``; `error`: `string`; `functionName`: `string`; `network`: `"mainnet"`; `result`: `null`; `success`: `boolean`; \}\>

Decoded result on success; `{ success: false, error }` on revert

***

### estimateGas()

> **estimateGas**(`params`): `Promise`\<\{ `contractAddress`: `` `0x${string}` ``; `error?`: `undefined`; `functionName`: `string`; `gasEstimate`: `string`; `gasPrice`: `string`; `network`: `"mainnet"`; `success`: `boolean`; `totalCost`: `string`; \} \| \{ `contractAddress`: `` `0x${string}` ``; `error`: `string`; `functionName`: `string`; `gasEstimate`: `string`; `gasPrice`: `string`; `network`: `"mainnet"`; `success`: `boolean`; `totalCost`: `string`; \}\>

Defined in: [src/services/contract.service.ts:94](https://github.com/andrewkimjoseph/celina-sdk/blob/e071b6ef176a1c725fb3cc7d17c5bc0b9767d108/src/services/contract.service.ts#L94)

Estimate gas for a contract call from `fromAddress`.

#### Parameters

##### params

[`ContractCallParams`](../interfaces/ContractCallParams.md) & `object`

Same as `callFunction` plus required `fromAddress`

#### Returns

`Promise`\<\{ `contractAddress`: `` `0x${string}` ``; `error?`: `undefined`; `functionName`: `string`; `gasEstimate`: `string`; `gasPrice`: `string`; `network`: `"mainnet"`; `success`: `boolean`; `totalCost`: `string`; \} \| \{ `contractAddress`: `` `0x${string}` ``; `error`: `string`; `functionName`: `string`; `gasEstimate`: `string`; `gasPrice`: `string`; `network`: `"mainnet"`; `success`: `boolean`; `totalCost`: `string`; \}\>

Gas estimate, current gas price, and total cost in wei
