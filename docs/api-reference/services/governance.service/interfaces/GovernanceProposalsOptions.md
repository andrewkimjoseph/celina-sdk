[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/governance.service](../README.md) / GovernanceProposalsOptions

# Interface: GovernanceProposalsOptions

Defined in: [src/services/governance.service.ts:41](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/services/governance.service.ts#L41)

Pagination and metadata options for governance proposal lists.

## Properties

### includeInactive?

> `optional` **includeInactive?**: `boolean`

Defined in: [src/services/governance.service.ts:43](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/services/governance.service.ts#L43)

Include expired, rejected, and withdrawn proposals (default `true`).

***

### includeMetadata?

> `optional` **includeMetadata?**: `boolean`

Defined in: [src/services/governance.service.ts:45](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/services/governance.service.ts#L45)

Fetch CGP frontmatter from GitHub (default `true`).

***

### limit?

> `optional` **limit?**: `number`

Defined in: [src/services/governance.service.ts:53](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/services/governance.service.ts#L53)

Max proposals when using `offset` (capped at 100).

***

### offset?

> `optional` **offset?**: `number`

Defined in: [src/services/governance.service.ts:51](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/services/governance.service.ts#L51)

Zero-based offset into the proposal id list.

***

### page?

> `optional` **page?**: `number`

Defined in: [src/services/governance.service.ts:47](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/services/governance.service.ts#L47)

Page number (1-based); used with `pageSize` when set.

***

### pageSize?

> `optional` **pageSize?**: `number`

Defined in: [src/services/governance.service.ts:49](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/services/governance.service.ts#L49)

Proposals per page when using `page` (1–20, default 10).
