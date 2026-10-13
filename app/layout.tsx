import type { Metadata, Viewport } from "next";
import "./globals.css";
import { isProductionIndexing, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Mega Drum — Find your next drum kit", template: "%s — Mega Drum" },
  description: "Explore the public Mega Drum kit catalog and take your next drum setup to the mobile app.",
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
