"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getCopy } from "@/lib/copy";
import { DrumAudioEngine } from "@/lib/drum/audio-engine";
import { getPieceForCode, type KeyboardLayout } from "@/lib/drum/keymap";
import {
  DRUM_KITS,
  DRUM_PIECES,
  findDrumKit,
  type DrumKit,
  type DrumPiece,
} from "@/lib/drum/kits";
import { localizedPath } from "@/lib/site";
import type { Locale } from "@/lib/types";
import { AdSenseDisplay } from "./ads/AdSenseDisplay";
import { DrumStage } from "./drum/DrumStage";
import styles from "./InteractiveDrumHero.module.css";

const keyboardLayout: KeyboardLayout = 1;

function initialHitCounts(): Record<DrumPiece, number> {
  return Object.fromEntries(DRUM_PIECES.map((piece) => [piece, 0])) as Record<DrumPiece, number>;
}

function isTypingTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(target.tagName));
}

export function InteractiveDrumHero({
  locale,
  activeKitId,
}: {
  locale: Locale;
  activeKitId: string;
}) {
  const text = getCopy(locale).drum;
  const [hitCounts, setHitCounts] = useState(initialHitCounts);
  const engineRef = useRef<DrumAudioEngine | null>(null);
  const activeKit = useMemo(() => findDrumKit(activeKitId), [activeKitId]);

  const preloadKit = useCallback(async (kit: DrumKit) => {
    const engine = engineRef.current;
    if (!engine) return;
    try {
      await engine.preload(kit);
    } catch {
      // A failed preload is retried naturally when the user plays a piece.
    }
  }, []);

  useEffect(() => {
    const engine = new DrumAudioEngine();
    engineRef.current = engine;
    engine.setVolume(0.82);

    const idleWindow = window as typeof window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const idleId = idleWindow.requestIdleCallback?.(
      () => void preloadKit(DRUM_KITS[1]),
      { timeout: 3500 },
    );
    const fallbackId = idleId === undefined
      ? window.setTimeout(() => void preloadKit(DRUM_KITS[1]), 1800)
      : undefined;

    return () => {
      if (idleId !== undefined) idleWindow.cancelIdleCallback?.(idleId);
      if (fallbackId !== undefined) window.clearTimeout(fallbackId);
      engineRef.current = null;
      void engine.destroy();
    };
  }, [preloadKit]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) void engineRef.current?.suspend();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const hitPiece = useCallback((piece: DrumPiece) => {
    setHitCounts((current) => ({ ...current, [piece]: current[piece] + 1 }));
    const engine = engineRef.current;
    if (!engine) return;
    void engine.play(activeKit, piece).catch(() => {
      // Audio failures should never interrupt the playing surface.
    });
  }, [activeKit]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return;
      const piece = getPieceForCode(event.code, keyboardLayout);
      if (!piece) return;
      event.preventDefault();
      hitPiece(piece);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hitPiece, keyboardLayout]);

  useEffect(() => {
    void preloadKit(activeKit);
  }, [activeKit, preloadKit]);

  return (
    <section id="drum-player" className={styles.hero} aria-label={text.stageLabel}>
      <div className="shell">
        <h1 className="sr-only">{text.title}</h1>

        <div className={styles.playerPanel}>
          <p className={styles.rotateHint}>{text.rotateHint}</p>
          <div className={styles.stageFrame}>
            <DrumStage
              kit={activeKit}
              hitCounts={hitCounts}
              pieceNames={text.pieces}
              stageLabel={text.stageLabel}
              onHit={hitPiece}
            />
          </div>

          <div className={styles.playerFooter}>
            <Link href={localizedPath("/download/", locale)}>{text.appCta} →</Link>
          </div>
        </div>
        <AdSenseDisplay className={styles.adArea} label={text.advertisement} />
      </div>
    </section>
  );
}
