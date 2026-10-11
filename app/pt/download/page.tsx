import { ContentPage } from "@/components/ContentPage";
import { StoreButtons } from "@/components/StoreButtons";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Baixar Mega Drum", description: "Baixe o Mega Drum para Android, iPhone ou iPad.", path: "/pt/download/", locale: "pt" });

export default function Page() {
  return <div lang="pt-BR"><ContentPage locale="pt" eyebrow="Leve seu kit para qualquer lugar" title="Baixe o Mega Drum" lead="A experiência completa para tocar está disponível no aplicativo mobile."><StoreButtons locale="pt" /><h2>Do site para o app</h2><p>As páginas usam um ID estável do kit. A abertura direta no kit será ativada quando as versões compatíveis de Android e iOS estiverem disponíveis. Até lá, instale ou abra o Mega Drum e escolha o kit pelo nome.</p></ContentPage></div>;
}
