[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/aave.service](../README.md) / AaveService

# Class: AaveService

Defined in: [src/services/aave.service.ts:24](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/aave.service.ts#L24)

Aave V3 supply and withdraw prepared flows on Celo mainnet.

## Constructors

### Constructor

> **new AaveService**(`clientFactory`): `AaveService`

Defined in: [src/services/aave.service.ts:27](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/aave.service.ts#L27)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`AaveService`

## Methods

### prepareSupply()

> **prepareSupply**(`from`, `token`, `amount`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/aave.service.ts:107](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/aave.service.ts#L107)

Build unsigned Aave V3 supply steps (approve + supply when needed).

#### Parameters

##### from

`` `0x${string}` ``

Supplier wallet address

##### token

`string`

Aave asset symbol (e.g. `USDm`, `USDC`); `CELO` uses wrapped CELO (WCELO)

##### amount

`string`

Human-readable supply amount

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

1–2 step `SerializedPreparedFlow`; CELO must be wrapped ERC-20, not native

***

### prepareWithdraw()

> **prepareWithdraw**(`from`, `token`, `amount`, `withdrawMax?`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/aave.service.ts:172](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/aave.service.ts#L172)

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
