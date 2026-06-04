# LLM tool catalog (`@andrewkimjoseph/celina-sdk/tools`)

From **v0.5.0**, the SDK publishes a shared catalog of LLM-oriented tools: Zod input schemas, descriptions, and handlers that call `CelinaClient`. The same definitions power **celina-mcp** (`surface: "mcp"`) and **browser wallet apps** (`surface: "browser"`).

Use the programmatic client (`createCelinaClient`) when you only need reads and `prepare*` in TypeScript. Use the **`/tools` export** when you are building an **agent host** (MCP server, Vercel AI SDK chat API, custom orchestrator).

## Install and import

The catalog is a separate export path (keeps MCP/agent deps out of the default bundle for simple wagmi apps):

```bash
npm i @andrewkimjoseph/celina-sdk
```

```ts
import { createCelinaClient } from "@andrewkimjoseph/celina-sdk";
import {
  ALL_TOOL_DEFINITIONS,
  filterToolDefinitions,
  getBrowserToolNames,
  getMcpToolNames,
  type ToolDefinition,
  type ToolRuntime,
} from "@andrewkimjoseph/celina-sdk/tools";
```

Requires **Node.js ≥ 20**. Schemas are built with **Zod 3** (same major as this package’s dependency).

## What is a `ToolDefinition`?

Each catalog entry is a plain object:

| Field | Purpose |
|-------|---------|
| `name` | Snake_case tool id (e.g. `get_stablecoin_balances`) |
| `description` | Text shown to the model |
| `inputSchema` | Zod schema (`z.ZodTypeAny`) — keys must be **snake_case** |
| `families` | `"read"` \| `"prepare"` \| `"execute"` |
| `surfaces` | Optional: `"mcp"`, `"browser"`, or both (default: both) |
| `mcp` | Optional MCP metadata (title, annotations, `responseKind`) |
| `handler` | `(runtime, input) => Promise<unknown>` |

Handlers receive a **`ToolRuntime`**: `{ celina, resolveWallet, hooks?, executors?, mcpWallet? }`.

- **`celina`** — `ReturnType<typeof createCelinaClient>` (reads + unsigned prepare).
- **`resolveWallet(input?)`** — host supplies how `address` / `wallet_address` / `from` map to `0x…`.
- **`hooks`** — optional host overrides (e.g. send preflight, Carbon prepare enrichment). Browser chat hosts set these; MCP usually does not.
- **`executors`** — MCP-only signed execution (`sendToken`, `executeFx`, `execute_carbon_*`, etc.). Not used in wallet-signing browser apps.

## Filtering by host

```ts
const browserTools = filterToolDefinitions(ALL_TOOL_DEFINITIONS, {
  surface: "browser",
  carbonPrepareEnabled: true,
  carbonExecuteEnabled: false, // user signs in wallet; no server-key execute
});

const mcpTools = filterToolDefinitions(ALL_TOOL_DEFINITIONS, {
  surface: "mcp",
  carbonPrepareEnabled: true,
  carbonExecuteEnabled: true, // stdio with CELO_PRIVATE_KEY
});
```

| Option | Effect |
|--------|--------|
| `surface` | `"mcp"` or `"browser"` — only tools that list that surface |
| `families` | Subset: read / prepare / execute |
| `names` | Allow-list by tool name |
| `carbonPrepareEnabled` | `false` hides `prepare_carbon_*` |
| `carbonExecuteEnabled` | `false` hides `execute_carbon_*` |

Helpers: `getToolNames()`, `getMcpToolNames()`, `getBrowserToolNames()`, `getToolDefinition(name)`.

Catalog layout: `src/tools/domains/*.ts` (merged in `ALL_TOOL_DEFINITIONS`). Browser-only swap routing (`get_swap_quote`, `prepare_swap`) lives in `domains/browser.ts`.

## MCP host (reference)

**celina-mcp** registers the catalog with `@modelcontextprotocol/sdk` — no Vercel AI SDK involved:

1. Build `ToolRuntime` (SDK client + `resolveWallet` + optional `executors` for writes).
2. `filterToolDefinitions(..., { surface: "mcp", ... })`.
3. For each definition: `server.registerTool(name, { description, inputSchema }, handler)`.

See `celina-mcp` `registerSdkTools` / `sdk-register.ts` in the monorepo.

## Vercel AI SDK (browser chat API)

For `streamText` / `generateText`, wrap definitions with **`dynamicTool`**, not `tool()` in a tight loop.

