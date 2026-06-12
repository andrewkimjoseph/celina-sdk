[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/staking.service](../README.md) / StakingService

# Class: StakingService

Defined in: [src/services/staking.service.ts:30](https://github.com/andrewkimjoseph/celina-sdk/blob/671d3f90a836646c5a311cc0f8c6691cf3fc4dad/src/services/staking.service.ts#L30)

Validator election staking reads via Celo core contracts.

## Constructors

### Constructor

> **new StakingService**(`clientFactory`): `StakingService`

Defined in: [src/services/staking.service.ts:31](https://github.com/andrewkimjoseph/celina-sdk/blob/671d3f90a836646c5a311cc0f8c6691cf3fc4dad/src/services/staking.service.ts#L31)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`StakingService`

## Methods

### getActivatableStakes()

> **getActivatableStakes**(`address`): `Promise`\<\{ `activatableGroups`: `string`[]; `address`: `` `0x${string}` ``; `groupToIsActivatable`: `Record`\<`string`, `boolean`\>; `network`: `"mainnet"`; `summary`: \{ `activatableGroupsFormatted?`: `undefined`; `message`: `string`; `totalActivatableGroups`: `number`; `totalPendingGroups`: `number`; \}; \} \| \{ `activatableGroups`: `string`[]; `address`: `` `0x${string}` ``; `groupToIsActivatable`: `Record`\<`string`, `boolean`\>; `network`: `"mainnet"`; `summary`: \{ `activatableGroupsFormatted`: `string`[]; `message`: `string`; `totalActivatableGroups`: `number`; `totalPendingGroups`: `number`; \}; \}\>

Defined in: [src/services/staking.service.ts:143](https://github.com/andrewkimjoseph/celina-sdk/blob/671d3f90a836646c5a311cc0f8c6691cf3fc4dad/src/services/staking.service.ts#L143)

Pending stakes that can be activated in the current epoch.

#### Parameters

##### address

`` `0x${string}` ``

Staker wallet address

#### Returns

`Promise`\<\{ `activatableGroups`: `string`[]; `address`: `` `0x${string}` ``; `groupToIsActivatable`: `Record`\<`string`, `boolean`\>; `network`: `"mainnet"`; `summary`: \{ `activatableGroupsFormatted?`: `undefined`; `message`: `string`; `totalActivatableGroups`: `number`; `totalPendingGroups`: `number`; \}; \} \| \{ `activatableGroups`: `string`[]; `address`: `` `0x${string}` ``; `groupToIsActivatable`: `Record`\<`string`, `boolean`\>; `network`: `"mainnet"`; `summary`: \{ `activatableGroupsFormatted`: `string`[]; `message`: `string`; `totalActivatableGroups`: `number`; `totalPendingGroups`: `number`; \}; \}\>

Groups with activatable pending votes and a summary message

#### Throws

When `address` is not a valid hex address

***

### getStakingBalances()

> **getStakingBalances**(`address`): `Promise`\<\{ `active`: `string`; `activeFormatted`: `string`; `address`: `` `0x${string}` ``; `groups`: `object`[]; `network`: `"mainnet"`; `pending`: `string`; `pendingFormatted`: `string`; `total`: `string`; `totalFormatted`: `string`; \}\>

Defined in: [src/services/staking.service.ts:43](https://github.com/andrewkimjoseph/celina-sdk/blob/671d3f90a836646c5a311cc0f8c6691cf3fc4dad/src/services/staking.service.ts#L43)

Active and pending CELO vote balances per validator group for an account.

#### Parameters

##### address

`` `0x${string}` ``

Staker wallet address

#### Returns

`Promise`\<\{ `active`: `string`; `activeFormatted`: `string`; `address`: `` `0x${string}` ``; `groups`: `object`[]; `network`: `"mainnet"`; `pending`: `string`; `pendingFormatted`: `string`; `total`: `string`; `totalFormatted`: `string`; \}\>

Totals and per-group active/pending vote amounts

#### Throws

When `address` is not a valid hex address

***

### getTotalStakingInfo()

> **getTotalStakingInfo**(): `Promise`\<\{ `network`: `"mainnet"`; `summary`: \{ `message`: `string`; `networkParticipation`: `string`; \}; `totalVotes`: `string`; `totalVotesCelo`: `number`; `totalVotesFormatted`: `string`; \}\>

Defined in: [src/services/staking.service.ts:544](https://github.com/andrewkimjoseph/celina-sdk/blob/671d3f90a836646c5a311cc0f8c6691cf3fc4dad/src/services/staking.service.ts#L544)

Network-wide total active staking votes across all validator groups.

#### Returns

`Promise`\<\{ `network`: `"mainnet"`; `summary`: \{ `message`: `string`; `networkParticipation`: `string`; \}; `totalVotes`: `string`; `totalVotesCelo`: `number`; `totalVotesFormatted`: `string`; \}\>

Total votes in wei and human-readable CELO formatting

***

### getValidatorGroupDetails()

> **getValidatorGroupDetails**(`groupAddress`): `Promise`\<\{ `address`: `` `0x${string}` ``; `capacity`: `string`; `capacityFormatted`: `string`; `eligible`: `boolean`; `lastSlashed`: `number` \| `null`; `members`: `object`[]; `name`: `string`; `network`: `"mainnet"`; `numElected`: `number`; `numMembers`: `number`; `votes`: `string`; `votesFormatted`: `string`; \}\>

Defined in: [src/services/staking.service.ts:385](https://github.com/andrewkimjoseph/celina-sdk/blob/671d3f90a836646c5a311cc0f8c6691cf3fc4dad/src/services/staking.service.ts#L385)

Detailed validator group profile including member validators and scores.

#### Parameters

##### groupAddress

`` `0x${string}` ``

Validator group contract address

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` ``; `capacity`: `string`; `capacityFormatted`: `string`; `eligible`: `boolean`; `lastSlashed`: `number` \| `null`; `members`: `object`[]; `name`: `string`; `network`: `"mainnet"`; `numElected`: `number`; `numMembers`: `number`; `votes`: `string`; `votesFormatted`: `string`; \}\>

Group name, votes, capacity, eligibility, and member list

#### Throws

When `groupAddress` is not a valid hex address

***

### getValidatorGroups()

> **getValidatorGroups**(`options?`): `Promise`\<\{ `groups`: `object`[]; `network`: `"mainnet"`; `pagination`: \{ `hasMore`: `boolean`; `limit`: `number`; `offset`: `number`; `page`: `number`; `pageSize`: `number`; `total`: `number`; `totalPages`: `number`; \}; `totalVotes`: `string`; `totalVotesFormatted`: `string`; \}\>

Defined in: [src/services/staking.service.ts:210](https://github.com/andrewkimjoseph/celina-sdk/blob/671d3f90a836646c5a311cc0f8c6691cf3fc4dad/src/services/staking.service.ts#L210)

Paginated list of validator groups registered on Celo.

#### Parameters

##### options?

###### limit?

`number`

Max groups when using `offset`

###### offset?

`number`

Alternative to `page`: zero-based offset

###### page?

`number`

Page number (1-based)

###### pageSize?

`number`

Groups per page (1–50, default 10)

#### Returns

`Promise`\<\{ `groups`: `object`[]; `network`: `"mainnet"`; `pagination`: \{ `hasMore`: `boolean`; `limit`: `number`; `offset`: `number`; `page`: `number`; `pageSize`: `number`; `total`: `number`; `totalPages`: `number`; \}; `totalVotes`: `string`; `totalVotesFormatted`: `string`; \}\>

Group addresses, vote totals, capacity, and pagination metadata
