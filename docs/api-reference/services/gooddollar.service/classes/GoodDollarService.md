[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/gooddollar.service](../README.md) / GoodDollarService

# Class: GoodDollarService

Defined in: [src/services/gooddollar.service.ts:42](https://github.com/andrewkimjoseph/celina-sdk/blob/f8728c3a6e17d8fef70a1fbf6a9b27bff61756e1/src/services/gooddollar.service.ts#L42)

GoodDollar IdentityV4 whitelist, reverification, and daily UBI claim preparation.

## Constructors

### Constructor

> **new GoodDollarService**(`clientFactory`): `GoodDollarService`

Defined in: [src/services/gooddollar.service.ts:43](https://github.com/andrewkimjoseph/celina-sdk/blob/f8728c3a6e17d8fef70a1fbf6a9b27bff61756e1/src/services/gooddollar.service.ts#L43)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`GoodDollarService`

## Methods

### getUbiClaimEligibility()

> **getUbiClaimEligibility**(`address`): `Promise`\<\{ `address`: `` `0x${string}` ``; `alreadyClaimedToday`: `boolean`; `claimableAmount`: `string`; `claimableAmountFormatted`: `string`; `contract`: `"0x43d72Ff17701B2DA814620735C39C620Ce0ea4A1"`; `currentDailyUbi`: `string`; `currentDailyUbiFormatted`: `string`; `estimatedDailyUbi`: `string`; `estimatedDailyUbiFormatted`: `string`; `identity`: \{ `isCurrentlyWhitelisted`: `boolean`; `reverification`: \{ `currentReverificationPeriodDays`: `number`; `daysSinceLastAuthentication`: `number`; `daysUntilReverificationRequired`: `number`; `isReverificationOverdue`: `boolean`; `maxReverificationPeriodDays`: `number`; `reverificationProgressPercent`: `number`; `reverificationRequiredOn`: `string`; \} \| `null`; `statusLabel`: `string`; \}; `isConnectedWallet`: `boolean`; `isEligibleToClaim`: `boolean`; `reasons`: `string`[]; `schemePaused`: `boolean`; `schemeStarted`: `boolean`; `whitelistedRoot`: `` `0x${string}` `` \| `null`; \}\>

Defined in: [src/services/gooddollar.service.ts:151](https://github.com/andrewkimjoseph/celina-sdk/blob/f8728c3a6e17d8fef70a1fbf6a9b27bff61756e1/src/services/gooddollar.service.ts#L151)

Daily UBI claim eligibility for a wallet against UBISchemeV2 on Celo.
Resolves connected wallets via Identity `getWhitelistedRoot`.

#### Parameters

##### address

`` `0x${string}` ``

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` ``; `alreadyClaimedToday`: `boolean`; `claimableAmount`: `string`; `claimableAmountFormatted`: `string`; `contract`: `"0x43d72Ff17701B2DA814620735C39C620Ce0ea4A1"`; `currentDailyUbi`: `string`; `currentDailyUbiFormatted`: `string`; `estimatedDailyUbi`: `string`; `estimatedDailyUbiFormatted`: `string`; `identity`: \{ `isCurrentlyWhitelisted`: `boolean`; `reverification`: \{ `currentReverificationPeriodDays`: `number`; `daysSinceLastAuthentication`: `number`; `daysUntilReverificationRequired`: `number`; `isReverificationOverdue`: `boolean`; `maxReverificationPeriodDays`: `number`; `reverificationProgressPercent`: `number`; `reverificationRequiredOn`: `string`; \} \| `null`; `statusLabel`: `string`; \}; `isConnectedWallet`: `boolean`; `isEligibleToClaim`: `boolean`; `reasons`: `string`[]; `schemePaused`: `boolean`; `schemeStarted`: `boolean`; `whitelistedRoot`: `` `0x${string}` `` \| `null`; \}\>

***

### getWhitelistingInfo()

> **getWhitelistingInfo**(`address`): `Promise`\<\{ `address`: `` `0x${string}` ``; `contract`: `"0xC361A6E67822a0EDc17D899227dd9FC50BD62F42"`; `fieldDescriptions`: \{ `lastAuthenticatedOn`: `string`; `whitelistedOn`: `string`; \}; `identity`: \{ `authCount`: `number`; `dateAdded`: `number`; `dateAuthenticated`: `number`; `did`: `string`; `status`: `number`; `whitelistedOnChainId`: `number`; \}; `isCurrentlyWhitelisted`: `boolean`; `lastAuthenticatedOn`: `string` \| `null`; `reverification`: \{ `currentReverificationPeriodDays`: `number`; `daysSinceLastAuthentication`: `number`; `daysUntilReverificationRequired`: `number`; `isReverificationOverdue`: `boolean`; `maxReverificationPeriodDays`: `number`; `reverificationProgressPercent`: `number`; `reverificationRequiredOn`: `string`; \} \| `null`; `status`: `number`; `statusLabel`: `string`; `whitelistedOn`: `string` \| `null`; \}\>

Defined in: [src/services/gooddollar.service.ts:54](https://github.com/andrewkimjoseph/celina-sdk/blob/f8728c3a6e17d8fef70a1fbf6a9b27bff61756e1/src/services/gooddollar.service.ts#L54)

GoodDollar IdentityV4 whitelist status and reverification progress for a wallet.

#### Parameters

##### address

`` `0x${string}` ``

Wallet to check against IdentityV4

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` ``; `contract`: `"0xC361A6E67822a0EDc17D899227dd9FC50BD62F42"`; `fieldDescriptions`: \{ `lastAuthenticatedOn`: `string`; `whitelistedOn`: `string`; \}; `identity`: \{ `authCount`: `number`; `dateAdded`: `number`; `dateAuthenticated`: `number`; `did`: `string`; `status`: `number`; `whitelistedOnChainId`: `number`; \}; `isCurrentlyWhitelisted`: `boolean`; `lastAuthenticatedOn`: `string` \| `null`; `reverification`: \{ `currentReverificationPeriodDays`: `number`; `daysSinceLastAuthentication`: `number`; `daysUntilReverificationRequired`: `number`; `isReverificationOverdue`: `boolean`; `maxReverificationPeriodDays`: `number`; `reverificationProgressPercent`: `number`; `reverificationRequiredOn`: `string`; \} \| `null`; `status`: `number`; `statusLabel`: `string`; `whitelistedOn`: `string` \| `null`; \}\>

On-chain status, whitelist dates, field descriptions, and reverification timeline

***

### prepareClaimUbi()

> **prepareClaimUbi**(`from`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/gooddollar.service.ts:277](https://github.com/andrewkimjoseph/celina-sdk/blob/f8728c3a6e17d8fef70a1fbf6a9b27bff61756e1/src/services/gooddollar.service.ts#L277)

Build an unsigned UBISchemeV2 `claim()` transaction for daily G$ UBI.
Validates whitelist, entitlement, and simulates gas before returning steps.

#### Parameters

##### from

`` `0x${string}` ``

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>
