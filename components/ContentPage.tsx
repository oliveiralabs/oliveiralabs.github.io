import type { ReactNode } from "react";
import type { Locale } from "@/lib/types";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function ContentPage({ locale, eyebrow, title, lead, children }: { locale: Locale; eyebrow: string; title: string; lead: string; children: ReactNode }) {
  return (
    <>
      <SiteHeader locale={locale} />
      <main className="content-page">
        <article className="shell">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="lead">{lead}</p>
          {children}
        </article>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
