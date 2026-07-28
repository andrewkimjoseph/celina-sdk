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
```

## Network totals and delegation

```ts
const totals = await celina.staking.getTotalStakingInfo();
// totals.totalVotesFormatted — network-wide staking participation

const delegation = await celina.staking.getDelegationInfo("0xYourAddress");
// delegation.delegatees[] — { delegatee, fractionPercent, currentAmountFormatted }
// delegation.governanceVotingPowerFormatted
```

## Prepare: stake, activate, unstake, delegate

All five are humanness-gated by convention (see [Humanness](humanness.md)) — the SDK methods don't call `checkHumanness` themselves; celina-mcp's `execute_*` tools apply the gate before preparing.

```ts
// Stake — casts an Election vote for a validator group; finds lesser/greater neighbors on-chain
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
| `prepareStake` | `execute_stake` | `prepare_stake` |
| `prepareActivateStake` | `execute_activate_stake` | `prepare_activate_stake` |
| `prepareUnstake` | `execute_unstake` | `prepare_unstake` |
| `prepareDelegatePower` | `execute_delegate_power` | `prepare_delegate_power` |
| `prepareUndelegatePower` | `execute_undelegate_power` | `prepare_undelegate_power` |

`execute_*` tools accept an optional `signer: "celo" | "self_agent"` and apply the humanness gate before signing. Browser `prepare_*` tools return unsigned flows only — no humanness gate is applied at that layer.

## Related

- [Governance](governance.md) — lock CELO before staking; the other humanness-gated write surface
- [Humanness](humanness.md) — gating model for the `execute_*` writes above
- [Prepared-step simulation](prepared-step-simulation.md)
- [wagmi integration](wagmi-integration.md)
- [Prepared flows](../concepts/prepared-flows.md)
- [StakingService API](../api-reference/services/staking.service/classes/StakingService.md)
