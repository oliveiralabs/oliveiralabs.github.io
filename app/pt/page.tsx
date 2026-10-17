import { PlayDrumsPage } from "@/components/PlayDrumsPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Toque bateria online", description: "Toque kits oficiais do Mega Drum online usando teclado, mouse ou tela sensível ao toque e descubra mais kits no aplicativo.", path: "/pt/", locale: "pt" });

export default function Page() { return <div lang="pt-BR"><PlayDrumsPage locale="pt" /></div>; }
