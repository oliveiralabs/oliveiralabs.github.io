"use client";

import Image from "next/image";
import { A11y, EffectCoverflow, Keyboard, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Locale } from "@/lib/types";

const gallery = [
  {
    src: "/brand/play-gallery/kit-1.webp",
    en: "Mega Drum acoustic kit with a wood stage",
    pt: "Kit acústico do Mega Drum em um palco de madeira",
  },
  {
    src: "/brand/play-gallery/kit-2.webp",
    en: "Mega Drum black acoustic kit with bronze cymbals",
    pt: "Kit acústico preto do Mega Drum com pratos de bronze",
  },
  {
    src: "/brand/play-gallery/kit-3.webp",
    en: "Mega Drum black and yellow custom kit",
    pt: "Kit personalizado preto e amarelo do Mega Drum",
  },
  {
    src: "/brand/play-gallery/kit-4.webp",
    en: "Mega Drum yellow acoustic kit",
    pt: "Kit acústico amarelo do Mega Drum",
  },
  {
    src: "/brand/play-gallery/kit-5.webp",
    en: "Mega Drum studio kit with bronze cymbals",
    pt: "Kit de estúdio do Mega Drum com pratos de bronze",
  },
  {
    src: "/brand/play-gallery/kit-6.webp",
    en: "Mega Drum hybrid acoustic kit",
    pt: "Kit acústico híbrido do Mega Drum",
  },
  {
    src: "/brand/play-gallery/kit-7.webp",
    en: "Mega Drum white acoustic kit",
    pt: "Kit acústico branco do Mega Drum",
  },
  {
    src: "/brand/play-gallery/kit-8.webp",
    en: "Mega Drum yellow hybrid kit",
    pt: "Kit híbrido amarelo do Mega Drum",
  },
] as const;

const labels = {
  en: {
    gallery: "Real drum kits available in Mega Drum",
    downloads: "downloads",
    previous: "Previous kit",
    next: "Next kit",
    slide: "Kit {{index}} of {{slidesLength}}",
    hint: "Drag to explore",
  },
  pt: {
    gallery: "Kits de bateria reais disponíveis no Mega Drum",
    downloads: "downloads",
    previous: "Kit anterior",
    next: "Próximo kit",
    slide: "Kit {{index}} de {{slidesLength}}",
    hint: "Arraste para explorar",
  },
} as const;

export function HeroKitCarousel({ locale }: { locale: Locale }) {
  const text = labels[locale];

  return (
    <div className="hero-gallery" aria-label={text.gallery}>
      <div className="hero-download-badge">
        <Image src="/brand/megadrum-production.png" alt="" width={58} height={58} priority />
        <span><strong>1M+</strong><small>{text.downloads}</small></span>
      </div>
      <div className="kit-carousel-stage">
        <Swiper
          className="kit-carousel"
          modules={[A11y, EffectCoverflow, Keyboard, Navigation]}
          effect="coverflow"
          centeredSlides
          loop
          grabCursor
          keyboard={{ enabled: true }}
          navigation
          slidesPerView="auto"
          speed={650}
          coverflowEffect={{ rotate: 0, stretch: 72, depth: 190, modifier: 1.15, slideShadows: false }}
          a11y={{
            enabled: true,
            prevSlideMessage: text.previous,
            nextSlideMessage: text.next,
            slideLabelMessage: text.slide,
          }}
        >
          {gallery.map((image, index) => (
            <SwiperSlide key={image.src}>
              <div className="kit-shot-frame">
                <Image
                  src={image.src}
                  alt={image[locale]}
                  width={1052}
                  height={473}
                  priority={index < 3}
                  sizes="(max-width: 680px) 82vw, (max-width: 980px) 64vw, 440px"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <p className="carousel-hint">{text.hint}</p>
    </div>
  );
}
