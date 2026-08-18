[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/nft.service](../README.md) / NftService

# Class: NftService

Defined in: [src/services/nft.service.ts:37](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/nft.service.ts#L37)

ERC-721 / ERC-1155 collection and balance reads with optional metadata fetch.

## Constructors

### Constructor

> **new NftService**(`clientFactory`): `NftService`

Defined in: [src/services/nft.service.ts:38](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/nft.service.ts#L38)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`NftService`

## Methods

### getNftBalance()

> **getNftBalance**(`contractAddress`, `ownerAddress`, `tokenId?`): `Promise`\<\{ `balance`: `string`; `contractAddress`: `` `0x${string}` ``; `network`: `"mainnet"`; `ownerAddress`: `` `0x${string}` ``; `standard`: `"ERC721"`; `tokenId`: `string` \| `null`; \} \| \{ `balance`: `string`; `contractAddress`: `` `0x${string}` ``; `network`: `"mainnet"`; `ownerAddress`: `` `0x${string}` ``; `standard`: `"ERC1155"`; `tokenId`: `string`; \}\>

Defined in: [src/services/nft.service.ts:202](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/nft.service.ts#L202)

NFT balance for an owner (ERC-721 collection total or ERC-1155 id-specific balance).

#### Parameters

##### contractAddress

`` `0x${string}` ``

NFT collection contract

##### ownerAddress

`` `0x${string}` ``

Holder wallet address

##### tokenId?

`string`

Required for ERC-1155; ignored for ERC-721 collection balance

#### Returns

`Promise`\<\{ `balance`: `string`; `contractAddress`: `` `0x${string}` ``; `network`: `"mainnet"`; `ownerAddress`: `` `0x${string}` ``; `standard`: `"ERC721"`; `tokenId`: `string` \| `null`; \} \| \{ `balance`: `string`; `contractAddress`: `` `0x${string}` ``; `network`: `"mainnet"`; `ownerAddress`: `` `0x${string}` ``; `standard`: `"ERC1155"`; `tokenId`: `string`; \}\>

Balance as decimal string and detected standard

#### Throws

When ERC-1155 is detected but `tokenId` is omitted

***

### getNftInfo()

> **getNftInfo**(`contractAddress`, `tokenId`): `Promise`\<\{ `attributes`: \{ \}; `collection`: \{ `name`: `string`; `symbol`: `string`; `totalSupply`: `string` \| `undefined`; \}; `contractAddress`: `` `0x${string}` ``; `description`: `string` \| `undefined`; `image`: `string` \| `undefined`; `metadata`: `Record`\<`string`, `unknown`\> \| `null`; `metadataUri`: `string` \| `null`; `name`: `string`; `network`: `"mainnet"`; `owner`: `` `0x${string}` `` \| `null`; `standard`: `NftStandard`; `tokenId`: `string`; \}\>

Defined in: [src/services/nft.service.ts:92](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/nft.service.ts#L92)

Collection and token metadata for an ERC-721 or ERC-1155 contract.

#### Parameters

##### contractAddress

`` `0x${string}` ``

NFT collection contract

##### tokenId

`string`

Token id as decimal string

#### Returns

`Promise`\<\{ `attributes`: \{ \}; `collection`: \{ `name`: `string`; `symbol`: `string`; `totalSupply`: `string` \| `undefined`; \}; `contractAddress`: `` `0x${string}` ``; `description`: `string` \| `undefined`; `image`: `string` \| `undefined`; `metadata`: `Record`\<`string`, `unknown`\> \| `null`; `metadataUri`: `string` \| `null`; `name`: `string`; `network`: `"mainnet"`; `owner`: `` `0x${string}` `` \| `null`; `standard`: `NftStandard`; `tokenId`: `string`; \}\>

Standard, owner, collection info, and fetched JSON metadata when available

#### Throws

When the address is not a deployed NFT contract
