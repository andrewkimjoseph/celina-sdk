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
// On-chain verification by agent address
await celina.self.verifyAgent({
  agentAddress: "0xC1C860804EFdA544fe79194d1a37e60b846CEdeb",
  requireAge: 18,
});

// Lookup by numeric agent ID (REST + on-chain expiry)
await celina.self.lookupAgent(1);
```

## Registration flow

```ts
const session = await celina.self.registerAgent({
  mode: "wallet-free",
  agentName: "my-agent",
});
// session.session_id, session.qr_code_url, session.deep_link — present BOTH links to the human

const status = await celina.self.checkRegistration(session.session_id);
// When complete: status.private_key_hex — set SELF_AGENT_PRIVATE_KEY locally
```

Sessions are stored **in-process** for ~10 minutes. They are lost on server restart and do not work across stateless serverless instances (same as hosted MCP).

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
