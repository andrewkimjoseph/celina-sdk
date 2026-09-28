[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/uniswap.service](../README.md) / UniswapSwapParams

# Interface: UniswapSwapParams

Defined in: [src/services/uniswap.service.ts:50](https://github.com/andrewkimjoseph/celina-sdk/blob/22b2ccc38aadfee03a1077786ec5de9ae678568c/src/services/uniswap.service.ts#L50)

Optional parameters for Uniswap v4 swap estimates and prepares.

## Properties

### deadlineMinutes?

> `optional` **deadlineMinutes?**: `number`

Defined in: [src/services/uniswap.service.ts:54](https://github.com/andrewkimjoseph/celina-sdk/blob/22b2ccc38aadfee03a1077786ec5de9ae678568c/src/services/uniswap.service.ts#L54)

Swap deadline in minutes from now (default `5`).

***

### recipient?

> `optional` **recipient?**: `` `0x${string}` ``

Defined in: [src/services/uniswap.service.ts:56](https://github.com/andrewkimjoseph/celina-sdk/blob/22b2ccc38aadfee03a1077786ec5de9ae678568c/src/services/uniswap.service.ts#L56)

Address receiving output tokens (default: `from`).

***

### slippageTolerance?

> `optional` **slippageTolerance?**: `number`

Defined in: [src/services/uniswap.service.ts:52](https://github.com/andrewkimjoseph/celina-sdk/blob/22b2ccc38aadfee03a1077786ec5de9ae678568c/src/services/uniswap.service.ts#L52)

Max slippage tolerance in percent (default `0.5`).
