import { cp, copyFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "out");

const rootFiles = (await readdir(root)).filter(
  (name) =>
    (name.endsWith(".html") && name !== "index.html") ||
    [".nojekyll", "ads.txt", "app-ads.txt", "CNAME", "readme.md"].includes(name),
);

await mkdir(out, { recursive: true });
for (const file of rootFiles) {
  await copyFile(path.join(root, file), path.join(out, file));
}

for (const directory of ["assets", "loops-drumless"]) {
  await cp(path.join(root, directory), path.join(out, directory), {
    recursive: true,
    force: true,
  });
}

// Compatibility alias used by the historical index2.html page.
await copyFile(
  path.join(root, "assets", "img", "logo.png"),
  path.join(out, "assets", "logo.png"),
);

console.log(
  `Legacy files copied unchanged: ${rootFiles.length} root files plus assets and loops-drumless.`,
);
