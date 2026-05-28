[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/governance.service](../README.md) / GovernanceService

# Class: GovernanceService

Defined in: [src/services/governance.service.ts:83](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/services/governance.service.ts#L83)

## Constructors

### Constructor

> **new GovernanceService**(`clientFactory`): `GovernanceService`

Defined in: [src/services/governance.service.ts:84](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/services/governance.service.ts#L84)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`GovernanceService`

## Methods

### getGovernanceProposals()

> **getGovernanceProposals**(`options?`): `Promise`\<\{ `network`: `"mainnet"`; `pagination`: \{ `hasMore`: `boolean`; `limit`: `number`; `offset`: `number`; `page`: `number`; `pageSize`: `number`; `total`: `number`; `totalPages`: `number`; \}; `proposals`: `object`[]; \}\>

Defined in: [src/services/governance.service.ts:205](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/services/governance.service.ts#L205)

#### Parameters

##### options?

[`GovernanceProposalsOptions`](../interfaces/GovernanceProposalsOptions.md) = `{}`

#### Returns

`Promise`\<\{ `network`: `"mainnet"`; `pagination`: \{ `hasMore`: `boolean`; `limit`: `number`; `offset`: `number`; `page`: `number`; `pageSize`: `number`; `total`: `number`; `totalPages`: `number`; \}; `proposals`: `object`[]; \}\>

***

### getProposalDetails()

> **getProposalDetails**(`proposalId`): `Promise`\<\{ `content`: `null`; `error`: `string`; `network`: `"mainnet"`; `proposal`: `null`; \} \| \{ `content`: `string` \| `null`; `error`: `null`; `network`: `"mainnet"`; `proposal`: \{ `deposit`: `string`; `expiryTimestamp`: `number` \| `null`; `id`: `number`; `isApproved`: `boolean`; `metadata`: `Record`\<`string`, `unknown`\> \| `null`; `networkWeight`: `string`; `numTransactions`: `number`; `proposer`: `string`; `stage`: `number`; `stageName`: `"Approval"` \| `"None"` \| `"Queued"` \| `"Referendum"` \| `"Execution"` \| `"Executed"` \| `"Expiration"` \| `"Rejected"` \| `"Withdrawn"`; `timestamp`: `number`; `upvotes`: `number`; `url`: `string`; `votes`: \{ `abstain`: `string`; `no`: `string`; `yes`: `string`; \}; \}; \}\>

Defined in: [src/services/governance.service.ts:283](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/services/governance.service.ts#L283)

#### Parameters

##### proposalId

`number`

#### Returns

`Promise`\<\{ `content`: `null`; `error`: `string`; `network`: `"mainnet"`; `proposal`: `null`; \} \| \{ `content`: `string` \| `null`; `error`: `null`; `network`: `"mainnet"`; `proposal`: \{ `deposit`: `string`; `expiryTimestamp`: `number` \| `null`; `id`: `number`; `isApproved`: `boolean`; `metadata`: `Record`\<`string`, `unknown`\> \| `null`; `networkWeight`: `string`; `numTransactions`: `number`; `proposer`: `string`; `stage`: `number`; `stageName`: `"Approval"` \| `"None"` \| `"Queued"` \| `"Referendum"` \| `"Execution"` \| `"Executed"` \| `"Expiration"` \| `"Rejected"` \| `"Withdrawn"`; `timestamp`: `number`; `upvotes`: `number`; `url`: `string`; `votes`: \{ `abstain`: `string`; `no`: `string`; `yes`: `string`; \}; \}; \}\>
