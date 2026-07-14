# On-chain attribution

Prepared and AA-submitted calldata can carry **dual** Celina attribution suffixes so indexers and agents can identify app traffic on Celo mainnet.

## Wire format

Every tagged step gets both layers:

| Layer | Contents |
|-------|----------|
| **Legacy UTF-8** | Starts with `CELINA`, then optional `\|TAG1\|TAG2…` |
| **ERC-8021** | Schema 0 codes via `toDataSuffix` — always includes platform code `celina`, then lowercase custom codes |

Example: `attributionTags: ["goclaim"]`

| Layer | Result |
|-------|--------|
| Legacy | `CELINA\|GOCLAIM` |
| ERC-8021 | codes `celina`, `goclaim` |

That is **not** the old bare UTF-8 suffix `stringToHex("GOCLAIM")`. Prefer Celina dual tags for new apps.

Case rules (legacy layer):

- App tags (e.g. `goclaim`, `celeste_ai`) → uppercase (`GOCLAIM`, `CELESTE_AI`)
- Celo Builders tags matching `celo_<12 hex>` → lowercase
- Tags are deduped in first-seen order; the literal tag `CELINA` is never duplicated as a custom tag

## Where to set tags

| Client | When tags apply |
|--------|-----------------|
| `createCelinaClient({ attributionTags })` | Every `prepare*` step via `appendCelinaCalldataTag` |
| `createAAClient({ attributionTags })` | Every step with `data` in `sendPreparedFlow` |

Omit `attributionTags` on the AA client to **pass step `data` through unchanged** (useful when `prepare*` already tagged). Passing `[]` still applies the platform-only dual suffix (`CELINA` + ERC-8021 `celina`).

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
| **`verify_attribution_tag`** / `verifyAttributionInCalldata` | You need the raw legacy string and ERC-8021 decode |

See [Configuration](../getting-started/configuration.md), [Prepared flows](../concepts/prepared-flows.md), and [Account Abstraction](account-abstraction.md).
