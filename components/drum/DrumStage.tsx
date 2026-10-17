"use client";

import type { CSSProperties, MouseEvent, PointerEvent } from "react";
import { DRUM_PAD_LAYOUT, DRUM_PIECES, type DrumKit, type DrumPiece } from "@/lib/drum/kits";
import styles from "../InteractiveDrumHero.module.css";

type DrumStageProps = {
  kit: DrumKit;
  hitCounts: Record<DrumPiece, number>;
  pieceNames: Record<DrumPiece, string>;
  stageLabel: string;
  onHit: (piece: DrumPiece) => void;
};

export function DrumStage({ kit, hitCounts, pieceNames, stageLabel, onHit }: DrumStageProps) {
  function handlePointerDown(event: PointerEvent<HTMLButtonElement>, piece: DrumPiece) {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    onHit(piece);
  }

  function handleAccessibleClick(event: MouseEvent<HTMLButtonElement>, piece: DrumPiece) {
    if (event.detail === 0) onHit(piece);
  }

  return (
    <div
      className={styles.stage}
      aria-label={stageLabel}
      onContextMenu={(event) => event.preventDefault()}
    >
      <img className={styles.stageBackground} src={kit.background} alt="" draggable={false} />
      <div className={styles.stageShade} aria-hidden="true" />
      {DRUM_PIECES.map((piece) => {
        const position = DRUM_PAD_LAYOUT[piece];
        const style = {
          "--pad-x": `${position.x}%`,
          "--pad-y": `${position.y}%`,
          "--pad-size": `${position.size * 0.95}%`,
          "--pad-z": position.zIndex,
        } as CSSProperties;

        return (
          <button
            key={piece}
            type="button"
            className={styles.pad}
            style={style}
            aria-label={pieceNames[piece]}
            data-piece={piece}
            data-kind={position.kind}
            onPointerDown={(event) => handlePointerDown(event, piece)}
            onClick={(event) => handleAccessibleClick(event, piece)}
          >
            <span className={styles.hitArea} aria-hidden="true" />
            <span
              key={`${kit.id}-${piece}-${hitCounts[piece]}`}
              className={hitCounts[piece] > 0
                ? position.kind === "cymbal" ? styles.cymbalHit : styles.drumHit
                : undefined}
            >
              <img src={kit.pieces[piece].image} alt="" draggable={false} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
