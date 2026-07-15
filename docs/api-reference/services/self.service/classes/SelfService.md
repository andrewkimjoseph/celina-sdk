[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/self.service](../README.md) / SelfService

# Class: SelfService

Defined in: [src/services/self.service.ts:120](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/services/self.service.ts#L120)

## Constructors

### Constructor

> **new SelfService**(`clientFactory`, `config`): `SelfService`

Defined in: [src/services/self.service.ts:121](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/services/self.service.ts#L121)

#### Parameters

##### clientFactory

`CeloClientFactory`

##### config

`Pick`\<[`SdkConfig`](../../../index/interfaces/SdkConfig.md), `"selfAgentPrivateKey"` \| `"selfApiBase"` \| `"attributionTags"`\>

#### Returns

`SelfService`

## Methods

### authenticatedFetch()

> **authenticatedFetch**(`params`): `Promise`\<\{ `body`: `string`; `status`: `number`; `truncated`: `boolean`; \}\>

Defined in: [src/services/self.service.ts:923](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/services/self.service.ts#L923)

#### Parameters

##### params

###### body?

`string`

###### contentType?

`string`

###### method

`string`

###### url

`string`

#### Returns

`Promise`\<\{ `body`: `string`; `status`: `number`; `truncated`: `boolean`; \}\>

***

### checkRegistration()

> **checkRegistration**(`sessionId`): `Promise`\<\{ `agent_address?`: `undefined`; `agent_id?`: `undefined`; `message`: `string`; `private_key_hex?`: `undefined`; `proof_expires_at?`: `undefined`; `status`: `"deregistered"`; `tx_hash?`: `undefined`; \} \| \{ `agent_address?`: `undefined`; `agent_id?`: `undefined`; `message`: `string`; `private_key_hex?`: `undefined`; `proof_expires_at`: `string`; `status`: `"refreshed"`; `tx_hash?`: `undefined`; \} \| \{ `agent_address`: `string`; `agent_id`: `number`; `message`: `string`; `private_key_hex`: `string`; `proof_expires_at?`: `undefined`; `status`: `"verified"`; `tx_hash`: `string` \| `undefined`; \} \| \{ `agent_address?`: `undefined`; `agent_id?`: `undefined`; `message`: `string`; `private_key_hex?`: `undefined`; `proof_expires_at?`: `undefined`; `status`: `"pending"`; `tx_hash?`: `undefined`; \} \| \{ `agent_address?`: `undefined`; `agent_id?`: `undefined`; `message`: `string`; `private_key_hex?`: `undefined`; `proof_expires_at?`: `undefined`; `status`: `"expired"`; `tx_hash?`: `undefined`; \}\>

Defined in: [src/services/self.service.ts:736](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/services/self.service.ts#L736)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<\{ `agent_address?`: `undefined`; `agent_id?`: `undefined`; `message`: `string`; `private_key_hex?`: `undefined`; `proof_expires_at?`: `undefined`; `status`: `"deregistered"`; `tx_hash?`: `undefined`; \} \| \{ `agent_address?`: `undefined`; `agent_id?`: `undefined`; `message`: `string`; `private_key_hex?`: `undefined`; `proof_expires_at`: `string`; `status`: `"refreshed"`; `tx_hash?`: `undefined`; \} \| \{ `agent_address`: `string`; `agent_id`: `number`; `message`: `string`; `private_key_hex`: `string`; `proof_expires_at?`: `undefined`; `status`: `"verified"`; `tx_hash`: `string` \| `undefined`; \} \| \{ `agent_address?`: `undefined`; `agent_id?`: `undefined`; `message`: `string`; `private_key_hex?`: `undefined`; `proof_expires_at?`: `undefined`; `status`: `"pending"`; `tx_hash?`: `undefined`; \} \| \{ `agent_address?`: `undefined`; `agent_id?`: `undefined`; `message`: `string`; `private_key_hex?`: `undefined`; `proof_expires_at?`: `undefined`; `status`: `"expired"`; `tx_hash?`: `undefined`; \}\>

***

### deregisterAgent()

> **deregisterAgent**(): `Promise`\<\{ `deep_link`: `string`; `expires_at`: `string`; `instructions`: `string`; `qr_code_url`: `string`; `qr_url`: `string`; `session_id`: `string`; \}\>

Defined in: [src/services/self.service.ts:867](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/services/self.service.ts#L867)

#### Returns

`Promise`\<\{ `deep_link`: `string`; `expires_at`: `string`; `instructions`: `string`; `qr_code_url`: `string`; `qr_url`: `string`; `session_id`: `string`; \}\>

***

### getIdentity()

> **getIdentity**(): `Promise`\<\{ `address`: `` `0x${string}` ``; `agentCount`: `number`; `agentId`: `number`; `agentKey`: `` `0x${string}` ``; `credentials_summary`: `string`; `days_until_expiry`: `number`; `expiry_warning?`: `string`; `is_expired`: `boolean`; `is_expiring_soon`: `boolean`; `isVerified`: `boolean`; `network`: `"mainnet"`; `nullifier`: `number`; `proof_expires_at`: `string` \| `null`; `registered`: `true`; `sibling_agent_ids`: `number`[]; `verificationStrength`: `string`; \} \| \{ `address`: `` `0x${string}` ``; `message`: `string`; `network`: `"mainnet"`; `registered`: `false`; \}\>

Defined in: [src/services/self.service.ts:689](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/services/self.service.ts#L689)

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` ``; `agentCount`: `number`; `agentId`: `number`; `agentKey`: `` `0x${string}` ``; `credentials_summary`: `string`; `days_until_expiry`: `number`; `expiry_warning?`: `string`; `is_expired`: `boolean`; `is_expiring_soon`: `boolean`; `isVerified`: `boolean`; `network`: `"mainnet"`; `nullifier`: `number`; `proof_expires_at`: `string` \| `null`; `registered`: `true`; `sibling_agent_ids`: `number`[]; `verificationStrength`: `string`; \} \| \{ `address`: `` `0x${string}` ``; `message`: `string`; `network`: `"mainnet"`; `registered`: `false`; \}\>

***

### lookupAgent()

> **lookupAgent**(`agentId`): `Promise`\<\{ `credentialsSummary`: `string`; `days_until_expiry`: `number`; `is_expired`: `boolean`; `is_expiring_soon`: `boolean`; `network`: `"mainnet"`; `proof_expires_at`: `string` \| `null`; \}\>

Defined in: [src/services/self.service.ts:358](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/services/self.service.ts#L358)

#### Parameters

##### agentId

`number`

#### Returns

`Promise`\<\{ `credentialsSummary`: `string`; `days_until_expiry`: `number`; `is_expired`: `boolean`; `is_expiring_soon`: `boolean`; `network`: `"mainnet"`; `proof_expires_at`: `string` \| `null`; \}\>

***

### refreshProof()

> **refreshProof**(`params?`): `Promise`\<\{ `deep_link`: `string`; `expires_at`: `string`; `instructions`: `string`; `qr_code_url`: `string`; `qr_url`: `string`; `session_id`: `string`; \}\>

Defined in: [src/services/self.service.ts:832](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/services/self.service.ts#L832)

#### Parameters

##### params?

###### agentId?

`number`

#### Returns

`Promise`\<\{ `deep_link`: `string`; `expires_at`: `string`; `instructions`: `string`; `qr_code_url`: `string`; `qr_url`: `string`; `session_id`: `string`; \}\>

***

### registerAgent()

> **registerAgent**(`params?`): `Promise`\<\{ `deep_link`: `string`; `expires_at`: `string`; `instructions`: `string`; `qr_code_url`: `string`; `qr_url`: `string`; `session_id`: `string`; \}\>

Defined in: [src/services/self.service.ts:704](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/services/self.service.ts#L704)

#### Parameters

##### params?

[`RegisterSelfAgentParams`](../interfaces/RegisterSelfAgentParams.md) = `{}`

#### Returns

`Promise`\<\{ `deep_link`: `string`; `expires_at`: `string`; `instructions`: `string`; `qr_code_url`: `string`; `qr_url`: `string`; `session_id`: `string`; \}\>

***

### signRequest()

> **signRequest**(`params`): `Promise`\<\{ `headers`: \{ `x-self-agent-address`: `` `0x${string}` ``; `x-self-agent-signature`: `` `0x${string}` ``; `x-self-agent-timestamp`: `string`; \}; `instructions`: `string`; \}\>

Defined in: [src/services/self.service.ts:894](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/services/self.service.ts#L894)

#### Parameters

##### params

###### body?

`string`

###### method

`string`

###### url

`string`

#### Returns

`Promise`\<\{ `headers`: \{ `x-self-agent-address`: `` `0x${string}` ``; `x-self-agent-signature`: `` `0x${string}` ``; `x-self-agent-timestamp`: `string`; \}; `instructions`: `string`; \}\>

***

### taggedCalldata()

> `protected` **taggedCalldata**(`data`): `` `0x${string}` ``

Defined in: [src/services/self.service.ts:964](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/services/self.service.ts#L964)

Reserved for future on-chain Self writes (e.g. metadata updates).

#### Parameters

##### data

`` `0x${string}` ``

#### Returns

`` `0x${string}` ``

***

### verifyAgent()

> **verifyAgent**(`params`): `Promise`\<\{ `agent_address`: `` `0x${string}` ``; `network`: `"mainnet"`; `reason`: `string`; `verified`: `boolean`; \} \| \{ `agent_address`: `` `0x${string}` ``; `agent_id`: `number`; `credentials`: \{ `nationality`: `string` \| `undefined`; `ofac_clear`: `boolean`; `older_than`: `number`; \}; `days_until_expiry`: `number`; `is_expiring_soon`: `boolean`; `network`: `"mainnet"`; `proof_expires_at`: `string` \| `null`; `reason`: `string`; `sibling_agent_ids`: `number`[]; `verification_strength`: `string`; `verified`: `boolean`; \} \| \{ `agent_address`: `` `0x${string}` ``; `agent_count`: `number`; `agent_id`: `number`; `credentials`: \{ `nationality`: `string` \| `undefined`; `ofac_clear`: `boolean`; `older_than`: `number`; \}; `days_until_expiry`: `number`; `is_expiring_soon`: `boolean`; `is_proof_fresh`: `boolean`; `network`: `"mainnet"`; `proof_expires_at`: `string` \| `null`; `reason?`: `undefined`; `registered_at`: `number`; `sibling_agent_ids`: `number`[]; `verification_strength`: `string`; `verified`: `boolean`; \}\>

Defined in: [src/services/self.service.ts:197](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/services/self.service.ts#L197)

#### Parameters

##### params

[`VerifySelfAgentParams`](../interfaces/VerifySelfAgentParams.md)

#### Returns

`Promise`\<\{ `agent_address`: `` `0x${string}` ``; `network`: `"mainnet"`; `reason`: `string`; `verified`: `boolean`; \} \| \{ `agent_address`: `` `0x${string}` ``; `agent_id`: `number`; `credentials`: \{ `nationality`: `string` \| `undefined`; `ofac_clear`: `boolean`; `older_than`: `number`; \}; `days_until_expiry`: `number`; `is_expiring_soon`: `boolean`; `network`: `"mainnet"`; `proof_expires_at`: `string` \| `null`; `reason`: `string`; `sibling_agent_ids`: `number`[]; `verification_strength`: `string`; `verified`: `boolean`; \} \| \{ `agent_address`: `` `0x${string}` ``; `agent_count`: `number`; `agent_id`: `number`; `credentials`: \{ `nationality`: `string` \| `undefined`; `ofac_clear`: `boolean`; `older_than`: `number`; \}; `days_until_expiry`: `number`; `is_expiring_soon`: `boolean`; `is_proof_fresh`: `boolean`; `network`: `"mainnet"`; `proof_expires_at`: `string` \| `null`; `reason?`: `undefined`; `registered_at`: `number`; `sibling_agent_ids`: `number`[]; `verification_strength`: `string`; `verified`: `boolean`; \}\>

***

### verifyRequest()

> **verifyRequest**(`params`): `Promise`\<\{ `agent_address?`: `undefined`; `agent_count?`: `undefined`; `agent_id?`: `undefined`; `credentials?`: `undefined`; `note?`: `undefined`; `nullifier?`: `undefined`; `reason`: `string`; `valid`: `boolean`; \} \| \{ `agent_address`: `` `0x${string}` ``; `agent_count?`: `undefined`; `agent_id?`: `undefined`; `credentials?`: `undefined`; `note?`: `undefined`; `nullifier?`: `undefined`; `reason`: `string`; `valid`: `boolean`; \} \| \{ `agent_address`: `` `0x${string}` ``; `agent_count?`: `undefined`; `agent_id`: `number`; `credentials?`: `undefined`; `note?`: `undefined`; `nullifier?`: `undefined`; `reason`: `string`; `valid`: `boolean`; \} \| \{ `agent_address`: `` `0x${string}` ``; `agent_count`: `number`; `agent_id`: `number`; `credentials`: \{ `nationality`: `string` \| `undefined`; `ofac_clear`: `boolean`; `older_than`: `number`; \}; `note`: `string`; `nullifier`: `number`; `reason?`: `undefined`; `valid`: `boolean`; \}\>

Defined in: [src/services/self.service.ts:394](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/services/self.service.ts#L394)

#### Parameters

##### params

[`VerifySelfRequestParams`](../interfaces/VerifySelfRequestParams.md)

#### Returns

`Promise`\<\{ `agent_address?`: `undefined`; `agent_count?`: `undefined`; `agent_id?`: `undefined`; `credentials?`: `undefined`; `note?`: `undefined`; `nullifier?`: `undefined`; `reason`: `string`; `valid`: `boolean`; \} \| \{ `agent_address`: `` `0x${string}` ``; `agent_count?`: `undefined`; `agent_id?`: `undefined`; `credentials?`: `undefined`; `note?`: `undefined`; `nullifier?`: `undefined`; `reason`: `string`; `valid`: `boolean`; \} \| \{ `agent_address`: `` `0x${string}` ``; `agent_count?`: `undefined`; `agent_id`: `number`; `credentials?`: `undefined`; `note?`: `undefined`; `nullifier?`: `undefined`; `reason`: `string`; `valid`: `boolean`; \} \| \{ `agent_address`: `` `0x${string}` ``; `agent_count`: `number`; `agent_id`: `number`; `credentials`: \{ `nationality`: `string` \| `undefined`; `ofac_clear`: `boolean`; `older_than`: `number`; \}; `note`: `string`; `nullifier`: `number`; `reason?`: `undefined`; `valid`: `boolean`; \}\>
