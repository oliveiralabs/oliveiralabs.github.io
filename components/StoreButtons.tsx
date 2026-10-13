import Image from "next/image";
import { appStoreUrl, googlePlayUrl } from "@/lib/site";
import { getCopy } from "@/lib/copy";
import type { Locale } from "@/lib/types";

export function StoreButtons({ locale, kitId }: { locale: Locale; kitId?: string }) {
  const text = getCopy(locale).stores;
  const suffix = kitId ? `&referrer=utm_source%3Dmegadrum.app%26utm_medium%3Dkit_page%26utm_content%3Dkit_${kitId}` : "";
  return (
    <div className="store-buttons">
      <a className="store-button store-button-apple" href={appStoreUrl} target="_blank" rel="noreferrer" aria-label={text.apple} data-event="click_app_store" data-kit-id={kitId}>
        <Image src="/brand/store/app-store-en.svg" alt={text.apple} width={120} height={40} />
      </a>
      <a className="store-button store-button-google" href={`${googlePlayUrl}${suffix}`} target="_blank" rel="noreferrer" aria-label={text.google} data-event="click_google_play" data-kit-id={kitId}>
        <Image src={locale === "pt" ? "/brand/store/google-play-pt-br.png" : "/brand/store/google-play-en.png"} alt={text.google} width={155} height={60} />
      </a>
    </div>
  );
}
