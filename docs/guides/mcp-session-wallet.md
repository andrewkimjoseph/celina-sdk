# MCP session wallet (local stdio)

This guide applies to **[celina-mcp](https://www.npmjs.com/package/@andrewkimjoseph/celina-mcp)** when you run it locally with `CELO_PRIVATE_KEY` in the MCP server `env`. It does **not** apply to browser apps that use this SDK directly.

## SDK vs MCP vs hosted

| Runtime | Who is “the user”? | How the wallet is known |
|---------|-------------------|-------------------------|
| **celina-sdk** / `surface: "browser"` | Connected browser wallet | You pass `0x…` on every read/prepare (e.g. wagmi `useAccount()`); no `get_wallet_address` |
| **celina-mcp** stdio + `CELO_PRIVATE_KEY` | MCP server signer | Omit `address` / `wallet_address` / `from` on wallet-scoped tools; they default to the configured key |
| **Hosted MCP** (`mcp.usecelina.xyz`) | N/A (no server key) | Pass explicit addresses on every wallet-scoped tool; key-dependent tools fail without local keys |

Browser agent hosts use the same tool catalog with `surface: "browser"` — see [Tool catalog](tool-catalog.md). They do not run celina-mcp and do not use `get_wallet_address`.

## `get_wallet_address`

Read-only MCP tool with an **optional `signer`** (`"celo"` | `"self_agent"`). Omit it to get the default signer's address plus every configured wallet in one call:

```json
{
  "wallet_address": "0x…",
  "has_wallet": true,
  "source": "CELO_PRIVATE_KEY",
  "wallets": {
    "celo": { "address": "0x…" },
    "self_agent": { "address": "0x…" }
  }
}
```

`wallets` only lists signers whose key is actually configured. Pass `signer: "self_agent"` to resolve just that wallet's address (throws a clear error if `SELF_AGENT_PRIVATE_KEY` is not set); `source` always reflects the wallet actually returned, not a hardcoded value.

Call it when the agent needs a signer address as **data** (logging, comparisons, copy-paste, or finding the Self agent's address before funding it). For everyday “my balances”, omit address fields instead.

Fails with a clear error when neither `CELO_PRIVATE_KEY` nor `SELF_AGENT_PRIVATE_KEY` is set (hosted endpoint or read-only stdio), or when the specific `signer` requested has no key configured.

## Two wallets: CELO + Self agent

`celina-mcp` can hold two independent signing keys at once: `CELO_PRIVATE_KEY` (the main wallet, usually funded) and `SELF_AGENT_PRIVATE_KEY` (the Self identity — see [Self Agent ID](self-agent-id.md)). Humanness-gated tools ([Humanness](humanness.md), [Governance](governance.md), [Staking](staking.md)) accept an optional `signer: "celo" | "self_agent"` so the *right* wallet signs each step. Defaults to `celo` when both keys are configured.

A freshly registered Self agent starts with **0 CELO** — it cannot pay gas, register a Celo account, lock CELO, or stake until it is funded. The recommended flow:

1. `register_self_agent` → human scans QR → `check_self_registration` returns `agent_address` immediately (and `private_key_hex` once verified). You don't need `SELF_AGENT_PRIVATE_KEY` configured yet to know this address.
2. Fund it from the main wallet: `send_token({ to: agent_address, token: "CELO", amount, signer: "celo" })` (call `estimate_send` first). `send_token`/`estimate_send` accept the same optional `signer`, so this step works even when both keys are already configured — no ambiguity about which wallet pays.
3. Set `SELF_AGENT_PRIVATE_KEY` to `private_key_hex` and restart the MCP server so `signer: "self_agent"` becomes available.
4. Use `get_wallet_address` (no `signer`) to confirm both `wallets.celo` and `wallets.self_agent` addresses, and check the Self agent's balance before writes.
5. Run the humanness-gated flow **entirely on `signer: "self_agent"`**: `execute_register_celo_account({ signer: "self_agent" })` → `execute_lock_celo({ signer: "self_agent" })` → `execute_stake` / `execute_vote({ signer: "self_agent" })`. Never mix signers mid-flow — the address that gets registered must be the same one that locks, stakes, or votes, and it must be the address that passes `check_humanness`.

The main wallet keeps handling everything else (balances, swaps, DeFi, sends) as the default signer; only humanness-gated writes need to move to the Self agent once it's funded and registered.

## Omit address on wallet-scoped tools

When `CELO_PRIVATE_KEY` is configured, these parameters are **optional** and default to the signer:

| Parameter | Example tools |
|-----------|----------------|
| `address` | `get_account`, `get_celo_balances`, `get_stablecoin_balances`, `get_token_balance`, staking reads, GoodDollar reads, `get_nft_balance` |
| `from` | `estimate_transaction`, `prepare_contract_function` (browser) |
| `fromAddress` | `call_contract_function`, `estimate_contract_gas` |

Pass an explicit value to query a **different** wallet.

`execute_contract_function` always uses the MCP session signer (`CELO_PRIVATE_KEY`); it does not take an address parameter. Prefer `estimate_contract_gas` first.

## Agent rules

- Never derive addresses from shell commands or read `.env`.
- Do not call `get_wallet_address` on every turn unless you need the string; prefer omitted params for “my” operations.
- On hosted MCP (no key), always pass explicit `address` / `wallet_address`.

## Related

- [Architecture](../concepts/architecture.md) — Celina stack
- [Humanness](humanness.md) — dual-rail check gating governance/staking writes
- [Governance](governance.md) / [Staking](staking.md) — `signer`-aware `prepare*`/execute tools
- [Self Agent ID](self-agent-id.md) — registering and using a Self agent signer
- [Account Abstraction](account-abstraction.md) — `createAAClient` (SDK-first; no Celina-owned sponsorship key)
- [celina-mcp README](https://github.com/andrewkimjoseph/celina-mcp#session-wallet-local-stdio) — MCP setup and tool table
