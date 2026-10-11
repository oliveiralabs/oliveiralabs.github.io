import { CatalogPage } from "@/components/CatalogPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Search drum kits", description: "Search the Mega Drum kit catalog.", path: "/search/", locale: "en", index: false });

export default function Page() { return <CatalogPage locale="en" />; }
