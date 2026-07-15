# Account Abstraction (sponsored UserOps)

Celina can submit **prepared transactions** as ERC-4337 UserOperations on Celo mainnet via **`createAAClient`**. Gas sponsorship credentials are **app-owned** — Celina does not store or host a Pimlico (or other) API key.

**Terminology:** Celina calls the `prepare*` result a **prepared flow**. That object is simply an ordered list of unsigned transactions in **`steps`** — not a workflow engine. The same object is what wagmi signs step-by-step or what `sendPreparedFlow` submits as UserOp(s).

## What you get

| Piece | Role |
|-------|------|
| **`createAAClient`** | Simple Smart Account (EntryPoint **0.7**) + bundler/paymaster via `GasSponsorshipService` |
| **`sendPreparedFlow`** | Submit prepared transactions (`SerializedPreparedFlow.steps`) as sponsored UserOp(s) |
| **`deriveSmartAccountAddress`** | Counterfactual smart account address without submitting |
| **`GasSponsorshipService`** | Provider-agnostic URL / paymaster / fee helpers (v1: Pimlico) |

EOA paths (`prepare*` + wagmi / MCP `CELO_PRIVATE_KEY`) are unchanged. Celo `feeCurrency` / MiniPay remains a separate EOA fee story — do not conflate it with ERC-4337 sponsorship.

## Provider config (explicit)

Pass a discriminant `provider` and the matching object. v1 supports **Pimlico** only:

```ts
import { createAAClient, createCelinaClient } from "@andrewkimjoseph/celina-sdk";
import { privateKeyToAccount } from "viem/accounts";
import { celo } from "viem/chains";

const owner = privateKeyToAccount(process.env.OWNER_PRIVATE_KEY as `0x${string}`);

const aa = await createAAClient({
  owner,
  gasSponsorship: {
    provider: "pimlico",
    pimlico: {
      // Your Pimlico project key — never a Celina platform secret
      apiKey: process.env.PIMLICO_API_KEY!,
    },
  },
  // Optional: tag hand-built or prepare* steps at send time
  attributionTags: ["goclaim"],
});

console.log(aa.provider); // "pimlico"
console.log(aa.smartAccountAddress);
console.log(aa.attributionTags); // ["goclaim"]
```

`GasSponsorshipService` builds the Celo endpoint:

`https://api.pimlico.io/v2/42220/rpc?apikey=…`

Adding another sponsorship vendor later means a new `provider` union member and a branch inside `GasSponsorshipService` — the public factory name stays the same.

## Send prepared transactions

```ts
const celina = createCelinaClient({
  attributionTags: ["celo_862c21dd97a7", "my_app"],
});
const prepared = await celina.transaction.prepareSend(
  aa.smartAccountAddress, // from
  aa.smartAccountAddress, // to (or any recipient)
  "USDm",
  "1",
);
// prepared.chainId === celo.id (42220)

// Default: all steps in one UserOp (atomic approve + action)
const result = await aa.sendPreparedFlow(prepared);
// result.userOpHashes, result.transactionHashes, result.success

// Or one UserOp per step
await aa.sendPreparedFlow(prepared, { mode: "sequential" });
```

### Batch vs sequential

| Mode | Behavior |
|------|----------|
| **`batch`** (default) | All `steps` → one `sendUserOperation({ calls })` |
| **`sequential`** | One UserOp per step (when atomic batching is wrong for your app) |

## Attribution

`createAAClient` accepts optional **`attributionTags`**. When set (including `[]`), `sendPreparedFlow` runs `appendCelinaCalldataTag` on each step’s `data` before submit (same ERC-8021 format as `prepare*`). When **omitted** (`undefined`), step `data` is passed through unchanged.

```ts
// Hand-built steps (e.g. app-specific contract calls)
const aa = await createAAClient({
  owner,
  gasSponsorship: { provider: "pimlico", pimlico: { apiKey: process.env.PIMLICO_API_KEY! } },
  attributionTags: ["goclaim"],
});
await aa.sendPreparedFlow(handBuiltPreparedFlow);
```

```ts
// Or tag at prepare* time and omit AA tags (pass-through)
const celina = createCelinaClient({
  attributionTags: ["celo_862c21dd97a7", "my_app"],
});
const prepared = await celina.transaction.prepareSend(
  aa.smartAccountAddress,
  aa.smartAccountAddress,
  "USDm",
  "1",
);
const aa = await createAAClient({
  owner,
  gasSponsorship: { provider: "pimlico", pimlico: { apiKey: process.env.PIMLICO_API_KEY! } },
});
await aa.sendPreparedFlow(prepared);
```

Use **one consistent tag list** per send path (`createCelinaClient` *or* `createAAClient`). Mismatched lists on both sides can produce stacked / incomplete suffixes.

How tags reach the chain:

1. `prepare*` and/or `sendPreparedFlow` (when AA `attributionTags` is set) run `appendCelinaCalldataTag` — **ERC-8021** Schema 0 codes (`celina` + custom).
2. UserOp inner calls carry that tagged calldata.
3. Prefer `check_attribution_tag` / `checkAttributionInCalldata` on the resulting transaction hash.

`attributionTags: ["goclaim"]` yields ERC-8021 codes `celina`, `goclaim` — **not** a bare UTF-8 `GOCLAIM` suffix.

See [On-chain attribution](on-chain-attribution.md), [Prepared flows](../concepts/prepared-flows.md), and [Configuration](../getting-started/configuration.md).

## Derive address only

```ts
import { deriveSmartAccountAddress } from "@andrewkimjoseph/celina-sdk";

const { eoaAddress, smartAccountAddress } = await deriveSmartAccountAddress(owner);
```

## MCP / hosted Celina

Account Abstraction is **SDK-first** in this iteration.

- Local MCP `execute_*` still uses **EOA** `CELO_PRIVATE_KEY` via sequential `sendTransaction`.
- There is **no** Celina-owned `PIMLICO_API_KEY` (or other sponsorship key) on celina-mcp / mcp-host.
- Apps that need sponsored UserOps call `createAAClient` in their own process and pass **their** provider credentials.

Future MCP AA tools would take caller-supplied `gasSponsorship` config — not Celina infrastructure secrets.

## Migrating an app (e.g. GoClaim)

1. Replace a local `createSmartAccountClient` / Pimlico URL helper with `createAAClient({ gasSponsorship: { provider: "pimlico", pimlico: { apiKey } }, attributionTags: ["goclaim"] })`.
2. Prefer Celina `prepare*` for transfers / claims where available; keep app-specific calls as extra prepared steps.
3. Set tags on `createAAClient` (hand-built steps) or `createCelinaClient` (`prepare*`), not mismatched lists on both.
4. Drop duplicate `permissionless` wiring once you consume Celina’s AA client.