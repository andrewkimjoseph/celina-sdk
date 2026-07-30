# Self Agent ID on Celo

The SDK exposes Self Agent ID via `celina.self` — the same flows as [celina-mcp](https://www.npmjs.com/package/@andrewkimjoseph/celina-mcp) tools (`verify_self_agent`, `register_self_agent`, etc.).

For browser-first apps, also consider the official [`@selfxyz/agent-sdk`](https://www.npmjs.com/package/@selfxyz/agent-sdk).

## Configuration

```ts
import { createCelinaClient } from "@andrewkimjoseph/celina-sdk";

const celina = createCelinaClient({
  selfAgentPrivateKey: process.env.SELF_AGENT_PRIVATE_KEY as `0x${string}`,
  selfApiBase: "https://app.ai.self.xyz", // optional
});
```

| Option / env | Purpose |
|--------------|---------|
| `selfAgentPrivateKey` / `SELF_AGENT_PRIVATE_KEY` | Signing, identity, refresh, deregister |
| `selfApiBase` / `SELF_AGENT_API_BASE` | Override ai.self.xyz REST base URL |

Read-only verification (`verifyAgent`, `lookupAgent`, `verifyRequest`) does not require a key.

## Read examples

```ts
// On-chain verification by agent address (defaults: age 18+, OFAC required)
await celina.self.verifyAgent({
  agentAddress: "0xC1C860804EFdA544fe79194d1a37e60b846CEdeb",
});

// Relax gates explicitly if needed
await celina.self.verifyAgent({
  agentAddress: "0xC1C860804EFdA544fe79194d1a37e60b846CEdeb",
  requireAge: 0,
  requireOfac: false,
});

// Lookup by numeric agent ID (REST + on-chain expiry)
await celina.self.lookupAgent(1);
```

Verified agents expose credentials including `nationality` (ISO 3166-1 alpha-3, when disclosed at registration), `older_than`, `ofac_clear`, and `ofac_checks` — a labeled array derived from Self’s on-chain `bool[3]` OFAC field. Each check has `list`, `label`, and `clear` (`clear: true` means **not on that sanctions list**). **`ofac_clear` is true only when every check has `clear: true`** (full screening passed at registration). `lookup_self_agent`, `verify_self_agent`, and `get_self_identity` return this normalized shape — not a raw `ofac` array.

## Registration flow

```ts
// Defaults: minimumAge 18, nationality disclosure, OFAC screening
const session = await celina.self.registerAgent({
  mode: "wallet-free",
  agentName: "my-agent",
});
// session.session_id, session.qr_code_url, session.deep_link — present BOTH links to the human

const status = await celina.self.checkRegistration(session.session_id);
// When complete: status.private_key_hex — set SELF_AGENT_PRIVATE_KEY locally
```

Registration disclosures default to `{ minimumAge: 18, nationality: true, ofac: true }` so Self agents are not tied to under-18 or OFAC-listed humans, and nationality is available on later verify/identity reads. Opt out with `minimumAge: 0`, `nationality: false`, or `ofac: false`.

Sessions are stored **in-process** for ~10 minutes. They are lost on server restart and do not work across stateless serverless instances (same as hosted MCP).

A newly registered agent address holds no CELO. On `celina-mcp`, fund it from your main wallet and switch humanness-gated writes to it once `SELF_AGENT_PRIVATE_KEY` is set — see [Two wallets: CELO + Self agent](mcp-session-wallet.md#two-wallets-celo--self-agent) in the MCP session wallet guide.

## Signed HTTP (agent key required)

```ts
const { headers } = await celina.self.signRequest({
  method: "POST",
  url: "https://app.ai.self.xyz/api/demo/verify?network=celo-mainnet",
  body: JSON.stringify({ ping: true }),
});

await celina.self.authenticatedFetch({
  method: "POST",
  url: "https://app.ai.self.xyz/api/demo/verify?network=celo-mainnet",
  body: JSON.stringify({ ping: true }),
});
```

Use `?network=celo-mainnet` (not `mainnet`) for Self demo/gated APIs on Celo.

## Proof refresh and deregister

- `refreshProof()` — only after on-chain proof expiry (`isProofFresh` false)
- `deregisterAgent()` — irreversible; returns QR/deep link session like registration

Poll completion with `checkRegistration(session_id)` for refresh and deregister sessions too.
