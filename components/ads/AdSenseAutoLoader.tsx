"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    getCkyConsent?: () => {
      categories?: { analytics?: boolean; advertisement?: boolean };
      isUserActionCompleted?: boolean;
    };
  }
}

const publisher = "ca-pub-4596253670073094";
const enabled = process.env.NEXT_PUBLIC_ADSENSE_AUTO_ADS === "true";
const cookieYesKey = process.env.NEXT_PUBLIC_COOKIEYES_WEBSITE_KEY?.trim();

function advertisingConsentGranted(): boolean {
  const consent = window.getCkyConsent?.();
  return Boolean(consent?.isUserActionCompleted && consent.categories?.advertisement);
}

function loadAdSense() {
  if (document.querySelector("script[data-megadrum-adsense]")) return;
  const script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.dataset.megadrumAdsense = "true";
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisher}`;
  script.addEventListener("load", () => { script.dataset.loaded = "true"; }, { once: true });
  document.head.appendChild(script);
}

export function AdSenseAutoLoader() {
  useEffect(() => {
    if (!enabled || !cookieYesKey) return;
    const syncConsent = () => {
      if (advertisingConsentGranted()) loadAdSense();
    };
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

  return null;
}
