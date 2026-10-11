import { HomePage } from "@/components/HomePage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Encontre seu próximo kit de bateria", description: "Explore 147 kits de bateria disponíveis no Mega Drum e leve sua próxima configuração para o aplicativo.", path: "/pt/", locale: "pt" });

export default function Page() { return <div lang="pt-BR"><HomePage locale="pt" /></div>; }
