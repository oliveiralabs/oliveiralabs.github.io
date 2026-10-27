import type { Metadata } from "next";
import { absoluteUrl, isProductionIndexing } from "./site";
import type { Locale } from "./types";

export function pageMetadata({
  title,
  description,
  path,
  locale,
  index = true,
  image,
}: {
  title: string;
  description: string;
  path: string;
  locale: Locale;
  index?: boolean;
  image?: string;
}): Metadata {
  const enPath = locale === "pt" ? path.replace(/^\/pt/, "") || "/" : path;
  const ptPath = locale === "pt" ? path : `/pt${path === "/" ? "/" : path}`;
  const canIndex = isProductionIndexing && index;
  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: { en: enPath, "pt-BR": ptPath, "x-default": enPath },
    },
    robots: { index: canIndex, follow: isProductionIndexing },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      locale: locale === "pt" ? "pt_BR" : "en_US",
      alternateLocale: locale === "pt" ? ["en_US"] : ["pt_BR"],
      images: image ? [{ url: image }] : undefined,
    },
  };
}
