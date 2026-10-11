import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "out");
const errors = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) => {
        const target = path.join(directory, entry.name);
        return entry.isDirectory() ? walk(target) : target;
      }),
    )
  ).flat();
}

async function exists(file) {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false;
  }
}

function candidates(urlPath) {
  const clean = decodeURI(urlPath.split(/[?#]/)[0]);
  const relative = clean.replace(/^\//, "");
  if (!relative) return [path.join(out, "index.html")];
  if (path.extname(relative)) return [path.join(out, relative)];
  return [path.join(out, relative, "index.html"), path.join(out, `${relative}.html`)];
}

const files = await walk(out);
const htmlFiles = files.filter((file) => file.endsWith(".html"));

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = match[1];
    if (!value.startsWith("/") || value.startsWith("//")) continue;
    const options = candidates(value);
    if (!(await Promise.any(options.map(async (candidate) => {
      if (await exists(candidate)) return true;
      throw new Error();
    })).catch(() => false))) {
      errors.push(`${path.relative(out, file)} -> ${value}`);
    }
  }
}

const kitPages = htmlFiles.filter((file) => /\/kit\/\d+\/[^/]+\/index\.html$/.test(file));
if (kitPages.length !== 294) errors.push(`Expected 294 localized kit pages, found ${kitPages.length}`);

for (const file of kitPages) {
  const html = await readFile(file, "utf8");
  if (!html.includes('name="robots" content="noindex, nofollow"')) errors.push(`Preview page is indexable: ${path.relative(out, file)}`);
  if (!html.includes('rel="canonical"')) errors.push(`Missing canonical: ${path.relative(out, file)}`);
}

const robots = await readFile(path.join(out, "robots.txt"), "utf8");
if (!robots.includes("Disallow: /")) errors.push("Preview robots.txt does not block crawling");

const sitemap = await readFile(path.join(out, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>/g)].length;
if (sitemapUrls !== 310) errors.push(`Expected 310 preview sitemap URLs, found ${sitemapUrls}`);

if (errors.length) {
  console.error(errors.slice(0, 100).join("\n"));
  if (errors.length > 100) console.error(`...and ${errors.length - 100} more errors`);
  process.exit(1);
}

console.log(`Static export verified: ${htmlFiles.length} HTML files, 294 kit pages, ${sitemapUrls} sitemap URLs, no broken internal references.`);
