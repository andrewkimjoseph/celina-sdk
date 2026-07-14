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
});

console.log(aa.provider); // "pimlico"
console.log(aa.smartAccountAddress);
```

`GasSponsorshipService` builds the Celo endpoint:

`https://api.pimlico.io/v2/42220/rpc?apikey=…`

Adding another sponsorship vendor later means a new `provider` union member and a branch inside `GasSponsorshipService` — the public factory name stays the same.

## Send prepared transactions

```ts
const celina = createCelinaClient({
  attributionTags: ["celo_862c21dd97a7", "my_app"],
});
const prepared = await celina.transaction.prepareSend({
  token: "USDm",
  to: aa.smartAccountAddress, // or any recipient; use SA as `from` when preparing from that identity
  amount: "1",
  from: aa.smartAccountAddress,
});
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

**`createAAClient` has no `attributionTags` parameter.** Set tags when creating the Celina client used for `prepare*`:

```ts
const celina = createCelinaClient({
  attributionTags: ["celo_862c21dd97a7", "my_app"],
});
const prepared = await celina.transaction.prepareSend({ ... });
await aa.sendPreparedFlow(prepared); // inner call data keeps Celina dual suffixes
```

How tags reach the chain:

1. `prepare*` runs `appendCelinaCalldataTag` on each step — **legacy** UTF-8 (`CELINA|…`) plus **ERC-8021** Schema 0 codes.
2. `sendPreparedFlow` **passes that calldata through** as UserOp inner calls — it does not strip or re-tag.
3. Verify with `check_attribution_tag` / `verify_attribution_tag` on the resulting transaction hash.

Apps (e.g. GoClaim) may also keep their own calldata suffix in parallel with Celina’s dual tags.

See [Prepared flows](../concepts/prepared-flows.md) and [Configuration](../getting-started/configuration.md).

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

1. Replace a local `createSmartAccountClient` / Pimlico URL helper with `createAAClient({ gasSponsorship: { provider: "pimlico", pimlico: { apiKey } } })`.
2. Prefer Celina `prepare*` for transfers / claims where available; keep app-specific calls as extra prepared steps or custom `calls`.
3. Set Celina dual tags via `createCelinaClient({ attributionTags })` when preparing; keep app-specific suffixes if needed.
4. Drop duplicate `permissionless` wiring once you consume Celina’s AA client.