Using `tool()` plus `ReturnType<typeof tool>` over dozens of Zod schemas makes TypeScript infer a huge union and can **OOM during `next build`** (`TS2589: Type instantiation is excessively deep`).

Recommended pattern:

```ts
import { dynamicTool, type FlexibleSchema, type ToolSet } from "ai";
import { createCelinaClient } from "@andrewkimjoseph/celina-sdk";
import {
  ALL_TOOL_DEFINITIONS,
  filterToolDefinitions,
  type ToolRuntime,
} from "@andrewkimjoseph/celina-sdk/tools";

const celina = createCelinaClient();
const connected = "0xYourAddress" as const;

const runtime: ToolRuntime = {
  celina,
  resolveWallet: (input) =>
    (input?.address ?? input?.wallet_address ?? input?.from ?? connected) as `0x${string}`,
  // hooks: { ... }  // optional host-specific prepare/send logic
};

const definitions = filterToolDefinitions(ALL_TOOL_DEFINITIONS, {
  surface: "browser",
  carbonPrepareEnabled: true,
  carbonExecuteEnabled: false,
});

const tools: ToolSet = {};
for (const def of definitions) {
  tools[def.name] = dynamicTool({
    description: def.description,
    // Break deep Zod inference (SDK schemas are Zod 3; cast for the checker only).
    inputSchema: def.inputSchema as unknown as FlexibleSchema<
      Record<string, unknown>
    >,
    execute: async (input) =>
      def.handler(runtime, input as Record<string, unknown>),
  });
}

// streamText({ model, tools, ... })
```

Runtime validation still uses each definition’s Zod schema inside the AI SDK; the cast only limits compile-time work.

### Zod versions

- **celina-sdk/tools** — Zod **3**
- **Vercel AI SDK** — supports Zod 3 or 4

If your app depends on Zod 4, keep using the catalog schemas as-is and the `unknown` → `FlexibleSchema` cast above. Aligning your app to Zod 3 avoids duplicate majors but is optional.

## Sample app (Celeste AI)

[Celeste AI](https://github.com/andrewkimjoseph/onchain-agents-hackathon/tree/main/celeste-ai) is a reference Next.js chat UI: `filterToolDefinitions(..., { surface: "browser" })`, wagmi signing, and host hooks in `celeste-ai/src/lib/chat-tools/sdk-adapter.ts` (send preflight, Carbon market-price fallback, `finalizeCarbonPrepare` via `hooks.carbon`). It is not part of the SDK surface types.

## Adding a new tool

1. **Implement logic** on `CelinaClient` (service method or shared util in `src/tools/`).
2. **Add a `ToolDefinition`** in `src/tools/domains/<domain>.ts` (or `browser.ts` for browser-only routing tools).
   - Use **snake_case** input keys.
   - Set `families` and `surfaces` (`["mcp"]`, `["browser"]`, or omit for both).
   - Call `resolveWalletFromRuntime` or `runtime.resolveWallet` for wallet-scoped reads/prepares.
3. **Export** via `domains/index.ts` if you added a new file.
4. **Wire the host:**
   - MCP: definitions are picked up automatically after filter; adjust Carbon options in `registerSdkTools` if needed.
   - Browser chat: extend `ToolRuntime.hooks` in your adapter if the tool needs host-specific behavior; update the app system prompt.
5. **Test:** `npm run test:unit` in celina-sdk (`tools-catalog.test.ts`); run integration tests in MCP or your browser app.

`validateToolCatalogSnakeCase()` (unit tests) guards non–snake_case Zod keys.

## Related exports

| Export | Use |
|--------|-----|
| `finalizeCarbonPrepare` | Package root — merge approve steps after Carbon REST prepare |
| `runCarbonPrepare` | Catalog helper for MCP-style Carbon prepare handlers |
| `getSwapQuoteWithFallback` / `prepareSwapWithFallback` | Browser swap routing (Mento + Uniswap) |
| Schemas in `tools` (`addressSchema`, …) | Reuse in custom tools |

## See also

- [Architecture](../concepts/architecture.md) — stack and wallet-address rules
- [Prepared flows](../concepts/prepared-flows.md) — `SerializedPreparedFlow` for `prepare_*` tools
- [Carbon DeFi](carbon.md) — Carbon tool split (read / prepare / execute)
- [MCP session wallet](mcp-session-wallet.md) — omitting address on MCP stdio
