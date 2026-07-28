# Celo governance

Read governance proposals, lock/unlock CELO for voting power, and vote — all via unsigned transaction flows against Celo's core `Governance` and `LockedGold` contracts.

## Proposals

```ts
const { proposals, pagination } = await celina.governance.getGovernanceProposals({
  page: 1,
  pageSize: 10,
  includeMetadata: true, // fetches CGP frontmatter — slower; set false for faster list responses
});

const { proposal, content } = await celina.governance.getProposalDetails(42);
// content — CGP markdown body when the proposal links to a CGP
```

## Votable proposals

Only proposals in **Referendum** stage can be voted on. `getVotableProposals` resolves the on-chain dequeue and filters by stage, returning the `index` required for `prepareVote`:

```ts
const { proposals } = await celina.governance.getVotableProposals();
// proposals[].proposalId, proposals[].index, proposals[].stage === "Referendum"
```

`prepareVote` looks up the dequeue index internally — you only need `proposalId`.

## Locked CELO and voting power

```ts
const locked = await celina.governance.getLockedCeloBalance("0xYourAddress");
// locked.totalLockedFormatted, locked.nonvotingLockedFormatted, locked.governanceVotingPowerFormatted

const pending = await celina.governance.getPendingWithdrawals("0xYourAddress");
// pending.withdrawals[].isMature, pending.matureCount
```

## Prepare: lock, unlock, relock, withdraw, vote

All five are humanness-gated by convention (see [Humanness](humanness.md)) — the SDK methods themselves do not call `checkHumanness`; celina-mcp's `execute_*` tools apply the gate before preparing.

```ts
// Lock — relocks matured pending withdrawals first, then locks the remainder as new CELO
const lockFlow = await celina.governance.prepareLockCelo(from, "100");

// Unlock — starts LockedGold's 3-day timelock
const unlockFlow = await celina.governance.prepareUnlockCelo(from, "50");

// Relock a specific pending withdrawal (cancels its timelock)
const relockFlow = await celina.governance.prepareRelockCelo(from, /* index */ 0, "50");

// Withdraw all matured pending withdrawals (throws if none are mature yet)
const withdrawFlow = await celina.governance.prepareWithdrawCelo(from);

// Vote — Abstain | No | Yes (VOTE_VALUES also includes "None", not votable)
const voteFlow = await celina.governance.prepareVote(from, /* proposalId */ 42, "Yes");
```

```ts
import { VOTE_VALUES, voteValueToInt, type VoteValueName } from "@andrewkimjoseph/celina-sdk";
// VOTE_VALUES === ["None", "Abstain", "No", "Yes"] — on-chain enum order
```

`prepareLockCelo`, `prepareUnlockCelo`, `prepareRelockCelo`, and `prepareWithdrawCelo` call `assertCeloAccountRegistered` first — the `from` address must have a registered Celo account (see [Send tokens](send-tokens.md) for account registration).

Sign and broadcast like any other prepared flow:

```ts
for (const step of flow.steps) {
  await sendTransactionAsync({
    to: step.to,
    data: step.data,
    value: step.value ? BigInt(step.value) : undefined,
  });
}
```

## MCP tool mapping

| SDK method | MCP tool (stdio, humanness-gated) | Browser prepare |
|------------|------------------------------------|------------------|
| `getGovernanceProposals` | `get_governance_proposals` | — (read, both surfaces) |
| `getProposalDetails` | `get_proposal_details` | — (read, both surfaces) |
| `getVotableProposals` | `get_votable_proposals` | — (read, both surfaces) |
| `getLockedCeloBalance` | `get_locked_celo_balance` | — (read, both surfaces) |
| `getPendingWithdrawals` | `get_pending_withdrawals` | — (read, both surfaces) |
| `prepareLockCelo` | `execute_lock_celo` | `prepare_lock_celo` |
| `prepareUnlockCelo` | `execute_unlock_celo` | `prepare_unlock_celo` |
| `prepareRelockCelo` | `execute_relock_celo` | `prepare_relock_celo` |
| `prepareWithdrawCelo` | `execute_withdraw_celo` | `prepare_withdraw_celo` |
| `prepareVote` | `execute_vote` | `prepare_vote` |

`execute_*` tools accept an optional `signer: "celo" | "self_agent"` (defaults to CELO when both keys are configured) and apply the humanness gate before signing. Browser `prepare_*` tools return unsigned flows only — no humanness gate is applied at that layer; apply your own gate if your host needs one.

If you intend to sign with `self_agent`, fund and register that address **before** locking — see [Two wallets: CELO + Self agent](mcp-session-wallet.md#two-wallets-celo--self-agent).

## Related

- [Humanness](humanness.md) — gating model for the `execute_*` writes above
- [Staking](staking.md) — validator election staking, the other humanness-gated write surface
- [MCP session wallet](mcp-session-wallet.md) — funding a Self agent from the main wallet
- [Prepared-step simulation](prepared-step-simulation.md)
- [wagmi integration](wagmi-integration.md)
- [Prepared flows](../concepts/prepared-flows.md)
- [GovernanceService API](../api-reference/services/governance.service/classes/GovernanceService.md)
