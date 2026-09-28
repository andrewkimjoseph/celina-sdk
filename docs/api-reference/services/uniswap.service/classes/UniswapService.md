[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/uniswap.service](../README.md) / UniswapService

# Class: UniswapService

Defined in: [src/services/uniswap.service.ts:97](https://github.com/andrewkimjoseph/celina-sdk/blob/22b2ccc38aadfee03a1077786ec5de9ae678568c/src/services/uniswap.service.ts#L97)

Uniswap v4 quotes, gas estimates, and `prepareSwap` flows on Celo mainnet.

## Constructors

### Constructor

> **new UniswapService**(`clientFactory`): `UniswapService`

Defined in: [src/services/uniswap.service.ts:101](https://github.com/andrewkimjoseph/celina-sdk/blob/22b2ccc38aadfee03a1077786ec5de9ae678568c/src/services/uniswap.service.ts#L101)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`UniswapService`

## Methods

### estimateSwap()

> **estimateSwap**(`from`, `tokenIn`, `tokenOut`, `amount`, `params?`): `Promise`\<\{ `amountIn`: `string`; `amountOutMin`: `string`; `approvalGas`: `string`[]; `approvalStepsNeeded`: `number`; `deadline`: `string`; `deadlineMinutes`: `number`; `expectedOut`: `string`; `from`: `` `0x${string}` ``; `indexSource`: `string` \| `undefined`; `network`: `"mainnet"`; `protocol`: `"uniswap_v4"`; `recipient`: `` `0x${string}` ``; `routeHops`: `number`; `slippageTolerance`: `number`; `swapGas`: `string` \| `undefined`; `swapGasEstimated`: `boolean`; `tokenIn`: `string`; `tokenOut`: `string`; \}\>

Defined in: [src/services/uniswap.service.ts:454](https://github.com/andrewkimjoseph/celina-sdk/blob/22b2ccc38aadfee03a1077786ec5de9ae678568c/src/services/uniswap.service.ts#L454)

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

> **getSwapQuote**(`tokenIn`, `tokenOut`, `amount`, `_from?`): `Promise`\<\{ `amountIn`: `string`; `expectedOut`: `string`; `indexSource`: `string` \| `undefined`; `network`: `"mainnet"`; `protocol`: `"uniswap_v4"`; `route`: \{ `pools`: `UniswapPoolKey`[]; \}; `routeHops`: `number`; `tokenIn`: `string`; `tokenOut`: `string`; \}\>

Defined in: [src/services/uniswap.service.ts:420](https://github.com/andrewkimjoseph/celina-sdk/blob/22b2ccc38aadfee03a1077786ec5de9ae678568c/src/services/uniswap.service.ts#L420)

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

##### \_from?

`` `0x${string}` ``

Deprecated; ignored. Balance checks run on prepare/estimate only.

#### Returns

`Promise`\<\{ `amountIn`: `string`; `expectedOut`: `string`; `indexSource`: `string` \| `undefined`; `network`: `"mainnet"`; `protocol`: `"uniswap_v4"`; `route`: \{ `pools`: `UniswapPoolKey`[]; \}; `routeHops`: `number`; `tokenIn`: `string`; `tokenOut`: `string`; \}\>

***

### listPairs()

> **listPairs**(`token?`): `Promise`\<[`SwapPairsResult`](../../../index/type-aliases/SwapPairsResult.md)\>

Defined in: [src/services/uniswap.service.ts:397](https://github.com/andrewkimjoseph/celina-sdk/blob/22b2ccc38aadfee03a1077786ec5de9ae678568c/src/services/uniswap.service.ts#L397)

Uniswap v4 registry-token pairs on Celo mainnet (direct pools and 2-hop routes).

#### Parameters

##### token?

`string`

Optional registry symbol; when set, only pairs involving that token

#### Returns

`Promise`\<[`SwapPairsResult`](../../../index/type-aliases/SwapPairsResult.md)\>

***

### prepareSwap()

> **prepareSwap**(`from`, `tokenIn`, `tokenOut`, `amount`, `params?`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/uniswap.service.ts:549](https://github.com/andrewkimjoseph/celina-sdk/blob/22b2ccc38aadfee03a1077786ec5de9ae678568c/src/services/uniswap.service.ts#L549)

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
