# On-chain attribution

Prepared and AA-submitted calldata carries an **ERC-8021 Schema 0** Celina attribution suffix so indexers and agents can identify app traffic on Celo mainnet.

## Wire format (writes)

Every tagged step appends ERC-8021 only via `appendCelinaCalldataTag` / `toDataSuffix`:

| Layer | Contents |
|-------|----------|
| **ERC-8021** | Schema 0 codes — always includes platform code `celina`, then lowercase custom codes |

Example: `attributionTags: ["goclaim"]` → codes `celina`, `goclaim`.

Historical txs may also include a legacy UTF-8 `CELINA|…` layer. Readers (`verify` / `check`) still decode that layer when present; **new writes do not append it**.

Case rules for **custom tags** (before ERC-8021 lowercasing):

- App tags (e.g. `goclaim`, `celeste_ai`) → uppercase in normalize helpers (`GOCLAIM`, `CELESTE_AI`), then lowercase in ERC-8021 codes
- Celo Builders tags matching `celo_<12 hex>` → lowercase
- Tags are deduped in first-seen order; the literal tag `CELINA` / code `celina` is platform-only

## Where to set tags

| Client | When tags apply |
|--------|-----------------|
| `createCelinaClient({ attributionTags })` | Every `prepare*` step via `appendCelinaCalldataTag` |
| `createAAClient({ attributionTags })` | Every step with `data` in `sendPreparedFlow` |

Omit `attributionTags` on the AA client to **pass step `data` through unchanged** (useful when `prepare*` already tagged). Passing `[]` still applies the platform-only ERC-8021 code `celina`.

Use **one consistent tag list** per send path. Setting different lists on both the Celina client and the AA client can stack or mismatch suffixes.

Hand-built flows (no `prepare*`) that still need tags:

```ts
import { appendCelinaCalldataTag } from "@andrewkimjoseph/celina-sdk";

const data = appendCelinaCalldataTag(encodeFunctionData(...), ["goclaim"]);
```

## Check vs verify

| Tool / API | Prefer when |
|------------|-------------|
| **`check_attribution_tag`** / `checkAttributionInCalldata` | You want a unified custom `tags` list (excludes platform `CELINA` / `celina`) or to confirm one tag |
| **`verify_attribution_tag`** / `verifyAttributionInCalldata` | You need raw layers: optional historical `legacyTags` plus `erc8021` |

See [Configuration](../getting-started/configuration.md), [Prepared flows](../concepts/prepared-flows.md), and [Account Abstraction](account-abstraction.md).
