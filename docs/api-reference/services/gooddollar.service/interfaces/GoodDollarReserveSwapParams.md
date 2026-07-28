[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/gooddollar.service](../README.md) / GoodDollarReserveSwapParams

# Interface: GoodDollarReserveSwapParams

Defined in: [src/services/gooddollar.service.ts:85](https://github.com/andrewkimjoseph/celina-sdk/blob/108a06415a8ecf8f0740dcf787117e653a3ffce0/src/services/gooddollar.service.ts#L85)

Optional parameters for GoodDollar reserve swap prepares.

## Properties

### amountSide?

> `optional` **amountSide?**: [`GoodDollarReserveAmountSide`](../type-aliases/GoodDollarReserveAmountSide.md)

Defined in: [src/services/gooddollar.service.ts:94](https://github.com/andrewkimjoseph/celina-sdk/blob/108a06415a8ecf8f0740dcf787117e653a3ffce0/src/services/gooddollar.service.ts#L94)

`in` (default): `amount` is token_in spend. `out`: `amount` is desired token_out;
SDK resolves required token_in via MentoBroker `getAmountIn`.

***

### recipient?

> `optional` **recipient?**: `` `0x${string}` ``

Defined in: [src/services/gooddollar.service.ts:89](https://github.com/andrewkimjoseph/celina-sdk/blob/108a06415a8ecf8f0740dcf787117e653a3ffce0/src/services/gooddollar.service.ts#L89)

Address receiving output tokens (default: `from`).

***

### slippageTolerance?

> `optional` **slippageTolerance?**: `number`

Defined in: [src/services/gooddollar.service.ts:87](https://github.com/andrewkimjoseph/celina-sdk/blob/108a06415a8ecf8f0740dcf787117e653a3ffce0/src/services/gooddollar.service.ts#L87)

Max slippage tolerance in percent (default `0.5`).
