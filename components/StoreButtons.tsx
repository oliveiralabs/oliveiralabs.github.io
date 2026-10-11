import { appStoreUrl, googlePlayUrl } from "@/lib/site";
import { getCopy } from "@/lib/copy";
import type { Locale } from "@/lib/types";

export function StoreButtons({ locale, kitId }: { locale: Locale; kitId?: string }) {
  const text = getCopy(locale).stores;
  const suffix = kitId ? `&referrer=utm_source%3Dmegadrum.app%26utm_medium%3Dkit_page%26utm_content%3Dkit_${kitId}` : "";
  return (
    <div className="store-buttons">
      <a className="store-button" href={`${googlePlayUrl}${suffix}`} target="_blank" rel="noreferrer" data-event="click_google_play" data-kit-id={kitId}>
        <span className="store-mark" aria-hidden="true">▶</span>
        <span><small>Android</small><strong>{text.google}</strong></span>
      </a>
      <a className="store-button" href={appStoreUrl} target="_blank" rel="noreferrer" data-event="click_app_store" data-kit-id={kitId}>
        <span className="store-mark apple" aria-hidden="true">●</span>
        <span><small>iPhone &amp; iPad</small><strong>{text.apple}</strong></span>
      </a>
    </div>
  );
}
