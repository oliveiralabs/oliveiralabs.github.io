import { ContentPage } from "@/components/ContentPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Privacidade", description: "Informações de privacidade do Mega Drum e a Política de Privacidade oficial atual.", path: "/pt/privacy/", locale: "pt" });

export default function Page() {
  return <div lang="pt-BR"><ContentPage locale="pt" eyebrow="Privacidade e transparência" title="Sua privacidade importa" lead="O documento legal existente continua sendo a Política de Privacidade oficial do Mega Drum."><p className="notice">Leia o documento oficial atual em <a href="/privacy-policy-megadrum.html">Política de Privacidade do Mega Drum</a>. Esta rota amigável não substitui nem modifica esse documento.</p><h2>Outros apps da Oliveira Labs</h2><p>As URLs de políticas dos outros aplicativos permanecem disponíveis nos caminhos originais. O novo build verifica que esses arquivos são copiados sem mudanças.</p></ContentPage></div>;
}
