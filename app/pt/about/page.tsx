import { ContentPage } from "@/components/ContentPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Sobre o Mega Drum", description: "Conheça o Mega Drum e seu catálogo público de kits de bateria.", path: "/pt/about/", locale: "pt" });

export default function Page() { return <div lang="pt-BR"><ContentPage locale="pt" eyebrow="Sobre o projeto" title="Uma bateria no seu bolso" lead="Mega Drum é uma experiência mobile de bateria da Oliveira Labs, criada para praticar, criar e tocar em qualquer lugar."><h2>Por que este catálogo existe</h2><p>O site público facilita descobrir, compartilhar e reencontrar kits. Cada página representa um kit já disponível no app; os sons continuam fazendo parte da experiência mobile.</p><h2>Construído a partir do catálogo oficial</h2><p>Nomes, identificadores e capas vêm do mesmo catálogo somente leitura usado pelo Mega Drum. O site não escreve dados de volta na produção.</p></ContentPage></div>; }
