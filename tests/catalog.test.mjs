import test from "node:test";
import assert from "node:assert/strict";
import {
  isUuid,
  kitAccess,
  normalizeKit,
  publicKitRoute,
  slugify,
} from "../scripts/catalog-utils.mjs";

test("slugify produces stable ASCII slugs", () => {
  assert.equal(slugify("Forró 2024"), "forro-2024");
  assert.equal(slugify("Guns n' Roses"), "guns-n-roses");
});

test("kit identity is the UUID used by the current app", () => {
  assert.equal(isUuid("4ab74d1d-cdcf-417e-9053-070de6ab7b52"), true);
  assert.equal(isUuid("online_kit_1032"), false);
});

test("routes remain unique when two kits share a slug", () => {
  const editorial = { approvedForIndexing: [], featured: [], metadata: {} };
  const a = normalizeKit(
    { id: "4ab74d1d-cdcf-417e-9053-070de6ab7b52", name: "Metallica Lars", cover_url: "https://example.com/a.png", sort_order: 1 },
    editorial,
  );
  const b = normalizeKit(
    { id: "94f0aefc-2383-4525-ba19-c43788d25fc8", name: "Metallica Lars", cover_url: "https://example.com/b.png", sort_order: 2 },
    editorial,
  );
  assert.notEqual(publicKitRoute(a), publicKitRoute(b));
  assert.equal(publicKitRoute(a, "pt"), "/pt/kit/4ab74d1d-cdcf-417e-9053-070de6ab7b52/metallica-lars/");
});

test("access rules reflect the current app catalog flags", () => {
  assert.equal(kitAccess({ is_premium: true }), "premium");
  assert.equal(kitAccess({ need_user_task: true }), "task");
  assert.equal(kitAccess({ unlock_lesson_id: "lesson-id" }), "lesson");
  assert.equal(kitAccess({}), "app_unlock");
});
