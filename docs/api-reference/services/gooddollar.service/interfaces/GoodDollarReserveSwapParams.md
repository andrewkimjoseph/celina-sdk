[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/gooddollar.service](../README.md) / GoodDollarReserveSwapParams

# Interface: GoodDollarReserveSwapParams

Defined in: [src/services/gooddollar.service.ts:70](https://github.com/andrewkimjoseph/celina-sdk/blob/c4138c1333e37c3188f9b6d876cbd4e95b2408f1/src/services/gooddollar.service.ts#L70)

Optional parameters for GoodDollar reserve swap prepares.

## Properties

### recipient?

> `optional` **recipient?**: `` `0x${string}` ``

Defined in: [src/services/gooddollar.service.ts:74](https://github.com/andrewkimjoseph/celina-sdk/blob/c4138c1333e37c3188f9b6d876cbd4e95b2408f1/src/services/gooddollar.service.ts#L74)

Address receiving output tokens (default: `from`).

***

### slippageTolerance?

> `optional` **slippageTolerance?**: `number`

Defined in: [src/services/gooddollar.service.ts:72](https://github.com/andrewkimjoseph/celina-sdk/blob/c4138c1333e37c3188f9b6d876cbd4e95b2408f1/src/services/gooddollar.service.ts#L72)

Max slippage tolerance in percent (default `0.5`).
