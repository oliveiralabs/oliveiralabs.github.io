"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/types";

export function LanguageSwitcher({ locale, label, code }: { locale: Locale; label: string; code: string }) {
  const pathname = usePathname();
  const isNotFound = pathname.includes("_not-found") || pathname === "/404";
  const target = isNotFound
    ? "/pt/"
    : locale === "en"
      ? `/pt${pathname === "/" ? "/" : pathname}`
      : pathname.replace(/^\/pt(?=\/|$)/, "") || "/";
  return <Link className="language-link" href={target} lang={locale === "en" ? "pt-BR" : "en"}>{code}<span className="sr-only"> — {label}</span></Link>;
}
