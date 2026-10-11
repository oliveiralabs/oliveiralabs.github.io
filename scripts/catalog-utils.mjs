export function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value) {
  return UUID_PATTERN.test(value);
}

export function publicKitRoute(kit, locale = "en") {
  const prefix = locale === "pt" ? "/pt" : "";
  return `${prefix}/kit/${kit.id}/${kit.slug}/`;
}

export function kitAccess(entry) {
  if (entry.is_premium) return "premium";
  if (entry.need_user_task) return "task";
  if (entry.unlock_lesson_id) return "lesson";
  return "app_unlock";
}

export function normalizeKit(entry, editorial) {
  const id = entry.id;
  if (!isUuid(id)) throw new Error(`Invalid Supabase kit id: ${id}`);
  const overrides = editorial.metadata[id] ?? {};
  const name = overrides.name ?? entry.name;

  return {
    id,
    name,
    slug: slugify(name),
    access: kitAccess(entry),
    isPremium: Boolean(entry.is_premium),
    isDefault: Boolean(entry.is_default),
    needUserTask: Boolean(entry.need_user_task),
    unlockLessonId: entry.unlock_lesson_id ?? null,
    sortOrder: Number(entry.sort_order),
    cover: `/catalog/kits/${id}/cover.png`,
    sourceCoverUrl: entry.cover_url,
    approvedForIndexing: editorial.approvedForIndexing.includes(id),
    featured: editorial.featured.includes(id),
    description: overrides.description ?? null,
    descriptionPt: overrides.descriptionPt ?? null,
    tags: overrides.tags ?? [],
  };
}
