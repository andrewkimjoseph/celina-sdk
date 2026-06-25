# AgentKarma reputation on Celo

The SDK exposes [AgentKarma](https://agentkarma.io) via `celina.agentKarma` — a read-only reputation adapter over `@agentkarma/sdk`. It is Celo-pinned (the chain Celina operates on) and mirrors the same flows as celina-mcp tools (`get_agentkarma_reputation`, `get_agentkarma_celo_agent`, `check_agentkarma_counterparty`).

**Boundaries:**

- **Read-only** — never signs, never executes a transaction, never holds custody
- **Non-routing** — never proxies an agent call; only reads reputation
- **No keys** — no `CELO_PRIVATE_KEY` or env requirement
- **External API** — calls agentkarma.io; not wrapped in Celina Amplitude analytics (unlike on-chain Celina reads)

For direct AgentKarma integration outside Celina, see [`@agentkarma/sdk`](https://www.npmjs.com/package/@agentkarma/sdk).

## Configuration

No configuration is required. The adapter defaults to `https://agentkarma.io`:

```ts
import { createCelinaClient } from "@andrewkimjoseph/celina-sdk";

const celina = createCelinaClient();

// Optional: override AgentKarma API base URL
const celinaCustom = createCelinaClient({
  agentKarma: { baseUrl: "https://agentkarma.io" },
});
```

| Option | Purpose |
|--------|---------|
| `agentKarma.baseUrl` | Override AgentKarma REST base URL (defaults to `https://agentkarma.io`) |
| `agentKarma.timeout` | Request timeout in ms |

## Read examples

### Karma by wallet address

```ts
const snapshot = await celina.agentKarma.getKarma(
  "0xC1C860804EFdA544fe79194d1a37e60b846CEdeb",
  { face: "both" }, // provider, consumer, or both (default)
);
// snapshot.provider, snapshot.consumer — scores and receipt-backed signals
```

### ERC-8004 agent by ID

```ts
const agent = await celina.agentKarma.getCeloAgent(1);
// agent.identity, agent.reputation — on-chain ERC-8004 + AgentKarma context
```

### Counterparty trust policy

```ts
const result = await celina.agentKarma.evaluateCounterparty(
  "0xCounterpartyAddress",
  {
    face: "provider",
    minScore: 50,
    requireReceiptBacked: true,
  },
);
// result.decision.allowed — explainable allow/deny
// result.snapshot — karma data the decision was computed from
```

`evaluateCounterparty` always fetches **both** karma faces so the scored face is guaranteed present. Policy evaluation is local (pure function) — no extra network call.

## MCP tools

On hosted MCP (`https://mcp.usecelina.xyz/api/mcp`) and local stdio MCP, three read tools are available:

| Tool | Purpose |
|------|---------|
| `get_agentkarma_reputation` | Provider + Consumer karma for a Celo wallet |
| `get_agentkarma_celo_agent` | ERC-8004 agent identity + reputation by numeric ID |
| `check_agentkarma_counterparty` | Local trust policy against a counterparty address |

**Important:** AgentKarma tools require an explicit `address` for the subject being looked up. They do **not** default to the operator's signer wallet — that would disclose the operator's identity to a third-party API.

## When to use

Use AgentKarma reads as a **preflight** before high-risk agent actions:

- Before `send_token` or `prepare_send` to an unknown counterparty
- Before `execute_uniswap_swap` or `execute_mento_fx` with a new routing partner
- In browser chat UIs (e.g. Celeste) to surface reputation context to the user

AgentKarma complements Celina's on-chain reads — it does not replace balance checks, gas estimates, or sign-time simulation.

## Catalog access

For advanced use, call tools from the canonical `@agentkarma/sdk/tools` catalog via `runCatalogTool` (chain forced to `"celo"`):

```ts
await celina.agentKarma.runCatalogTool("get_karma", {
  wallet: "0xYourAddress",
  face: "both",
});
```

See [AgentKarmaService](../api-reference/services/agentkarma.service/classes/AgentKarmaService.md) for full method signatures.

## See also

- [Architecture](../concepts/architecture.md) — stack and client composition
- [LLM tool catalog](tool-catalog.md) — `domains/agentkarma.ts` in the shared catalog
- [celina-website tool docs](https://usecelina.xyz/tools) — rich examples for each MCP tool
