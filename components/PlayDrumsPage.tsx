import { getAllKits, getFeaturedKits, getKit } from "@/lib/catalog";
import { DRUM_KITS } from "@/lib/drum/kits";
import type { Locale } from "@/lib/types";
import { PlayDrumsExperience } from "./PlayDrumsExperience";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function PlayDrumsPage({ locale }: { locale: Locale }) {
  const playableIds = new Set(DRUM_KITS.map((kit) => kit.id));
  const playableKits = DRUM_KITS.map((kit) => getKit(kit.id)).filter((kit) => kit !== undefined);
  const featuredKits = getFeaturedKits().filter((kit) => !playableIds.has(kit.id));
  const featuredIds = new Set(featuredKits.map((kit) => kit.id));
  const catalogKits = getAllKits().filter(
    (kit) => !playableIds.has(kit.id) && !featuredIds.has(kit.id),
  );
  const appKits = [...featuredKits, ...catalogKits].slice(0, 18);

  return (
    <>
      <a className="skip-link" href="#content">Skip to content</a>
      <SiteHeader locale={locale} />
      <main id="content">
        <PlayDrumsExperience locale={locale} playableKits={playableKits} appKits={appKits} />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
