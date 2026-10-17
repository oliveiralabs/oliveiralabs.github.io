"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
    getCkyConsent?: () => {
      categories?: { advertisement?: boolean };
      isUserActionCompleted?: boolean;
    };
  }
}

const publisher = "ca-pub-4596253670073094";
const slot = process.env.NEXT_PUBLIC_ADSENSE_PLAY_SLOT?.trim();
const cookieYesKey = process.env.NEXT_PUBLIC_COOKIEYES_WEBSITE_KEY?.trim();

function advertisingConsentGranted(): boolean {
  const consent = window.getCkyConsent?.();
  return Boolean(consent?.isUserActionCompleted && consent.categories?.advertisement);
}

export function AdSenseDisplay({ className, label }: { className?: string; label: string }) {
  const [allowed, setAllowed] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const pushed = useRef(false);

  useEffect(() => {
    if (!slot || !cookieYesKey) return;
    const syncConsent = () => setAllowed(advertisingConsentGranted());
    syncConsent();
    document.addEventListener("cookieyes_banner_loaded", syncConsent);
    document.addEventListener("cookieyes_banner_load", syncConsent);
    document.addEventListener("cookieyes_consent_update", syncConsent);
    return () => {
      document.removeEventListener("cookieyes_banner_loaded", syncConsent);
      document.removeEventListener("cookieyes_banner_load", syncConsent);
      document.removeEventListener("cookieyes_consent_update", syncConsent);
    };
  }, []);

  useEffect(() => {
    if (!allowed || !slot) return;
    const existing = document.querySelector<HTMLScriptElement>("script[data-megadrum-adsense]");
    if (existing) {
      if (existing.dataset.loaded === "true") setScriptReady(true);
      else existing.addEventListener("load", () => setScriptReady(true), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.megadrumAdsense = "true";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisher}`;
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      setScriptReady(true);
    }, { once: true });
    document.head.appendChild(script);
  }, [allowed]);

  useEffect(() => {
    if (!allowed || !scriptReady || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // Ad blockers and empty development slots should not break the page.
    }
  }, [allowed, scriptReady]);

  if (!slot || !cookieYesKey || !allowed) return null;

  return (
    <aside className={className} aria-label={label}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={publisher}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
