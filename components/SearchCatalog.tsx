"use client";

import { useEffect, useMemo, useState } from "react";
import { KitCard } from "./KitCard";
import { getCopy } from "@/lib/copy";
import type { Kit, Locale } from "@/lib/types";

export function SearchCatalog({ kits, locale }: { kits: Kit[]; locale: Locale }) {
  const text = getCopy(locale).catalog;
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState<"standard" | "premium" | "all">("all");
  const normalized = query.trim().toLocaleLowerCase(locale === "pt" ? "pt-BR" : "en-US");
  const results = useMemo(
    () => kits.filter((kit) => (tier === "all" || (tier === "premium" ? kit.isPremium : !kit.isPremium)) && (!normalized || kit.name.toLocaleLowerCase().includes(normalized))),
    [kits, normalized, tier],
  );

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("q");
    if (fromUrl) setQuery(fromUrl);
  }, []);

  return (
    <section className="catalog-search" aria-labelledby="catalog-results-title">
      <div className="catalog-controls">
        <label>
          <span className="sr-only">{text.filter}</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={text.filter} autoComplete="off" />
        </label>
        <div className="filter-tabs" role="group" aria-label="Kit type">
          {(["all", "standard", "premium"] as const).map((value) => (
            <button key={value} type="button" className={tier === value ? "active" : ""} onClick={() => setTier(value)} aria-pressed={tier === value}>
              {text[value]}
            </button>
          ))}
        </div>
      </div>
      <p className="result-count" id="catalog-results-title" aria-live="polite">{results.length} {getCopy(locale).stats.kits}</p>
      {results.length ? (
        <div className="kit-grid">
          {results.map((kit) => <KitCard key={kit.id} kit={kit} locale={locale} />)}
        </div>
      ) : <p className="empty-state">{text.noResults}</p>}
    </section>
  );
}
