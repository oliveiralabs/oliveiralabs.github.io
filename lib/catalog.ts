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
      `Explore ${kit.name}, um kit oficial do catálogo Mega Drum. Veja a capa e abra o aplicativo para tocar com este kit.`
    );
  }
  return (
    kit.description ??
    `Explore ${kit.name}, an official kit from the Mega Drum catalog. See its artwork and open the app to play this kit.`
  );
}

export function kitAccessLabel(kit: Kit, locale: Locale) {
  const labels = {
    en: {
      app_unlock: "Unlock in the app",
      task: "Unlock with an in-app task",
      lesson: "Unlock through Lessons",
      premium: "Premium access",
    },
    pt: {
      app_unlock: "Desbloqueio no app",
      task: "Desbloqueio com uma tarefa no app",
      lesson: "Desbloqueio pelo modo Lições",
      premium: "Acesso Premium",
    },
  } as const;
  return labels[locale][kit.access];
}

export function relatedKits(kit: Kit, limit = 4) {
  const sameAccess = kits.filter(
    (candidate) => candidate.id !== kit.id && candidate.isPremium === kit.isPremium,
  );
  const start = Math.max(
    0,
    sameAccess.findIndex((candidate) => candidate.sortOrder > kit.sortOrder) - 1,
  );
  return [...sameAccess.slice(start, start + limit), ...sameAccess]
    .filter(
      (candidate, index, list) =>
        list.findIndex((item) => item.id === candidate.id) === index,
    )
    .slice(0, limit);
}
