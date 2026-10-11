import Image from "next/image";
import Link from "next/link";
import { getCopy } from "@/lib/copy";
import { kitDescription, kitRoute, relatedKits } from "@/lib/catalog";
import { absoluteUrl, localizedPath } from "@/lib/site";
import type { Kit, Locale } from "@/lib/types";
import { KitGrid } from "./KitGrid";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { StoreButtons } from "./StoreButtons";

export function KitDetailPage({ kit, locale }: { kit: Kit; locale: Locale }) {
  const text = getCopy(locale).kit;
  const description = kitDescription(kit, locale);
  const canonical = absoluteUrl(kitRoute(kit, locale));
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: text.breadcrumbHome, item: absoluteUrl(localizedPath("/", locale)) },
      { "@type": "ListItem", position: 2, name: text.breadcrumbKits, item: absoluteUrl(localizedPath("/kits/", locale)) },
      { "@type": "ListItem", position: 3, name: kit.name, item: canonical },
    ],
  };

  return (
    <>
      <SiteHeader locale={locale} />
      <main>
        <div className="shell kit-breadcrumb" aria-label="Breadcrumb">
          <Link href={localizedPath("/", locale)}>{text.breadcrumbHome}</Link><span>/</span>
          <Link href={localizedPath("/kits/", locale)}>{text.breadcrumbKits}</Link><span>/</span>
          <span aria-current="page">{kit.name}</span>
        </div>
        <section className="shell kit-detail">
          <div className="kit-detail-cover">
            <Image src={kit.cover} alt={locale === "pt" ? `Kit de bateria ${kit.name}` : `${kit.name} drum kit`} fill priority sizes="(max-width: 900px) 100vw, 54vw" />
          </div>
          <div className="kit-detail-copy">
            <p className="eyebrow">{text.available}</p>
            <h1>{kit.name}</h1>
            <p className="lead compact">{description}</p>
            <dl className="kit-facts">
              <div><dt>{text.id}</dt><dd>{kit.sourceKey}</dd></div>
              <div><dt>{text.access}</dt><dd>{kit.tier === "premium" ? text.premium : text.free}</dd></div>
            </dl>
            <h2 className="cta-heading">{text.use}</h2>
            <StoreButtons locale={locale} kitId={kit.id} />
            <p className="microcopy">{text.note}</p>
          </div>
        </section>
        <section className="section related-section">
          <div className="shell">
            <div className="section-heading"><h2>{text.more}</h2></div>
            <KitGrid kits={relatedKits(kit)} locale={locale} />
          </div>
        </section>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
