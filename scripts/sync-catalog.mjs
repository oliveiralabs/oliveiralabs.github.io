import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
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

const sources = [
  {
    tier: "free",
    snapshot: path.join(sourceDir, "free.json"),
    localRepo:
      process.env.MEGADRUM_FREE_KITS_REPO ??
      path.resolve(root, "..", "megadrum-kits"),
  },
  {
    tier: "premium",
    snapshot: path.join(sourceDir, "premium.json"),
    localRepo:
      process.env.MEGADRUM_PREMIUM_KITS_REPO ??
      path.resolve(root, "..", "megadrum-kits-premium"),
  },
];

const kits = [];

for (const source of sources) {
  const entries = JSON.parse(await readFile(source.snapshot, "utf8"));
  for (const entry of entries) {
    const kit = normalizeKit(entry, source.tier, editorial);
    const targetDir = path.join(publicCatalogDir, kit.id);
    const target = path.join(targetDir, "cover.png");
    const localCover = path.join(source.localRepo, kit.id, "cover.png");
    await mkdir(targetDir, { recursive: true });

    if (existsSync(localCover)) {
      await copyFile(localCover, target);
    } else {
      const response = await fetch(entry.coverUrl, { redirect: "follow" });
      if (!response.ok) {
        throw new Error(`Cover download failed (${response.status}): ${entry.coverUrl}`);
      }
      await writeFile(target, Buffer.from(await response.arrayBuffer()));
    }

    kits.push(kit);
  }
}

kits.sort((a, b) => Number(a.id) - Number(b.id));

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

console.log(`Catalog synchronized: ${kits.length} kits, covers only.`);
