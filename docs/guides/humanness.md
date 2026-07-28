# Humanness verification

Dual-rail check that gates governance and staking writes: an address passes if it verifies on **either** Self Agent ID **or** GoodDollar IdentityV4 — no single rail is required.

## Check humanness

```ts
const result = await celina.humanness.checkHumanness("0xYourAddress");
// result.isHumanOverall — true if either rail passed
// result.selfAgent — { checked, isHuman, agentId?, reason? }
// result.goodDollar — { checked, isHuman, whitelistedRoot?, reason? }
```

Both rails are checked in parallel. `isHumanOverall` is `result.selfAgent.isHuman || result.goodDollar.isHuman`.

| Field | Meaning |
|-------|---------|
| `signerAddress` | Address checked |
| `selfAgent.isHuman` | `true` if `verify_self_agent` succeeds for this address |
| `selfAgent.agentId` | Numeric Self agent id, when verified |
| `goodDollar.isHuman` | `true` if the address (or its whitelisted root, via `getWhitelistedRoot`) is GoodDollar-whitelisted |
| `goodDollar.whitelistedRoot` | Root identity resolved for connected wallets |
| `*.reason` | Why a rail failed (e.g. `"GoodDollar identity not whitelisted"`, `"reverify-index-out-of-bounds"`) |

GoodDollar reads resolve connected wallets to their root before checking `isWhitelisted` — same root-resolution rule as [GoodDollar UBI](gooddollar.md#whitelist-status).

## Assert humanness

Throw with remediation text when the check fails, instead of branching on `isHumanOverall` yourself:

```ts
import { assertHumanness } from "@andrewkimjoseph/celina-sdk";

const result = await celina.humanness.checkHumanness(from);
assertHumanness(result); // throws if !result.isHumanOverall
```

The thrown error includes both rails' failure reasons plus `GOODDOLLAR_HUMANNESS_REMEDIATION`:

```ts
import { GOODDOLLAR_HUMANNESS_REMEDIATION } from "@andrewkimjoseph/celina-sdk";
// "Register a Self agent (register_self_agent), face-verify this wallet
//  (get_gooddollar_face_verification_link), or if already GoodDollar verified
//  on another wallet, set CELO_PRIVATE_KEY to that verified root and link this
//  wallet via execute_connect_gooddollar_identity."
```

## What's gated

`prepareLockCelo`, `prepareVote`, `prepareStake`, etc. build unsigned flows and do **not** call `checkHumanness` themselves — the gate is enforced by the **caller**, not the SDK method. celina-mcp is the reference implementation: it wraps every governance/staking write in a `checkHumanness` + `assertHumanness` gate before preparing and executing:

```ts
import { assertHumanness } from "@andrewkimjoseph/celina-sdk";

async function executeHumannessGated(from: `0x${string}`, prepare: () => Promise<SerializedPreparedFlow>) {
  const humanness = await celina.humanness.checkHumanness(from);
  assertHumanness(humanness); // throws before preparing if neither rail passes

  const flow = await prepare();
  // sign + broadcast flow.steps
}
```

If you build your own host (browser app, other MCP server) around governance/staking writes, apply the same gate yourself before calling:

- **Governance** — `prepareLockCelo`, `prepareUnlockCelo`, `prepareRelockCelo`, `prepareWithdrawCelo`, `prepareVote` (see [Governance](governance.md))
- **Staking** — `prepareStake`, `prepareActivateStake`, `prepareUnstake`, `prepareDelegatePower`, `prepareUndelegatePower` (see [Staking](staking.md))

Reads on both services (proposal lists, validator groups, balances) don't need a humanness gate — only the writes above, and only because celina-mcp's `execute_*` tools choose to enforce it that way.

## MCP tool mapping

| SDK method | MCP tool | Notes |
|------------|----------|-------|
| `checkHumanness` | `check_humanness` | Read-only; resolves the wallet address like other MCP tools — see [MCP session wallet](mcp-session-wallet.md) |

celina-mcp calls `check_humanness` before humanness-gated `execute_*` governance/staking tools and surfaces the same remediation on failure.

## Two ways to pass

1. **Self Agent ID** — register once via `register_self_agent` (human scans a QR code); see [Self Agent ID](self-agent-id.md).
2. **GoodDollar** — either face-verify this wallet directly, or connect it to an already-verified root; see [Face verify vs connect](gooddollar.md#face-verify-vs-connect).

Either rail is sufficient — you do not need both.

## Related

- [GoodDollar UBI](gooddollar.md) — one of the two humanness rails, including the face-verify-vs-connect distinction
- [Self Agent ID](self-agent-id.md) — the other humanness rail
- [Governance](governance.md) — humanness-gated locking and voting
- [Staking](staking.md) — humanness-gated staking and delegation
- [MCP session wallet](mcp-session-wallet.md) — funding and switching to a Self agent signer
- [HumannessService API](../api-reference/services/humanness.service/classes/HumannessService.md)
