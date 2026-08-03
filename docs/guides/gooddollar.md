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

## Identity link

```ts
const link = await celina.gooddollar.getIdentityLink("0xYourAddress");
// link.whitelistedRoot, link.isConnectedWallet, link.connectedTo, link.isWhitelisted
```

Use this when you need to know how a wallet maps to GoodDollar IdentityV4 before calling whitelist or UBI tools.

## Whitelist status

```ts
const info = await celina.gooddollar.getWhitelistingInfo("0xYourAddress");
// info.isWhitelisted, info.whitelistedRoot, info.checkedAddress, info.reverification, …
```

Resolves connected wallets via Identity `getWhitelistedRoot`. Identity reads (`identities`, `isWhitelisted`, reverification) run on the **root** (`checkedAddress`), not the literal connected address.

| Field | Meaning |
|-------|---------|
| `address` | Wallet you queried |
| `whitelistedRoot` | Verified identity root, or `null` |
| `isConnectedWallet` | `true` when the queried wallet maps to a different root |
| `checkedAddress` | Identity used for whitelist/reverification reads |
| `isWhitelisted` | Live whitelist status on `checkedAddress` |

## Daily UBI entitlement

Before claiming, check eligibility (whitelist root, claimable G$, scheme state):

```ts
const eligibility = await celina.gooddollar.getUbiClaimEligibility("0xYourAddress");

if (eligibility.isEligibleToClaim) {
  console.log(eligibility.claimableAmountFormatted); // e.g. "12.5 G$"
} else if (eligibility.inClaimCooldown) {
  console.log(eligibility.nextClaimAvailableIn); // e.g. "5 hours 12 minutes"
  console.log(eligibility.reasons);
} else {
  console.log(eligibility.reasons);
}
```

Key fields:

| Field | Meaning |
|-------|---------|
| `whitelistedRoot` | Verified identity root (connected wallets resolve here) |
| `isConnectedWallet` | `true` when the checked address maps to a different root |
| `isEligibleToClaim` | `true` when on-chain `claim()` should succeed (not raw `checkEntitlement` alone) |
| `claimableAmountFormatted` | Amount from `checkEntitlement` (may be `estimateNextDailyUBI` during day-roll) |
| `alreadyClaimedToday` | Claimed for the current on-chain period; `false` during day-roll window |
| `inClaimCooldown` | Same as `alreadyClaimedToday` when a root exists; `false` during day-roll window |
| `lastClaimedAt` | ISO UTC of the root's last successful claim, or `null` |
| `nextClaimAvailableAt` | ISO UTC when the next UBI period starts |
| `secondsUntilNextClaim` | Seconds until `nextClaimAvailableAt` |
| `nextClaimAvailableIn` | Human-readable countdown (hours and minutes) |
| `ubiPeriodDay` | Current `currentDay` from UBISchemeV2 |
| `reasons` | Prioritized blockers; cooldown suppresses misleading identity errors |
| `identity.checkedAddress` | Root used for whitelist/reverification (not the connected wallet) |
| `identity.isWhitelisted` | Live whitelist status on the root |

Entitlement uses Identity `getWhitelistedRoot` (same check as `UBISchemeV2.claim()`). Identity status in the entitlement response is evaluated on the **root**, so connected wallets do not surface stale whitelist data on the linked address.

**UBI period vs rolling 24h:** Claims reset at the next UBI day boundary (`periodStart + (day + 1) × 86400`, aligned to 12:00 UTC), not `lastClaimed + 24 hours`. The countdown fields reflect that boundary.

**Day-roll window:** After the UTC period boundary, `currentDay` on-chain may lag until the first `claim()` calls `setDay()`. During that window `hasClaimed` can still be `true` while `checkEntitlement` returns a positive estimate — `isEligibleToClaim` accounts for this and matches on-chain `claim()` behavior.

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

## Face verify vs connect

There are two distinct ways a wallet becomes GoodDollar-verified — do not confuse them:

