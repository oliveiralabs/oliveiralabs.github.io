import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Toque bateria online",
  description: "A experiência de tocar Mega Drum online agora está disponível na página inicial.",
  path: "/pt/",
  locale: "pt",
  index: false,
});

export default function Page() {
  return <main className="content-page" lang="pt-BR"><meta httpEquiv="refresh" content="0; url=/pt/" /><script dangerouslySetInnerHTML={{ __html: "window.location.replace('/pt/');" }} /><article className="shell"><h1>Abrindo o Mega Drum…</h1><p>Se o redirecionamento não acontecer automaticamente, <Link href="/pt/">abra a bateria online</Link>.</p></article></main>;
}
