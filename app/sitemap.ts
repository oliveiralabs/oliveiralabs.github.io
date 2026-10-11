import type { MetadataRoute } from "next";
import { getAllKits, kitRoute } from "@/lib/catalog";
import { isProductionIndexing, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

const coreRoutes = ["/", "/kits/", "/download/", "/about/", "/help/", "/privacy/", "/terms/", "/copyright/"];

export default function sitemap(): MetadataRoute.Sitemap {
  const core = coreRoutes.flatMap((route) => [
    { url: new URL(route, siteUrl).toString(), changeFrequency: "weekly" as const, priority: route === "/" ? 1 : 0.7 },
    { url: new URL(`/pt${route}`, siteUrl).toString(), changeFrequency: "weekly" as const, priority: route === "/" ? 0.9 : 0.6 },
  ]);
  const kits = getAllKits()
    .filter((kit) => !isProductionIndexing || kit.approvedForIndexing)
    .flatMap((kit) => [
      { url: new URL(kitRoute(kit, "en"), siteUrl).toString(), changeFrequency: "monthly" as const, priority: 0.8 },
      { url: new URL(kitRoute(kit, "pt"), siteUrl).toString(), changeFrequency: "monthly" as const, priority: 0.7 },
    ]);
  return [...core, ...kits];
}
