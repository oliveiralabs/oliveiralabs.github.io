import Image from "next/image";
import Link from "next/link";
import { getCopy } from "@/lib/copy";
import { localizedPath } from "@/lib/site";
import type { Locale } from "@/lib/types";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function SiteHeader({ locale }: { locale: Locale }) {
  const text = getCopy(locale);

  return (
    <header className="site-header">
      <div className="shell nav-shell">
        <Link className="brand" href={localizedPath("/", locale)} aria-label="Mega Drum">
          <Image src="/brand/megadrum-production.png" alt="" width={44} height={44} priority />
          <span>Mega Drum</span>
        </Link>
        <nav aria-label="Primary navigation">
          <Link href={localizedPath("/", locale)}>{text.nav.home}</Link>
          <Link href={localizedPath("/kits/", locale)}>{text.nav.kits}</Link>
          <Link href={localizedPath("/help/", locale)}>{text.nav.help}</Link>
        </nav>
        <div className="nav-actions">
          <LanguageSwitcher locale={locale} code={text.languageCode} label={text.language} />
          <Link className="button button-small" href={localizedPath("/download/", locale)}>
            {text.nav.download}
          </Link>
        </div>
      </div>
    </header>
  );
}
