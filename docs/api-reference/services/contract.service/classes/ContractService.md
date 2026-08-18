[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/contract.service](../README.md) / ContractService

# Class: ContractService

Defined in: [src/services/contract.service.ts:57](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/contract.service.ts#L57)

Read, gas-estimate, and prepare helpers for arbitrary contracts.

## Constructors

### Constructor

> **new ContractService**(`clientFactory`): `ContractService`

Defined in: [src/services/contract.service.ts:60](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/contract.service.ts#L60)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`ContractService`

## Methods

### callFunction()

> **callFunction**(`params`): `Promise`\<\{ `contractAddress`: `` `0x${string}` ``; `error?`: `undefined`; `functionName`: `string`; `network`: `"mainnet"`; `result`: `unknown`; `success`: `boolean`; \} \| \{ `contractAddress`: `` `0x${string}` ``; `error`: `string`; `functionName`: `string`; `network`: `"mainnet"`; `result`: `null`; `success`: `boolean`; \}\>

Defined in: [src/services/contract.service.ts:69](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/contract.service.ts#L69)

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

Defined in: [src/services/contract.service.ts:114](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/contract.service.ts#L114)

Estimate gas for a contract call from `fromAddress`.

#### Parameters

##### params

[`ContractCallParams`](../interfaces/ContractCallParams.md) & `object`

Same as `callFunction` plus required `fromAddress`

#### Returns

`Promise`\<\{ `contractAddress`: `` `0x${string}` ``; `error?`: `undefined`; `functionName`: `string`; `gasEstimate`: `string`; `gasPrice`: `string`; `network`: `"mainnet"`; `success`: `boolean`; `totalCost`: `string`; \} \| \{ `contractAddress`: `` `0x${string}` ``; `error`: `string`; `functionName`: `string`; `gasEstimate`: `string`; `gasPrice`: `string`; `network`: `"mainnet"`; `success`: `boolean`; `totalCost`: `string`; \}\>

Gas estimate, current gas price, and total cost in wei

***

### prepareFunction()

> **prepareFunction**(`from`, `params`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/contract.service.ts:172](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/contract.service.ts#L172)

Build an unsigned single-step flow for a contract write (caller ABI).
Calldata includes the CELINA attribution suffix. Rejects `view`/`pure` ABI entries.

#### Parameters

##### from

`` `0x${string}` ``

Sender wallet address (must match connected wallet when signing)

##### params

[`ContractCallParams`](../interfaces/ContractCallParams.md)

Contract address, ABI, function name, optional args and wei `value`

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Single-step `SerializedPreparedFlow` for wagmi or MCP `executePreparedFlow`
