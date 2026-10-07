[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/uniswap.service](../README.md) / UniswapService

# Class: UniswapService

Defined in: [src/services/uniswap.service.ts:109](https://github.com/andrewkimjoseph/celina-sdk/blob/7e7366e621d233383ba931e39791a490b5122106/src/services/uniswap.service.ts#L109)

Uniswap v3 and v4 quotes, gas estimates, and `prepareSwap` flows on Celo mainnet.

## Constructors

### Constructor

> **new UniswapService**(`clientFactory`): `UniswapService`

Defined in: [src/services/uniswap.service.ts:113](https://github.com/andrewkimjoseph/celina-sdk/blob/7e7366e621d233383ba931e39791a490b5122106/src/services/uniswap.service.ts#L113)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`UniswapService`

## Methods

### estimateSwap()

> **estimateSwap**(`from`, `tokenIn`, `tokenOut`, `amount`, `params?`): `Promise`\<\{ `amountIn`: `string`; `amountOutMin`: `string`; `approvalGas`: `string`[]; `approvalStepsNeeded`: `number`; `deadline`: `string`; `deadlineMinutes`: `number`; `expectedOut`: `string`; `from`: `` `0x${string}` ``; `indexSource`: `string` \| `undefined`; `network`: `"mainnet"`; `protocol`: `UniswapProtocol`; `recipient`: `` `0x${string}` ``; `routeHops`: `number`; `slippageTolerance`: `number`; `swapGas`: `string` \| `undefined`; `swapGasEstimated`: `boolean`; `tokenIn`: `string`; `tokenOut`: `string`; \}\>

Defined in: [src/services/uniswap.service.ts:520](https://github.com/andrewkimjoseph/celina-sdk/blob/7e7366e621d233383ba931e39791a490b5122106/src/services/uniswap.service.ts#L520)

Simulate gas for a Uniswap swap from `from`.
v4 includes Permit2 approvals when needed. v3 includes one ERC-20 approval when needed.

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

`Promise`\<\{ `amountIn`: `string`; `amountOutMin`: `string`; `approvalGas`: `string`[]; `approvalStepsNeeded`: `number`; `deadline`: `string`; `deadlineMinutes`: `number`; `expectedOut`: `string`; `from`: `` `0x${string}` ``; `indexSource`: `string` \| `undefined`; `network`: `"mainnet"`; `protocol`: `UniswapProtocol`; `recipient`: `` `0x${string}` ``; `routeHops`: `number`; `slippageTolerance`: `number`; `swapGas`: `string` \| `undefined`; `swapGasEstimated`: `boolean`; `tokenIn`: `string`; `tokenOut`: `string`; \}\>

***

### getSwapQuote()

> **getSwapQuote**(`tokenIn`, `tokenOut`, `amount`, `_from?`): `Promise`\<\{ `amountIn`: `string`; `expectedOut`: `string`; `indexSource`: `string` \| `undefined`; `network`: `"mainnet"`; `protocol`: `UniswapProtocol`; `route`: \{ `pools`: `UniswapPoolKey`[] \| `UniswapV3Pool`[]; \}; `routeHops`: `number`; `tokenIn`: `string`; `tokenOut`: `string`; \}\>

Defined in: [src/services/uniswap.service.ts:484](https://github.com/andrewkimjoseph/celina-sdk/blob/7e7366e621d233383ba931e39791a490b5122106/src/services/uniswap.service.ts#L484)

Expected Uniswap output for a token pair — no wallet required.
Compares v3 and v4 and returns the higher output.

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

`Promise`\<\{ `amountIn`: `string`; `expectedOut`: `string`; `indexSource`: `string` \| `undefined`; `network`: `"mainnet"`; `protocol`: `UniswapProtocol`; `route`: \{ `pools`: `UniswapPoolKey`[] \| `UniswapV3Pool`[]; \}; `routeHops`: `number`; `tokenIn`: `string`; `tokenOut`: `string`; \}\>

***

### listPairs()

> **listPairs**(`token?`): `Promise`\<[`SwapPairsResult`](../../../index/type-aliases/SwapPairsResult.md)\>

Defined in: [src/services/uniswap.service.ts:454](https://github.com/andrewkimjoseph/celina-sdk/blob/7e7366e621d233383ba931e39791a490b5122106/src/services/uniswap.service.ts#L454)

Uniswap registry-token pairs on Celo mainnet (v4 graph plus v3 hub pools).
`protocol` stays `uniswap_v4` for existing consumers. Each pair's `venues`
lists which versions can route it.

#### Parameters

##### token?

`string`

Optional registry symbol; when set, only pairs involving that token

#### Returns

`Promise`\<[`SwapPairsResult`](../../../index/type-aliases/SwapPairsResult.md)\>

***

### prepareSwap()

> **prepareSwap**(`from`, `tokenIn`, `tokenOut`, `amount`, `params?`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/uniswap.service.ts:623](https://github.com/andrewkimjoseph/celina-sdk/blob/7e7366e621d233383ba931e39791a490b5122106/src/services/uniswap.service.ts#L623)

Build unsigned Uniswap steps.
v4: ERC-20 approve → Permit2 approve → Universal Router swap.
v3: ERC-20 approve → SwapRouter02 multicall swap.
Pass `params.protocol` to pin the venue from a quote the caller already chose.

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
