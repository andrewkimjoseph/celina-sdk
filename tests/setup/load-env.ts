import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

for (const file of [".env", ".env.local"]) {
  const envPath = path.join(root, file);
  if (existsSync(envPath)) {
    config({ path: envPath, quiet: true, override: false });
  }
}
