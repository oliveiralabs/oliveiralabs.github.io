import { createHash } from "node:crypto";
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(repositoryRoot, "static-contract.json");
const args = process.argv.slice(2);
const write = args.includes("--write");
const rootIndex = args.indexOf("--root");
const targetRoot = rootIndex >= 0 ? path.resolve(args[rootIndex + 1]) : repositoryRoot;

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

async function walk(directory, prefix = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const relative = path.posix.join(prefix, entry.name);
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) paths.push(...(await walk(absolute, relative)));
    else if (entry.isFile()) paths.push(relative);
  }
  return paths;
}

async function discoverContractPaths() {
  const rootEntries = await readdir(repositoryRoot, { withFileTypes: true });
  const rootFiles = rootEntries
    .filter(
      (entry) =>
        entry.isFile() &&
        ((entry.name.endsWith(".html") && !["404.html", "index.html"].includes(entry.name)) ||
          [".nojekyll", "ads.txt", "app-ads.txt", "readme.md"].includes(entry.name)),
    )
    .map((entry) => entry.name)
    .sort();

  const directoryFiles = (
    await Promise.all(
      ["assets", "loops-drumless"].map(async (directory) =>
        (await walk(path.join(repositoryRoot, directory), directory)).sort(),
      ),
    )
  ).flat();

  return [...rootFiles, ...directoryFiles];
}

if (write) {
  const paths = await discoverContractPaths();
  const files = [];
  for (const relative of paths) {
    const bytes = await readFile(path.join(repositoryRoot, relative));
    files.push({ path: relative, bytes: bytes.length, sha256: sha256(bytes) });
  }
  const manifest = {
    version: 1,
    description: "Public Oliveira Labs paths that must remain available without URL changes.",
    files,
  };
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Static contract written: ${files.length} protected paths.`);
  process.exit(0);
}

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const errors = [];
for (const expected of manifest.files) {
  const absolute = path.join(targetRoot, expected.path);
  try {
    const [info, bytes] = await Promise.all([stat(absolute), readFile(absolute)]);
    if (!info.isFile()) errors.push(`Not a file: ${expected.path}`);
    if (bytes.length !== expected.bytes) errors.push(`Size changed: ${expected.path}`);
    if (sha256(bytes) !== expected.sha256) errors.push(`Content changed: ${expected.path}`);
  } catch {
    errors.push(`Missing: ${expected.path}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Static contract verified: ${manifest.files.length} protected paths are unchanged.`);
