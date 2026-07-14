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

Read-only MCP tool with **no parameters**. Returns:

```json
{
  "wallet_address": "0x…",
  "has_wallet": true,
  "source": "CELO_PRIVATE_KEY"
}
```

Call it when the agent needs the signer address as **data** (logging, comparisons, copy-paste). For everyday “my balances”, omit address fields instead.

Fails with a clear error when `CELO_PRIVATE_KEY` is not set (hosted endpoint or read-only stdio).

## Omit address on wallet-scoped tools

When `CELO_PRIVATE_KEY` is configured, these parameters are **optional** and default to the signer:

| Parameter | Example tools |
|-----------|----------------|
| `address` | `get_account`, `get_celo_balances`, `get_stablecoin_balances`, `get_token_balance`, staking reads, GoodDollar reads, `get_nft_balance` |
| `from` | `estimate_transaction` |
| `fromAddress` | `call_contract_function`, `estimate_contract_gas` |

Pass an explicit value to query a **different** wallet.

## Agent rules

- Never derive addresses from shell commands or read `.env`.
- Do not call `get_wallet_address` on every turn unless you need the string; prefer omitted params for “my” operations.
- On hosted MCP (no key), always pass explicit `address` / `wallet_address`.

## Related

- [Architecture](../concepts/architecture.md) — Celina stack
- [Account Abstraction](account-abstraction.md) — `createAAClient` (SDK-first; no Celina-owned sponsorship key)
- [celina-mcp README](https://github.com/andrewkimjoseph/celina-mcp#session-wallet-local-stdio) — MCP setup and tool table
