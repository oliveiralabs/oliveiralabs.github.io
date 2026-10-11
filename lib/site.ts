import type { Locale } from "./types";

export const siteUrl = "https://megadrum.app";
export const googlePlayUrl =
  "https://play.google.com/store/apps/details?id=com.oliveiralabs.megadrum";
export const appStoreUrl =
  "https://apps.apple.com/app/mega-drum-drum-simulator/id6789980388";
export const isProductionIndexing =
  process.env.NEXT_PUBLIC_SITE_ENV === "production";

export function localizedPath(path: string, locale: Locale) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return locale === "pt" ? `/pt${normalized}` : normalized;
}

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}
