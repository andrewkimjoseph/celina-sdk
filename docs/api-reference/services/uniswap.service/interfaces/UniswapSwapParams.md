[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/uniswap.service](../README.md) / UniswapSwapParams

# Interface: UniswapSwapParams

Defined in: [src/services/uniswap.service.ts:43](https://github.com/andrewkimjoseph/celina-sdk/blob/852f4654b3367c2e99db65ab17e2cfcd145a3d0e/src/services/uniswap.service.ts#L43)

Optional parameters for Uniswap v4 swap estimates and prepares.

## Properties

### deadlineMinutes?

> `optional` **deadlineMinutes?**: `number`

Defined in: [src/services/uniswap.service.ts:47](https://github.com/andrewkimjoseph/celina-sdk/blob/852f4654b3367c2e99db65ab17e2cfcd145a3d0e/src/services/uniswap.service.ts#L47)

Swap deadline in minutes from now (default `5`).

***

### recipient?

> `optional` **recipient?**: `` `0x${string}` ``

Defined in: [src/services/uniswap.service.ts:49](https://github.com/andrewkimjoseph/celina-sdk/blob/852f4654b3367c2e99db65ab17e2cfcd145a3d0e/src/services/uniswap.service.ts#L49)

Address receiving output tokens (default: `from`).

***

### slippageTolerance?

> `optional` **slippageTolerance?**: `number`

Defined in: [src/services/uniswap.service.ts:45](https://github.com/andrewkimjoseph/celina-sdk/blob/852f4654b3367c2e99db65ab17e2cfcd145a3d0e/src/services/uniswap.service.ts#L45)

Max slippage tolerance in percent (default `0.5`).
