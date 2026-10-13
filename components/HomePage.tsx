import Image from "next/image";
import Link from "next/link";
import { getFeaturedKits } from "@/lib/catalog";
import { getCopy } from "@/lib/copy";
import { localizedPath } from "@/lib/site";
import type { Locale } from "@/lib/types";
import { KitGrid } from "./KitGrid";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { StoreButtons } from "./StoreButtons";

export function HomePage({ locale }: { locale: Locale }) {
  const text = getCopy(locale);
  const featured = getFeaturedKits();

  return (
    <>
      <a className="skip-link" href="#content">Skip to content</a>
      <SiteHeader locale={locale} />
      <main id="content">
        <section className="hero">
          <div className="shell hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">{text.hero.eyebrow}</p>
              <h1>{text.hero.title}</h1>
              <p className="lead">{text.hero.body}</p>
              <form className="hero-search" action={localizedPath("/search/", locale)}>
                <label className="sr-only" htmlFor={`home-search-${locale}`}>{text.hero.search}</label>
                <input id={`home-search-${locale}`} type="search" name="q" placeholder={text.hero.search} />
                <button type="submit">{text.hero.submit} <span aria-hidden="true">→</span></button>
              </form>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <Image src="/brand/megadrum-kit-center.webp" alt="" fill sizes="(max-width: 900px) 100vw, 50vw" priority />
            </div>
          </div>
        </section>

        <section className="section featured-section">
          <div className="shell">
            <div className="section-heading">
              <div><p className="eyebrow">{text.featured.eyebrow}</p><h2>{text.featured.title}</h2></div>
              <Link className="text-link" href={localizedPath("/kits/", locale)}>{text.featured.all} →</Link>
            </div>
            <KitGrid kits={featured} locale={locale} />
          </div>
        </section>

        <section className="section catalog-story">
          <div className="shell story-grid">
            <div><p className="eyebrow">{text.browse.eyebrow}</p><h2>{text.browse.title}</h2></div>
            <div><p className="lead compact">{text.browse.body}</p><Link className="button" href={localizedPath("/kits/", locale)}>{text.featured.all}</Link></div>
          </div>
        </section>

        <section className="section app-section">
          <div className="shell app-panel">
            <div className="app-copy">
              <p className="eyebrow">{text.app.eyebrow}</p>
              <h2>{text.app.title}</h2>
              <p>{text.app.body}</p>
              <StoreButtons locale={locale} />
            </div>
            <div className="app-visual">
              <Image src="/brand/megadrum-showcase.webp" alt="Mega Drum running on a phone" fill sizes="(max-width: 900px) 100vw, 46vw" />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
