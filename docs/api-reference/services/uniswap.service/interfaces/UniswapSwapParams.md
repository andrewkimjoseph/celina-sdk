[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/uniswap.service](../README.md) / UniswapSwapParams

# Interface: UniswapSwapParams

Defined in: [src/services/uniswap.service.ts:44](https://github.com/andrewkimjoseph/celina-sdk/blob/c4138c1333e37c3188f9b6d876cbd4e95b2408f1/src/services/uniswap.service.ts#L44)

Optional parameters for Uniswap v4 swap estimates and prepares.

## Properties

### deadlineMinutes?

> `optional` **deadlineMinutes?**: `number`

Defined in: [src/services/uniswap.service.ts:48](https://github.com/andrewkimjoseph/celina-sdk/blob/c4138c1333e37c3188f9b6d876cbd4e95b2408f1/src/services/uniswap.service.ts#L48)

Swap deadline in minutes from now (default `5`).

***

### recipient?

> `optional` **recipient?**: `` `0x${string}` ``

Defined in: [src/services/uniswap.service.ts:50](https://github.com/andrewkimjoseph/celina-sdk/blob/c4138c1333e37c3188f9b6d876cbd4e95b2408f1/src/services/uniswap.service.ts#L50)

Address receiving output tokens (default: `from`).

***

### slippageTolerance?

> `optional` **slippageTolerance?**: `number`

Defined in: [src/services/uniswap.service.ts:46](https://github.com/andrewkimjoseph/celina-sdk/blob/c4138c1333e37c3188f9b6d876cbd4e95b2408f1/src/services/uniswap.service.ts#L46)

Max slippage tolerance in percent (default `0.5`).
