[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/gooddollar.service](../README.md) / GoodDollarReserveSwapParams

# Interface: GoodDollarReserveSwapParams

Defined in: [src/services/gooddollar.service.ts:70](https://github.com/andrewkimjoseph/celina-sdk/blob/970ab720c805303ead8b20406c6579ecdcf2193a/src/services/gooddollar.service.ts#L70)

Optional parameters for GoodDollar reserve swap prepares.

## Properties

### recipient?

> `optional` **recipient?**: `` `0x${string}` ``

Defined in: [src/services/gooddollar.service.ts:74](https://github.com/andrewkimjoseph/celina-sdk/blob/970ab720c805303ead8b20406c6579ecdcf2193a/src/services/gooddollar.service.ts#L74)

Address receiving output tokens (default: `from`).

***

### slippageTolerance?

> `optional` **slippageTolerance?**: `number`

Defined in: [src/services/gooddollar.service.ts:72](https://github.com/andrewkimjoseph/celina-sdk/blob/970ab720c805303ead8b20406c6579ecdcf2193a/src/services/gooddollar.service.ts#L72)

Max slippage tolerance in percent (default `0.5`).
