import { ContentPage } from "@/components/ContentPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Direitos autorais", description: "Informações de direitos autorais e contato para o catálogo público do Mega Drum.", path: "/pt/copyright/", locale: "pt", index: false });

export default function Page() { return <div lang="pt-BR"><ContentPage locale="pt" eyebrow="Direitos e atribuição" title="Direitos autorais" lead="O Mega Drum e o catálogo público são mantidos pela Oliveira Labs."><h2>Comunique uma preocupação</h2><p>Se você detém direitos sobre nome, imagem, som ou outro material ligado a um kit e deseja revisão, envie um e-mail para <a href="mailto:antonio.filho128@gmail.com?subject=Revis%C3%A3o%20de%20direitos%20Mega%20Drum">antonio.filho128@gmail.com</a>. Inclua a URL do kit, o material em questão e uma forma de verificar a solicitação.</p><h2>Sem endosso implícito</h2><p>O nome ou referência visual de um kit não declara, por si só, patrocínio, endosso ou afiliação com terceiros.</p></ContentPage></div>; }
