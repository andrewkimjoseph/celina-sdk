[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / TrustDecision

# Interface: TrustDecision

Defined in: node\_modules/@agentkarma/sdk/dist/policy.d.ts:88

## Properties

### allowed

> **allowed**: `boolean`

Defined in: node\_modules/@agentkarma/sdk/dist/policy.d.ts:90

Final allow/deny. False ⇒ at least one reason is populated.

***

### observed

> **observed**: `TrustObserved`

Defined in: node\_modules/@agentkarma/sdk/dist/policy.d.ts:98

Snapshot of what was observed, for logging / audit.

***

### reasons

> **reasons**: `string`[]

Defined in: node\_modules/@agentkarma/sdk/dist/policy.d.ts:96

Human-readable rejection reasons. Empty array when `allowed === true`.
Each reason references the policy field it tripped, so callers can
surface them to operators or log them.
