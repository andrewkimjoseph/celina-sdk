import { copyFileSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "src/clients/generated");
const destDir = join(root, "build/clients/generated");

mkdirSync(destDir, { recursive: true });

for (const name of readdirSync(srcDir)) {
  if (name.endsWith(".bundle.js")) {
    copyFileSync(join(srcDir, name), join(destDir, name));
  }
}
