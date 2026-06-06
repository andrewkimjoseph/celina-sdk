[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/governance.service](../README.md) / GovernanceService

# Class: GovernanceService

Defined in: [src/services/governance.service.ts:94](https://github.com/andrewkimjoseph/celina-sdk/blob/e071b6ef176a1c725fb3cc7d17c5bc0b9767d108/src/services/governance.service.ts#L94)

Celo on-chain governance proposal reads and CGP enrichment.

## Constructors

### Constructor

> **new GovernanceService**(`clientFactory`): `GovernanceService`

Defined in: [src/services/governance.service.ts:95](https://github.com/andrewkimjoseph/celina-sdk/blob/e071b6ef176a1c725fb3cc7d17c5bc0b9767d108/src/services/governance.service.ts#L95)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`GovernanceService`

## Methods

### getGovernanceProposals()

> **getGovernanceProposals**(`options?`): `Promise`\<\{ `network`: `"mainnet"`; `pagination`: \{ `hasMore`: `boolean`; `limit`: `number`; `offset`: `number`; `page`: `number`; `pageSize`: `number`; `total`: `number`; `totalPages`: `number`; \}; `proposals`: `object`[]; \}\>

Defined in: [src/services/governance.service.ts:221](https://github.com/andrewkimjoseph/celina-sdk/blob/e071b6ef176a1c725fb3cc7d17c5bc0b9767d108/src/services/governance.service.ts#L221)

List governance proposals with pagination and optional CGP metadata.

#### Parameters

##### options?

[`GovernanceProposalsOptions`](../interfaces/GovernanceProposalsOptions.md) = `{}`

Pagination (`page`/`pageSize` or `offset`/`limit`) and filters

#### Returns

`Promise`\<\{ `network`: `"mainnet"`; `pagination`: \{ `hasMore`: `boolean`; `limit`: `number`; `offset`: `number`; `page`: `number`; `pageSize`: `number`; `total`: `number`; `totalPages`: `number`; \}; `proposals`: `object`[]; \}\>

Proposals with stage names, vote totals, and optional CGP frontmatter

***

### getProposalDetails()

> **getProposalDetails**(`proposalId`): `Promise`\<\{ `content`: `null`; `error`: `string`; `network`: `"mainnet"`; `proposal`: `null`; \} \| \{ `content`: `string` \| `null`; `error`: `null`; `network`: `"mainnet"`; `proposal`: \{ `deposit`: `string`; `expiryTimestamp`: `number` \| `null`; `id`: `number`; `isApproved`: `boolean`; `metadata`: `Record`\<`string`, `unknown`\> \| `null`; `networkWeight`: `string`; `numTransactions`: `number`; `proposer`: `string`; `stage`: `number`; `stageName`: `"Approval"` \| `"None"` \| `"Queued"` \| `"Referendum"` \| `"Execution"` \| `"Executed"` \| `"Expiration"` \| `"Rejected"` \| `"Withdrawn"`; `timestamp`: `number`; `upvotes`: `number`; `url`: `string`; `votes`: \{ `abstain`: `string`; `no`: `string`; `yes`: `string`; \}; \}; \}\>

Defined in: [src/services/governance.service.ts:304](https://github.com/andrewkimjoseph/celina-sdk/blob/e071b6ef176a1c725fb3cc7d17c5bc0b9767d108/src/services/governance.service.ts#L304)

Full details for a single proposal, including CGP markdown body when available.

#### Parameters

##### proposalId

`number`

On-chain governance proposal id

#### Returns

`Promise`\<\{ `content`: `null`; `error`: `string`; `network`: `"mainnet"`; `proposal`: `null`; \} \| \{ `content`: `string` \| `null`; `error`: `null`; `network`: `"mainnet"`; `proposal`: \{ `deposit`: `string`; `expiryTimestamp`: `number` \| `null`; `id`: `number`; `isApproved`: `boolean`; `metadata`: `Record`\<`string`, `unknown`\> \| `null`; `networkWeight`: `string`; `numTransactions`: `number`; `proposer`: `string`; `stage`: `number`; `stageName`: `"Approval"` \| `"None"` \| `"Queued"` \| `"Referendum"` \| `"Execution"` \| `"Executed"` \| `"Expiration"` \| `"Rejected"` \| `"Withdrawn"`; `timestamp`: `number`; `upvotes`: `number`; `url`: `string`; `votes`: \{ `abstain`: `string`; `no`: `string`; `yes`: `string`; \}; \}; \}\>

Proposal record, CGP content, or `{ proposal: null, error }` if missing
