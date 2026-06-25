[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / CeloAgentSnapshot

# Interface: CeloAgentSnapshot

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:154

## Properties

### agentId

> **agentId**: `number`

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:156

***

### agentWallet

> **agentWallet**: `string`

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:160

Operational wallet (may equal `owner` unless `setAgentWallet` was used).

***

### chain

> **chain**: `"celo"`

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:155

***

### explorer

> **explorer**: `object`

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:167

#### celoscan

> **celoscan**: `string`

#### eightthousandfourscan

> **eightthousandfourscan**: `string`

***

### owner

> **owner**: `string`

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:158

ERC-721 owner = the registry NFT owner.

***

### registration

> **registration**: `CeloAgentRegistration` \| `null`

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:163

***

### registrationError?

> `optional` **registrationError?**: `string`

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:165

Set when registration JSON could not be fetched or parsed.

***

### reputation

> **reputation**: `CeloAgentReputation` \| `null`

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:166

***

### tokenURI

> **tokenURI**: `string`

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:162

Raw `tokenURI` as stored on-chain. May be `https://…`, `data:…`, `ipfs://…`.
