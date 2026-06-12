[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/mento-fx.service](../README.md) / MentoFxService

# Class: MentoFxService

Defined in: [src/services/mento-fx.service.ts:158](https://github.com/andrewkimjoseph/celina-sdk/blob/671d3f90a836646c5a311cc0f8c6691cf3fc4dad/src/services/mento-fx.service.ts#L158)

Mento FX quotes, gas estimates, and `prepareFx` flows on Celo mainnet.

## Constructors

### Constructor

> **new MentoFxService**(`clientFactory`): `MentoFxService`

Defined in: [src/services/mento-fx.service.ts:161](https://github.com/andrewkimjoseph/celina-sdk/blob/671d3f90a836646c5a311cc0f8c6691cf3fc4dad/src/services/mento-fx.service.ts#L161)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`MentoFxService`

## Methods

### estimateFx()

> **estimateFx**(`from`, `tokenIn`, `tokenOut`, `amount`, `params?`): `Promise`\<\{ `amountIn`: `string`; `amountOutMin`: `string`; `approvalGas`: `string` \| `undefined`; `approvalNeeded`: `boolean`; `deadline`: `string`; `deadlineMinutes`: `number`; `expectedOut`: `string`; `from`: `` `0x${string}` ``; `fxGas`: `string` \| `undefined`; `network`: `"mainnet"`; `protocol`: `"mento_fx"`; `recipient`: `` `0x${string}` ``; `routeHops`: `number`; `slippageTolerance`: `number`; `swapGasEstimated`: `boolean`; `tokenIn`: `string`; `tokenOut`: `string`; \}\>

Defined in: [src/services/mento-fx.service.ts:388](https://github.com/andrewkimjoseph/celina-sdk/blob/671d3f90a836646c5a311cc0f8c6691cf3fc4dad/src/services/mento-fx.service.ts#L388)

Simulate gas for a Mento FX swap from `from`, including approval if needed.

#### Parameters

##### from

`` `0x${string}` ``

Sender wallet address

##### tokenIn

`string`

Input token symbol or address

##### tokenOut

`string`

Output token symbol or address

##### amount

`string`

Human-readable input amount

##### params?

[`MentoFxParams`](../interfaces/MentoFxParams.md)

Optional slippage, deadline, and recipient

#### Returns

`Promise`\<\{ `amountIn`: `string`; `amountOutMin`: `string`; `approvalGas`: `string` \| `undefined`; `approvalNeeded`: `boolean`; `deadline`: `string`; `deadlineMinutes`: `number`; `expectedOut`: `string`; `from`: `` `0x${string}` ``; `fxGas`: `string` \| `undefined`; `network`: `"mainnet"`; `protocol`: `"mento_fx"`; `recipient`: `` `0x${string}` ``; `routeHops`: `number`; `slippageTolerance`: `number`; `swapGasEstimated`: `boolean`; `tokenIn`: `string`; `tokenOut`: `string`; \}\>

***

### getFxQuote()

> **getFxQuote**(`tokenIn`, `tokenOut`, `amount`, `_from?`): `Promise`\<\{ `amountIn`: `string`; `expectedOut`: `string`; `network`: `"mainnet"`; `protocol`: `"mento_fx"`; `routeHops`: `number`; `tokenIn`: `string`; `tokenOut`: `string`; \}\>

Defined in: [src/services/mento-fx.service.ts:349](https://github.com/andrewkimjoseph/celina-sdk/blob/671d3f90a836646c5a311cc0f8c6691cf3fc4dad/src/services/mento-fx.service.ts#L349)

Expected Mento FX output for a token pair — no wallet required.

#### Parameters

##### tokenIn

`string`

Input token symbol or address

##### tokenOut

`string`

Output token symbol or address

##### amount

`string`

Human-readable input amount

##### \_from?

`` `0x${string}` ``

Deprecated; ignored. Balance checks run on prepare/estimate only.

#### Returns

`Promise`\<\{ `amountIn`: `string`; `expectedOut`: `string`; `network`: `"mainnet"`; `protocol`: `"mento_fx"`; `routeHops`: `number`; `tokenIn`: `string`; `tokenOut`: `string`; \}\>

***

### prepareFx()

> **prepareFx**(`from`, `tokenIn`, `tokenOut`, `amount`, `params?`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/mento-fx.service.ts:468](https://github.com/andrewkimjoseph/celina-sdk/blob/671d3f90a836646c5a311cc0f8c6691cf3fc4dad/src/services/mento-fx.service.ts#L468)

Build unsigned Mento FX steps (approve + swap when needed).

#### Parameters

##### from

`` `0x${string}` ``

Sender wallet address

##### tokenIn

`string`

Input token symbol or address

##### tokenOut

`string`

Output token symbol or address

##### amount

`string`

Human-readable input amount

##### params?

[`MentoFxParams`](../interfaces/MentoFxParams.md)

Optional slippage, deadline, and recipient

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

1–2 step `SerializedPreparedFlow` for sequential wallet signing
