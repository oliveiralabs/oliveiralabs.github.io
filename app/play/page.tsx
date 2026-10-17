import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Play drums online",
  description: "The Mega Drum online player is now available on the home page.",
  path: "/",
  locale: "en",
  index: false,
});

export default function Page() {
  return <main className="content-page"><meta httpEquiv="refresh" content="0; url=/" /><script dangerouslySetInnerHTML={{ __html: "window.location.replace('/');" }} /><article className="shell"><h1>Taking you to Mega Drum…</h1><p>If you are not redirected automatically, <Link href="/">open the drum player</Link>.</p></article></main>;
}
