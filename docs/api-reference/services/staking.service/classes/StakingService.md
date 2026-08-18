[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/staking.service](../README.md) / StakingService

# Class: StakingService

Defined in: [src/services/staking.service.ts:66](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/staking.service.ts#L66)

Validator election staking reads and writes via Celo core contracts.

## Constructors

### Constructor

> **new StakingService**(`clientFactory`): `StakingService`

Defined in: [src/services/staking.service.ts:69](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/staking.service.ts#L69)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`StakingService`

## Methods

### getActivatableStakes()

> **getActivatableStakes**(`address`): `Promise`\<\{ `activatableGroups`: `string`[]; `address`: `` `0x${string}` ``; `groupToIsActivatable`: `Record`\<`string`, `boolean`\>; `network`: `"mainnet"`; `summary`: \{ `activatableGroupsFormatted?`: `undefined`; `message`: `string`; `totalActivatableGroups`: `number`; `totalPendingGroups`: `number`; \}; \} \| \{ `activatableGroups`: `string`[]; `address`: `` `0x${string}` ``; `groupToIsActivatable`: `Record`\<`string`, `boolean`\>; `network`: `"mainnet"`; `summary`: \{ `activatableGroupsFormatted`: `string`[]; `message`: `string`; `totalActivatableGroups`: `number`; `totalPendingGroups`: `number`; \}; \}\>

Defined in: [src/services/staking.service.ts:183](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/staking.service.ts#L183)

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

### getDelegationInfo()

> **getDelegationInfo**(`address`): `Promise`\<\{ `address`: `` `0x${string}` ``; `delegatees`: `object`[]; `governanceVotingPower`: `string`; `governanceVotingPowerFormatted`: `string`; `network`: `"mainnet"`; `totalDelegatedFraction`: `string`; `totalDelegatedPercent`: `string`; \}\>

Defined in: [src/services/staking.service.ts:614](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/staking.service.ts#L614)

Governance vote delegation info from LockedGold for an address.

#### Parameters

##### address

`` `0x${string}` ``

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` ``; `delegatees`: `object`[]; `governanceVotingPower`: `string`; `governanceVotingPowerFormatted`: `string`; `network`: `"mainnet"`; `totalDelegatedFraction`: `string`; `totalDelegatedPercent`: `string`; \}\>

***

### getGovernanceDelegateDetails()

> **getGovernanceDelegateDetails**(`address`): `Promise`\<[`GovernanceDelegateDetailsResult`](../type-aliases/GovernanceDelegateDetailsResult.md)\>

Defined in: [src/services/staking.service.ts:684](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/staking.service.ts#L684)

Mondo profile (if listed) plus on-chain LockedGold stats for a delegate address.

#### Parameters

##### address

`` `0x${string}` ``

#### Returns

`Promise`\<[`GovernanceDelegateDetailsResult`](../type-aliases/GovernanceDelegateDetailsResult.md)\>

***

### getGovernanceDelegates()

> **getGovernanceDelegates**(`options?`): `Promise`\<[`GovernanceDelegatesResult`](../../../index/type-aliases/GovernanceDelegatesResult.md)\>

Defined in: [src/services/staking.service.ts:677](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/staking.service.ts#L677)

Curated Celo Mondo governance delegate directory with optional LockedGold stats.
Off-chain directory — not an on-chain registry; any address can receive delegation.

#### Parameters

##### options?

[`GetGovernanceDelegatesOptions`](../../../index/type-aliases/GetGovernanceDelegatesOptions.md)

#### Returns

`Promise`\<[`GovernanceDelegatesResult`](../../../index/type-aliases/GovernanceDelegatesResult.md)\>

***

### getStakeEligibility()

> **getStakeEligibility**(`address`, `groupAddress`, `amount`): `Promise`\<[`StakeEligibilityResult`](../../../index/type-aliases/StakeEligibilityResult.md)\>

Defined in: [src/services/staking.service.ts:798](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/staking.service.ts#L798)

Check whether a stake with the given amount would succeed before execute_stake.
Uses computed group headroom and Election.canReceiveVotes(group, amount),
non-voting locked balance, and account registration.

#### Parameters

##### address

`` `0x${string}` ``

##### groupAddress

`` `0x${string}` ``

##### amount

`string`

#### Returns

`Promise`\<[`StakeEligibilityResult`](../../../index/type-aliases/StakeEligibilityResult.md)\>

***

### getStakingBalances()

> **getStakingBalances**(`address`): `Promise`\<\{ `active`: `string`; `activeFormatted`: `string`; `address`: `` `0x${string}` ``; `groups`: `object`[]; `network`: `"mainnet"`; `pending`: `string`; `pendingFormatted`: `string`; `total`: `string`; `totalFormatted`: `string`; \}\>

Defined in: [src/services/staking.service.ts:83](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/staking.service.ts#L83)

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

Defined in: [src/services/staking.service.ts:593](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/staking.service.ts#L593)

Network-wide total active staking votes across all validator groups.

#### Returns

`Promise`\<\{ `network`: `"mainnet"`; `summary`: \{ `message`: `string`; `networkParticipation`: `string`; \}; `totalVotes`: `string`; `totalVotesCelo`: `number`; `totalVotesFormatted`: `string`; \}\>

Total votes in wei and human-readable CELO formatting

***

### getValidatorGroupDetails()

> **getValidatorGroupDetails**(`groupAddress`): `Promise`\<\{ `address`: `` `0x${string}` ``; `canReceiveVotes`: `string`; `canReceiveVotesFormatted`: `string`; `capacity`: `string`; `capacityFormatted`: `string`; `eligible`: `boolean`; `lastSlashed`: `number` \| `null`; `members`: `object`[]; `name`: `string`; `network`: `"mainnet"`; `numElected`: `number`; `numMembers`: `number`; `votes`: `string`; `votesFormatted`: `string`; \}\>

Defined in: [src/services/staking.service.ts:425](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/staking.service.ts#L425)

Detailed validator group profile including member validators and scores.

#### Parameters

##### groupAddress

`` `0x${string}` ``

Validator group contract address

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` ``; `canReceiveVotes`: `string`; `canReceiveVotesFormatted`: `string`; `capacity`: `string`; `capacityFormatted`: `string`; `eligible`: `boolean`; `lastSlashed`: `number` \| `null`; `members`: `object`[]; `name`: `string`; `network`: `"mainnet"`; `numElected`: `number`; `numMembers`: `number`; `votes`: `string`; `votesFormatted`: `string`; \}\>

Group name, votes, capacity, eligibility, and member list

#### Throws

When `groupAddress` is not a valid hex address

***

### getValidatorGroups()

> **getValidatorGroups**(`options?`): `Promise`\<\{ `groups`: `object`[]; `network`: `"mainnet"`; `pagination`: \{ `hasMore`: `boolean`; `limit`: `number`; `offset`: `number`; `page`: `number`; `pageSize`: `number`; `total`: `number`; `totalPages`: `number`; \}; `totalVotes`: `string`; `totalVotesFormatted`: `string`; \}\>

Defined in: [src/services/staking.service.ts:250](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/staking.service.ts#L250)

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

***

### prepareActivateStake()

> **prepareActivateStake**(`from`, `groupAddress`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/staking.service.ts:909](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/staking.service.ts#L909)

#### Parameters

##### from

`` `0x${string}` ``

##### groupAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

***

### prepareDelegatePower()

> **prepareDelegatePower**(`from`, `delegatee`, `percent`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/staking.service.ts:1034](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/staking.service.ts#L1034)

#### Parameters

##### from

`` `0x${string}` ``

##### delegatee

`` `0x${string}` ``

##### percent

`number`

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

***

### prepareStake()

> **prepareStake**(`from`, `groupAddress`, `amount`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/staking.service.ts:871](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/staking.service.ts#L871)

#### Parameters

##### from

`` `0x${string}` ``

##### groupAddress

`` `0x${string}` ``

##### amount

`string`

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

***

### prepareUndelegatePower()

> **prepareUndelegatePower**(`from`, `delegatee`, `percent`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/staking.service.ts:1070](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/staking.service.ts#L1070)

#### Parameters

##### from

`` `0x${string}` ``

##### delegatee

`` `0x${string}` ``

##### percent

`number`

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

***

### prepareUnstake()

> **prepareUnstake**(`from`, `groupAddress`, `amount`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/staking.service.ts:947](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/staking.service.ts#L947)

#### Parameters

##### from

`` `0x${string}` ``

##### groupAddress

`` `0x${string}` ``

##### amount

`string`

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>
