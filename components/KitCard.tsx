import Image from "next/image";
import Link from "next/link";
import { kitAccessLabel, kitRoute } from "@/lib/catalog";
import type { Kit, Locale } from "@/lib/types";

export function KitCard({ kit, locale, mutedCover = false }: { kit: Kit; locale: Locale; mutedCover?: boolean }) {
  return (
    <Link className={`kit-card${mutedCover ? " kit-card-muted" : ""}`} href={kitRoute(kit, locale)}>
      <span className="kit-cover">
        <Image
          src={kit.cover}
          alt={locale === "pt" ? `Kit de bateria ${kit.name}` : `${kit.name} drum kit`}
          fill
          sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
        />
      </span>
      <span className="kit-card-copy">
        <span>
          <small>{kitAccessLabel(kit, locale)}</small>
          <strong>{kit.name}</strong>
        </span>
        <span className="card-arrow" aria-hidden="true">↗</span>
      </span>
    </Link>
  );
}
