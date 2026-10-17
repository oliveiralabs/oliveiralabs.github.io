import { ContentPage } from "@/components/ContentPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Ajuda e suporte", description: "Obtenha ajuda sobre kits, áudio, downloads, assinaturas e o aplicativo Mega Drum.", path: "/pt/help/", locale: "pt" });

export default function Page() {
  return <div lang="pt-BR"><ContentPage locale="pt" eyebrow="Central de ajuda" title="Como podemos ajudar?" lead="Encontre respostas sobre kits, downloads, áudio, assinaturas e o uso do Mega Drum."><p className="notice">Acesse o <a href="/megadrum-support.html">Suporte Mega Drum</a> para conferir soluções e respostas às dúvidas mais comuns.</p><h2>Fale com a Oliveira Labs</h2><p>Envie um e-mail para <a href="mailto:antonio.filho128@gmail.com">antonio.filho128@gmail.com</a> com o aparelho, versão do sistema, versão do aplicativo e uma descrição curta do problema.</p></ContentPage></div>;
}
