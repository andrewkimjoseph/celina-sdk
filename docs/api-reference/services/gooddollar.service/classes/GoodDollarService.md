[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/gooddollar.service](../README.md) / GoodDollarService

# Class: GoodDollarService

Defined in: [src/services/gooddollar.service.ts:106](https://github.com/andrewkimjoseph/celina-sdk/blob/970ab720c805303ead8b20406c6579ecdcf2193a/src/services/gooddollar.service.ts#L106)

GoodDollar IdentityV4 whitelist, reverification, daily UBI claim, and reserve swap preparation.

## Constructors

### Constructor

> **new GoodDollarService**(`clientFactory`): `GoodDollarService`

Defined in: [src/services/gooddollar.service.ts:109](https://github.com/andrewkimjoseph/celina-sdk/blob/970ab720c805303ead8b20406c6579ecdcf2193a/src/services/gooddollar.service.ts#L109)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`GoodDollarService`

## Methods

### estimateReserveSwap()

> **estimateReserveSwap**(`from`, `tokenIn`, `tokenOut`, `amount`, `params?`): `Promise`\<\{ `amountIn`: `string`; `amountOutMin`: `string`; `approvalGas`: `string` \| `undefined`; `approvalNeeded`: `boolean`; `broker`: `"0x88de45906D4F5a57315c133620cfa484cB297541"`; `exchangeId`: `"0xba77f5c7bb3317643c6d81d1ef3f9913561741d92095f88efa402faf2cbe9124"`; `exchangeProvider`: `"0x2fFBB49055d487DdBBb0C052Cd7c2a02A7971e41"`; `expectedOut`: `string`; `from`: `` `0x${string}` ``; `network`: `"mainnet"`; `protocol`: `"gooddollar_reserve"`; `recipient`: `` `0x${string}` ``; `routeHops`: `number`; `slippageTolerance`: `number`; `swapGas`: `string`; `tokenIn`: `string`; `tokenOut`: `string`; `totalGas`: `string`; \}\>

Defined in: [src/services/gooddollar.service.ts:727](https://github.com/andrewkimjoseph/celina-sdk/blob/970ab720c805303ead8b20406c6579ecdcf2193a/src/services/gooddollar.service.ts#L727)

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

### getIdentityLink()

> **getIdentityLink**(`address`): `Promise`\<\{ `address`: `` `0x${string}` ``; `checkedAddress`: `` `0x${string}` ``; `connectedTo`: `` `0x${string}` `` \| `null`; `contract`: `"0xC361A6E67822a0EDc17D899227dd9FC50BD62F42"`; `isConnectedWallet`: `boolean`; `isWhitelisted`: `boolean`; `isWhitelistedRoot`: `boolean`; `whitelistedRoot`: `` `0x${string}` `` \| `null`; \}\>

Defined in: [src/services/gooddollar.service.ts:233](https://github.com/andrewkimjoseph/celina-sdk/blob/970ab720c805303ead8b20406c6579ecdcf2193a/src/services/gooddollar.service.ts#L233)

How a wallet links to GoodDollar IdentityV4 (root vs connected account).

#### Parameters

##### address

`` `0x${string}` ``

Wallet to inspect

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` ``; `checkedAddress`: `` `0x${string}` ``; `connectedTo`: `` `0x${string}` `` \| `null`; `contract`: `"0xC361A6E67822a0EDc17D899227dd9FC50BD62F42"`; `isConnectedWallet`: `boolean`; `isWhitelisted`: `boolean`; `isWhitelistedRoot`: `boolean`; `whitelistedRoot`: `` `0x${string}` `` \| `null`; \}\>

***

### getReserveQuote()

> **getReserveQuote**(`tokenIn`, `tokenOut`, `amount`, `_from?`): `Promise`\<\{ `amountIn`: `string`; `broker`: `"0x88de45906D4F5a57315c133620cfa484cB297541"`; `exchangeId`: `"0xba77f5c7bb3317643c6d81d1ef3f9913561741d92095f88efa402faf2cbe9124"`; `exchangeProvider`: `"0x2fFBB49055d487DdBBb0C052Cd7c2a02A7971e41"`; `expectedOut`: `string`; `network`: `"mainnet"`; `protocol`: `"gooddollar_reserve"`; `routeHops`: `number`; `tokenIn`: `string`; `tokenOut`: `string`; \}\>

Defined in: [src/services/gooddollar.service.ts:572](https://github.com/andrewkimjoseph/celina-sdk/blob/970ab720c805303ead8b20406c6579ecdcf2193a/src/services/gooddollar.service.ts#L572)

Expected GoodDollar reserve output for G$ ↔ USDm — no wallet required.

#### Parameters

##### tokenIn

`string`

##### tokenOut

`string`

##### amount

`string`

##### \_from?

`` `0x${string}` ``

Deprecated; ignored. Balance checks run on prepare/estimate only.

#### Returns

`Promise`\<\{ `amountIn`: `string`; `broker`: `"0x88de45906D4F5a57315c133620cfa484cB297541"`; `exchangeId`: `"0xba77f5c7bb3317643c6d81d1ef3f9913561741d92095f88efa402faf2cbe9124"`; `exchangeProvider`: `"0x2fFBB49055d487DdBBb0C052Cd7c2a02A7971e41"`; `expectedOut`: `string`; `network`: `"mainnet"`; `protocol`: `"gooddollar_reserve"`; `routeHops`: `number`; `tokenIn`: `string`; `tokenOut`: `string`; \}\>

***

### getUbiClaimEligibility()

> **getUbiClaimEligibility**(`address`): `Promise`\<\{ `address`: `` `0x${string}` ``; `alreadyClaimedToday`: `boolean`; `claimableAmount`: `string`; `claimableAmountFormatted`: `string`; `contract`: `"0x43d72Ff17701B2DA814620735C39C620Ce0ea4A1"`; `currentDailyUbi`: `string`; `currentDailyUbiFormatted`: `string`; `estimatedDailyUbi`: `string`; `estimatedDailyUbiFormatted`: `string`; `identity`: \{ `checkedAddress`: `` `0x${string}` ``; `isWhitelisted`: `boolean`; `reverification`: \{ `currentReverificationPeriodDays`: `number`; `daysSinceLastAuthentication`: `number`; `daysUntilReverificationRequired`: `number`; `isReverificationOverdue`: `boolean`; `maxReverificationPeriodDays`: `number`; `reverificationProgressPercent`: `number`; `reverificationRequiredOn`: `string`; \} \| `null`; `statusLabel`: `string`; \}; `inClaimCooldown`: `boolean`; `isConnectedWallet`: `boolean`; `isEligibleToClaim`: `boolean`; `lastClaimedAt`: `string` \| `null`; `nextClaimAvailableAt`: `string`; `nextClaimAvailableIn`: `string`; `reasons`: `string`[]; `schemePaused`: `boolean`; `schemeStarted`: `boolean`; `secondsUntilNextClaim`: `string`; `ubiPeriodDay`: `string`; `whitelistedRoot`: `` `0x${string}` `` \| `null`; \}\>

Defined in: [src/services/gooddollar.service.ts:293](https://github.com/andrewkimjoseph/celina-sdk/blob/970ab720c805303ead8b20406c6579ecdcf2193a/src/services/gooddollar.service.ts#L293)

Daily UBI claim eligibility for a wallet against UBISchemeV2 on Celo.
Resolves connected wallets via Identity `getWhitelistedRoot`.

#### Parameters

##### address

`` `0x${string}` ``

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` ``; `alreadyClaimedToday`: `boolean`; `claimableAmount`: `string`; `claimableAmountFormatted`: `string`; `contract`: `"0x43d72Ff17701B2DA814620735C39C620Ce0ea4A1"`; `currentDailyUbi`: `string`; `currentDailyUbiFormatted`: `string`; `estimatedDailyUbi`: `string`; `estimatedDailyUbiFormatted`: `string`; `identity`: \{ `checkedAddress`: `` `0x${string}` ``; `isWhitelisted`: `boolean`; `reverification`: \{ `currentReverificationPeriodDays`: `number`; `daysSinceLastAuthentication`: `number`; `daysUntilReverificationRequired`: `number`; `isReverificationOverdue`: `boolean`; `maxReverificationPeriodDays`: `number`; `reverificationProgressPercent`: `number`; `reverificationRequiredOn`: `string`; \} \| `null`; `statusLabel`: `string`; \}; `inClaimCooldown`: `boolean`; `isConnectedWallet`: `boolean`; `isEligibleToClaim`: `boolean`; `lastClaimedAt`: `string` \| `null`; `nextClaimAvailableAt`: `string`; `nextClaimAvailableIn`: `string`; `reasons`: `string`[]; `schemePaused`: `boolean`; `schemeStarted`: `boolean`; `secondsUntilNextClaim`: `string`; `ubiPeriodDay`: `string`; `whitelistedRoot`: `` `0x${string}` `` \| `null`; \}\>

***

### getWhitelistingInfo()

> **getWhitelistingInfo**(`address`): `Promise`\<\{ `address`: `` `0x${string}` ``; `checkedAddress`: `` `0x${string}` ``; `contract`: `"0xC361A6E67822a0EDc17D899227dd9FC50BD62F42"`; `fieldDescriptions`: \{ `lastAuthenticatedOn`: `string`; `whitelistedOn`: `string`; \}; `identity`: \{ `authCount`: `number`; `dateAdded`: `number`; `dateAuthenticated`: `number`; `did`: `string`; `status`: `number`; `whitelistedOnChainId`: `number`; \}; `isConnectedWallet`: `boolean`; `isWhitelisted`: `boolean`; `lastAuthenticatedOn`: `string` \| `null`; `reverification`: \{ `currentReverificationPeriodDays`: `number`; `daysSinceLastAuthentication`: `number`; `daysUntilReverificationRequired`: `number`; `isReverificationOverdue`: `boolean`; `maxReverificationPeriodDays`: `number`; `reverificationProgressPercent`: `number`; `reverificationRequiredOn`: `string`; \} \| `null`; `status`: `number`; `statusLabel`: `string`; `whitelistedOn`: `string` \| `null`; `whitelistedRoot`: `` `0x${string}` `` \| `null`; \}\>

Defined in: [src/services/gooddollar.service.ts:276](https://github.com/andrewkimjoseph/celina-sdk/blob/970ab720c805303ead8b20406c6579ecdcf2193a/src/services/gooddollar.service.ts#L276)

GoodDollar IdentityV4 whitelist status and reverification progress for a wallet.
Resolves connected wallets via Identity `getWhitelistedRoot`.

#### Parameters

##### address

`` `0x${string}` ``

Wallet to check against IdentityV4

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` ``; `checkedAddress`: `` `0x${string}` ``; `contract`: `"0xC361A6E67822a0EDc17D899227dd9FC50BD62F42"`; `fieldDescriptions`: \{ `lastAuthenticatedOn`: `string`; `whitelistedOn`: `string`; \}; `identity`: \{ `authCount`: `number`; `dateAdded`: `number`; `dateAuthenticated`: `number`; `did`: `string`; `status`: `number`; `whitelistedOnChainId`: `number`; \}; `isConnectedWallet`: `boolean`; `isWhitelisted`: `boolean`; `lastAuthenticatedOn`: `string` \| `null`; `reverification`: \{ `currentReverificationPeriodDays`: `number`; `daysSinceLastAuthentication`: `number`; `daysUntilReverificationRequired`: `number`; `isReverificationOverdue`: `boolean`; `maxReverificationPeriodDays`: `number`; `reverificationProgressPercent`: `number`; `reverificationRequiredOn`: `string`; \} \| `null`; `status`: `number`; `statusLabel`: `string`; `whitelistedOn`: `string` \| `null`; `whitelistedRoot`: `` `0x${string}` `` \| `null`; \}\>

On-chain status, whitelist dates, field descriptions, and reverification timeline

***

### prepareClaimUbi()

> **prepareClaimUbi**(`from`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/gooddollar.service.ts:464](https://github.com/andrewkimjoseph/celina-sdk/blob/970ab720c805303ead8b20406c6579ecdcf2193a/src/services/gooddollar.service.ts#L464)

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

Defined in: [src/services/gooddollar.service.ts:798](https://github.com/andrewkimjoseph/celina-sdk/blob/970ab720c805303ead8b20406c6579ecdcf2193a/src/services/gooddollar.service.ts#L798)

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
