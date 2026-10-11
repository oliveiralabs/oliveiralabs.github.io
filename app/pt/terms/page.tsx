import { ContentPage } from "@/components/ContentPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Termos do site", description: "Termos de uso do site público e catálogo do Mega Drum.", path: "/pt/terms/", locale: "pt", index: false });

export default function Page() { return <div lang="pt-BR"><ContentPage locale="pt" eyebrow="Legal" title="Termos do site" lead="Estes termos são um rascunho de preview e exigem aprovação do proprietário antes da produção."><p className="notice">Ainda não é um documento legal publicado. As políticas atuais de produção permanecem inalteradas.</p><h2>Informações do catálogo</h2><p>O site apresenta informações públicas sobre kits disponíveis no Mega Drum. Disponibilidade, nomes, capas e recursos podem mudar com a evolução do catálogo.</p><h2>Uso aceitável</h2><p>Não use o site de forma indevida, não interfira em seu funcionamento e não redistribua ativos protegidos fora das permissões concedidas por seus proprietários.</p><h2>Contato</h2><p>Dúvidas podem ser enviadas para <a href="mailto:antonio.filho128@gmail.com">antonio.filho128@gmail.com</a>.</p></ContentPage></div>; }
