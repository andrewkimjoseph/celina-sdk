[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/uniswap.service](../README.md) / UniswapSwapParams

# Interface: UniswapSwapParams

Defined in: [src/services/uniswap.service.ts:57](https://github.com/andrewkimjoseph/celina-sdk/blob/7e7366e621d233383ba931e39791a490b5122106/src/services/uniswap.service.ts#L57)

Optional parameters for Uniswap swap estimates and prepares.

## Properties

### deadlineMinutes?

> `optional` **deadlineMinutes?**: `number`

Defined in: [src/services/uniswap.service.ts:61](https://github.com/andrewkimjoseph/celina-sdk/blob/7e7366e621d233383ba931e39791a490b5122106/src/services/uniswap.service.ts#L61)

Swap deadline in minutes from now (default `5`).

***

### protocol?

> `optional` **protocol?**: `UniswapProtocol`

Defined in: [src/services/uniswap.service.ts:68](https://github.com/andrewkimjoseph/celina-sdk/blob/7e7366e621d233383ba931e39791a490b5122106/src/services/uniswap.service.ts#L68)

When set, quote and prepare only this venue.
Omit to compare v3 and v4 and keep the higher output.

***

### recipient?

> `optional` **recipient?**: `` `0x${string}` ``

Defined in: [src/services/uniswap.service.ts:63](https://github.com/andrewkimjoseph/celina-sdk/blob/7e7366e621d233383ba931e39791a490b5122106/src/services/uniswap.service.ts#L63)

Address receiving output tokens (default: `from`).

***

### slippageTolerance?

> `optional` **slippageTolerance?**: `number`

Defined in: [src/services/uniswap.service.ts:59](https://github.com/andrewkimjoseph/celina-sdk/blob/7e7366e621d233383ba931e39791a490b5122106/src/services/uniswap.service.ts#L59)

Max slippage tolerance in percent (default `0.5`).
