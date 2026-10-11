import type { MetadataRoute } from "next";
import { isProductionIndexing, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: isProductionIndexing
      ? { userAgent: "*", allow: "/", disallow: ["/search/", "/pt/search/"] }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
