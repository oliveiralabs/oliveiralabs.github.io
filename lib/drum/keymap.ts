import type { DrumPiece } from "./kits";

export type KeyboardLayout = 1 | 2;

const fixedKeymap: Readonly<Record<string, DrumPiece>> = {
  KeyQ: "crash_l",
  KeyW: "crash_l",
  KeyE: "splash",
  KeyR: "splash",
  KeyT: "crash_r",
  KeyY: "crash_r",
  KeyU: "ride",
  KeyI: "ride",
  KeyO: "ride",
  KeyP: "kick_r",
  KeyZ: "open_hh",
  Comma: "open_hh",
  KeyX: "close_hh",
  KeyM: "close_hh",
  KeyC: "kick_l",
  KeyL: "kick_l",
  Space: "kick_l",
  KeyN: "kick_r",
  KeyV: "snare",
  KeyB: "snare",
};

const middleRows: Record<KeyboardLayout, Readonly<Record<string, DrumPiece>>> = {
  1: {
    KeyA: "floor",
    KeyS: "tom_3",
    KeyD: "tom_2",
    KeyF: "tom_1",
    KeyG: "tom_1",
    KeyH: "tom_2",
    KeyJ: "tom_3",
    KeyK: "floor",
  },
  2: {
    KeyA: "tom_1",
    KeyS: "tom_1",
    KeyD: "tom_2",
    KeyF: "tom_2",
    KeyG: "tom_3",
    KeyH: "tom_3",
    KeyJ: "floor",
    KeyK: "floor",
  },
};

export function getPieceForCode(code: string, layout: KeyboardLayout): DrumPiece | null {
  return fixedKeymap[code] ?? middleRows[layout][code] ?? null;
}
