[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/governance.service](../README.md) / GovernanceProposalsOptions

# Interface: GovernanceProposalsOptions

Defined in: [src/services/governance.service.ts:44](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/governance.service.ts#L44)

Pagination and metadata options for governance proposal lists.

## Properties

### includeInactive?

> `optional` **includeInactive?**: `boolean`

Defined in: [src/services/governance.service.ts:46](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/governance.service.ts#L46)

Include expired, rejected, and withdrawn proposals (default `true`).

***

### includeMetadata?

> `optional` **includeMetadata?**: `boolean`

Defined in: [src/services/governance.service.ts:48](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/governance.service.ts#L48)

Fetch CGP frontmatter from GitHub (default `true`).

***

### limit?

> `optional` **limit?**: `number`

Defined in: [src/services/governance.service.ts:56](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/governance.service.ts#L56)

Max proposals when using `offset` (capped at 100).

***

### offset?

> `optional` **offset?**: `number`

Defined in: [src/services/governance.service.ts:54](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/governance.service.ts#L54)

Zero-based offset into the proposal id list.

***

### page?

> `optional` **page?**: `number`

Defined in: [src/services/governance.service.ts:50](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/governance.service.ts#L50)

Page number (1-based); used with `pageSize` when set.

***

### pageSize?

> `optional` **pageSize?**: `number`

Defined in: [src/services/governance.service.ts:52](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/governance.service.ts#L52)

Proposals per page when using `page` (1–20, default 10).
