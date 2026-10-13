"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import type { Locale } from "@/lib/types";

const gallery = [
  { src: "/brand/play-gallery/kit-1.webp", en: "Mega Drum acoustic kit with a wood stage", pt: "Kit acústico do Mega Drum em um palco de madeira" },
  { src: "/brand/play-gallery/kit-2.webp", en: "Mega Drum black acoustic kit with bronze cymbals", pt: "Kit acústico preto do Mega Drum com pratos de bronze" },
  { src: "/brand/play-gallery/kit-3.webp", en: "Mega Drum black and yellow custom kit", pt: "Kit personalizado preto e amarelo do Mega Drum" },
  { src: "/brand/play-gallery/kit-4.webp", en: "Mega Drum yellow acoustic kit", pt: "Kit acústico amarelo do Mega Drum" },
  { src: "/brand/play-gallery/kit-5.webp", en: "Mega Drum studio kit with bronze cymbals", pt: "Kit de estúdio do Mega Drum com pratos de bronze" },
  { src: "/brand/play-gallery/kit-6.webp", en: "Mega Drum hybrid acoustic kit", pt: "Kit acústico híbrido do Mega Drum" },
  { src: "/brand/play-gallery/kit-7.webp", en: "Mega Drum white acoustic kit", pt: "Kit acústico branco do Mega Drum" },
  { src: "/brand/play-gallery/kit-8.webp", en: "Mega Drum yellow hybrid kit", pt: "Kit híbrido amarelo do Mega Drum" },
] as const;

const labels = {
  en: {
    gallery: "Real drum kits available in Mega Drum",
    downloads: "downloads",
    pause: "Pause carousel",
    play: "Play carousel",
    reduced: "Autoplay disabled by motion preference",
    slide: "Kit {current} of {total}",
  },
  pt: {
    gallery: "Kits de bateria reais disponíveis no Mega Drum",
    downloads: "downloads",
    pause: "Pausar carrossel",
    play: "Reproduzir carrossel",
    reduced: "Reprodução automática desativada pela preferência de movimento",
    slide: "Kit {current} de {total}",
  },
} as const;

type RingStyle = CSSProperties & {
  "--ring-x": string;
  "--ring-y": string;
  "--ring-z": string;
  "--ring-rotate": string;
  "--ring-scale": string;
  "--ring-opacity": string;
  "--ring-blur": string;
  "--ring-order": string;
};

function circularOffset(index: number, activeIndex: number) {
  const total = gallery.length;
  let offset = (index - activeIndex + total) % total;
  if (offset > total / 2) offset -= total;
  return offset;
}

function ringStyle(offset: number): RingStyle {
  const distance = Math.abs(offset);
  const direction = Math.sign(offset);
  const xPositions = [0, 29, 49, 65, 76];
  const yPositions = [0, 7, 15, 25, 34];
  const scales = [1, 0.8, 0.62, 0.48, 0.38];
  const opacities = [1, 0.78, 0.42, 0.16, 0];
  const blurs = [0, 0.8, 2.2, 5, 9];
  const clamped = Math.min(distance, 4);

  return {
    "--ring-x": `${direction * xPositions[clamped]}%`,
    "--ring-y": `${yPositions[clamped]}%`,
    "--ring-z": `${-clamped * 135}px`,
    "--ring-rotate": `${direction * -19 * clamped}deg`,
    "--ring-scale": `${scales[clamped]}`,
    "--ring-opacity": `${opacities[clamped]}`,
    "--ring-blur": `${blurs[clamped]}px`,
    "--ring-order": `${20 - clamped}`,
  };
}

export function HeroKitCarousel({ locale }: { locale: Locale }) {
  const text = labels[locale];
  const [activeIndex, setActiveIndex] = useState(0);
  const [pausedByUser, setPausedByUser] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const next = useCallback(() => {
    setActiveIndex((index) => (index + 1) % gallery.length);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(media.matches);
    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (pausedByUser || prefersReducedMotion) return;
    const timer = window.setInterval(next, 3400);
    return () => window.clearInterval(timer);
  }, [next, pausedByUser, prefersReducedMotion]);

  const isPaused = pausedByUser || prefersReducedMotion;

  return (
    <div
      className="hero-gallery"
      role="region"
      aria-roledescription="carousel"
      aria-label={text.gallery}
    >
      <div className="hero-download-badge">
        <Image src="/brand/megadrum-production.png" alt="" width={58} height={58} priority />
        <span><strong>1M+</strong><small>{text.downloads}</small></span>
      </div>

      <div className="momentum-ring-stage">
        <div className="momentum-ring-halo" aria-hidden="true" />
        <div className="momentum-ring">
          {gallery.map((image, index) => {
            const offset = circularOffset(index, activeIndex);
            const isActive = offset === 0;
            return (
              <div
                className={`momentum-ring-card${isActive ? " is-active" : ""}`}
                style={ringStyle(offset)}
                key={image.src}
                role="group"
                aria-roledescription="slide"
                aria-label={text.slide.replace("{current}", String(index + 1)).replace("{total}", String(gallery.length))}
                aria-hidden={!isActive}
              >
                <div className="momentum-ring-glass" aria-hidden="true" />
                <Image
                  src={image.src}
                  alt={isActive ? image[locale] : ""}
                  width={1052}
                  height={473}
                  priority={index < 3}
                  sizes="(max-width: 680px) 82vw, (max-width: 1120px) 68vw, 440px"
                />
              </div>
            );
          })}
        </div>

      </div>

      <div className="ring-status">
        <button
          type="button"
          className="ring-playback"
          onClick={() => setPausedByUser((paused) => !paused)}
          aria-label={prefersReducedMotion ? text.reduced : pausedByUser ? text.play : text.pause}
          disabled={prefersReducedMotion}
        >
          {isPaused ? (
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m8 5 11 7-11 7Z" /></svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M9 5v14M15 5v14" /></svg>
          )}
        </button>
      </div>
    </div>
  );
}
