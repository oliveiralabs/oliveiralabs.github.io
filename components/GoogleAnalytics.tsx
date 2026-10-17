"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    getCkyConsent?: () => {
      categories?: { analytics?: boolean; advertisement?: boolean };
      isUserActionCompleted?: boolean;
    };
  }
}

export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready || !window.gtag) return;
    window.gtag("event", "page_view", {
      page_path: `${pathname}${window.location.search}`,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [measurementId, pathname, ready]);

  useEffect(() => {
    function trackTaggedClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-event]") : null;
      if (!target?.dataset.event || !window.gtag) return;
      window.gtag("event", target.dataset.event, {
        kit_id: target.dataset.kitId,
        link_url: target instanceof HTMLAnchorElement ? target.href : undefined,
      });
    }

    document.addEventListener("click", trackTaggedClick);
    return () => document.removeEventListener("click", trackTaggedClick);
  }, []);

  useEffect(() => {
    function syncAnalyticsConsent() {
      const consent = window.getCkyConsent?.();
      if (!consent?.isUserActionCompleted || !window.gtag) return;
      window.gtag("consent", "update", {
        analytics_storage: consent.categories?.analytics ? "granted" : "denied",
      });
    }

    syncAnalyticsConsent();
    document.addEventListener("cookieyes_banner_loaded", syncAnalyticsConsent);
    document.addEventListener("cookieyes_banner_load", syncAnalyticsConsent);
    document.addEventListener("cookieyes_consent_update", syncAnalyticsConsent);
    return () => {
      document.removeEventListener("cookieyes_banner_loaded", syncAnalyticsConsent);
      document.removeEventListener("cookieyes_banner_load", syncAnalyticsConsent);
      document.removeEventListener("cookieyes_consent_update", syncAnalyticsConsent);
    };
  }, []);

  return (
    <Script
      id="google-analytics"
      src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      strategy="afterInteractive"
      onLoad={() => {
        window.gtag?.("js", new Date());
        window.gtag?.("config", measurementId, { send_page_view: false });
        setReady(true);
      }}
    />
  );
}
