import { CatalogPage } from "@/components/CatalogPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Drum kit catalog", description: "Browse the complete public Mega Drum kit catalog.", path: "/kits/", locale: "en" });

export default function Page() { return <CatalogPage locale="en" />; }
