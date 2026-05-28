[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/contract.service](../README.md) / ContractService

# Class: ContractService

Defined in: [src/services/contract.service.ts:30](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/services/contract.service.ts#L30)

## Constructors

### Constructor

> **new ContractService**(`clientFactory`): `ContractService`

Defined in: [src/services/contract.service.ts:31](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/services/contract.service.ts#L31)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`ContractService`

## Methods

### callFunction()

> **callFunction**(`params`): `Promise`\<\{ `contractAddress`: `` `0x${string}` ``; `error?`: `undefined`; `functionName`: `string`; `network`: `"mainnet"`; `result`: `unknown`; `success`: `boolean`; \} \| \{ `contractAddress`: `` `0x${string}` ``; `error`: `string`; `functionName`: `string`; `network`: `"mainnet"`; `result`: `null`; `success`: `boolean`; \}\>

Defined in: [src/services/contract.service.ts:33](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/services/contract.service.ts#L33)

#### Parameters

##### params

[`ContractCallParams`](../interfaces/ContractCallParams.md)

#### Returns

`Promise`\<\{ `contractAddress`: `` `0x${string}` ``; `error?`: `undefined`; `functionName`: `string`; `network`: `"mainnet"`; `result`: `unknown`; `success`: `boolean`; \} \| \{ `contractAddress`: `` `0x${string}` ``; `error`: `string`; `functionName`: `string`; `network`: `"mainnet"`; `result`: `null`; `success`: `boolean`; \}\>

***

### estimateGas()

> **estimateGas**(`params`): `Promise`\<\{ `contractAddress`: `` `0x${string}` ``; `error?`: `undefined`; `functionName`: `string`; `gasEstimate`: `string`; `gasPrice`: `string`; `network`: `"mainnet"`; `success`: `boolean`; `totalCost`: `string`; \} \| \{ `contractAddress`: `` `0x${string}` ``; `error`: `string`; `functionName`: `string`; `gasEstimate`: `string`; `gasPrice`: `string`; `network`: `"mainnet"`; `success`: `boolean`; `totalCost`: `string`; \}\>

Defined in: [src/services/contract.service.ts:73](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/services/contract.service.ts#L73)

#### Parameters

##### params

[`ContractCallParams`](../interfaces/ContractCallParams.md) & `object`

#### Returns

`Promise`\<\{ `contractAddress`: `` `0x${string}` ``; `error?`: `undefined`; `functionName`: `string`; `gasEstimate`: `string`; `gasPrice`: `string`; `network`: `"mainnet"`; `success`: `boolean`; `totalCost`: `string`; \} \| \{ `contractAddress`: `` `0x${string}` ``; `error`: `string`; `functionName`: `string`; `gasEstimate`: `string`; `gasPrice`: `string`; `network`: `"mainnet"`; `success`: `boolean`; `totalCost`: `string`; \}\>
