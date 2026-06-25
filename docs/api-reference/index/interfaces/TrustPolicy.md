[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / TrustPolicy

# Interface: TrustPolicy

Defined in: node\_modules/@agentkarma/sdk/dist/policy.d.ts:13

## Properties

### acceptedConfidenceBadges?

> `optional` **acceptedConfidenceBadges?**: `ConfidenceBadge`[]

Defined in: node\_modules/@agentkarma/sdk/dist/policy.d.ts:19

Accept only these confidence badges on the chosen face. Empty/omitted = accept all.

***

### face?

> `optional` **face?**: `KarmaFace`

Defined in: node\_modules/@agentkarma/sdk/dist/policy.d.ts:15

Which face to evaluate. Defaults to 'provider'.

***

### minAutonomyScore?

> `optional` **minAutonomyScore?**: `number`

Defined in: node\_modules/@agentkarma/sdk/dist/policy.d.ts:29

Reject when the autonomy score is below this value. null autonomy is treated as failing this check.

***

### minBondedUSDC?

> `optional` **minBondedUSDC?**: `number`

Defined in: node\_modules/@agentkarma/sdk/dist/policy.d.ts:61

Require the total USDC currently bonded (open bonds) to be at least this.
Demo bonds are EXCLUDED from this total — borrowed-on-paper capital must
not satisfy a real-money gate.

***

### minScore?

> `optional` **minScore?**: `number`

Defined in: node\_modules/@agentkarma/sdk/dist/policy.d.ts:17

Reject when the chosen face's score is below this value (0-100).

***

### minTxCount?

> `optional` **minTxCount?**: `number`

Defined in: node\_modules/@agentkarma/sdk/dist/policy.d.ts:21

Require at least this many on-chain transactions observed.

***

### rejectAutonomyLabels?

> `optional` **rejectAutonomyLabels?**: `AutonomyLabel`[]

Defined in: node\_modules/@agentkarma/sdk/dist/policy.d.ts:27

Reject when the autonomy label matches one of these. (e.g. reject 'agent-like' for human-only flows.)

***

### rejectLapsed?

> `optional` **rejectLapsed?**: `boolean`

Defined in: node\_modules/@agentkarma/sdk/dist/policy.d.ts:49

Reject when the succession plan has lapsed or is lapsing — a strong signal
the agent may be abandoned. A missing succession block does NOT trip this
(no plan ≠ lapsed); use `requireLiveSuccession` to demand a plan.

***

### rejectRecentBondFailure?

> `optional` **rejectRecentBondFailure?**: `boolean`

Defined in: node\_modules/@agentkarma/sdk/dist/policy.d.ts:66

Reject when the agent has a recent bond failure (`resolved_failure`). A
blown bond is a real negative delivery signal. Demo bonds are ignored.

***

### requireBonded?

> `optional` **requireBonded?**: `boolean`

Defined in: node\_modules/@agentkarma/sdk/dist/policy.d.ts:55

Require at least one currently-active (open) bond on the agent. Borrowed
capital lifts confidence, NOT the trust ceiling — this gate is about
presence of skin-in-the-game, evaluated independently of score.

***

### requireLiveSuccession?

> `optional` **requireLiveSuccession?**: `boolean`

Defined in: node\_modules/@agentkarma/sdk/dist/policy.d.ts:43

Require a live succession plan. Passes only when the snapshot carries a
succession block whose derived status is `declared` or `live`. A missing
succession block fails this gate (no plan = not live). OBSERVE-ONLY: this
reads AK's recorded liveness; AK never receives a real heartbeat.

***

### requireReceiptBacked?

> `optional` **requireReceiptBacked?**: `boolean`

Defined in: node\_modules/@agentkarma/sdk/dist/policy.d.ts:25

Require at least one Tier-1 receipt-backed signal somewhere on the chosen face.

***

### requireSeen?

> `optional` **requireSeen?**: `boolean`

Defined in: node\_modules/@agentkarma/sdk/dist/policy.d.ts:36

Reject when the wallet has never been observed active. Defaults to false —
a wallet with no recorded activity isn't automatically untrustworthy; the
face's score and confidence badge already encode that. Flip on when you
specifically want a "must have shown up before" gate.

***

### requireTiers?

> `optional` **requireTiers?**: `SignalTier`[]

Defined in: node\_modules/@agentkarma/sdk/dist/policy.d.ts:23

Require non-null signal in each of these tiers (per the chosen face's tierAggregates).