| Path | What it does | Tool |
|------|--------------|------|
| **Face verify** | Makes the signer wallet a **new** whitelisted IdentityV4 root (first-time human verification) | `get_gooddollar_face_verification_link` |
| **Connect** | Links a **secondary** wallet to an **existing** verified root | `execute_connect_gooddollar_identity` |

Connect requires the signer (`CELO_PRIVATE_KEY`) to **be** the whitelisted root — the wallet you want to link is passed as `connected_account`, not the signer.

```ts
const guidance = await celina.gooddollar.getIdentityGuidance("0xYourAddress");
// guidance.recommendedAction: "face_verify" | "connect_secondary" | "already_verified" | "use_verified_root_to_connect"
// guidance.message — human-readable next step
```

| `recommendedAction` | Meaning |
|----------------------|---------|
| `face_verify` | Wallet is unverified and not connected to a root — use `get_gooddollar_face_verification_link` |
| `connect_secondary` | Wallet **is** the whitelisted root — face verification not needed; can call `execute_connect_gooddollar_identity` to link other wallets |
| `already_verified` | Wallet is connected to an existing root — humanness is inherited; no FV link needed |
| `use_verified_root_to_connect` | Reserved for future use; not currently returned by `deriveGoodDollarIdentityGuidance` |

If you already verified on wallet A and the current signer is wallet B: do not face-verify B. Set `CELO_PRIVATE_KEY` to wallet A and call `execute_connect_gooddollar_identity` with `connected_account` set to wallet B.

**Face verification link generation:** `celina.gooddollar.getFaceVerificationLink(...)` is a direct SDK method. Callers supply their own viem `publicClient` and `walletClient` (e.g. from wagmi in the browser or a Node signer in MCP). The SDK runs `getIdentityGuidance` first; when `shouldSkipFaceVerification(guidance)` is `true` (`connect_secondary` or `already_verified`), it returns `{ skipped: true, reason, guidance }` **without** calling citizen-sdk.

```ts
import { shouldSkipFaceVerification } from "@andrewkimjoseph/celina-sdk";

const result = await celina.gooddollar.getFaceVerificationLink({
  publicClient,
  walletClient,
  accountAddress: "0xYourAddress",
  callbackUrl: "https://your-app.example/callback",
});

if (result.skipped) {
  // result.guidance.message explains what to do instead
}
```

The MCP tool `get_gooddollar_face_verification_link` is a thin wrapper: it builds clients from `CELO_PRIVATE_KEY` / `SELF_AGENT_PRIVATE_KEY` and forwards them into this SDK method.

`prepareConnectIdentity` (→ `execute_connect_gooddollar_identity`) throws a guidance-aware error when the signer is not the whitelisted root — including the specific remediation for a *connected* wallet trying to connect another wallet (not allowed; only the root can).

## Reserve swaps (G$ ↔ USDm)

For **GoodDollar ↔ USDm**, use the on-chain **MentoBroker reserve** (bonding curve), not Uniswap. `get_swap_quote` auto-selects this route for G$ ↔ USDm pairs.

| Contract | Address |
|----------|---------|
| MentoBroker | `0x88de45906D4F5a57315c133620cfa484cB297541` |
| MentoExchangeProvider | `0x2fFBB49055d487DdBBb0C052Cd7c2a02A7971e41` |

```ts
const quote = await celina.gooddollar.getReserveQuote("GoodDollar", "USDm", "1000");
// quote.protocol === "gooddollar_reserve"

// Fixed output: how much G$ to receive 0.6 USDm?
const exactOut = await celina.gooddollar.getReserveQuote("GoodDollar", "USDm", "0.6", {
  amountSide: "out",
});
// exactOut.amountIn — G$ spend; exactOut.expectedOut === "0.6"

const flow = await celina.gooddollar.prepareReserveSwap(
  from,
  "GoodDollar",
  "USDm",
  "0.6",
  { amountSide: "out" },
);
// Same params as quote — 1–2 steps: optional ERC-20 approve + broker swapIn
```

