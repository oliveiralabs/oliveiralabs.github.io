import { getAllKits } from "@/lib/catalog";
import { getCopy } from "@/lib/copy";
import type { Locale } from "@/lib/types";
import { SearchCatalog } from "./SearchCatalog";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function CatalogPage({ locale }: { locale: Locale }) {
  const text = getCopy(locale).catalog;
  return (
    <>
      <SiteHeader locale={locale} />
      <main>
        <section className="page-hero compact-hero">
          <div className="shell narrow">
            <p className="eyebrow">{text.eyebrow}</p>
            <h1>{text.title}</h1>
            <p className="lead">{text.body}</p>
          </div>
        </section>
        <div className="shell section catalog-section">
          <SearchCatalog kits={getAllKits()} locale={locale} />
        </div>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
