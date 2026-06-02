[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/gooddollar.service](../README.md) / GoodDollarService

# Class: GoodDollarService

Defined in: [src/services/gooddollar.service.ts:49](https://github.com/andrewkimjoseph/celina-sdk/blob/66d378efc4d326c1d282d6fbce18abc9daeb353d/src/services/gooddollar.service.ts#L49)

GoodDollar IdentityV4 whitelist, reverification, and daily UBI claim preparation.

## Constructors

### Constructor

> **new GoodDollarService**(`clientFactory`): `GoodDollarService`

Defined in: [src/services/gooddollar.service.ts:50](https://github.com/andrewkimjoseph/celina-sdk/blob/66d378efc4d326c1d282d6fbce18abc9daeb353d/src/services/gooddollar.service.ts#L50)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`GoodDollarService`

## Methods

### getUbiClaimEligibility()

> **getUbiClaimEligibility**(`address`): `Promise`\<\{ `address`: `` `0x${string}` ``; `alreadyClaimedToday`: `boolean`; `claimableAmount`: `string`; `claimableAmountFormatted`: `string`; `contract`: `"0x43d72Ff17701B2DA814620735C39C620Ce0ea4A1"`; `currentDailyUbi`: `string`; `currentDailyUbiFormatted`: `string`; `estimatedDailyUbi`: `string`; `estimatedDailyUbiFormatted`: `string`; `identity`: \{ `checkedAddress`: `` `0x${string}` ``; `isCurrentlyWhitelisted`: `boolean`; `reverification`: \{ `currentReverificationPeriodDays`: `number`; `daysSinceLastAuthentication`: `number`; `daysUntilReverificationRequired`: `number`; `isReverificationOverdue`: `boolean`; `maxReverificationPeriodDays`: `number`; `reverificationProgressPercent`: `number`; `reverificationRequiredOn`: `string`; \} \| `null`; `statusLabel`: `string`; \}; `inClaimCooldown`: `boolean`; `isConnectedWallet`: `boolean`; `isEligibleToClaim`: `boolean`; `lastClaimedAt`: `string` \| `null`; `nextClaimAvailableAt`: `string`; `nextClaimAvailableIn`: `string`; `reasons`: `string`[]; `schemePaused`: `boolean`; `schemeStarted`: `boolean`; `secondsUntilNextClaim`: `string`; `ubiPeriodDay`: `string`; `whitelistedRoot`: `` `0x${string}` `` \| `null`; \}\>

Defined in: [src/services/gooddollar.service.ts:158](https://github.com/andrewkimjoseph/celina-sdk/blob/66d378efc4d326c1d282d6fbce18abc9daeb353d/src/services/gooddollar.service.ts#L158)

Daily UBI claim eligibility for a wallet against UBISchemeV2 on Celo.
Resolves connected wallets via Identity `getWhitelistedRoot`.

#### Parameters

##### address

`` `0x${string}` ``

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` ``; `alreadyClaimedToday`: `boolean`; `claimableAmount`: `string`; `claimableAmountFormatted`: `string`; `contract`: `"0x43d72Ff17701B2DA814620735C39C620Ce0ea4A1"`; `currentDailyUbi`: `string`; `currentDailyUbiFormatted`: `string`; `estimatedDailyUbi`: `string`; `estimatedDailyUbiFormatted`: `string`; `identity`: \{ `checkedAddress`: `` `0x${string}` ``; `isCurrentlyWhitelisted`: `boolean`; `reverification`: \{ `currentReverificationPeriodDays`: `number`; `daysSinceLastAuthentication`: `number`; `daysUntilReverificationRequired`: `number`; `isReverificationOverdue`: `boolean`; `maxReverificationPeriodDays`: `number`; `reverificationProgressPercent`: `number`; `reverificationRequiredOn`: `string`; \} \| `null`; `statusLabel`: `string`; \}; `inClaimCooldown`: `boolean`; `isConnectedWallet`: `boolean`; `isEligibleToClaim`: `boolean`; `lastClaimedAt`: `string` \| `null`; `nextClaimAvailableAt`: `string`; `nextClaimAvailableIn`: `string`; `reasons`: `string`[]; `schemePaused`: `boolean`; `schemeStarted`: `boolean`; `secondsUntilNextClaim`: `string`; `ubiPeriodDay`: `string`; `whitelistedRoot`: `` `0x${string}` `` \| `null`; \}\>

***

### getWhitelistingInfo()

> **getWhitelistingInfo**(`address`): `Promise`\<\{ `address`: `` `0x${string}` ``; `contract`: `"0xC361A6E67822a0EDc17D899227dd9FC50BD62F42"`; `fieldDescriptions`: \{ `lastAuthenticatedOn`: `string`; `whitelistedOn`: `string`; \}; `identity`: \{ `authCount`: `number`; `dateAdded`: `number`; `dateAuthenticated`: `number`; `did`: `string`; `status`: `number`; `whitelistedOnChainId`: `number`; \}; `isCurrentlyWhitelisted`: `boolean`; `lastAuthenticatedOn`: `string` \| `null`; `reverification`: \{ `currentReverificationPeriodDays`: `number`; `daysSinceLastAuthentication`: `number`; `daysUntilReverificationRequired`: `number`; `isReverificationOverdue`: `boolean`; `maxReverificationPeriodDays`: `number`; `reverificationProgressPercent`: `number`; `reverificationRequiredOn`: `string`; \} \| `null`; `status`: `number`; `statusLabel`: `string`; `whitelistedOn`: `string` \| `null`; \}\>

Defined in: [src/services/gooddollar.service.ts:61](https://github.com/andrewkimjoseph/celina-sdk/blob/66d378efc4d326c1d282d6fbce18abc9daeb353d/src/services/gooddollar.service.ts#L61)

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

Defined in: [src/services/gooddollar.service.ts:332](https://github.com/andrewkimjoseph/celina-sdk/blob/66d378efc4d326c1d282d6fbce18abc9daeb353d/src/services/gooddollar.service.ts#L332)

Build an unsigned UBISchemeV2 `claim()` transaction for daily G$ UBI.
Validates whitelist, entitlement, and simulates gas before returning steps.

#### Parameters

##### from

`` `0x${string}` ``

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>
