import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const kits = JSON.parse(
  await readFile(path.join(root, "data", "generated", "catalog.json"), "utf8"),
);

const errors = [];
const ids = new Set();
const sourceKeys = new Set();

for (const kit of kits) {
  if (!kit.id || !kit.name || !kit.slug || !kit.sourceKey) {
    errors.push(`Kit has missing required data: ${JSON.stringify(kit)}`);
  }
  if (ids.has(kit.id)) errors.push(`Duplicate kit id: ${kit.id}`);
  if (sourceKeys.has(kit.sourceKey)) errors.push(`Duplicate source key: ${kit.sourceKey}`);
  ids.add(kit.id);
  sourceKeys.add(kit.sourceKey);

  const coverPath = path.join(root, "public", kit.cover.replace(/^\//, ""));
  try {
    const info = await stat(coverPath);
    if (!info.isFile() || info.size < 100) errors.push(`Invalid cover: ${coverPath}`);
  } catch {
    errors.push(`Missing cover: ${coverPath}`);
  }
}

if (kits.length !== 147) {
  errors.push(`Expected 147 catalog entries, found ${kits.length}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const duplicateSlugs = Object.entries(
  Object.groupBy(kits, (kit) => kit.slug),
).filter(([, group]) => group.length > 1);

console.log(
  `Catalog valid: ${kits.length} kits, ${duplicateSlugs.length} expected slug collisions resolved by stable ids.`,
);
