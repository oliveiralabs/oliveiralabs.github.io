import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return <><SiteHeader locale="en" /><main className="content-page"><article className="shell"><p className="eyebrow">404</p><h1>This beat went missing.</h1><p className="lead">The page may have moved, but the kit catalog is ready.</p><Link className="button" href="/kits/">Browse drum kits</Link></article></main><SiteFooter locale="en" /></>;
}
