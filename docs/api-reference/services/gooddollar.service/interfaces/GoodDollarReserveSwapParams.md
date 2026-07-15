[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/gooddollar.service](../README.md) / GoodDollarReserveSwapParams

# Interface: GoodDollarReserveSwapParams

Defined in: [src/services/gooddollar.service.ts:68](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/services/gooddollar.service.ts#L68)

Optional parameters for GoodDollar reserve swap prepares.

## Properties

### amountSide?

> `optional` **amountSide?**: [`GoodDollarReserveAmountSide`](../type-aliases/GoodDollarReserveAmountSide.md)

Defined in: [src/services/gooddollar.service.ts:77](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/services/gooddollar.service.ts#L77)

`in` (default): `amount` is token_in spend. `out`: `amount` is desired token_out;
SDK resolves required token_in via MentoBroker `getAmountIn`.

***

### recipient?

> `optional` **recipient?**: `` `0x${string}` ``

Defined in: [src/services/gooddollar.service.ts:72](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/services/gooddollar.service.ts#L72)

Address receiving output tokens (default: `from`).

***

### slippageTolerance?

> `optional` **slippageTolerance?**: `number`

Defined in: [src/services/gooddollar.service.ts:70](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/services/gooddollar.service.ts#L70)

Max slippage tolerance in percent (default `0.5`).
