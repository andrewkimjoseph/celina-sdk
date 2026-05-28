[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/gooddollar.service](../README.md) / GoodDollarService

# Class: GoodDollarService

Defined in: [src/services/gooddollar.service.ts:20](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/services/gooddollar.service.ts#L20)

## Constructors

### Constructor

> **new GoodDollarService**(`clientFactory`): `GoodDollarService`

Defined in: [src/services/gooddollar.service.ts:21](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/services/gooddollar.service.ts#L21)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`GoodDollarService`

## Methods

### getWhitelistingInfo()

> **getWhitelistingInfo**(`address`): `Promise`\<\{ `address`: `` `0x${string}` ``; `contract`: `"0xC361A6E67822a0EDc17D899227dd9FC50BD62F42"`; `fieldDescriptions`: \{ `lastAuthenticatedOn`: `string`; `whitelistedOn`: `string`; \}; `identity`: \{ `authCount`: `number`; `dateAdded`: `number`; `dateAuthenticated`: `number`; `did`: `string`; `status`: `number`; `whitelistedOnChainId`: `number`; \}; `isCurrentlyWhitelisted`: `boolean`; `lastAuthenticatedOn`: `string` \| `null`; `reverification`: \{ `currentReverificationPeriodDays`: `number`; `daysSinceLastAuthentication`: `number`; `daysUntilReverificationRequired`: `number`; `isReverificationOverdue`: `boolean`; `maxReverificationPeriodDays`: `number`; `reverificationProgressPercent`: `number`; `reverificationRequiredOn`: `string`; \} \| `null`; `status`: `number`; `statusLabel`: `string`; `whitelistedOn`: `string` \| `null`; \}\>

Defined in: [src/services/gooddollar.service.ts:24](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/services/gooddollar.service.ts#L24)

GoodDollar IdentityV4 whitelist status and reverification progress.

#### Parameters

##### address

`` `0x${string}` ``

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` ``; `contract`: `"0xC361A6E67822a0EDc17D899227dd9FC50BD62F42"`; `fieldDescriptions`: \{ `lastAuthenticatedOn`: `string`; `whitelistedOn`: `string`; \}; `identity`: \{ `authCount`: `number`; `dateAdded`: `number`; `dateAuthenticated`: `number`; `did`: `string`; `status`: `number`; `whitelistedOnChainId`: `number`; \}; `isCurrentlyWhitelisted`: `boolean`; `lastAuthenticatedOn`: `string` \| `null`; `reverification`: \{ `currentReverificationPeriodDays`: `number`; `daysSinceLastAuthentication`: `number`; `daysUntilReverificationRequired`: `number`; `isReverificationOverdue`: `boolean`; `maxReverificationPeriodDays`: `number`; `reverificationProgressPercent`: `number`; `reverificationRequiredOn`: `string`; \} \| `null`; `status`: `number`; `statusLabel`: `string`; `whitelistedOn`: `string` \| `null`; \}\>
