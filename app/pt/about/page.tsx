import { ContentPage } from "@/components/ContentPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Sobre o Mega Drum", description: "Conheça o Mega Drum e seu catálogo público de kits de bateria.", path: "/pt/about/", locale: "pt" });

export default function Page() { return <div lang="pt-BR"><ContentPage locale="pt" eyebrow="Sobre o Mega Drum" title="Uma bateria no seu bolso" lead="Mega Drum é uma experiência mobile de bateria da Oliveira Labs, criada para praticar, criar e tocar em qualquer lugar."><h2>Descubra seu próximo som</h2><p>Explore a coleção oficial de kits do Mega Drum, encontre uma configuração que combine com o seu estilo e tenha seus favoritos por perto sempre que a inspiração chegar.</p><h2>Feito para tocar</h2><p>Dos controles multitoque responsivos à gravação das suas ideias, o Mega Drum transforma seu celular ou tablet em um espaço criativo para bateristas de todos os níveis.</p></ContentPage></div>; }
