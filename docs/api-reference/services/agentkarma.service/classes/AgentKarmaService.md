[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/agentkarma.service](../README.md) / AgentKarmaService

# Class: AgentKarmaService

Defined in: [src/services/agentkarma.service.ts:77](https://github.com/andrewkimjoseph/celina-sdk/blob/2666667daf96a6fd5a7d6a6940f387cab3e7887d/src/services/agentkarma.service.ts#L77)

Read-only AgentKarma reputation insight for Celo agents.

Exposed from `createCelinaClient()` as `client.agentKarma`.

## Constructors

### Constructor

> **new AgentKarmaService**(`config?`): `AgentKarmaService`

Defined in: [src/services/agentkarma.service.ts:83](https://github.com/andrewkimjoseph/celina-sdk/blob/2666667daf96a6fd5a7d6a6940f387cab3e7887d/src/services/agentkarma.service.ts#L83)

#### Parameters

##### config?

`ClientConfig` = `{}`

#### Returns

`AgentKarmaService`

## Properties

### chain

> `readonly` **chain**: `"celo"`

Defined in: [src/services/agentkarma.service.ts:81](https://github.com/andrewkimjoseph/celina-sdk/blob/2666667daf96a6fd5a7d6a6940f387cab3e7887d/src/services/agentkarma.service.ts#L81)

This adapter only ever talks to AgentKarma on the Celo chain.

## Accessors

### baseUrl

#### Get Signature

> **get** **baseUrl**(): `string`

Defined in: [src/services/agentkarma.service.ts:91](https://github.com/andrewkimjoseph/celina-sdk/blob/2666667daf96a6fd5a7d6a6940f387cab3e7887d/src/services/agentkarma.service.ts#L91)

AgentKarma API base URL the adapter reads from.

##### Returns

`string`

***

### catalog

#### Get Signature

> **get** **catalog**(): readonly `AgentKarmaToolDescriptor`[]

Defined in: [src/services/agentkarma.service.ts:96](https://github.com/andrewkimjoseph/celina-sdk/blob/2666667daf96a6fd5a7d6a6940f387cab3e7887d/src/services/agentkarma.service.ts#L96)

The canonical `@agentkarma/sdk/tools` descriptors this adapter draws from.

##### Returns

readonly `AgentKarmaToolDescriptor`[]

## Methods

### evaluateCounterparty()

> **evaluateCounterparty**(`wallet`, `policy?`): `Promise`\<[`CounterpartyDecision`](../interfaces/CounterpartyDecision.md)\>

Defined in: [src/services/agentkarma.service.ts:154](https://github.com/andrewkimjoseph/celina-sdk/blob/2666667daf96a6fd5a7d6a6940f387cab3e7887d/src/services/agentkarma.service.ts#L154)

Fetch Celo karma and run a local, explainable trust policy against it.
Pure evaluation — no routing, no signing, no side effects.

Always fetches BOTH faces so whichever face `policy.face` scores on
(`provider` by default) is guaranteed present — there is intentionally no
separate fetch-face knob to drift out of sync with the scored face.

#### Parameters

##### wallet

`string`

Celo `0x` counterparty address.

##### policy?

[`TrustPolicy`](../../../index/interfaces/TrustPolicy.md) = `{}`

Local trust policy (face, minScore, requireReceiptBacked, …).

#### Returns

`Promise`\<[`CounterpartyDecision`](../interfaces/CounterpartyDecision.md)\>

***

### getCeloAgent()

> **getCeloAgent**(`agentId`): `Promise`\<[`CeloAgentSnapshot`](../../../index/interfaces/CeloAgentSnapshot.md)\>

Defined in: [src/services/agentkarma.service.ts:138](https://github.com/andrewkimjoseph/celina-sdk/blob/2666667daf96a6fd5a7d6a6940f387cab3e7887d/src/services/agentkarma.service.ts#L138)

Resolve a Celo ERC-8004 agent (IdentityRegistry + ReputationRegistry)
and its AgentKarma reputation by numeric agent ID. Routed through the
shared catalog's `get_celo_agent` tool.

#### Parameters

##### agentId

`number`

Positive integer ERC-8004 agent ID on Celo.

#### Returns

`Promise`\<[`CeloAgentSnapshot`](../../../index/interfaces/CeloAgentSnapshot.md)\>

***

### getKarma()

> **getKarma**(`wallet`, `options?`): `Promise`\<[`KarmaSnapshot`](../../../index/interfaces/KarmaSnapshot.md)\>

Defined in: [src/services/agentkarma.service.ts:121](https://github.com/andrewkimjoseph/celina-sdk/blob/2666667daf96a6fd5a7d6a6940f387cab3e7887d/src/services/agentkarma.service.ts#L121)

Provider + Consumer karma for a Celo agent wallet. Always queries Celo.
Routed through the shared catalog's `get_karma` tool.

#### Parameters

##### wallet

`string`

Celo `0x` agent/wallet address to look up.

##### options?

[`GetKarmaOptions`](../interfaces/GetKarmaOptions.md) = `{}`

Optional face selector (defaults to `"both"`).

#### Returns

`Promise`\<[`KarmaSnapshot`](../../../index/interfaces/KarmaSnapshot.md)\>

***

### runCatalogTool()

> **runCatalogTool**(`name`, `input?`): `Promise`\<`unknown`\>

Defined in: [src/services/agentkarma.service.ts:108](https://github.com/andrewkimjoseph/celina-sdk/blob/2666667daf96a6fd5a7d6a6940f387cab3e7887d/src/services/agentkarma.service.ts#L108)

Execute a tool from the canonical `@agentkarma/sdk/tools` catalog,
Celo-pinned. This is how Celina consumes the SHARED tool catalog instead of
re-implementing each AgentKarma call: the names, schemas, arg-coercion, and
handler logic all live in `@agentkarma/sdk`. `chain` is forced to `'celo'`.

#### Parameters

##### name

`string`

A catalog tool name (e.g. `get_karma`, `get_celo_agent`).

##### input?

`Record`\<`string`, `unknown`\> = `{}`

Tool arguments; `chain` is overridden to `'celo'`.

#### Returns

`Promise`\<`unknown`\>
