import { ContentPage } from "@/components/ContentPage";
import { StoreButtons } from "@/components/StoreButtons";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Baixar Mega Drum", description: "Baixe o Mega Drum para Android, iPhone ou iPad.", path: "/pt/download/", locale: "pt" });

export default function Page() {
  return <div lang="pt-BR"><ContentPage locale="pt" eyebrow="Leve seu kit para qualquer lugar" title="Baixe o Mega Drum" lead="A experiência completa para tocar está disponível no aplicativo."><StoreButtons locale="pt" /><h2>Tudo o que você precisa para continuar tocando</h2><p>Explore o catálogo completo do Mega Drum, toque com controles multitoque responsivos, grave suas ideias e leve sua prática para qualquer lugar.</p></ContentPage></div>;
}
