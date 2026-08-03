[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/gooddollar.service](../README.md) / GoodDollarReserveSwapParams

# Interface: GoodDollarReserveSwapParams

Defined in: [src/services/gooddollar.service.ts:104](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/services/gooddollar.service.ts#L104)

Optional parameters for GoodDollar reserve swap prepares.

## Properties

### amountSide?

> `optional` **amountSide?**: [`GoodDollarReserveAmountSide`](../type-aliases/GoodDollarReserveAmountSide.md)

Defined in: [src/services/gooddollar.service.ts:113](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/services/gooddollar.service.ts#L113)

`in` (default): `amount` is token_in spend. `out`: `amount` is desired token_out;
SDK resolves required token_in via MentoBroker `getAmountIn`.

***

### recipient?

> `optional` **recipient?**: `` `0x${string}` ``

Defined in: [src/services/gooddollar.service.ts:108](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/services/gooddollar.service.ts#L108)

Address receiving output tokens (default: `from`).

***

### slippageTolerance?

> `optional` **slippageTolerance?**: `number`

Defined in: [src/services/gooddollar.service.ts:106](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/services/gooddollar.service.ts#L106)

Max slippage tolerance in percent (default `0.5`).
