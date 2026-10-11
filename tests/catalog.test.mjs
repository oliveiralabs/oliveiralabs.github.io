import test from "node:test";
import assert from "node:assert/strict";
import {
  extractKitId,
  normalizeKit,
  publicKitRoute,
  slugify,
} from "../scripts/catalog-utils.mjs";

test("slugify produces stable ASCII slugs", () => {
  assert.equal(slugify("Forró 2024"), "forro-2024");
  assert.equal(slugify("Guns n' Roses"), "guns-n-roses");
});

test("kit identity is taken from the stable source key", () => {
  assert.equal(extractKitId("online_kit_1032"), "1032");
  assert.throws(() => extractKitId("kit-1032"));
});

test("routes remain unique when two kits share a slug", () => {
  const editorial = { approvedForIndexing: [], featured: [], metadata: {} };
  const a = normalizeKit(
    { name: "Metallica Lars", path: "online_kit_75", coverUrl: "a" },
    "free",
    editorial,
  );
  const b = normalizeKit(
    { name: "Metallica Lars", path: "online_kit_116", coverUrl: "b" },
    "free",
    editorial,
  );
  assert.notEqual(publicKitRoute(a), publicKitRoute(b));
  assert.equal(publicKitRoute(a, "pt"), "/pt/kit/75/metallica-lars/");
});
