[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/staking.service](../README.md) / StakingService

# Class: StakingService

Defined in: [src/services/staking.service.ts:52](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/services/staking.service.ts#L52)

Validator election staking reads and writes via Celo core contracts.

## Constructors

### Constructor

> **new StakingService**(`clientFactory`): `StakingService`

Defined in: [src/services/staking.service.ts:55](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/services/staking.service.ts#L55)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`StakingService`

## Methods

### getActivatableStakes()

> **getActivatableStakes**(`address`): `Promise`\<\{ `activatableGroups`: `string`[]; `address`: `` `0x${string}` ``; `groupToIsActivatable`: `Record`\<`string`, `boolean`\>; `network`: `"mainnet"`; `summary`: \{ `activatableGroupsFormatted?`: `undefined`; `message`: `string`; `totalActivatableGroups`: `number`; `totalPendingGroups`: `number`; \}; \} \| \{ `activatableGroups`: `string`[]; `address`: `` `0x${string}` ``; `groupToIsActivatable`: `Record`\<`string`, `boolean`\>; `network`: `"mainnet"`; `summary`: \{ `activatableGroupsFormatted`: `string`[]; `message`: `string`; `totalActivatableGroups`: `number`; `totalPendingGroups`: `number`; \}; \}\>

Defined in: [src/services/staking.service.ts:169](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/services/staking.service.ts#L169)

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

Defined in: [src/services/staking.service.ts:600](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/services/staking.service.ts#L600)

Governance vote delegation info from LockedGold for an address.

#### Parameters

##### address

`` `0x${string}` ``

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` ``; `delegatees`: `object`[]; `governanceVotingPower`: `string`; `governanceVotingPowerFormatted`: `string`; `network`: `"mainnet"`; `totalDelegatedFraction`: `string`; `totalDelegatedPercent`: `string`; \}\>

***

### getStakeEligibility()

> **getStakeEligibility**(`address`, `groupAddress`, `amount`): `Promise`\<[`StakeEligibilityResult`](../../../index/type-aliases/StakeEligibilityResult.md)\>

Defined in: [src/services/staking.service.ts:764](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/services/staking.service.ts#L764)

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

Defined in: [src/services/staking.service.ts:69](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/services/staking.service.ts#L69)

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

Defined in: [src/services/staking.service.ts:579](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/services/staking.service.ts#L579)

Network-wide total active staking votes across all validator groups.

#### Returns

`Promise`\<\{ `network`: `"mainnet"`; `summary`: \{ `message`: `string`; `networkParticipation`: `string`; \}; `totalVotes`: `string`; `totalVotesCelo`: `number`; `totalVotesFormatted`: `string`; \}\>

Total votes in wei and human-readable CELO formatting

***

### getValidatorGroupDetails()

> **getValidatorGroupDetails**(`groupAddress`): `Promise`\<\{ `address`: `` `0x${string}` ``; `canReceiveVotes`: `string`; `canReceiveVotesFormatted`: `string`; `capacity`: `string`; `capacityFormatted`: `string`; `eligible`: `boolean`; `lastSlashed`: `number` \| `null`; `members`: `object`[]; `name`: `string`; `network`: `"mainnet"`; `numElected`: `number`; `numMembers`: `number`; `votes`: `string`; `votesFormatted`: `string`; \}\>

Defined in: [src/services/staking.service.ts:411](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/services/staking.service.ts#L411)

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

Defined in: [src/services/staking.service.ts:236](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/services/staking.service.ts#L236)

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

Defined in: [src/services/staking.service.ts:875](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/services/staking.service.ts#L875)

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

Defined in: [src/services/staking.service.ts:1000](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/services/staking.service.ts#L1000)

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

Defined in: [src/services/staking.service.ts:837](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/services/staking.service.ts#L837)

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

Defined in: [src/services/staking.service.ts:1036](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/services/staking.service.ts#L1036)

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

Defined in: [src/services/staking.service.ts:913](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/services/staking.service.ts#L913)

#### Parameters

##### from

`` `0x${string}` ``

##### groupAddress

`` `0x${string}` ``

##### amount

`string`

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>
