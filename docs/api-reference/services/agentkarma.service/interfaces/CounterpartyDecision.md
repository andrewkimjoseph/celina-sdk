[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/agentkarma.service](../README.md) / CounterpartyDecision

# Interface: CounterpartyDecision

Defined in: [src/services/agentkarma.service.ts:48](https://github.com/andrewkimjoseph/celina-sdk/blob/852f4654b3367c2e99db65ab17e2cfcd145a3d0e/src/services/agentkarma.service.ts#L48)

Result of a local counterparty trust evaluation.

## Properties

### chain

> **chain**: `"celo"`

Defined in: [src/services/agentkarma.service.ts:50](https://github.com/andrewkimjoseph/celina-sdk/blob/852f4654b3367c2e99db65ab17e2cfcd145a3d0e/src/services/agentkarma.service.ts#L50)

Always `"celo"` — this adapter is Celo-pinned.

***

### decision

> **decision**: [`TrustDecision`](../../../index/interfaces/TrustDecision.md)

Defined in: [src/services/agentkarma.service.ts:54](https://github.com/andrewkimjoseph/celina-sdk/blob/852f4654b3367c2e99db65ab17e2cfcd145a3d0e/src/services/agentkarma.service.ts#L54)

Explainable allow/deny from the local policy (no network, pure function).

***

### snapshot

> **snapshot**: [`KarmaSnapshot`](../../../index/interfaces/KarmaSnapshot.md)

Defined in: [src/services/agentkarma.service.ts:56](https://github.com/andrewkimjoseph/celina-sdk/blob/852f4654b3367c2e99db65ab17e2cfcd145a3d0e/src/services/agentkarma.service.ts#L56)

The karma snapshot the decision was computed from.

***

### wallet

> **wallet**: `string`

Defined in: [src/services/agentkarma.service.ts:52](https://github.com/andrewkimjoseph/celina-sdk/blob/852f4654b3367c2e99db65ab17e2cfcd145a3d0e/src/services/agentkarma.service.ts#L52)

The wallet that was evaluated.
