"use client";

import Image from "next/image";
import { useState } from "react";
import { getCopy } from "@/lib/copy";
import { DRUM_KITS } from "@/lib/drum/kits";
import type { Kit, Locale } from "@/lib/types";
import { InteractiveDrumHero } from "./InteractiveDrumHero";
import { KitCard } from "./KitCard";

export function PlayDrumsExperience({
  locale,
  playableKits,
  appKits,
}: {
  locale: Locale;
  playableKits: Kit[];
  appKits: Kit[];
}) {
  const text = getCopy(locale);
  const [activeKitId, setActiveKitId] = useState(DRUM_KITS[0].id);

  function selectPlayableKit(kitId: string) {
    setActiveKitId(kitId);
    window.requestAnimationFrame(() => {
      document.getElementById("drum-player")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <>
      <InteractiveDrumHero locale={locale} activeKitId={activeKitId} />
      <section className="section related-section play-more-section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{text.play.moreEyebrow}</p>
              <h2>{text.kit.more}</h2>
            </div>
          </div>
          <div className="kit-grid">
            {playableKits.map((kit) => {
              const isActive = kit.id === activeKitId;
              return (
                <button
                  className={`kit-card playable-kit-card${isActive ? " kit-card-active" : ""}`}
                  type="button"
                  key={kit.id}
                  aria-pressed={isActive}
                  aria-label={`${text.play.playOnline}: ${kit.name}`}
                  onClick={() => selectPlayableKit(kit.id)}
                >
                  <span className="kit-cover">
                    <Image
                      src={kit.cover}
                      alt={locale === "pt" ? `Kit de bateria ${kit.name}` : `${kit.name} drum kit`}
                      fill
                      sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 25vw"
                    />
                  </span>
                  <span className="kit-card-copy">
                    <span>
                      <small>{isActive ? text.play.playingNow : text.play.playOnline}</small>
                      <strong>{kit.name}</strong>
                    </span>
                    <span className="card-arrow playable-arrow" aria-hidden="true">▶</span>
                  </span>
                </button>
              );
            })}
            {appKits.map((kit) => <KitCard key={kit.id} kit={kit} locale={locale} />)}
          </div>
        </div>
      </section>
    </>
  );
}
