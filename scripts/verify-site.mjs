import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");
const errors = [];
const contract = JSON.parse(await readFile(path.join(root, "static-contract.json"), "utf8"));
const protectedPaths = new Set(contract.files.map((entry) => entry.path));

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(absolute)));
    else files.push(absolute);
  }
  return files;
}

function localTarget(url) {
  const clean = url.split(/[?#]/)[0];
  if (!clean.startsWith("/") || clean.startsWith("//")) return null;
  if (clean === "/") return path.join(output, "index.html");
  if (path.extname(clean)) return path.join(output, clean);
  return path.join(output, clean, "index.html");
}

const files = await walk(output);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const relative = path.relative(output, file);
  if (!protectedPaths.has(relative)) {
    if (!html.includes('lang="pt-BR"')) errors.push(`${relative}: idioma ausente`);
    if (!html.includes("<main")) errors.push(`${relative}: main ausente`);
    if (!html.includes("<title>")) errors.push(`${relative}: title ausente`);
  }
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = localTarget(match[1]);
    if (!target) continue;
    try {
      await access(target);
    } catch {
      errors.push(`${path.relative(output, file)}: referência ausente ${match[1]}`);
    }
  }
}

for (const required of ["index.html", "apps/index.html", "sobre/index.html", "suporte/index.html", "404.html", "sitemap.xml", "robots.txt", ".nojekyll"]) {
  try {
    await access(path.join(output, required));
  } catch {
    errors.push(`Saída obrigatória ausente: ${required}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Site verified: ${htmlFiles.length} HTML files and ${files.length} total files.`);
