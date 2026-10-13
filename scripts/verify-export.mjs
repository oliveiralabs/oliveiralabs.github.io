import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "out");
const errors = [];
const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";
const catalog = JSON.parse(
  await readFile(path.join(root, "data", "generated", "catalog.json"), "utf8"),
);
const approvedIds = new Set(
  catalog.filter((kit) => kit.approvedForIndexing).map((kit) => kit.id),
);

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

const kitPages = htmlFiles.filter((file) =>
  /\/kit\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\/[^/]+\/index\.html$/i.test(file),
);
if (kitPages.length !== 294) errors.push(`Expected 294 localized kit pages, found ${kitPages.length}`);

for (const file of kitPages) {
  const html = await readFile(file, "utf8");
  const match = file.match(/\/kit\/([0-9a-f-]{36})\//i);
  const shouldIndex = isProduction && match && approvedIds.has(match[1]);
  const isNoIndex = html.includes('name="robots" content="noindex, nofollow"');
  if (shouldIndex && isNoIndex) errors.push(`Approved production page is not indexable: ${path.relative(out, file)}`);
  if (!shouldIndex && !isNoIndex) errors.push(`Unapproved page is indexable: ${path.relative(out, file)}`);
  if (!html.includes('rel="canonical"')) errors.push(`Missing canonical: ${path.relative(out, file)}`);
}

const robots = await readFile(path.join(out, "robots.txt"), "utf8");
if (isProduction) {
  if (!robots.includes("Allow: /")) errors.push("Production robots.txt does not allow crawling");
  if (!robots.includes("Disallow: /search/")) errors.push("Production robots.txt does not exclude search pages");
} else if (!robots.includes("Disallow: /")) {
  errors.push("Preview robots.txt does not block crawling");
}

const sitemap = await readFile(path.join(out, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>/g)].length;
const expectedSitemapUrls = isProduction ? 16 + approvedIds.size * 2 : 310;
if (sitemapUrls !== expectedSitemapUrls) errors.push(`Expected ${expectedSitemapUrls} sitemap URLs, found ${sitemapUrls}`);

if (errors.length) {
  console.error(errors.slice(0, 100).join("\n"));
  if (errors.length > 100) console.error(`...and ${errors.length - 100} more errors`);
  process.exit(1);
}

console.log(`Static ${isProduction ? "production" : "preview"} export verified: ${htmlFiles.length} HTML files, 294 kit pages, ${sitemapUrls} sitemap URLs, no broken internal references.`);
