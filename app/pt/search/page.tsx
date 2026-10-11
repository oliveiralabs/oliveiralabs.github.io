import { CatalogPage } from "@/components/CatalogPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Buscar kits de bateria", description: "Busque no catálogo de kits do Mega Drum.", path: "/pt/search/", locale: "pt", index: false });

export default function Page() { return <div lang="pt-BR"><CatalogPage locale="pt" /></div>; }
