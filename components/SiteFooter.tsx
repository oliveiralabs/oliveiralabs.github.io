import Image from "next/image";
import Link from "next/link";
import { getCopy } from "@/lib/copy";
import { localizedPath } from "@/lib/site";
import type { Locale } from "@/lib/types";

export function SiteFooter({ locale }: { locale: Locale }) {
  const text = getCopy(locale);
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Link className="brand" href={localizedPath("/", locale)}>
            <Image src="/brand/new-mega-drum.png" alt="" width={44} height={44} />
            <span>Mega Drum</span>
          </Link>
          <p>{text.footer.line}</p>
        </div>
        <div>
          <h2>{text.footer.discover}</h2>
          <Link href={localizedPath("/kits/", locale)}>{text.nav.kits}</Link>
          <Link href={localizedPath("/download/", locale)}>{text.nav.download}</Link>
          <Link href={localizedPath("/help/", locale)}>{text.nav.help}</Link>
        </div>
        <div>
          <h2>{text.footer.legal}</h2>
          <Link href={localizedPath("/privacy/", locale)}>{text.footer.privacy}</Link>
          <Link href={localizedPath("/terms/", locale)}>{text.footer.terms}</Link>
          <Link href={localizedPath("/copyright/", locale)}>{text.footer.copyright}</Link>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>{text.footer.rights}</span>
        <a href="mailto:antonio.filho128@gmail.com">antonio.filho128@gmail.com</a>
      </div>
    </footer>
  );
}
