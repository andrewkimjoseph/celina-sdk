[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/governance.service](../README.md) / GovernanceService

# Class: GovernanceService

Defined in: [src/services/governance.service.ts:146](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/governance.service.ts#L146)

Celo on-chain governance proposal reads, CGP enrichment, and LockedGold writes.

## Constructors

### Constructor

> **new GovernanceService**(`clientFactory`): `GovernanceService`

Defined in: [src/services/governance.service.ts:149](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/governance.service.ts#L149)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`GovernanceService`

## Methods

### getActionableGovernanceProposals()

> **getActionableGovernanceProposals**(): `Promise`\<\{ `concurrentProposals`: `number`; `dequeueFrequencySeconds`: `number`; `dequeueReady`: `boolean`; `hasAny`: `boolean`; `hasQueued`: `boolean`; `hasReferendum`: `boolean`; `hasUpvoteableQueued`: `boolean`; `lastDequeue`: `number`; `lastDequeueISO`: `string`; `message`: `string`; `network`: `"mainnet"`; `nextDequeueProposalIds`: `number`[]; `queued`: `object`[]; `referendum`: `object`[]; `secondsUntilDequeueReady`: `number`; \}\>

Defined in: [src/services/governance.service.ts:708](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/governance.service.ts#L708)

Queued and Referendum proposals you can upvote or vote on now.

#### Returns

`Promise`\<\{ `concurrentProposals`: `number`; `dequeueFrequencySeconds`: `number`; `dequeueReady`: `boolean`; `hasAny`: `boolean`; `hasQueued`: `boolean`; `hasReferendum`: `boolean`; `hasUpvoteableQueued`: `boolean`; `lastDequeue`: `number`; `lastDequeueISO`: `string`; `message`: `string`; `network`: `"mainnet"`; `nextDequeueProposalIds`: `number`[]; `queued`: `object`[]; `referendum`: `object`[]; `secondsUntilDequeueReady`: `number`; \}\>

***

### getDequeueWithIndices()

> **getDequeueWithIndices**(): `Promise`\<`object`[]\>

Defined in: [src/services/governance.service.ts:620](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/governance.service.ts#L620)

Raw getDequeue with positional indices preserved for Governance.vote().

#### Returns

`Promise`\<`object`[]\>

***

### getGovernanceProposals()

> **getGovernanceProposals**(`options?`): `Promise`\<\{ `network`: `"mainnet"`; `pagination`: \{ `hasMore`: `boolean`; `limit`: `number`; `offset`: `number`; `page`: `number`; `pageSize`: `number`; `total`: `number`; `totalPages`: `number`; \}; `proposals`: `object`[]; \}\>

Defined in: [src/services/governance.service.ts:502](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/governance.service.ts#L502)

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

Defined in: [src/services/governance.service.ts:785](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/governance.service.ts#L785)

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

Defined in: [src/services/governance.service.ts:912](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/governance.service.ts#L912)

Locked CELO balances and governance voting power for an address.

#### Parameters

##### address

`` `0x${string}` ``

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` ``; `delegatedFraction`: `string`; `governanceVotingPower`: `string`; `governanceVotingPowerFormatted`: `string`; `network`: `"mainnet"`; `nonvotingLocked`: `string`; `nonvotingLockedFormatted`: `string`; `totalLocked`: `string`; `totalLockedFormatted`: `string`; \}\>

***

### getPendingWithdrawals()

> **getPendingWithdrawals**(`address`): `Promise`\<\{ `address`: `` `0x${string}` ``; `matureCount`: `number`; `network`: `"mainnet"`; `unlockingPeriodSeconds`: `number`; `withdrawals`: `object`[]; \}\>

Defined in: [src/services/governance.service.ts:962](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/governance.service.ts#L962)

Pending LockedGold withdrawals with maturity timestamps.

#### Parameters

##### address

`` `0x${string}` ``

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` ``; `matureCount`: `number`; `network`: `"mainnet"`; `unlockingPeriodSeconds`: `number`; `withdrawals`: `object`[]; \}\>

***

### getProposalDetails()

> **getProposalDetails**(`proposalId`): `Promise`\<\{ `content`: `null`; `error`: `string`; `network`: `"mainnet"`; `proposal`: `null`; \} \| \{ `content`: `string` \| `null`; `error`: `null`; `network`: `"mainnet"`; `proposal`: \{ `deposit`: `string`; `expiryTimestamp`: `number` \| `null`; `id`: `number`; `isApproved`: `boolean`; `metadata`: `Record`\<`string`, `unknown`\> \| `null`; `networkWeight`: `string`; `numTransactions`: `number`; `proposer`: `string`; `stage`: `number`; `stageName`: `"Approval"` \| `"None"` \| `"Queued"` \| `"Referendum"` \| `"Execution"` \| `"Executed"` \| `"Expiration"` \| `"Rejected"` \| `"Withdrawn"`; `timestamp`: `number`; `upvotes`: `number`; `url`: `string`; `votes`: \{ `abstain`: `string`; `no`: `string`; `yes`: `string`; \}; \}; \}\>

Defined in: [src/services/governance.service.ts:585](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/governance.service.ts#L585)

Full details for a single proposal, including CGP markdown body when available.

#### Parameters

##### proposalId

`number`

On-chain governance proposal id

#### Returns

`Promise`\<\{ `content`: `null`; `error`: `string`; `network`: `"mainnet"`; `proposal`: `null`; \} \| \{ `content`: `string` \| `null`; `error`: `null`; `network`: `"mainnet"`; `proposal`: \{ `deposit`: `string`; `expiryTimestamp`: `number` \| `null`; `id`: `number`; `isApproved`: `boolean`; `metadata`: `Record`\<`string`, `unknown`\> \| `null`; `networkWeight`: `string`; `numTransactions`: `number`; `proposer`: `string`; `stage`: `number`; `stageName`: `"Approval"` \| `"None"` \| `"Queued"` \| `"Referendum"` \| `"Execution"` \| `"Executed"` \| `"Expiration"` \| `"Rejected"` \| `"Withdrawn"`; `timestamp`: `number`; `upvotes`: `number`; `url`: `string`; `votes`: \{ `abstain`: `string`; `no`: `string`; `yes`: `string`; \}; \}; \}\>

Proposal record, CGP content, or `{ proposal: null, error }` if missing

***

### getQueuedProposals()

> **getQueuedProposals**(`options?`): `Promise`\<\{ `concurrentProposals`: `number`; `dequeueFrequencySeconds`: `number`; `dequeueReady`: `boolean`; `lastDequeue`: `number`; `lastDequeueISO`: `string`; `message`: `string`; `network`: `"mainnet"`; `nextDequeueProposalIds`: `number`[]; `proposals`: `object`[]; `secondsUntilDequeueReady`: `number`; \}\>

Defined in: [src/services/governance.service.ts:663](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/governance.service.ts#L663)

Proposals currently in Queue stage with upvote weight.

#### Parameters

##### options?

###### limit?

`number`

#### Returns

`Promise`\<\{ `concurrentProposals`: `number`; `dequeueFrequencySeconds`: `number`; `dequeueReady`: `boolean`; `lastDequeue`: `number`; `lastDequeueISO`: `string`; `message`: `string`; `network`: `"mainnet"`; `nextDequeueProposalIds`: `number`[]; `proposals`: `object`[]; `secondsUntilDequeueReady`: `number`; \}\>

***

### getVotableProposals()

> **getVotableProposals**(`options?`): `Promise`\<\{ `message`: `string`; `network`: `"mainnet"`; `proposals`: `object`[]; \}\>

Defined in: [src/services/governance.service.ts:635](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/governance.service.ts#L635)

Proposals currently in Referendum stage with their dequeue index.

#### Parameters

##### options?

###### limit?

`number`

#### Returns

`Promise`\<\{ `message`: `string`; `network`: `"mainnet"`; `proposals`: `object`[]; \}\>

***

### prepareDequeueProposalsIfReady()

> **prepareDequeueProposalsIfReady**(`from`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/governance.service.ts:1306](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/governance.service.ts#L1306)

Prepare Governance.dequeueProposalsIfReady (on-chain the call is permissionless).
Celina MCP execute_dequeue_proposals_if_ready is humanness-gated.
When overdue, moves up to concurrentProposals from the queue into Approval.

#### Parameters

##### from

`` `0x${string}` ``

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

***

### prepareLockCelo()

> **prepareLockCelo**(`from`, `amount`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/governance.service.ts:1038](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/governance.service.ts#L1038)

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

Defined in: [src/services/governance.service.ts:1120](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/governance.service.ts#L1120)

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

Defined in: [src/services/governance.service.ts:1378](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/governance.service.ts#L1378)

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

Defined in: [src/services/governance.service.ts:1346](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/governance.service.ts#L1346)

Revoke all active referendum votes for an account (bulk on-chain).

#### Parameters

##### from

`` `0x${string}` ``

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

***

### prepareUnlockCelo()

> **prepareUnlockCelo**(`from`, `amount`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/governance.service.ts:1095](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/governance.service.ts#L1095)

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

Defined in: [src/services/governance.service.ts:1226](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/governance.service.ts#L1226)

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

Defined in: [src/services/governance.service.ts:1184](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/governance.service.ts#L1184)

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

Defined in: [src/services/governance.service.ts:1150](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/governance.service.ts#L1150)

Withdraw all matured pending withdrawals.

#### Parameters

##### from

`` `0x${string}` ``

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>
