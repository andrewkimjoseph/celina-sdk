[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/gooddollar.service](../README.md) / GoodDollarService

# Class: GoodDollarService

Defined in: [src/services/gooddollar.service.ts:105](https://github.com/andrewkimjoseph/celina-sdk/blob/9aa8703fbb6f796ec6f1362b133c7fd2f4baefc2/src/services/gooddollar.service.ts#L105)

GoodDollar IdentityV4 whitelist, reverification, daily UBI claim, and reserve swap preparation.

## Constructors

### Constructor

> **new GoodDollarService**(`clientFactory`): `GoodDollarService`

Defined in: [src/services/gooddollar.service.ts:108](https://github.com/andrewkimjoseph/celina-sdk/blob/9aa8703fbb6f796ec6f1362b133c7fd2f4baefc2/src/services/gooddollar.service.ts#L108)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`GoodDollarService`

## Methods

### estimateReserveSwap()

> **estimateReserveSwap**(`from`, `tokenIn`, `tokenOut`, `amount`, `params?`): `Promise`\<\{ `amountIn`: `string`; `amountOutMin`: `string`; `approvalGas`: `string` \| `undefined`; `approvalNeeded`: `boolean`; `broker`: `"0x88de45906D4F5a57315c133620cfa484cB297541"`; `exchangeId`: `"0xba77f5c7bb3317643c6d81d1ef3f9913561741d92095f88efa402faf2cbe9124"`; `exchangeProvider`: `"0x2fFBB49055d487DdBBb0C052Cd7c2a02A7971e41"`; `expectedOut`: `string`; `from`: `` `0x${string}` ``; `network`: `"mainnet"`; `protocol`: `"gooddollar_reserve"`; `recipient`: `` `0x${string}` ``; `routeHops`: `number`; `slippageTolerance`: `number`; `swapGas`: `string`; `tokenIn`: `string`; `tokenOut`: `string`; `totalGas`: `string`; \}\>

Defined in: [src/services/gooddollar.service.ts:656](https://github.com/andrewkimjoseph/celina-sdk/blob/9aa8703fbb6f796ec6f1362b133c7fd2f4baefc2/src/services/gooddollar.service.ts#L656)

Simulate gas for a GoodDollar reserve swap from `from`, including approval if needed.

#### Parameters

##### from

`` `0x${string}` ``

##### tokenIn

`string`

##### tokenOut

`string`

##### amount

`string`

##### params?

[`GoodDollarReserveSwapParams`](../interfaces/GoodDollarReserveSwapParams.md)

#### Returns

`Promise`\<\{ `amountIn`: `string`; `amountOutMin`: `string`; `approvalGas`: `string` \| `undefined`; `approvalNeeded`: `boolean`; `broker`: `"0x88de45906D4F5a57315c133620cfa484cB297541"`; `exchangeId`: `"0xba77f5c7bb3317643c6d81d1ef3f9913561741d92095f88efa402faf2cbe9124"`; `exchangeProvider`: `"0x2fFBB49055d487DdBBb0C052Cd7c2a02A7971e41"`; `expectedOut`: `string`; `from`: `` `0x${string}` ``; `network`: `"mainnet"`; `protocol`: `"gooddollar_reserve"`; `recipient`: `` `0x${string}` ``; `routeHops`: `number`; `slippageTolerance`: `number`; `swapGas`: `string`; `tokenIn`: `string`; `tokenOut`: `string`; `totalGas`: `string`; \}\>

***

### getReserveQuote()

> **getReserveQuote**(`tokenIn`, `tokenOut`, `amount`, `from?`): `Promise`\<\{ `amountIn`: `string`; `broker`: `"0x88de45906D4F5a57315c133620cfa484cB297541"`; `exchangeId`: `"0xba77f5c7bb3317643c6d81d1ef3f9913561741d92095f88efa402faf2cbe9124"`; `exchangeProvider`: `"0x2fFBB49055d487DdBBb0C052Cd7c2a02A7971e41"`; `expectedOut`: `string`; `network`: `"mainnet"`; `protocol`: `"gooddollar_reserve"`; `routeHops`: `number`; `tokenIn`: `string`; `tokenOut`: `string`; \}\>

Defined in: [src/services/gooddollar.service.ts:495](https://github.com/andrewkimjoseph/celina-sdk/blob/9aa8703fbb6f796ec6f1362b133c7fd2f4baefc2/src/services/gooddollar.service.ts#L495)

Expected GoodDollar reserve output for G$ ↔ USDm — no wallet required.

#### Parameters

##### tokenIn

`string`

##### tokenOut

`string`

##### amount

`string`

##### from?

`` `0x${string}` ``

#### Returns

`Promise`\<\{ `amountIn`: `string`; `broker`: `"0x88de45906D4F5a57315c133620cfa484cB297541"`; `exchangeId`: `"0xba77f5c7bb3317643c6d81d1ef3f9913561741d92095f88efa402faf2cbe9124"`; `exchangeProvider`: `"0x2fFBB49055d487DdBBb0C052Cd7c2a02A7971e41"`; `expectedOut`: `string`; `network`: `"mainnet"`; `protocol`: `"gooddollar_reserve"`; `routeHops`: `number`; `tokenIn`: `string`; `tokenOut`: `string`; \}\>

***

### getUbiClaimEligibility()

> **getUbiClaimEligibility**(`address`): `Promise`\<\{ `address`: `` `0x${string}` ``; `alreadyClaimedToday`: `boolean`; `claimableAmount`: `string`; `claimableAmountFormatted`: `string`; `contract`: `"0x43d72Ff17701B2DA814620735C39C620Ce0ea4A1"`; `currentDailyUbi`: `string`; `currentDailyUbiFormatted`: `string`; `estimatedDailyUbi`: `string`; `estimatedDailyUbiFormatted`: `string`; `identity`: \{ `checkedAddress`: `` `0x${string}` ``; `isCurrentlyWhitelisted`: `boolean`; `reverification`: \{ `currentReverificationPeriodDays`: `number`; `daysSinceLastAuthentication`: `number`; `daysUntilReverificationRequired`: `number`; `isReverificationOverdue`: `boolean`; `maxReverificationPeriodDays`: `number`; `reverificationProgressPercent`: `number`; `reverificationRequiredOn`: `string`; \} \| `null`; `statusLabel`: `string`; \}; `inClaimCooldown`: `boolean`; `isConnectedWallet`: `boolean`; `isEligibleToClaim`: `boolean`; `lastClaimedAt`: `string` \| `null`; `nextClaimAvailableAt`: `string`; `nextClaimAvailableIn`: `string`; `reasons`: `string`[]; `schemePaused`: `boolean`; `schemeStarted`: `boolean`; `secondsUntilNextClaim`: `string`; `ubiPeriodDay`: `string`; `whitelistedRoot`: `` `0x${string}` `` \| `null`; \}\>

Defined in: [src/services/gooddollar.service.ts:218](https://github.com/andrewkimjoseph/celina-sdk/blob/9aa8703fbb6f796ec6f1362b133c7fd2f4baefc2/src/services/gooddollar.service.ts#L218)

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

Defined in: [src/services/gooddollar.service.ts:121](https://github.com/andrewkimjoseph/celina-sdk/blob/9aa8703fbb6f796ec6f1362b133c7fd2f4baefc2/src/services/gooddollar.service.ts#L121)

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

Defined in: [src/services/gooddollar.service.ts:392](https://github.com/andrewkimjoseph/celina-sdk/blob/9aa8703fbb6f796ec6f1362b133c7fd2f4baefc2/src/services/gooddollar.service.ts#L392)

Build an unsigned UBISchemeV2 `claim()` transaction for daily G$ UBI.
Validates whitelist, entitlement, and simulates gas before returning steps.

#### Parameters

##### from

`` `0x${string}` ``

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

***

### prepareReserveSwap()

> **prepareReserveSwap**(`from`, `tokenIn`, `tokenOut`, `amount`, `params?`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/gooddollar.service.ts:727](https://github.com/andrewkimjoseph/celina-sdk/blob/9aa8703fbb6f796ec6f1362b133c7fd2f4baefc2/src/services/gooddollar.service.ts#L727)

Build unsigned GoodDollar reserve swap steps (approve + swapIn when needed).

#### Parameters

##### from

`` `0x${string}` ``

##### tokenIn

`string`

##### tokenOut

`string`

##### amount

`string`

##### params?

[`GoodDollarReserveSwapParams`](../interfaces/GoodDollarReserveSwapParams.md)

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>
