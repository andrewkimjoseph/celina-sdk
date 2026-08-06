# Validator election staking

Read validator group data and staking positions, then stake/activate/unstake CELO with a validator group or delegate governance voting power — via Celo's `Election` and `LockedGold` core contracts.

Staking CELO requires locking it first — see [Governance](governance.md#prepare-lock-unlock-relock-withdraw-vote) for `prepareLockCelo`.

## Staking balances

```ts
const balances = await celina.staking.getStakingBalances("0xYourAddress");
// balances.activeFormatted, balances.pendingFormatted, balances.totalFormatted
// balances.groups[] — per-group active/pending/total
```

Newly staked CELO is `pending` until the next epoch; `active` votes count toward validator election and rewards.

## Activatable stakes

Pending votes become activatable once an epoch boundary has passed:

```ts
const activatable = await celina.staking.getActivatableStakes("0xYourAddress");
// activatable.activatableGroups — group addresses ready for prepareActivateStake
// activatable.summary.message
```

`prepareActivateStake` throws if the target group isn't in `activatableGroups` yet.

## Validator groups

```ts
const { groups, pagination } = await celina.staking.getValidatorGroups({ page: 1, pageSize: 10 });
// groups[].address, groups[].votes, groups[].capacity, groups[].members

const details = await celina.staking.getValidatorGroupDetails("0xGroupAddress");
// details.canReceiveVotes, details.canReceiveVotesFormatted — remaining headroom before the group hits its cap
```

## Stake eligibility pre-check

Before staking, check whether the transaction would succeed on-chain. The SDK:

- Computes **group headroom** as `capacity − getTotalVotesForGroup(group)` (remaining CELO the group can accept before hitting its cap)
- Calls on-chain **`Election.canReceiveVotes(group, amount)`** (returns `bool`) — the exact gate `vote()` uses

When headroom is zero or the bool is false, stake reverts with **"Group cannot receive votes"** (e.g. cLabs at capacity).

```ts
const eligibility = await celina.staking.getStakeEligibility(
  "0xYourAddress",
  "0xGroupAddress",
  "100",
);
// eligibility.canStake — true when all gates pass
// eligibility.reasons[] — human-readable blockers when canStake is false
// eligibility.maxStakeAmountFormatted — min(non-voting locked, headroom)
// eligibility.canReceiveVotesFormatted, eligibility.nonvotingLockedFormatted
```

Recommended flow:

1. `getValidatorGroupDetails` — inspect `canReceiveVotesFormatted` for group headroom
2. `getStakeEligibility` — validate account registration, locked balance, and amount against headroom
3. Only then `prepareStake` / `execute_stake`

`prepareStake` runs the same validation via `assertStakeEligible` and throws before building unsigned steps — so browser apps get fail-fast behavior even without an explicit pre-check call.

The result type `StakeEligibilityResult` is exported from `@andrewkimjoseph/celina-sdk`.

## Network totals and delegation

```ts
const totals = await celina.staking.getTotalStakingInfo();
// totals.totalVotesFormatted — network-wide staking participation

const delegation = await celina.staking.getDelegationInfo("0xYourAddress");
// delegation.delegatees[] — { delegatee, fractionPercent, currentAmountFormatted }
// delegation.governanceVotingPowerFormatted
```

## Governance delegation (LockedGold)

**Distinct from validator-group staking:** `prepareDelegatePower` delegates **governance voting power** on locked CELO to another address (percent 1–100). It does not stake with a validator group.

There is **no on-chain delegate registry**. [Celo Mondo](https://mondo.celo.org/delegate) maintains a curated off-chain directory; Celina mirrors it:

```ts
const { delegates, source, directoryNote } =
  await celina.staking.getGovernanceDelegates({
    search: "governance",
    limit: 10,
    includeStats: true, // default — LockedGold voting power + total delegated TO them
  });
// delegates[].name, delegates[].address, delegates[].interests, delegates[].description
```

Recommended flow when the user has no delegatee in mind:

1. `getGovernanceDelegates` — browse names and addresses
2. `getLockedCeloBalance` + `getDelegationInfo` — confirm locked CELO and existing delegations
3. `prepareDelegatePower` / `execute_delegate_power` with chosen `delegatee` and `percent`

You can also delegate to **any** `0x…` address without using the directory.

## Prepare: stake, activate, unstake, delegate

All five are humanness-gated by convention (see [Humanness](humanness.md)) — the SDK methods don't call `checkHumanness` themselves; celina-mcp's `execute_*` tools apply the gate before preparing.

```ts
// Stake — casts an Election vote for a validator group; finds lesser/greater neighbors on-chain
// Validates eligibility first (same checks as getStakeEligibility) — throws if canStake would be false
const stakeFlow = await celina.staking.prepareStake(from, groupAddress, "100");

// Activate — converts pending votes to active once activatable
const activateFlow = await celina.staking.prepareActivateStake(from, groupAddress);

// Unstake — revokes pending first, then active, to cover the requested amount
const unstakeFlow = await celina.staking.prepareUnstake(from, groupAddress, "50");

// Delegate / undelegate a percentage (1–100) of governance voting power
const delegateFlow = await celina.staking.prepareDelegatePower(from, delegateeAddress, 25);
const undelegateFlow = await celina.staking.prepareUndelegatePower(from, delegateeAddress, 25);
```

`prepareStake`, `prepareActivateStake`, `prepareUnstake`, `prepareDelegatePower`, and `prepareUndelegatePower` call `assertCeloAccountRegistered` first — the `from` address must have a registered Celo account.

`prepareUnstake` can return 1–2 steps (`revokePending` then `revokeActive`) depending on how much of the requested amount is pending vs active; amounts below Election's minimum increment are dropped silently, and the method throws if nothing ends up revocable.

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
| `getStakingBalances` | `get_staking_balances` | — (read, both surfaces) |
| `getActivatableStakes` | `get_activatable_stakes` | — (read, both surfaces) |
| `getValidatorGroups` | `get_validator_groups` | — (read, both surfaces) |
| `getValidatorGroupDetails` | `get_validator_group_details` | — (read, both surfaces) |
| `getTotalStakingInfo` | `get_total_staking_info` | — (read, both surfaces) |
| `getDelegationInfo` | `get_delegation_info` | — (read, both surfaces) |
| `getGovernanceDelegates` | `get_governance_delegates` | — (read, both surfaces) |
| `getStakeEligibility` | `get_stake_eligibility` | — (read, both surfaces) |
| `prepareStake` | `execute_stake` (call `get_stake_eligibility` first; enforced in SDK for `prepareStake`) | `prepare_stake` |
| `prepareActivateStake` | `execute_activate_stake` | `prepare_activate_stake` |
| `prepareUnstake` | `execute_unstake` | `prepare_unstake` |
| `prepareDelegatePower` | `execute_delegate_power` | `prepare_delegate_power` |
| `prepareUndelegatePower` | `execute_undelegate_power` | `prepare_undelegate_power` |

`execute_*` tools accept an optional `signer: "celo" | "self_agent"` and apply the humanness gate before signing. Browser `prepare_*` tools return unsigned flows only — no humanness gate is applied at that layer.

If you intend to sign with `self_agent`, fund and register that address **before** staking — see [Two wallets: CELO + Self agent](mcp-session-wallet.md#two-wallets-celo--self-agent).

## Related

- [Governance](governance.md) — lock CELO before staking; the other humanness-gated write surface
- [Humanness](humanness.md) — gating model for the `execute_*` writes above
- [MCP session wallet](mcp-session-wallet.md) — funding a Self agent from the main wallet
- [Prepared-step simulation](prepared-step-simulation.md)
- [wagmi integration](wagmi-integration.md)
- [Prepared flows](../concepts/prepared-flows.md)
- [StakingService API](../api-reference/services/staking.service/classes/StakingService.md)
