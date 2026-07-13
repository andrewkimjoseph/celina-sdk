# Prepared flows

Methods named `prepare*` return a **serialized prepared flow** — an ordered list of unsigned transactions for the user's wallet to sign.

## Supported prepare methods

| Method | Service | Typical steps |
|--------|---------|---------------|
| `prepareSend` | `transaction` | 1 (ERC-20 transfer; CELO uses GoldToken) |
| `prepareFx` | `mentoFx` | 1–2 (optional approve + swap) |
| `prepareSwap` | `uniswap` | 1–3 (optional ERC-20 + Permit2 approve + swap) |
| `prepareSupply` | `aave` | 1–2 (optional approve + supply) |
| `prepareWithdraw` | `aave` | 1 (withdraw) |
| `prepareClaimUbi` | `gooddollar` | 1 (UBI claim) |
| `prepareReserveSwap` | `gooddollar` | 1–2 (optional ERC-20 approve + MentoBroker `swapIn`) |

## SerializedPreparedFlow shape

```ts
{
  preparedFlow: true,
  steps: PreparedTx[],
  summary: string,       // human-readable label for UI
  from: `0x${string}`,
  network: "mainnet",
}
```

The `preparedFlow: true` discriminator makes it easy to detect prepared flows in chat APIs or JSON responses.

## PreparedTx fields

| Field | Type | Description |
|-------|------|-------------|
| `kind` | `"native" \| "erc20" \| "contract"` | Transaction category |
| `to` | `` `0x${string}` `` | Target contract or recipient |
| `data` | `` `0x${string}` `` (optional) | Calldata for contract calls |
| `value` | `string` (optional) | Wei amount as decimal string (JSON-safe) |
| `description` | `string` | Human-readable step label for UI |

### kind values

- **`native`** — Native-value transfer (`to` is recipient, `value` is wei); rare in Celina prepare flows
- **`erc20`** — ERC-20 call (`to` is token contract, `data` is encoded function). CELO sends use GoldToken (`0x471E…`) via token duality.
- **`contract`** — Generic contract call (Aave pool, Mento router, Universal Router, etc.)

## Multi-step flows

When an ERC-20 approval is required before a swap or supply, the SDK returns multiple steps in order:

```ts
const flow = await celina.mentoFx.prepareFx(from, "USDm", "EURm", "100");

// flow.steps might be:
// [0] Approve USDm for Mento FX
// [1] Swap 100 USDm → ~92 EURm
```

Sign and confirm each step sequentially. Do not skip or reorder steps.

## Sign-time simulation

Call `simulatePreparedStep` from `@andrewkimjoseph/celina-sdk/simulation` **per step, immediately before** `sendTransactionAsync` — after any prior step is mined. Simulation uses current chain state; simulating step 2 before step 1 confirms falsely fails with insufficient allowance.

Local stdio MCP **`execute_*`** tools use the same helper internally before signing with `CELO_PRIVATE_KEY`.

See [Prepared-step simulation](../guides/prepared-step-simulation.md).

Those MCP tools sign and broadcast with `CELO_PRIVATE_KEY` instead of returning unsigned flows to the user.

## JSON serialization

`value` fields are decimal strings (not BigInt) so flows serialize cleanly over JSON APIs:

```ts
import { serializePreparedFlow } from "@andrewkimjoseph/celina-sdk";

// prepare* methods already return serialized flows
const flow = await celina.transaction.prepareSend(from, to, "CELO", "1");
// flow.steps[0].value === "0" (amount is in transfer calldata)
```

When calling wagmi, convert back to BigInt:

```ts
value: step.value ? BigInt(step.value) : undefined
```

## Celina data suffix

Prepared calldata is tagged with dual Celina attribution suffixes (`appendCelinaCalldataTag`) for on-chain identification — sends, Mento FX, Uniswap, Aave, and GoodDollar. You do not need to modify `data` before passing it to wagmi.

### Legacy layer

Every tagged step includes a UTF-8 suffix starting with **`CELINA`**. Optional `attributionTags` on `createCelinaClient()` append custom tags:

```ts
createCelinaClient({
  attributionTags: ["celo_862c21dd97a7", "celeste_ai"],
});
// legacy → CELINA|celo_862c21dd97a7|CELESTE_AI
```

### ERC-8021 layer

The same tags are also encoded as an ERC-8021 Schema 0 suffix at the end of calldata (`toDataSuffix`), with platform code `celina` plus lowercase codes (e.g. `celo_862c21dd97a7`, `celeste_ai`). Use `verify_attribution_tag` or `@celo/attribution-tags` `verifyTx` to confirm.

Case normalization (legacy layer):

- App tags (e.g. `celeste_ai`) → uppercase (`CELESTE_AI`)
- Celo Builders tags matching `celo_<12 hex>` → lowercase (e.g. `celo_862c21dd97a7`)
- Tags are deduped in first-seen order; `CELINA` itself is never duplicated as a custom tag

See [Configuration](../getting-started/configuration.md) for the full options table.

## Related

- [Prepared-step simulation](../guides/prepared-step-simulation.md)
- [wagmi integration](../guides/wagmi-integration.md)
- [Send tokens](../guides/send-tokens.md)
- [Mento FX](../guides/mento-fx.md)
- [Uniswap v4](../guides/uniswap.md)
- [Aave](../guides/aave.md)
- [GoodDollar](../guides/gooddollar.md)
