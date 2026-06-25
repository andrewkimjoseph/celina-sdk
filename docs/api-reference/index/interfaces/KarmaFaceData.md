[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / KarmaFaceData

# Interface: KarmaFaceData

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:54

## Properties

### confidenceBadge

> **confidenceBadge**: `ConfidenceBadge` \| `null`

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:58

***

### hasSignal

> **hasSignal**: `boolean`

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:64

Whether this face actually has signal worth reading. False = the wallet has no evidence on this face.

***

### metrics

> **metrics**: `Record`\<`string`, `number`\> \| `null`

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:60

Per-face metric breakdown (success_rate, diversity, etc.). Shape evolves over time; treat as opaque map.

***

### score

> **score**: `number`

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:56

0–100 integer (server rounds before serializing).

***

### tierAggregates

> **tierAggregates**: `Partial`\<`Record`\<`"tier1"` \| `"tier2"` \| `"tier3"` \| `"tier4"`, `number` \| `null`\>\> \| `null`

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:62

Per-tier aggregate values. `null` keys mean the tier had no signal for this face.

***

### trustTier

> **trustTier**: `TrustTier` \| `null`

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:57
