[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/gooddollar.service](../README.md) / GoodDollarReserveSwapParams

# Interface: GoodDollarReserveSwapParams

Defined in: [src/services/gooddollar.service.ts:72](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/services/gooddollar.service.ts#L72)

Optional parameters for GoodDollar reserve swap prepares.

## Properties

### amountSide?

> `optional` **amountSide?**: [`GoodDollarReserveAmountSide`](../type-aliases/GoodDollarReserveAmountSide.md)

Defined in: [src/services/gooddollar.service.ts:81](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/services/gooddollar.service.ts#L81)

`in` (default): `amount` is token_in spend. `out`: `amount` is desired token_out;
SDK resolves required token_in via MentoBroker `getAmountIn`.

***

### recipient?

> `optional` **recipient?**: `` `0x${string}` ``

Defined in: [src/services/gooddollar.service.ts:76](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/services/gooddollar.service.ts#L76)

Address receiving output tokens (default: `from`).

***

### slippageTolerance?

> `optional` **slippageTolerance?**: `number`

Defined in: [src/services/gooddollar.service.ts:74](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/services/gooddollar.service.ts#L74)

Max slippage tolerance in percent (default `0.5`).
