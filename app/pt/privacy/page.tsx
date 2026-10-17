import { ContentPage } from "@/components/ContentPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Privacidade", description: "Informações de privacidade do aplicativo e do site Mega Drum.", path: "/pt/privacy/", locale: "pt" });

export default function Page() {
  return <div lang="pt-BR"><ContentPage locale="pt" eyebrow="Privacidade e transparência" title="Sua privacidade importa" lead="A Política de Privacidade do Mega Drum cobre tanto o aplicativo quanto este site."><p className="notice">Leia a <a href="/privacy-policy-megadrum.html">Política de Privacidade do Mega Drum</a>.</p><h2>Análise de uso do site</h2><p>Usamos o Google Analytics para compreender, de forma agregada, os acessos às páginas, as origens do tráfego, o engajamento e o desempenho do site. Essas informações nos ajudam a melhorar a experiência web do Mega Drum.</p><h2>Controles de privacidade do site</h2><p>Quando exigido, o site solicita consentimento antes de carregar publicidade. Você poderá revisar ou retirar sua escolha em “Preferências de privacidade” no rodapé.</p><h2>Outros apps da Oliveira Labs</h2><p>As políticas de privacidade dos outros aplicativos da Oliveira Labs permanecem disponíveis em seus endereços originais.</p></ContentPage></div>;
}
