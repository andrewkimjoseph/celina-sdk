[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/aave.service](../README.md) / AaveService

# Class: AaveService

Defined in: [src/services/aave.service.ts:25](https://github.com/andrewkimjoseph/celina-sdk/blob/c4138c1333e37c3188f9b6d876cbd4e95b2408f1/src/services/aave.service.ts#L25)

Aave V3 supplied balance reads and supply/withdraw prepared flows on Celo mainnet.

## Constructors

### Constructor

> **new AaveService**(`clientFactory`): `AaveService`

Defined in: [src/services/aave.service.ts:28](https://github.com/andrewkimjoseph/celina-sdk/blob/c4138c1333e37c3188f9b6d876cbd4e95b2408f1/src/services/aave.service.ts#L28)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`AaveService`

## Methods

### getBalances()

> **getBalances**(`address`, `options?`): `Promise`\<\{ `address`: `` `0x${string}` ``; `balances`: (\{ `aToken`: `` `0x${string}` ``; `formatted`: `string`; `raw`: `string`; `readError`: `true`; `symbol`: `string`; `underlying`: `` `0x${string}` ``; \} \| \{ `aToken`: `` `0x${string}` ``; `formatted`: `string`; `raw`: `string`; `readError?`: `undefined`; `symbol`: `string`; `underlying`: `` `0x${string}` ``; \})[]; `market`: `"0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402"`; `network`: `"mainnet"`; `totalChecked`: `number`; \}\>

Defined in: [src/services/aave.service.ts:98](https://github.com/andrewkimjoseph/celina-sdk/blob/c4138c1333e37c3188f9b6d876cbd4e95b2408f1/src/services/aave.service.ts#L98)

Supplied Aave V3 positions (aToken balances) for an address on Celo mainnet.
Amounts are in underlying token units including accrued interest.

#### Parameters

##### address

`` `0x${string}` ``

##### options?

###### includeZero?

`boolean`

###### tokens?

`string`[]

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` ``; `balances`: (\{ `aToken`: `` `0x${string}` ``; `formatted`: `string`; `raw`: `string`; `readError`: `true`; `symbol`: `string`; `underlying`: `` `0x${string}` ``; \} \| \{ `aToken`: `` `0x${string}` ``; `formatted`: `string`; `raw`: `string`; `readError?`: `undefined`; `symbol`: `string`; `underlying`: `` `0x${string}` ``; \})[]; `market`: `"0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402"`; `network`: `"mainnet"`; `totalChecked`: `number`; \}\>

***

### prepareSupply()

> **prepareSupply**(`from`, `token`, `amount`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/aave.service.ts:181](https://github.com/andrewkimjoseph/celina-sdk/blob/c4138c1333e37c3188f9b6d876cbd4e95b2408f1/src/services/aave.service.ts#L181)

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

Defined in: [src/services/aave.service.ts:246](https://github.com/andrewkimjoseph/celina-sdk/blob/c4138c1333e37c3188f9b6d876cbd4e95b2408f1/src/services/aave.service.ts#L246)

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
