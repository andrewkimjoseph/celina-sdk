import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { setEventsStatsFetchForTests } from "../../src/analytics/events-stats.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

/** Catalog tests must not post read telemetry to production. The live smoke clears this. */
setEventsStatsFetchForTests((() =>
  Promise.resolve(new Response(null, { status: 204 })),
) as typeof fetch);

for (const file of [".env", ".env.local"]) {
  const envPath = path.join(root, file);
  if (existsSync(envPath)) {
    config({ path: envPath, quiet: true, override: false });
  }
}
