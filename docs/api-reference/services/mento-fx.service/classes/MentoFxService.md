# MentoFxService

[**@andrewkimjoseph/celina-sdk**](../../../)

***

[@andrewkimjoseph/celina-sdk](../../../) / [services/mento-fx.service](https://github.com/andrewkimjoseph/celina-sdk/blob/main/docs/api-reference/services/mento-fx.service/README.md) / MentoFxService

## Class: MentoFxService

Defined in: [src/services/mento-fx.service.ts:147](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/services/mento-fx.service.ts#L147)

Mento FX quotes, gas estimates, and `prepareFx` flows on Celo mainnet.

### Constructors

#### Constructor

> **new MentoFxService**(`clientFactory`): `MentoFxService`

Defined in: [src/services/mento-fx.service.ts:150](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/services/mento-fx.service.ts#L150)

**Parameters**

**clientFactory**

`CeloClientFactory`

**Returns**

`MentoFxService`

### Methods

#### estimateFx()

> **estimateFx**(`from`, `tokenIn`, `tokenOut`, `amount`, `params?`): `Promise`<{ `amountIn`: `string`; `amountOutMin`: `string`; `approvalGas`: `string` | `undefined`; `approvalNeeded`: `boolean`; `deadline`: `string`; `deadlineMinutes`: `number`; `expectedOut`: `string`; `from`: `` `0x${string}` ``; `fxGas`: `string` | `undefined`; `network`: `"mainnet"`; `protocol`: `"mento_fx"`; `recipient`: `` `0x${string}` ``; `routeHops`: `number`; `slippageTolerance`: `number`; `swapGasEstimated`: `boolean`; `tokenIn`: `string`; `tokenOut`: `string`; }>

Defined in: [src/services/mento-fx.service.ts:377](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/services/mento-fx.service.ts#L377)

Simulate gas for a Mento FX swap from `from`, including approval if needed.

**Parameters**

**from**

`` `0x${string}` ``

Sender wallet address

**tokenIn**

`string`

Input token symbol or address

**tokenOut**

`string`

Output token symbol or address

**amount**

`string`

Human-readable input amount

**params?**

[`MentoFxParams`](../interfaces/MentoFxParams.md)

Optional slippage, deadline, and recipient

**Returns**

`Promise`<{ `amountIn`: `string`; `amountOutMin`: `string`; `approvalGas`: `string` | `undefined`; `approvalNeeded`: `boolean`; `deadline`: `string`; `deadlineMinutes`: `number`; `expectedOut`: `string`; `from`: `` `0x${string}` ``; `fxGas`: `string` | `undefined`; `network`: `"mainnet"`; `protocol`: `"mento_fx"`; `recipient`: `` `0x${string}` ``; `routeHops`: `number`; `slippageTolerance`: `number`; `swapGasEstimated`: `boolean`; `tokenIn`: `string`; `tokenOut`: `string`; }>

***

#### getFxQuote()

> **getFxQuote**(`tokenIn`, `tokenOut`, `amount`, `_from?`): `Promise`<{ `amountIn`: `string`; `expectedOut`: `string`; `network`: `"mainnet"`; `protocol`: `"mento_fx"`; `routeHops`: `number`; `tokenIn`: `string`; `tokenOut`: `string`; }>

Defined in: [src/services/mento-fx.service.ts:338](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/services/mento-fx.service.ts#L338)

Expected Mento FX output for a token pair — no wallet required.

**Parameters**

**tokenIn**

`string`

Input token symbol or address

**tokenOut**

`string`

Output token symbol or address

**amount**

`string`

Human-readable input amount

**\_from?**

`` `0x${string}` ``

Deprecated; ignored. Balance checks run on prepare/estimate only.

**Returns**

`Promise`<{ `amountIn`: `string`; `expectedOut`: `string`; `network`: `"mainnet"`; `protocol`: `"mento_fx"`; `routeHops`: `number`; `tokenIn`: `string`; `tokenOut`: `string`; }>

***

#### prepareFx()

> **prepareFx**(`from`, `tokenIn`, `tokenOut`, `amount`, `params?`): `Promise`<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)>

Defined in: [src/services/mento-fx.service.ts:457](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/services/mento-fx.service.ts#L457)

Build unsigned Mento FX steps (approve + swap when needed).

**Parameters**

**from**

`` `0x${string}` ``

Sender wallet address

**tokenIn**

`string`

Input token symbol or address

**tokenOut**

`string`

Output token symbol or address

**amount**

`string`

Human-readable input amount

**params?**

[`MentoFxParams`](../interfaces/MentoFxParams.md)

Optional slippage, deadline, and recipient

**Returns**

`Promise`<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)>

1–2 step `SerializedPreparedFlow` for sequential wallet signing
