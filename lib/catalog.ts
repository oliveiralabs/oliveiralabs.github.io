import catalogData from "@/data/generated/catalog.json";
import type { Kit, Locale } from "./types";

const kits = catalogData as Kit[];

export function getAllKits() {
  return kits;
}

export function getFeaturedKits() {
  return kits.filter((kit) => kit.featured);
}

export function getKit(id: string) {
  return kits.find((kit) => kit.id === id);
}

export function kitRoute(kit: Kit, locale: Locale = "en") {
  const prefix = locale === "pt" ? "/pt" : "";
  return `${prefix}/kit/${kit.id}/${kit.slug}/`;
}

export function kitDescription(kit: Kit, locale: Locale) {
  if (locale === "pt") {
    return (
      kit.descriptionPt ??
      `Explore ${kit.name}, kit ${kit.id} do catálogo Mega Drum. Veja a capa e abra o aplicativo para tocar com este kit.`
    );
  }
  return (
    kit.description ??
    `Explore ${kit.name}, kit ${kit.id} from the Mega Drum catalog. See its artwork and open the app to play this kit.`
  );
}

export function relatedKits(kit: Kit, limit = 4) {
  const sameTier = kits.filter(
    (candidate) => candidate.id !== kit.id && candidate.tier === kit.tier,
  );
  const start = Math.max(
    0,
    sameTier.findIndex((candidate) => Number(candidate.id) > Number(kit.id)) - 1,
  );
  return [...sameTier.slice(start, start + limit), ...sameTier]
    .filter(
      (candidate, index, list) =>
        list.findIndex((item) => item.id === candidate.id) === index,
    )
    .slice(0, limit);
}
