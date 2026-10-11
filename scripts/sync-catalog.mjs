import { copyFile, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeKit } from "./catalog-utils.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "data", "source");
const generatedDir = path.join(root, "data", "generated");
const publicCatalogDir = path.join(root, "public", "catalog", "kits");
const publicBrandDir = path.join(root, "public", "brand");
const editorial = JSON.parse(
  await readFile(path.join(root, "data", "editorial", "kits.json"), "utf8"),
);

const entries = JSON.parse(
  await readFile(path.join(sourceDir, "supabase-kits.json"), "utf8"),
);
const kits = entries.map((entry) => normalizeKit(entry, editorial));
kits.sort((a, b) => a.sortOrder - b.sortOrder);

await mkdir(publicCatalogDir, { recursive: true });
const validIds = new Set(kits.map((kit) => kit.id));
for (const item of await readdir(publicCatalogDir, { withFileTypes: true })) {
  if (item.isDirectory() && !validIds.has(item.name)) {
    await rm(path.join(publicCatalogDir, item.name), { recursive: true, force: true });
  }
}

for (const kit of kits) {
  const targetDir = path.join(publicCatalogDir, kit.id);
  const target = path.join(targetDir, "cover.png");
  await mkdir(targetDir, { recursive: true });
  if (existsSync(target) && process.env.MEGADRUM_REFRESH_ASSETS !== "1") continue;

  const response = await fetch(kit.sourceCoverUrl, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(`Cover download failed (${response.status}): ${kit.sourceCoverUrl}`);
  }
  await writeFile(target, Buffer.from(await response.arrayBuffer()));
}

await mkdir(publicBrandDir, { recursive: true });
for (const file of [
  "new-mega-drum.png",
  "megadrum-ios.png",
  "megadrum-kit-center.webp",
  "megadrum-showcase.webp",
]) {
  await copyFile(
    path.join(root, "assets", "img", file),
    path.join(publicBrandDir, file),
  );
}

await mkdir(generatedDir, { recursive: true });
await writeFile(
  path.join(generatedDir, "catalog.json"),
  `${JSON.stringify(kits, null, 2)}\n`,
);

console.log(`Catalog synchronized from Supabase snapshot: ${kits.length} kits, covers only.`);
