[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/governance.service](../README.md) / GovernanceService

# Class: GovernanceService

Defined in: [src/services/governance.service.ts:127](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/services/governance.service.ts#L127)

Celo on-chain governance proposal reads, CGP enrichment, and LockedGold writes.

## Constructors

### Constructor

> **new GovernanceService**(`clientFactory`): `GovernanceService`

Defined in: [src/services/governance.service.ts:130](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/services/governance.service.ts#L130)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`GovernanceService`

## Methods

### getDequeueWithIndices()

> **getDequeueWithIndices**(): `Promise`\<`object`[]\>

Defined in: [src/services/governance.service.ts:427](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/services/governance.service.ts#L427)

Raw getDequeue with positional indices preserved for Governance.vote().

#### Returns

`Promise`\<`object`[]\>

***

### getGovernanceProposals()

> **getGovernanceProposals**(`options?`): `Promise`\<\{ `network`: `"mainnet"`; `pagination`: \{ `hasMore`: `boolean`; `limit`: `number`; `offset`: `number`; `page`: `number`; `pageSize`: `number`; `total`: `number`; `totalPages`: `number`; \}; `proposals`: `object`[]; \}\>

Defined in: [src/services/governance.service.ts:309](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/services/governance.service.ts#L309)

List governance proposals with pagination and optional CGP metadata.

#### Parameters

##### options?

[`GovernanceProposalsOptions`](../interfaces/GovernanceProposalsOptions.md) = `{}`

Pagination (`page`/`pageSize` or `offset`/`limit`) and filters

#### Returns

`Promise`\<\{ `network`: `"mainnet"`; `pagination`: \{ `hasMore`: `boolean`; `limit`: `number`; `offset`: `number`; `page`: `number`; `pageSize`: `number`; `total`: `number`; `totalPages`: `number`; \}; `proposals`: `object`[]; \}\>

Proposals with stage names, vote totals, and optional CGP frontmatter

***

### getGovernanceVotes()

> **getGovernanceVotes**(`address`, `options?`): `Promise`\<\{ `address`: `` `0x${string}` ``; `goldUsedForVoting`: `string`; `goldUsedForVotingFormatted`: `string`; `message`: `string`; `network`: `"mainnet"`; `queriedAddress?`: `` `0x${string}` ``; `referendumVotes`: `object`[]; `upvote`: \{ `proposalId`: `number`; `weight`: `string`; `weightFormatted`: `string`; \} \| `null`; \}\>

Defined in: [src/services/governance.service.ts:472](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/services/governance.service.ts#L472)

Referendum votes and queue upvotes cast by an address on Celo governance.

#### Parameters

##### address

`` `0x${string}` ``

##### options?

[`GovernanceVotesOptions`](../interfaces/GovernanceVotesOptions.md) = `{}`

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` ``; `goldUsedForVoting`: `string`; `goldUsedForVotingFormatted`: `string`; `message`: `string`; `network`: `"mainnet"`; `queriedAddress?`: `` `0x${string}` ``; `referendumVotes`: `object`[]; `upvote`: \{ `proposalId`: `number`; `weight`: `string`; `weightFormatted`: `string`; \} \| `null`; \}\>

***

### getLockedCeloBalance()

> **getLockedCeloBalance**(`address`): `Promise`\<\{ `address`: `` `0x${string}` ``; `delegatedFraction`: `string`; `governanceVotingPower`: `string`; `governanceVotingPowerFormatted`: `string`; `network`: `"mainnet"`; `nonvotingLocked`: `string`; `nonvotingLockedFormatted`: `string`; `totalLocked`: `string`; `totalLockedFormatted`: `string`; \}\>

Defined in: [src/services/governance.service.ts:599](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/services/governance.service.ts#L599)

Locked CELO balances and governance voting power for an address.

#### Parameters

##### address

`` `0x${string}` ``

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` ``; `delegatedFraction`: `string`; `governanceVotingPower`: `string`; `governanceVotingPowerFormatted`: `string`; `network`: `"mainnet"`; `nonvotingLocked`: `string`; `nonvotingLockedFormatted`: `string`; `totalLocked`: `string`; `totalLockedFormatted`: `string`; \}\>

***

### getPendingWithdrawals()

> **getPendingWithdrawals**(`address`): `Promise`\<\{ `address`: `` `0x${string}` ``; `matureCount`: `number`; `network`: `"mainnet"`; `unlockingPeriodSeconds`: `number`; `withdrawals`: `object`[]; \}\>

Defined in: [src/services/governance.service.ts:649](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/services/governance.service.ts#L649)

Pending LockedGold withdrawals with maturity timestamps.

#### Parameters

##### address

`` `0x${string}` ``

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` ``; `matureCount`: `number`; `network`: `"mainnet"`; `unlockingPeriodSeconds`: `number`; `withdrawals`: `object`[]; \}\>

***

### getProposalDetails()

> **getProposalDetails**(`proposalId`): `Promise`\<\{ `content`: `null`; `error`: `string`; `network`: `"mainnet"`; `proposal`: `null`; \} \| \{ `content`: `string` \| `null`; `error`: `null`; `network`: `"mainnet"`; `proposal`: \{ `deposit`: `string`; `expiryTimestamp`: `number` \| `null`; `id`: `number`; `isApproved`: `boolean`; `metadata`: `Record`\<`string`, `unknown`\> \| `null`; `networkWeight`: `string`; `numTransactions`: `number`; `proposer`: `string`; `stage`: `number`; `stageName`: `"Approval"` \| `"None"` \| `"Queued"` \| `"Referendum"` \| `"Execution"` \| `"Executed"` \| `"Expiration"` \| `"Rejected"` \| `"Withdrawn"`; `timestamp`: `number`; `upvotes`: `number`; `url`: `string`; `votes`: \{ `abstain`: `string`; `no`: `string`; `yes`: `string`; \}; \}; \}\>

Defined in: [src/services/governance.service.ts:392](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/services/governance.service.ts#L392)

Full details for a single proposal, including CGP markdown body when available.

#### Parameters

##### proposalId

`number`

On-chain governance proposal id

#### Returns

`Promise`\<\{ `content`: `null`; `error`: `string`; `network`: `"mainnet"`; `proposal`: `null`; \} \| \{ `content`: `string` \| `null`; `error`: `null`; `network`: `"mainnet"`; `proposal`: \{ `deposit`: `string`; `expiryTimestamp`: `number` \| `null`; `id`: `number`; `isApproved`: `boolean`; `metadata`: `Record`\<`string`, `unknown`\> \| `null`; `networkWeight`: `string`; `numTransactions`: `number`; `proposer`: `string`; `stage`: `number`; `stageName`: `"Approval"` \| `"None"` \| `"Queued"` \| `"Referendum"` \| `"Execution"` \| `"Executed"` \| `"Expiration"` \| `"Rejected"` \| `"Withdrawn"`; `timestamp`: `number`; `upvotes`: `number`; `url`: `string`; `votes`: \{ `abstain`: `string`; `no`: `string`; `yes`: `string`; \}; \}; \}\>

Proposal record, CGP content, or `{ proposal: null, error }` if missing

***

### getVotableProposals()

> **getVotableProposals**(): `Promise`\<\{ `message`: `string`; `network`: `"mainnet"`; `proposals`: `object`[]; \}\>

Defined in: [src/services/governance.service.ts:442](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/services/governance.service.ts#L442)

Proposals currently in Referendum stage with their dequeue index.

#### Returns

`Promise`\<\{ `message`: `string`; `network`: `"mainnet"`; `proposals`: `object`[]; \}\>

***

### prepareLockCelo()

> **prepareLockCelo**(`from`, `amount`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/governance.service.ts:725](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/services/governance.service.ts#L725)

Lock CELO, relocking matured pending withdrawals first (reverse index order).

#### Parameters

##### from

`` `0x${string}` ``

##### amount

`string`

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

***

### prepareRelockCelo()

> **prepareRelockCelo**(`from`, `index`, `amount`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/governance.service.ts:807](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/services/governance.service.ts#L807)

#### Parameters

##### from

`` `0x${string}` ``

##### index

`number`

##### amount

`string`

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

***

### prepareRevokeGovernanceUpvote()

> **prepareRevokeGovernanceUpvote**(`from`, `options?`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/governance.service.ts:1016](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/services/governance.service.ts#L1016)

Revoke the account's active queue upvote.

#### Parameters

##### from

`` `0x${string}` ``

##### options?

[`GovernanceRevokeUpvoteOptions`](../interfaces/GovernanceRevokeUpvoteOptions.md) = `{}`

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

***

### prepareRevokeGovernanceVotes()

> **prepareRevokeGovernanceVotes**(`from`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/governance.service.ts:984](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/services/governance.service.ts#L984)

Revoke all active referendum votes for an account (bulk on-chain).

#### Parameters

##### from

`` `0x${string}` ``

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

***

### prepareUnlockCelo()

> **prepareUnlockCelo**(`from`, `amount`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/governance.service.ts:782](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/services/governance.service.ts#L782)

#### Parameters

##### from

`` `0x${string}` ``

##### amount

`string`

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

***

### prepareUpvote()

> **prepareUpvote**(`from`, `proposalId`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/governance.service.ts:913](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/services/governance.service.ts#L913)

Upvote a Queued governance proposal (one active queue upvote per account).

#### Parameters

##### from

`` `0x${string}` ``

##### proposalId

`number`

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

***

### prepareVote()

> **prepareVote**(`from`, `proposalId`, `vote`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/governance.service.ts:871](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/services/governance.service.ts#L871)

#### Parameters

##### from

`` `0x${string}` ``

##### proposalId

`number`

##### vote

`"None"` \| `"Abstain"` \| `"No"` \| `"Yes"`

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

***

### prepareWithdrawCelo()

> **prepareWithdrawCelo**(`from`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/governance.service.ts:837](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/services/governance.service.ts#L837)

Withdraw all matured pending withdrawals.

#### Parameters

##### from

`` `0x${string}` ``

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>
