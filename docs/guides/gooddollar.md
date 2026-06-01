# GoodDollar UBI on Celo

Check Identity whitelist status, daily UBI entitlement, and prepare unsigned `claim()` transactions against [UBISchemeV2](https://docs.gooddollar.org/for-developers/core-contracts) on Celo mainnet.

| Contract | Address |
|----------|---------|
| IdentityV4 | `0xC361A6E67822a0EDc17D899227dd9FC50BD62F42` |
| UBISchemeV2 | `0x43d72Ff17701B2DA814620735C39C620Ce0ea4A1` |
| G$ token | `0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A` (registry: `GoodDollar`, `G$`) |

Export constants from the SDK:

```ts
import {
  GOODDOLLAR_IDENTITY_ADDRESS,
  GOODDOLLAR_UBI_SCHEME_ADDRESS,
} from "@andrewkimjoseph/celina-sdk";
```

## Whitelist status

```ts
const info = await celina.gooddollar.getWhitelistingInfo("0xYourAddress");
// info.isCurrentlyWhitelisted, info.reverification, info.statusLabel, …
```

Uses IdentityV4 `identities`, `isWhitelisted`, and reverification timeline fields.

## Daily UBI entitlement

Before claiming, check eligibility (whitelist root, claimable G$, scheme state):

```ts
const eligibility = await celina.gooddollar.getUbiClaimEligibility("0xYourAddress");

if (eligibility.isEligibleToClaim) {
  console.log(eligibility.claimableAmountFormatted); // e.g. "12.5 G$"
} else {
  console.log(eligibility.reasons); // e.g. ["already claimed today"]
}
```

Key fields:

| Field | Meaning |
|-------|---------|
| `whitelistedRoot` | Verified identity root (connected wallets resolve here) |
| `isConnectedWallet` | `true` when the checked address maps to a different root |
| `isEligibleToClaim` | `true` when `claim()` should succeed today |
| `claimableAmountFormatted` | Today's G$ amount from `checkEntitlement` |
| `alreadyClaimedToday` | One claim per identity per day |
| `reasons` | Human-readable blockers when not eligible |

Entitlement uses Identity `getWhitelistedRoot` (same check as `UBISchemeV2.claim()`).

## Prepare claim (unsigned)

```ts
const flow = await celina.gooddollar.prepareClaimUbi("0xFrom");
// flow.steps → single UBISchemeV2 claim() step with CELINA calldata tag
```

`prepareClaimUbi`:

1. Re-runs eligibility checks (throws with `reasons` if not eligible)
2. Simulates gas for `claim()`
3. Returns a one-step `SerializedPreparedFlow`

Sign and broadcast with wagmi:

```ts
for (const step of flow.steps) {
  await sendTransactionAsync({
    to: step.to,
    data: step.data,
    value: step.value ? BigInt(step.value) : undefined,
  });
}
```

G$ is sent to `msg.sender` (the signing wallet). Gas is paid in native CELO.

## MCP tool mapping

| SDK method | MCP tool (stdio) | Hosted MCP |
|------------|------------------|------------|
| `getWhitelistingInfo` | `get_gooddollar_whitelisting_info` | read |
| `getUbiClaimEligibility` | `get_gooddollar_ubi_entitlement` | read |
| `prepareClaimUbi` | — (unsigned; use SDK or Celeste AI) | — |
| — | `claim_daily_gooddollar_ubi` | write (requires `CELO_PRIVATE_KEY`, stdio only) |

[Celeste AI](https://github.com/andrewkimjoseph/celeste-ai) exposes `prepare_claim_daily_gooddollar_ubi` for browser wallet signing.

## Rules

- **One claim per identity per day** — connected wallet addresses share the same root; claiming from any connected address counts once.
- **Reverification** — overdue identity reverification blocks eligibility even if the wallet was previously whitelisted.
- **Paused scheme** — `schemePaused: true` means no claims until the avatar unpauses UBISchemeV2.

## Related

- [wagmi integration](wagmi-integration.md)
- [Prepared flows](../concepts/prepared-flows.md)
- [Uniswap v4](uniswap.md) — swap G$ to other stables
- [GoodDollarService API](../api-reference/services/gooddollar.service/classes/GoodDollarService.md)
- [GoodDollar core contracts](https://docs.gooddollar.org/for-developers/core-contracts)
