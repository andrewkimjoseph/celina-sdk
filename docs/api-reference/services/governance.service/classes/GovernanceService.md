[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/governance.service](../README.md) / GovernanceService

# Class: GovernanceService

Defined in: [src/services/governance.service.ts:109](https://github.com/andrewkimjoseph/celina-sdk/blob/108a06415a8ecf8f0740dcf787117e653a3ffce0/src/services/governance.service.ts#L109)

Celo on-chain governance proposal reads, CGP enrichment, and LockedGold writes.

## Constructors

### Constructor

> **new GovernanceService**(`clientFactory`): `GovernanceService`

Defined in: [src/services/governance.service.ts:112](https://github.com/andrewkimjoseph/celina-sdk/blob/108a06415a8ecf8f0740dcf787117e653a3ffce0/src/services/governance.service.ts#L112)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`GovernanceService`

## Methods

### getDequeueWithIndices()

> **getDequeueWithIndices**(): `Promise`\<`object`[]\>

Defined in: [src/services/governance.service.ts:358](https://github.com/andrewkimjoseph/celina-sdk/blob/108a06415a8ecf8f0740dcf787117e653a3ffce0/src/services/governance.service.ts#L358)

Raw getDequeue with positional indices preserved for Governance.vote().

#### Returns

`Promise`\<`object`[]\>

***

### getGovernanceProposals()

> **getGovernanceProposals**(`options?`): `Promise`\<\{ `network`: `"mainnet"`; `pagination`: \{ `hasMore`: `boolean`; `limit`: `number`; `offset`: `number`; `page`: `number`; `pageSize`: `number`; `total`: `number`; `totalPages`: `number`; \}; `proposals`: `object`[]; \}\>

Defined in: [src/services/governance.service.ts:240](https://github.com/andrewkimjoseph/celina-sdk/blob/108a06415a8ecf8f0740dcf787117e653a3ffce0/src/services/governance.service.ts#L240)

List governance proposals with pagination and optional CGP metadata.

#### Parameters

##### options?

[`GovernanceProposalsOptions`](../interfaces/GovernanceProposalsOptions.md) = `{}`

Pagination (`page`/`pageSize` or `offset`/`limit`) and filters

#### Returns

`Promise`\<\{ `network`: `"mainnet"`; `pagination`: \{ `hasMore`: `boolean`; `limit`: `number`; `offset`: `number`; `page`: `number`; `pageSize`: `number`; `total`: `number`; `totalPages`: `number`; \}; `proposals`: `object`[]; \}\>

Proposals with stage names, vote totals, and optional CGP frontmatter

***

### getLockedCeloBalance()

> **getLockedCeloBalance**(`address`): `Promise`\<\{ `address`: `` `0x${string}` ``; `delegatedFraction`: `string`; `governanceVotingPower`: `string`; `governanceVotingPowerFormatted`: `string`; `network`: `"mainnet"`; `nonvotingLocked`: `string`; `nonvotingLockedFormatted`: `string`; `totalLocked`: `string`; `totalLockedFormatted`: `string`; \}\>

Defined in: [src/services/governance.service.ts:403](https://github.com/andrewkimjoseph/celina-sdk/blob/108a06415a8ecf8f0740dcf787117e653a3ffce0/src/services/governance.service.ts#L403)

Locked CELO balances and governance voting power for an address.

#### Parameters

##### address

`` `0x${string}` ``

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` ``; `delegatedFraction`: `string`; `governanceVotingPower`: `string`; `governanceVotingPowerFormatted`: `string`; `network`: `"mainnet"`; `nonvotingLocked`: `string`; `nonvotingLockedFormatted`: `string`; `totalLocked`: `string`; `totalLockedFormatted`: `string`; \}\>

***

### getPendingWithdrawals()

> **getPendingWithdrawals**(`address`): `Promise`\<\{ `address`: `` `0x${string}` ``; `matureCount`: `number`; `network`: `"mainnet"`; `unlockingPeriodSeconds`: `number`; `withdrawals`: `object`[]; \}\>

Defined in: [src/services/governance.service.ts:453](https://github.com/andrewkimjoseph/celina-sdk/blob/108a06415a8ecf8f0740dcf787117e653a3ffce0/src/services/governance.service.ts#L453)

Pending LockedGold withdrawals with maturity timestamps.

#### Parameters

##### address

`` `0x${string}` ``

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` ``; `matureCount`: `number`; `network`: `"mainnet"`; `unlockingPeriodSeconds`: `number`; `withdrawals`: `object`[]; \}\>

***

### getProposalDetails()

> **getProposalDetails**(`proposalId`): `Promise`\<\{ `content`: `null`; `error`: `string`; `network`: `"mainnet"`; `proposal`: `null`; \} \| \{ `content`: `string` \| `null`; `error`: `null`; `network`: `"mainnet"`; `proposal`: \{ `deposit`: `string`; `expiryTimestamp`: `number` \| `null`; `id`: `number`; `isApproved`: `boolean`; `metadata`: `Record`\<`string`, `unknown`\> \| `null`; `networkWeight`: `string`; `numTransactions`: `number`; `proposer`: `string`; `stage`: `number`; `stageName`: `"Approval"` \| `"None"` \| `"Queued"` \| `"Referendum"` \| `"Execution"` \| `"Executed"` \| `"Expiration"` \| `"Rejected"` \| `"Withdrawn"`; `timestamp`: `number`; `upvotes`: `number`; `url`: `string`; `votes`: \{ `abstain`: `string`; `no`: `string`; `yes`: `string`; \}; \}; \}\>

Defined in: [src/services/governance.service.ts:323](https://github.com/andrewkimjoseph/celina-sdk/blob/108a06415a8ecf8f0740dcf787117e653a3ffce0/src/services/governance.service.ts#L323)

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

Defined in: [src/services/governance.service.ts:373](https://github.com/andrewkimjoseph/celina-sdk/blob/108a06415a8ecf8f0740dcf787117e653a3ffce0/src/services/governance.service.ts#L373)

Proposals currently in Referendum stage with their dequeue index.

#### Returns

`Promise`\<\{ `message`: `string`; `network`: `"mainnet"`; `proposals`: `object`[]; \}\>

***

### prepareLockCelo()

> **prepareLockCelo**(`from`, `amount`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/governance.service.ts:529](https://github.com/andrewkimjoseph/celina-sdk/blob/108a06415a8ecf8f0740dcf787117e653a3ffce0/src/services/governance.service.ts#L529)

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

Defined in: [src/services/governance.service.ts:611](https://github.com/andrewkimjoseph/celina-sdk/blob/108a06415a8ecf8f0740dcf787117e653a3ffce0/src/services/governance.service.ts#L611)

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

### prepareUnlockCelo()

> **prepareUnlockCelo**(`from`, `amount`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/governance.service.ts:586](https://github.com/andrewkimjoseph/celina-sdk/blob/108a06415a8ecf8f0740dcf787117e653a3ffce0/src/services/governance.service.ts#L586)

#### Parameters

##### from

`` `0x${string}` ``

##### amount

`string`

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

***

### prepareVote()

> **prepareVote**(`from`, `proposalId`, `vote`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/governance.service.ts:675](https://github.com/andrewkimjoseph/celina-sdk/blob/108a06415a8ecf8f0740dcf787117e653a3ffce0/src/services/governance.service.ts#L675)

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

Defined in: [src/services/governance.service.ts:641](https://github.com/andrewkimjoseph/celina-sdk/blob/108a06415a8ecf8f0740dcf787117e653a3ffce0/src/services/governance.service.ts#L641)

Withdraw all matured pending withdrawals.

#### Parameters

##### from

`` `0x${string}` ``

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>
