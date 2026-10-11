export function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractKitId(path) {
  const match = /^online_kit_(\d+)$/.exec(path);
  if (!match) {
    throw new Error(`Invalid kit path: ${path}`);
  }
  return match[1];
}

export function publicKitRoute(kit, locale = "en") {
  const prefix = locale === "pt" ? "/pt" : "";
  return `${prefix}/kit/${kit.id}/${kit.slug}/`;
}

export function normalizeKit(entry, tier, editorial) {
  const id = extractKitId(entry.path);
  const overrides = editorial.metadata[id] ?? {};
  const name = overrides.name ?? entry.name;

  return {
    id,
    sourceKey: entry.path,
    name,
    slug: slugify(name),
    tier,
    version: entry.version == null ? null : String(entry.version),
    cover: `/catalog/kits/${id}/cover.png`,
    sourceCoverUrl: entry.coverUrl,
    approvedForIndexing: editorial.approvedForIndexing.includes(id),
    featured: editorial.featured.includes(id),
    description: overrides.description ?? null,
    descriptionPt: overrides.descriptionPt ?? null,
    tags: overrides.tags ?? [],
  };
}
