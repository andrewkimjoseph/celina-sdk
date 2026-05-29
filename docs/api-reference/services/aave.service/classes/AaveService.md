[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/aave.service](../README.md) / AaveService

# Class: AaveService

Defined in: [src/services/aave.service.ts:23](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/aave.service.ts#L23)

## Constructors

### Constructor

> **new AaveService**(`clientFactory`): `AaveService`

Defined in: [src/services/aave.service.ts:26](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/aave.service.ts#L26)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`AaveService`

## Methods

### prepareSupply()

> **prepareSupply**(`from`, `token`, `amount`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/aave.service.ts:106](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/aave.service.ts#L106)

Build unsigned Aave V3 supply steps (approve + supply when needed).

#### Parameters

##### from

`` `0x${string}` ``

Supplier wallet address

##### token

`string`

Aave asset symbol (e.g. `USDm`, `USDC`)

##### amount

`string`

Human-readable supply amount

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

1–2 step `SerializedPreparedFlow`; CELO must be wrapped ERC-20, not native

***

### prepareWithdraw()

> **prepareWithdraw**(`from`, `token`, `amount`, `withdrawMax?`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/aave.service.ts:171](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/aave.service.ts#L171)

Build unsigned Aave V3 withdraw step on Celo.

#### Parameters

##### from

`` `0x${string}` ``

Withdrawer wallet address

##### token

`string`

Aave asset symbol

##### amount

`string` \| `undefined`

Human-readable withdraw amount (omit when using `withdrawMax`)

##### withdrawMax?

`boolean`

When true, withdraws full supplied aToken balance

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Single-step `SerializedPreparedFlow`
