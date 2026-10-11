import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "out");
const errors = [];

const hash = async (file) =>
  createHash("sha256").update(await readFile(file)).digest("hex");

const files = (await readdir(root)).filter(
  (name) =>
    (name.endsWith(".html") && name !== "index.html") ||
    ["ads.txt", "app-ads.txt", "CNAME", "readme.md"].includes(name),
);

for (const file of files) {
  const source = path.join(root, file);
  const target = path.join(out, file);
  try {
    if ((await hash(source)) !== (await hash(target))) {
      errors.push(`Content changed while copying: ${file}`);
    }
  } catch {
    errors.push(`Missing legacy output: ${file}`);
  }
}

for (const required of [
  "assets/img/new-mega-drum.png",
  "loops-drumless/index.json",
  "privacy-policy-percussion.html",
  "privacy-policy-megadrum.html",
  "account-delete-percussion.html",
  "googlefb0aa4cac85edf36.html",
]) {
  try {
    const info = await stat(path.join(out, required));
    if (!info.isFile()) errors.push(`Required legacy path is not a file: ${required}`);
  } catch {
    errors.push(`Required legacy path is missing: ${required}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Legacy contract verified: ${files.length} root files preserved byte-for-byte.`);
