[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / KarmaSnapshot

# Interface: KarmaSnapshot

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:84

`GET /api/v2/score/{wallet}` response.

`provider` and `consumer` are present according to the `face` query param.
`autonomy` ALWAYS appears (RFC invariant) regardless of which face was requested.

## Properties

### address

> **address**: `string`

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:86

Wallet address as queried (case-preserved on Solana, lowercased on EVM).

***

### autonomy

> **autonomy**: `AutonomyData`

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:98

***

### bond?

> `optional` **bond?**: `BondBlock`

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:110

Additive bonding block — bonds taken out ON this agent. Present only when
the wallet has bonds; omitted otherwise. A bond lifts confidence + Tier
presence ONLY, never the evidence-gated ceiling.

***

### consumer?

> `optional` **consumer?**: [`KarmaFaceData`](KarmaFaceData.md)

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:97

Present when face === 'consumer' or 'both'.

***

### face

> **face**: `"both"` \| `KarmaFace`

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:88

Face requested. `'both'` means both faces are present in the response.

***

### identity

> **identity**: `KarmaIdentity`

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:89

***

### lastActive

> **lastActive**: `string` \| `null`

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:93

ISO 8601 timestamp of most recent activity, or null when never observed.

***

### provider?

> `optional` **provider?**: [`KarmaFaceData`](KarmaFaceData.md)

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:95

Present when face === 'provider' or 'both'.

***

### succession?

> `optional` **succession?**: `SuccessionView`

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:104

Additive Dead Man's Switch block. Present only when the wallet has declared
a succession plan; omitted otherwise. OBSERVE-ONLY — does not lift the
trust ceiling. The pure `evaluateTrust()` reads it for liveness gates.

***

### surety?

> `optional` **surety?**: `SuretyView`

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:116

Additive orthogonal Surety Karma — this wallet's own underwriting record.
Present only when the wallet underwrites bonds; omitted otherwise. Never
folded into Provider/Consumer karma.

***

### txCount

> **txCount**: `number`

Defined in: node\_modules/@agentkarma/sdk/dist/types.d.ts:91

Number of indexed transactions for this wallet.
