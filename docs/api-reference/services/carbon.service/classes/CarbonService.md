[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/carbon.service](../README.md) / CarbonService

# Class: CarbonService

Defined in: [src/services/carbon.service.ts:31](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/carbon.service.ts#L31)

## Constructors

### Constructor

> **new CarbonService**(`config`, `tokenService`, `clientFactory`): `CarbonService`

Defined in: [src/services/carbon.service.ts:35](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/carbon.service.ts#L35)

#### Parameters

##### config

[`SdkConfig`](../../../index/interfaces/SdkConfig.md)

##### tokenService

[`TokenService`](../../token.service/classes/TokenService.md)

##### clientFactory

`CeloClientFactory`

#### Returns

`CarbonService`

## Methods

### buildExecutionSteps()

> **buildExecutionSteps**(`from`, `prepared`, `orderMeta`): `Promise`\<[`PreparedTx`](../../../types/prepared/interfaces/PreparedTx.md)[]\>

Defined in: [src/services/carbon.service.ts:70](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/carbon.service.ts#L70)

Build full on-chain steps (approvals + Carbon tx) for MCP local signing.

#### Parameters

##### from

`` `0x${string}` ``

##### prepared

[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)

##### orderMeta

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<[`PreparedTx`](../../../types/prepared/interfaces/PreparedTx.md)[]\>

***

### explorePair()

> **explorePair**(`body`): `Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

Defined in: [src/services/carbon.service.ts:249](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/carbon.service.ts#L249)

#### Parameters

##### body

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

***

### findOpportunities()

> **findOpportunities**(`body`): `Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

Defined in: [src/services/carbon.service.ts:277](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/carbon.service.ts#L277)

#### Parameters

##### body

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

***

### getActivity()

> **getActivity**(`body`): `Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

Defined in: [src/services/carbon.service.ts:273](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/carbon.service.ts#L273)

#### Parameters

##### body

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

***

### getPriceHistory()

> **getPriceHistory**(`body`): `Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

Defined in: [src/services/carbon.service.ts:289](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/carbon.service.ts#L289)

#### Parameters

##### body

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

***

### getProtocolStats()

> **getProtocolStats**(`body?`): `Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

Defined in: [src/services/carbon.service.ts:281](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/carbon.service.ts#L281)

#### Parameters

##### body?

`Record`\<`string`, `unknown`\> = `{}`

#### Returns

`Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

***

### getStrategies()

> **getStrategies**(`walletAddress`): `Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

Defined in: [src/services/carbon.service.ts:95](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/carbon.service.ts#L95)

#### Parameters

##### walletAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

***

### getStrategy()

> **getStrategy**(`strategyId`): `Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

Defined in: [src/services/carbon.service.ts:99](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/carbon.service.ts#L99)

#### Parameters

##### strategyId

`string`

#### Returns

`Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

***

### getTradeQuote()

> **getTradeQuote**(`body`): `Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

Defined in: [src/services/carbon.service.ts:169](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/carbon.service.ts#L169)

#### Parameters

##### body

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

***

### help()

> **help**(`topic?`): `Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

Defined in: [src/services/carbon.service.ts:310](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/carbon.service.ts#L310)

#### Parameters

##### topic?

`string`

#### Returns

`Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

***

### learn()

> **learn**(`topic?`): `Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

Defined in: [src/services/carbon.service.ts:314](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/carbon.service.ts#L314)

#### Parameters

##### topic?

`string`

#### Returns

`Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

***

### prepareConcentratedStrategy()

> **prepareConcentratedStrategy**(`body`): `Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

Defined in: [src/services/carbon.service.ts:121](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/carbon.service.ts#L121)

#### Parameters

##### body

[`CarbonWriteBody`](../type-aliases/CarbonWriteBody.md)

#### Returns

`Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

***

### prepareDeleteStrategy()

> **prepareDeleteStrategy**(`body`): `Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

Defined in: [src/services/carbon.service.ts:163](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/carbon.service.ts#L163)

#### Parameters

##### body

[`CarbonWriteBody`](../type-aliases/CarbonWriteBody.md)

#### Returns

`Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

***

### prepareDepositBudget()

> **prepareDepositBudget**(`body`): `Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

Defined in: [src/services/carbon.service.ts:147](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/carbon.service.ts#L147)

#### Parameters

##### body

[`CarbonWriteBody`](../type-aliases/CarbonWriteBody.md)

#### Returns

`Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

***

### prepareEditStrategy()

> **prepareEditStrategy**(`body`): `Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

Defined in: [src/services/carbon.service.ts:143](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/carbon.service.ts#L143)

#### Parameters

##### body

[`CarbonWriteBody`](../type-aliases/CarbonWriteBody.md)

#### Returns

`Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

***

### prepareFullRangeStrategy()

> **prepareFullRangeStrategy**(`body`): `Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

Defined in: [src/services/carbon.service.ts:129](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/carbon.service.ts#L129)

#### Parameters

##### body

[`CarbonWriteBody`](../type-aliases/CarbonWriteBody.md)

#### Returns

`Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

***

### prepareLimitOrder()

> **prepareLimitOrder**(`body`): `Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

Defined in: [src/services/carbon.service.ts:105](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/carbon.service.ts#L105)

#### Parameters

##### body

[`CarbonWriteBody`](../type-aliases/CarbonWriteBody.md)

#### Returns

`Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

***

### preparePauseStrategy()

> **preparePauseStrategy**(`body`): `Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

Defined in: [src/services/carbon.service.ts:155](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/carbon.service.ts#L155)

#### Parameters

##### body

[`CarbonWriteBody`](../type-aliases/CarbonWriteBody.md)

#### Returns

`Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

***

### prepareRangeOrder()

> **prepareRangeOrder**(`body`): `Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

Defined in: [src/services/carbon.service.ts:109](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/carbon.service.ts#L109)

#### Parameters

##### body

[`CarbonWriteBody`](../type-aliases/CarbonWriteBody.md)

#### Returns

`Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

***

### prepareRecurringStrategy()

> **prepareRecurringStrategy**(`body`): `Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

Defined in: [src/services/carbon.service.ts:113](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/carbon.service.ts#L113)

#### Parameters

##### body

[`CarbonWriteBody`](../type-aliases/CarbonWriteBody.md)

#### Returns

`Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

***

### prepareRepriceStrategy()

> **prepareRepriceStrategy**(`body`): `Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

Defined in: [src/services/carbon.service.ts:139](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/carbon.service.ts#L139)

#### Parameters

##### body

[`CarbonWriteBody`](../type-aliases/CarbonWriteBody.md)

#### Returns

`Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

***

### prepareResumeStrategy()

> **prepareResumeStrategy**(`body`): `Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

Defined in: [src/services/carbon.service.ts:159](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/carbon.service.ts#L159)

#### Parameters

##### body

[`CarbonWriteBody`](../type-aliases/CarbonWriteBody.md)

#### Returns

`Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

***

### prepareTrade()

> **prepareTrade**(`body`): `Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

Defined in: [src/services/carbon.service.ts:211](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/carbon.service.ts#L211)

#### Parameters

##### body

[`CarbonWriteBody`](../type-aliases/CarbonWriteBody.md)

#### Returns

`Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

***

### prepareWithdrawBudget()

> **prepareWithdrawBudget**(`body`): `Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

Defined in: [src/services/carbon.service.ts:151](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/carbon.service.ts#L151)

#### Parameters

##### body

[`CarbonWriteBody`](../type-aliases/CarbonWriteBody.md)

#### Returns

`Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

***

### resolveToken()

> **resolveToken**(`symbolOrName`): `Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

Defined in: [src/services/carbon.service.ts:253](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/carbon.service.ts#L253)

#### Parameters

##### symbolOrName

`string`

#### Returns

`Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

***

### simulateStrategy()

> **simulateStrategy**(`body`): `Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

Defined in: [src/services/carbon.service.ts:298](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/carbon.service.ts#L298)

#### Parameters

##### body

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>
