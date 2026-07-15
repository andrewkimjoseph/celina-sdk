[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/uniswap.service](../README.md) / UniswapSwapParams

# Interface: UniswapSwapParams

Defined in: [src/services/uniswap.service.ts:44](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/services/uniswap.service.ts#L44)

Optional parameters for Uniswap v4 swap estimates and prepares.

## Properties

### deadlineMinutes?

> `optional` **deadlineMinutes?**: `number`

Defined in: [src/services/uniswap.service.ts:48](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/services/uniswap.service.ts#L48)

Swap deadline in minutes from now (default `5`).

***

### recipient?

> `optional` **recipient?**: `` `0x${string}` ``

Defined in: [src/services/uniswap.service.ts:50](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/services/uniswap.service.ts#L50)

Address receiving output tokens (default: `from`).

***

### slippageTolerance?

> `optional` **slippageTolerance?**: `number`

Defined in: [src/services/uniswap.service.ts:46](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/services/uniswap.service.ts#L46)

Max slippage tolerance in percent (default `0.5`).
