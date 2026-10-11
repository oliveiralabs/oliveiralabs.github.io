import Image from "next/image";
import Link from "next/link";
import { getCopy } from "@/lib/copy";
import { kitRoute } from "@/lib/catalog";
import type { Kit, Locale } from "@/lib/types";

export function KitCard({ kit, locale }: { kit: Kit; locale: Locale }) {
  const text = getCopy(locale).kit;
  return (
    <Link className="kit-card" href={kitRoute(kit, locale)}>
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
          <small>{kit.tier === "premium" ? text.premium : text.free}</small>
          <strong>{kit.name}</strong>
        </span>
        <span className="card-arrow" aria-hidden="true">↗</span>
      </span>
    </Link>
  );
}
