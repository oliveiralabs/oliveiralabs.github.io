import { CatalogPage } from "@/components/CatalogPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Catálogo de kits de bateria", description: "Explore o catálogo público completo de kits do Mega Drum.", path: "/pt/kits/", locale: "pt" });

export default function Page() { return <div lang="pt-BR"><CatalogPage locale="pt" /></div>; }
