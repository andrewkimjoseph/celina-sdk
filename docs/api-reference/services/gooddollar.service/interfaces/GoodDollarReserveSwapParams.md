[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/gooddollar.service](../README.md) / GoodDollarReserveSwapParams

# Interface: GoodDollarReserveSwapParams

Defined in: [src/services/gooddollar.service.ts:67](https://github.com/andrewkimjoseph/celina-sdk/blob/15eb03644ed64e7dabf36462c8a85f34a3beaae2/src/services/gooddollar.service.ts#L67)

Optional parameters for GoodDollar reserve swap prepares.

## Properties

### amountSide?

> `optional` **amountSide?**: [`GoodDollarReserveAmountSide`](../type-aliases/GoodDollarReserveAmountSide.md)

Defined in: [src/services/gooddollar.service.ts:76](https://github.com/andrewkimjoseph/celina-sdk/blob/15eb03644ed64e7dabf36462c8a85f34a3beaae2/src/services/gooddollar.service.ts#L76)

`in` (default): `amount` is token_in spend. `out`: `amount` is desired token_out;
SDK resolves required token_in via MentoBroker `getAmountIn`.

***

### recipient?

> `optional` **recipient?**: `` `0x${string}` ``

Defined in: [src/services/gooddollar.service.ts:71](https://github.com/andrewkimjoseph/celina-sdk/blob/15eb03644ed64e7dabf36462c8a85f34a3beaae2/src/services/gooddollar.service.ts#L71)

Address receiving output tokens (default: `from`).

***

### slippageTolerance?

> `optional` **slippageTolerance?**: `number`

Defined in: [src/services/gooddollar.service.ts:69](https://github.com/andrewkimjoseph/celina-sdk/blob/15eb03644ed64e7dabf36462c8a85f34a3beaae2/src/services/gooddollar.service.ts#L69)

Max slippage tolerance in percent (default `0.5`).