Or use aggregated routing:

```ts
import { getSwapQuoteWithFallback } from "@andrewkimjoseph/celina-sdk/tools";

const best = await getSwapQuoteWithFallback(celina, "GoodDollar", "USDm", "1000");
// best.protocol === "gooddollar_reserve"
```

For other G$ pairs (e.g. G$ → USDT), Uniswap v4 remains the fallback when Mento FX has no route.

## Non-identity tools

These tools use the **literal wallet address** you pass. They do **not** resolve GoodDollar connected-wallet identity roots:

- `get_celo_balances`, `get_stablecoin_balances`, `get_token_balance`
- `get_gooddollar_reserve_quote`, `estimate_gooddollar_reserve_swap`, `execute_gooddollar_reserve_swap`, `prepare_gooddollar_reserve_swap`

A connected wallet's G$ balance is that wallet's on-chain balance, not the root's.

## MCP tool mapping

| SDK method | MCP tool (stdio) | Hosted MCP |
|------------|------------------|------------|
| `getIdentityLink` | `get_gooddollar_identity_link` | read |
| `getWhitelistingInfo` | `get_gooddollar_whitelisting_info` | read |
| `getIdentityGuidance` | — (used internally by face-verification pre-check) | — |
| `getUbiClaimEligibility` | `get_gooddollar_ubi_entitlement` | read |
| `getReserveQuote` | `get_gooddollar_reserve_quote` | read |
| `estimateReserveSwap` | `estimate_gooddollar_reserve_swap` | read* (*needs `CELO_PRIVATE_KEY` for gas sim) |
| `prepareReserveSwap` | `prepare_gooddollar_reserve_swap` | browser prepare |
| — | `execute_gooddollar_reserve_swap` | write (requires `CELO_PRIVATE_KEY`, stdio only) |
| `prepareClaimUbi` | — (unsigned; use SDK + wagmi in your app) | — |
| — | `claim_daily_gooddollar_ubi` | write (requires `CELO_PRIVATE_KEY`, stdio only) |
| — | `get_gooddollar_face_verification_link` | write* (stdio only; may return `skipped: true` — see [Face verify vs connect](#face-verify-vs-connect)) |
| `prepareConnectIdentity` | `execute_connect_gooddollar_identity` | write (requires `CELO_PRIVATE_KEY` to be the whitelisted root, stdio only) |

**Stdio MCP flow (G$ ↔ USDm):** `get_gooddollar_reserve_quote` → `estimate_gooddollar_reserve_swap` → `execute_gooddollar_reserve_swap`.

For browser wallet signing, call `prepareClaimUbi` and pass `flow.steps` to wagmi — same pattern as sends and swaps.

## Rules

- **One claim per identity per UBI period** — connected wallets share one root; `alreadyClaimedToday` and `nextClaimAvailableIn` apply to the root.
- **Reason priority** — scheme pause/start, then whitelist root, then claim cooldown (with countdown), then root identity/reverification, then zero entitlement.
- **Reverification** — when not in cooldown, overdue reverification on the **root** blocks eligibility.
- **Paused scheme** — `schemePaused: true` means no claims until the avatar unpauses UBISchemeV2.

## Related

- [Humanness](humanness.md) — GoodDollar whitelist is one of the two rails gating governance/staking writes
- [Prepared-step simulation](prepared-step-simulation.md)
- [wagmi integration](wagmi-integration.md)
- [Prepared flows](../concepts/prepared-flows.md)
- [Uniswap v4](uniswap.md) — swap G$ to other tokens when reserve does not apply (e.g. G$ → USDT)
- [GoodDollarService API](../api-reference/services/gooddollar.service/classes/GoodDollarService.md)
- [GoodDollar core contracts](https://docs.gooddollar.org/for-developers/core-contracts)
