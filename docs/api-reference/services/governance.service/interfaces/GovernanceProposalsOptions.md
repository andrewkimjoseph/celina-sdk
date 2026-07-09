[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/governance.service](../README.md) / GovernanceProposalsOptions

# Interface: GovernanceProposalsOptions

Defined in: [src/services/governance.service.ts:20](https://github.com/andrewkimjoseph/celina-sdk/blob/852f4654b3367c2e99db65ab17e2cfcd145a3d0e/src/services/governance.service.ts#L20)

Pagination and metadata options for governance proposal lists.

## Properties

### includeInactive?

> `optional` **includeInactive?**: `boolean`

Defined in: [src/services/governance.service.ts:22](https://github.com/andrewkimjoseph/celina-sdk/blob/852f4654b3367c2e99db65ab17e2cfcd145a3d0e/src/services/governance.service.ts#L22)

Include expired, rejected, and withdrawn proposals (default `true`).

***

### includeMetadata?

> `optional` **includeMetadata?**: `boolean`

Defined in: [src/services/governance.service.ts:24](https://github.com/andrewkimjoseph/celina-sdk/blob/852f4654b3367c2e99db65ab17e2cfcd145a3d0e/src/services/governance.service.ts#L24)

Fetch CGP frontmatter from GitHub (default `true`).

***

### limit?

> `optional` **limit?**: `number`

Defined in: [src/services/governance.service.ts:32](https://github.com/andrewkimjoseph/celina-sdk/blob/852f4654b3367c2e99db65ab17e2cfcd145a3d0e/src/services/governance.service.ts#L32)

Max proposals when using `offset` (capped at 100).

***

### offset?

> `optional` **offset?**: `number`

Defined in: [src/services/governance.service.ts:30](https://github.com/andrewkimjoseph/celina-sdk/blob/852f4654b3367c2e99db65ab17e2cfcd145a3d0e/src/services/governance.service.ts#L30)

Zero-based offset into the proposal id list.

***

### page?

> `optional` **page?**: `number`

Defined in: [src/services/governance.service.ts:26](https://github.com/andrewkimjoseph/celina-sdk/blob/852f4654b3367c2e99db65ab17e2cfcd145a3d0e/src/services/governance.service.ts#L26)

Page number (1-based); used with `pageSize` when set.

***

### pageSize?

> `optional` **pageSize?**: `number`

Defined in: [src/services/governance.service.ts:28](https://github.com/andrewkimjoseph/celina-sdk/blob/852f4654b3367c2e99db65ab17e2cfcd145a3d0e/src/services/governance.service.ts#L28)

Proposals per page when using `page` (1–20, default 10).
