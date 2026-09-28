[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/mento-fx.service](../README.md) / MentoFxService

# Class: MentoFxService

Defined in: [src/services/mento-fx.service.ts:148](https://github.com/andrewkimjoseph/celina-sdk/blob/22b2ccc38aadfee03a1077786ec5de9ae678568c/src/services/mento-fx.service.ts#L148)

Mento FX quotes, gas estimates, and `prepareFx` flows on Celo mainnet.

## Constructors

### Constructor

> **new MentoFxService**(`clientFactory`): `MentoFxService`

Defined in: [src/services/mento-fx.service.ts:152](https://github.com/andrewkimjoseph/celina-sdk/blob/22b2ccc38aadfee03a1077786ec5de9ae678568c/src/services/mento-fx.service.ts#L152)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`MentoFxService`

## Methods

### estimateFx()

> **estimateFx**(`from`, `tokenIn`, `tokenOut`, `amount`, `params?`): `Promise`\<\{ `amountIn`: `string`; `amountOutMin`: `string`; `approvalGas`: `string` \| `undefined`; `approvalNeeded`: `boolean`; `deadline`: `string`; `deadlineMinutes`: `number`; `expectedOut`: `string`; `from`: `` `0x${string}` ``; `fxGas`: `string` \| `undefined`; `network`: `"mainnet"`; `protocol`: `"mento_fx"`; `recipient`: `` `0x${string}` ``; `routeHops`: `number`; `slippageTolerance`: `number`; `swapGasEstimated`: `boolean`; `tokenIn`: `string`; `tokenOut`: `string`; \}\>

Defined in: [src/services/mento-fx.service.ts:401](https://github.com/andrewkimjoseph/celina-sdk/blob/22b2ccc38aadfee03a1077786ec5de9ae678568c/src/services/mento-fx.service.ts#L401)

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

Defined in: [src/services/mento-fx.service.ts:362](https://github.com/andrewkimjoseph/celina-sdk/blob/22b2ccc38aadfee03a1077786ec5de9ae678568c/src/services/mento-fx.service.ts#L362)

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

### listPairs()

> **listPairs**(`token?`): `Promise`\<[`SwapPairsResult`](../../../index/type-aliases/SwapPairsResult.md)\>

Defined in: [src/services/mento-fx.service.ts:339](https://github.com/andrewkimjoseph/celina-sdk/blob/22b2ccc38aadfee03a1077786ec5de9ae678568c/src/services/mento-fx.service.ts#L339)

Tradable Mento FX registry-token pairs on Celo mainnet.
Uses the same route graph as `getFxQuote` — no quotes, no market-hours check.

#### Parameters

##### token?

`string`

Optional registry symbol; when set, only pairs involving that token

#### Returns

`Promise`\<[`SwapPairsResult`](../../../index/type-aliases/SwapPairsResult.md)\>

***

### prepareFx()

> **prepareFx**(`from`, `tokenIn`, `tokenOut`, `amount`, `params?`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/mento-fx.service.ts:481](https://github.com/andrewkimjoseph/celina-sdk/blob/22b2ccc38aadfee03a1077786ec5de9ae678568c/src/services/mento-fx.service.ts#L481)

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
