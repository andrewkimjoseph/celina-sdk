[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/staking.service](../README.md) / StakingService

# Class: StakingService

Defined in: [src/services/staking.service.ts:26](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/staking.service.ts#L26)

## Constructors

### Constructor

> **new StakingService**(`clientFactory`): `StakingService`

Defined in: [src/services/staking.service.ts:27](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/staking.service.ts#L27)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`StakingService`

## Methods

### getActivatableStakes()

> **getActivatableStakes**(`address`): `Promise`\<\{ `activatableGroups`: `string`[]; `address`: `` `0x${string}` ``; `groupToIsActivatable`: `Record`\<`string`, `boolean`\>; `network`: `"mainnet"`; `summary`: \{ `activatableGroupsFormatted?`: `undefined`; `message`: `string`; `totalActivatableGroups`: `number`; `totalPendingGroups`: `number`; \}; \} \| \{ `activatableGroups`: `string`[]; `address`: `` `0x${string}` ``; `groupToIsActivatable`: `Record`\<`string`, `boolean`\>; `network`: `"mainnet"`; `summary`: \{ `activatableGroupsFormatted`: `string`[]; `message`: `string`; `totalActivatableGroups`: `number`; `totalPendingGroups`: `number`; \}; \}\>

Defined in: [src/services/staking.service.ts:127](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/staking.service.ts#L127)

#### Parameters

##### address

`` `0x${string}` ``

#### Returns

`Promise`\<\{ `activatableGroups`: `string`[]; `address`: `` `0x${string}` ``; `groupToIsActivatable`: `Record`\<`string`, `boolean`\>; `network`: `"mainnet"`; `summary`: \{ `activatableGroupsFormatted?`: `undefined`; `message`: `string`; `totalActivatableGroups`: `number`; `totalPendingGroups`: `number`; \}; \} \| \{ `activatableGroups`: `string`[]; `address`: `` `0x${string}` ``; `groupToIsActivatable`: `Record`\<`string`, `boolean`\>; `network`: `"mainnet"`; `summary`: \{ `activatableGroupsFormatted`: `string`[]; `message`: `string`; `totalActivatableGroups`: `number`; `totalPendingGroups`: `number`; \}; \}\>

***

### getStakingBalances()

> **getStakingBalances**(`address`): `Promise`\<\{ `active`: `string`; `activeFormatted`: `string`; `address`: `` `0x${string}` ``; `groups`: `object`[]; `network`: `"mainnet"`; `pending`: `string`; `pendingFormatted`: `string`; `total`: `string`; `totalFormatted`: `string`; \}\>

Defined in: [src/services/staking.service.ts:33](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/staking.service.ts#L33)

#### Parameters

##### address

`` `0x${string}` ``

#### Returns

`Promise`\<\{ `active`: `string`; `activeFormatted`: `string`; `address`: `` `0x${string}` ``; `groups`: `object`[]; `network`: `"mainnet"`; `pending`: `string`; `pendingFormatted`: `string`; `total`: `string`; `totalFormatted`: `string`; \}\>

***

### getTotalStakingInfo()

> **getTotalStakingInfo**(): `Promise`\<\{ `network`: `"mainnet"`; `summary`: \{ `message`: `string`; `networkParticipation`: `string`; \}; `totalVotes`: `string`; `totalVotesCelo`: `number`; `totalVotesFormatted`: `string`; \}\>

Defined in: [src/services/staking.service.ts:510](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/staking.service.ts#L510)

#### Returns

`Promise`\<\{ `network`: `"mainnet"`; `summary`: \{ `message`: `string`; `networkParticipation`: `string`; \}; `totalVotes`: `string`; `totalVotesCelo`: `number`; `totalVotesFormatted`: `string`; \}\>

***

### getValidatorGroupDetails()

> **getValidatorGroupDetails**(`groupAddress`): `Promise`\<\{ `address`: `` `0x${string}` ``; `capacity`: `string`; `capacityFormatted`: `string`; `eligible`: `boolean`; `lastSlashed`: `number` \| `null`; `members`: `object`[]; `name`: `string`; `network`: `"mainnet"`; `numElected`: `number`; `numMembers`: `number`; `votes`: `string`; `votesFormatted`: `string`; \}\>

Defined in: [src/services/staking.service.ts:355](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/staking.service.ts#L355)

#### Parameters

##### groupAddress

`` `0x${string}` ``

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` ``; `capacity`: `string`; `capacityFormatted`: `string`; `eligible`: `boolean`; `lastSlashed`: `number` \| `null`; `members`: `object`[]; `name`: `string`; `network`: `"mainnet"`; `numElected`: `number`; `numMembers`: `number`; `votes`: `string`; `votesFormatted`: `string`; \}\>

***

### getValidatorGroups()

> **getValidatorGroups**(`options?`): `Promise`\<\{ `groups`: `object`[]; `network`: `"mainnet"`; `pagination`: \{ `hasMore`: `boolean`; `limit`: `number`; `offset`: `number`; `page`: `number`; `pageSize`: `number`; `total`: `number`; `totalPages`: `number`; \}; `totalVotes`: `string`; `totalVotesFormatted`: `string`; \}\>

Defined in: [src/services/staking.service.ts:186](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/staking.service.ts#L186)

#### Parameters

##### options?

###### limit?

`number`

###### offset?

`number`

###### page?

`number`

###### pageSize?

`number`

#### Returns

`Promise`\<\{ `groups`: `object`[]; `network`: `"mainnet"`; `pagination`: \{ `hasMore`: `boolean`; `limit`: `number`; `offset`: `number`; `page`: `number`; `pageSize`: `number`; `total`: `number`; `totalPages`: `number`; \}; `totalVotes`: `string`; `totalVotesFormatted`: `string`; \}\>
