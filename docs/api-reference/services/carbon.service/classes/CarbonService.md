[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/carbon.service](../README.md) / CarbonService

# Class: CarbonService

Defined in: [src/services/carbon.service.ts:23](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/services/carbon.service.ts#L23)

## Constructors

### Constructor

> **new CarbonService**(`config`, `tokenService`): `CarbonService`

Defined in: [src/services/carbon.service.ts:27](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/services/carbon.service.ts#L27)

#### Parameters

##### config

[`SdkConfig`](../../../index/interfaces/SdkConfig.md)

##### tokenService

[`TokenService`](../../token.service/classes/TokenService.md)

#### Returns

`CarbonService`

## Methods

### explorePair()

> **explorePair**(`body`): `Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

Defined in: [src/services/carbon.service.ts:208](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/services/carbon.service.ts#L208)

#### Parameters

##### body

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

***

### findOpportunities()

> **findOpportunities**(`body`): `Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

Defined in: [src/services/carbon.service.ts:234](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/services/carbon.service.ts#L234)

#### Parameters

##### body

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

***

### getActivity()

> **getActivity**(`body`): `Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

Defined in: [src/services/carbon.service.ts:230](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/services/carbon.service.ts#L230)

#### Parameters

##### body

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

***

### getPriceHistory()

> **getPriceHistory**(`body`): `Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

Defined in: [src/services/carbon.service.ts:246](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/services/carbon.service.ts#L246)

#### Parameters

##### body

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

***

### getProtocolStats()

> **getProtocolStats**(`body?`): `Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

Defined in: [src/services/carbon.service.ts:238](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/services/carbon.service.ts#L238)

#### Parameters

##### body?

`Record`\<`string`, `unknown`\> = `{}`

#### Returns

`Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

***

### getStrategies()

> **getStrategies**(`walletAddress`): `Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

Defined in: [src/services/carbon.service.ts:70](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/services/carbon.service.ts#L70)

#### Parameters

##### walletAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

***

### getStrategy()

> **getStrategy**(`strategyId`): `Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

Defined in: [src/services/carbon.service.ts:74](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/services/carbon.service.ts#L74)

#### Parameters

##### strategyId

`string`

#### Returns

`Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

***

### getTradeQuote()

> **getTradeQuote**(`body`): `Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

Defined in: [src/services/carbon.service.ts:144](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/services/carbon.service.ts#L144)

#### Parameters

##### body

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

***

### help()

> **help**(`topic?`): `Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

Defined in: [src/services/carbon.service.ts:267](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/services/carbon.service.ts#L267)

#### Parameters

##### topic?

`string`

#### Returns

`Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

***

### learn()

> **learn**(`topic?`): `Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

Defined in: [src/services/carbon.service.ts:271](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/services/carbon.service.ts#L271)

#### Parameters

##### topic?

`string`

#### Returns

`Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

***

### prepareConcentratedStrategy()

> **prepareConcentratedStrategy**(`body`): `Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

Defined in: [src/services/carbon.service.ts:96](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/services/carbon.service.ts#L96)

#### Parameters

##### body

[`CarbonWriteBody`](../type-aliases/CarbonWriteBody.md)

#### Returns

`Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

***

### prepareDeleteStrategy()

> **prepareDeleteStrategy**(`body`): `Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

Defined in: [src/services/carbon.service.ts:138](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/services/carbon.service.ts#L138)

#### Parameters

##### body

[`CarbonWriteBody`](../type-aliases/CarbonWriteBody.md)

#### Returns

`Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

***

### prepareDepositBudget()

> **prepareDepositBudget**(`body`): `Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

Defined in: [src/services/carbon.service.ts:122](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/services/carbon.service.ts#L122)

#### Parameters

##### body

[`CarbonWriteBody`](../type-aliases/CarbonWriteBody.md)

#### Returns

`Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

***

### prepareEditStrategy()

> **prepareEditStrategy**(`body`): `Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

Defined in: [src/services/carbon.service.ts:118](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/services/carbon.service.ts#L118)

#### Parameters

##### body

[`CarbonWriteBody`](../type-aliases/CarbonWriteBody.md)

#### Returns

`Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

***

### prepareFullRangeStrategy()

> **prepareFullRangeStrategy**(`body`): `Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

Defined in: [src/services/carbon.service.ts:104](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/services/carbon.service.ts#L104)

#### Parameters

##### body

[`CarbonWriteBody`](../type-aliases/CarbonWriteBody.md)

#### Returns

`Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

***

### prepareLimitOrder()

> **prepareLimitOrder**(`body`): `Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

Defined in: [src/services/carbon.service.ts:80](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/services/carbon.service.ts#L80)

#### Parameters

##### body

[`CarbonWriteBody`](../type-aliases/CarbonWriteBody.md)

#### Returns

`Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

***

### preparePauseStrategy()

> **preparePauseStrategy**(`body`): `Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

Defined in: [src/services/carbon.service.ts:130](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/services/carbon.service.ts#L130)

#### Parameters

##### body

[`CarbonWriteBody`](../type-aliases/CarbonWriteBody.md)

#### Returns

`Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

***

### prepareRangeOrder()

> **prepareRangeOrder**(`body`): `Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

Defined in: [src/services/carbon.service.ts:84](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/services/carbon.service.ts#L84)

#### Parameters

##### body

[`CarbonWriteBody`](../type-aliases/CarbonWriteBody.md)

#### Returns

`Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

***

### prepareRecurringStrategy()

> **prepareRecurringStrategy**(`body`): `Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

Defined in: [src/services/carbon.service.ts:88](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/services/carbon.service.ts#L88)

#### Parameters

##### body

[`CarbonWriteBody`](../type-aliases/CarbonWriteBody.md)

#### Returns

`Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

***

### prepareRepriceStrategy()

> **prepareRepriceStrategy**(`body`): `Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

Defined in: [src/services/carbon.service.ts:114](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/services/carbon.service.ts#L114)

#### Parameters

##### body

[`CarbonWriteBody`](../type-aliases/CarbonWriteBody.md)

#### Returns

`Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

***

### prepareResumeStrategy()

> **prepareResumeStrategy**(`body`): `Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

Defined in: [src/services/carbon.service.ts:134](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/services/carbon.service.ts#L134)

#### Parameters

##### body

[`CarbonWriteBody`](../type-aliases/CarbonWriteBody.md)

#### Returns

`Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

***

### prepareTrade()

> **prepareTrade**(`body`): `Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

Defined in: [src/services/carbon.service.ts:180](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/services/carbon.service.ts#L180)

#### Parameters

##### body

[`CarbonWriteBody`](../type-aliases/CarbonWriteBody.md)

#### Returns

`Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

***

### prepareWithdrawBudget()

> **prepareWithdrawBudget**(`body`): `Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

Defined in: [src/services/carbon.service.ts:126](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/services/carbon.service.ts#L126)

#### Parameters

##### body

[`CarbonWriteBody`](../type-aliases/CarbonWriteBody.md)

#### Returns

`Promise`\<[`CarbonPrepareResult`](../../../index/interfaces/CarbonPrepareResult.md)\>

***

### resolveToken()

> **resolveToken**(`symbolOrName`): `Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

Defined in: [src/services/carbon.service.ts:212](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/services/carbon.service.ts#L212)

#### Parameters

##### symbolOrName

`string`

#### Returns

`Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

***

### simulateStrategy()

> **simulateStrategy**(`body`): `Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>

Defined in: [src/services/carbon.service.ts:255](https://github.com/andrewkimjoseph/celina-sdk/blob/9d8da2ec79a8d0b4bc27f84ffe83d23087f51af1/src/services/carbon.service.ts#L255)

#### Parameters

##### body

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<[`CarbonRestSuccess`](../../../index/type-aliases/CarbonRestSuccess.md) & `object`\>
