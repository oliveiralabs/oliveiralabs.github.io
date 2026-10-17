import Image from "next/image";
import Link from "next/link";
import { getCopy } from "@/lib/copy";
import { localizedPath } from "@/lib/site";
import type { Locale } from "@/lib/types";
import { StoreButtons } from "./StoreButtons";

export function SiteHeader({ locale }: { locale: Locale }) {
  const text = getCopy(locale);

  return (
    <header className="site-header">
      <div className="shell nav-shell">
        <Link className="brand" href={localizedPath("/", locale)} aria-label="Mega Drum">
          <Image src="/brand/megadrum-production.png" alt="" width={44} height={44} priority />
          <span>Mega Drum</span>
        </Link>
        <div className="header-download">
          <span>{text.nav.downloadNow}</span>
          <StoreButtons locale={locale} compact />
        </div>
      </div>
    </header>
  );
}
