import { KitCard } from "./KitCard";
import type { Kit, Locale } from "@/lib/types";

export function KitGrid({ kits, locale }: { kits: Kit[]; locale: Locale }) {
  return (
    <div className="kit-grid">
      {kits.map((kit) => (
        <KitCard key={kit.id} kit={kit} locale={locale} />
      ))}
    </div>
  );
}
