[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/uniswap.service](../README.md) / UniswapService

# Class: UniswapService

Defined in: [src/services/uniswap.service.ts:95](https://github.com/andrewkimjoseph/celina-sdk/blob/ac50537479efc78e19ba3fd85eca5754d1bcfed8/src/services/uniswap.service.ts#L95)

Uniswap v4 quotes, gas estimates, and `prepareSwap` flows on Celo mainnet.

## Constructors

### Constructor

> **new UniswapService**(`clientFactory`): `UniswapService`

Defined in: [src/services/uniswap.service.ts:98](https://github.com/andrewkimjoseph/celina-sdk/blob/ac50537479efc78e19ba3fd85eca5754d1bcfed8/src/services/uniswap.service.ts#L98)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`UniswapService`

## Methods

### estimateSwap()

> **estimateSwap**(`from`, `tokenIn`, `tokenOut`, `amount`, `params?`): `Promise`\<\{ `amountIn`: `string`; `amountOutMin`: `string`; `approvalGas`: `string`[]; `approvalStepsNeeded`: `number`; `deadline`: `string`; `deadlineMinutes`: `number`; `expectedOut`: `string`; `from`: `` `0x${string}` ``; `indexSource`: `string` \| `undefined`; `network`: `"mainnet"`; `protocol`: `"uniswap_v4"`; `recipient`: `` `0x${string}` ``; `routeHops`: `number`; `slippageTolerance`: `number`; `swapGas`: `string` \| `undefined`; `swapGasEstimated`: `boolean`; `tokenIn`: `string`; `tokenOut`: `string`; \}\>

Defined in: [src/services/uniswap.service.ts:409](https://github.com/andrewkimjoseph/celina-sdk/blob/ac50537479efc78e19ba3fd85eca5754d1bcfed8/src/services/uniswap.service.ts#L409)

Simulate gas for a Uniswap v4 swap from `from`, including Permit2 approvals when needed.

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

[`UniswapSwapParams`](../interfaces/UniswapSwapParams.md)

Optional slippage, deadline, and recipient

#### Returns

`Promise`\<\{ `amountIn`: `string`; `amountOutMin`: `string`; `approvalGas`: `string`[]; `approvalStepsNeeded`: `number`; `deadline`: `string`; `deadlineMinutes`: `number`; `expectedOut`: `string`; `from`: `` `0x${string}` ``; `indexSource`: `string` \| `undefined`; `network`: `"mainnet"`; `protocol`: `"uniswap_v4"`; `recipient`: `` `0x${string}` ``; `routeHops`: `number`; `slippageTolerance`: `number`; `swapGas`: `string` \| `undefined`; `swapGasEstimated`: `boolean`; `tokenIn`: `string`; `tokenOut`: `string`; \}\>

***

### getSwapQuote()

> **getSwapQuote**(`tokenIn`, `tokenOut`, `amount`): `Promise`\<\{ `amountIn`: `string`; `expectedOut`: `string`; `indexSource`: `string` \| `undefined`; `network`: `"mainnet"`; `protocol`: `"uniswap_v4"`; `route`: \{ `pools`: `UniswapPoolKey`[]; \}; `routeHops`: `number`; `tokenIn`: `string`; `tokenOut`: `string`; \}\>

Defined in: [src/services/uniswap.service.ts:380](https://github.com/andrewkimjoseph/celina-sdk/blob/ac50537479efc78e19ba3fd85eca5754d1bcfed8/src/services/uniswap.service.ts#L380)

Expected Uniswap v4 output for a token pair — no wallet required.

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

#### Returns

`Promise`\<\{ `amountIn`: `string`; `expectedOut`: `string`; `indexSource`: `string` \| `undefined`; `network`: `"mainnet"`; `protocol`: `"uniswap_v4"`; `route`: \{ `pools`: `UniswapPoolKey`[]; \}; `routeHops`: `number`; `tokenIn`: `string`; `tokenOut`: `string`; \}\>

***

### prepareSwap()

> **prepareSwap**(`from`, `tokenIn`, `tokenOut`, `amount`, `params?`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/uniswap.service.ts:501](https://github.com/andrewkimjoseph/celina-sdk/blob/ac50537479efc78e19ba3fd85eca5754d1bcfed8/src/services/uniswap.service.ts#L501)

Build unsigned Uniswap v4 steps (ERC-20 approve → Permit2 approve → swap when needed).

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

[`UniswapSwapParams`](../interfaces/UniswapSwapParams.md)

Optional slippage, deadline, and recipient

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

1–3 step `SerializedPreparedFlow` for sequential wallet signing
