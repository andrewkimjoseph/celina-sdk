[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/nft.service](../README.md) / NftService

# Class: NftService

Defined in: [src/services/nft.service.ts:33](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/nft.service.ts#L33)

## Constructors

### Constructor

> **new NftService**(`clientFactory`): `NftService`

Defined in: [src/services/nft.service.ts:34](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/nft.service.ts#L34)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`NftService`

## Methods

### getNftBalance()

> **getNftBalance**(`contractAddress`, `ownerAddress`, `tokenId?`): `Promise`\<\{ `balance`: `string`; `contractAddress`: `` `0x${string}` ``; `network`: `"mainnet"`; `ownerAddress`: `` `0x${string}` ``; `standard`: `"ERC721"`; `tokenId`: `string` \| `null`; \} \| \{ `balance`: `string`; `contractAddress`: `` `0x${string}` ``; `network`: `"mainnet"`; `ownerAddress`: `` `0x${string}` ``; `standard`: `"ERC1155"`; `tokenId`: `string`; \}\>

Defined in: [src/services/nft.service.ts:183](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/nft.service.ts#L183)

#### Parameters

##### contractAddress

`` `0x${string}` ``

##### ownerAddress

`` `0x${string}` ``

##### tokenId?

`string`

#### Returns

`Promise`\<\{ `balance`: `string`; `contractAddress`: `` `0x${string}` ``; `network`: `"mainnet"`; `ownerAddress`: `` `0x${string}` ``; `standard`: `"ERC721"`; `tokenId`: `string` \| `null`; \} \| \{ `balance`: `string`; `contractAddress`: `` `0x${string}` ``; `network`: `"mainnet"`; `ownerAddress`: `` `0x${string}` ``; `standard`: `"ERC1155"`; `tokenId`: `string`; \}\>

***

### getNftInfo()

> **getNftInfo**(`contractAddress`, `tokenId`): `Promise`\<\{ `attributes`: \{ \}; `collection`: \{ `name`: `string`; `symbol`: `string`; `totalSupply`: `string` \| `undefined`; \}; `contractAddress`: `` `0x${string}` ``; `description`: `string` \| `undefined`; `image`: `string` \| `undefined`; `metadata`: `Record`\<`string`, `unknown`\> \| `null`; `metadataUri`: `string` \| `null`; `name`: `string`; `network`: `"mainnet"`; `owner`: `` `0x${string}` `` \| `null`; `standard`: `NftStandard`; `tokenId`: `string`; \}\>

Defined in: [src/services/nft.service.ts:81](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/nft.service.ts#L81)

#### Parameters

##### contractAddress

`` `0x${string}` ``

##### tokenId

`string`

#### Returns

`Promise`\<\{ `attributes`: \{ \}; `collection`: \{ `name`: `string`; `symbol`: `string`; `totalSupply`: `string` \| `undefined`; \}; `contractAddress`: `` `0x${string}` ``; `description`: `string` \| `undefined`; `image`: `string` \| `undefined`; `metadata`: `Record`\<`string`, `unknown`\> \| `null`; `metadataUri`: `string` \| `null`; `name`: `string`; `network`: `"mainnet"`; `owner`: `` `0x${string}` `` \| `null`; `standard`: `NftStandard`; `tokenId`: `string`; \}\>
