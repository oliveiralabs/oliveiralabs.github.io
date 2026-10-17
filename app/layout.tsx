import type { Metadata, Viewport } from "next";
import "./globals.css";
import { isProductionIndexing, siteUrl } from "@/lib/site";
import { AdSenseAutoLoader } from "@/components/ads/AdSenseAutoLoader";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Mega Drum — Find your next drum kit", template: "%s — Mega Drum" },
  description: "Explore the public Mega Drum kit catalog, play online, and take your next drum setup to the mobile app.",
  applicationName: "Mega Drum",
  icons: { icon: "/brand/megadrum-production.png", apple: "/brand/megadrum-ios.png" },
  robots: isProductionIndexing ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: "Mega Drum",
    images: [{ url: "/brand/megadrum-showcase.webp", width: 1848, height: 819, alt: "Mega Drum app" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#f8f6f1", colorScheme: "light" };

const cookieYesWebsiteKey = process.env.NEXT_PUBLIC_COOKIEYES_WEBSITE_KEY?.trim();

const consentDefaults = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag("consent", "default", {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
  functionality_storage: "denied",
  personalization_storage: "denied",
  security_storage: "granted",
  wait_for_update: 2000
});
gtag("set", "ads_data_redaction", true);
gtag("set", "url_passthrough", false);
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      {cookieYesWebsiteKey ? (
        <head>
          <script dangerouslySetInnerHTML={{ __html: consentDefaults }} />
          <script
            id="cookieyes"
            type="text/javascript"
            src={`https://cdn-cookieyes.com/client_data/${cookieYesWebsiteKey}/script.js`}
          />
        </head>
      ) : null}
      <body><AdSenseAutoLoader />{children}</body>
    </html>
  );
}
