export const DRUM_PIECES = [
  "kick_l",
  "kick_r",
  "snare",
  "close_hh",
  "open_hh",
  "tom_1",
  "tom_2",
  "tom_3",
  "floor",
  "crash_l",
  "crash_r",
  "ride",
  "splash",
] as const;

export type DrumPiece = (typeof DRUM_PIECES)[number];

export type DrumKit = {
  id: string;
  slug: "sabian" | "green-metal";
  name: string;
  background: string;
  pieces: Record<DrumPiece, { image: string; audio: string }>;
};

export type DrumPadLayout = {
  x: number;
  y: number;
  size: number;
  zIndex: number;
  kind: "drum" | "cymbal";
};

const assetVersion = "1";

function createKit({
  id,
  slug,
  name,
}: Pick<DrumKit, "id" | "slug" | "name">): DrumKit {
  const root = `/play/kits/${slug}`;
  const pieces = Object.fromEntries(
    DRUM_PIECES.map((piece) => [
      piece,
      {
        image: `${root}/${piece}.webp?v=${assetVersion}`,
        audio: `${root}/${piece}.mp3?v=${assetVersion}`,
      },
    ]),
  ) as DrumKit["pieces"];

  return {
    id,
    slug,
    name,
    background: `${root}/background.webp?v=${assetVersion}`,
    pieces,
  };
}

export const DRUM_KITS = [
  createKit({
    id: "4ab74d1d-cdcf-417e-9053-070de6ab7b52",
    slug: "sabian",
    name: "Sabian",
  }),
  createKit({
    id: "e3b5302a-97ed-4568-b76b-e5e08a44a384",
    slug: "green-metal",
    name: "Green Metal",
  }),
] as const satisfies readonly DrumKit[];

export const DRUM_PAD_LAYOUT: Record<DrumPiece, DrumPadLayout> = {
  floor: { x: 11, y: 78, size: 23, zIndex: 1, kind: "drum" },
  kick_l: { x: 38, y: 92, size: 29, zIndex: 2, kind: "drum" },
  kick_r: { x: 68, y: 92, size: 29, zIndex: 3, kind: "drum" },
  snare: { x: 53, y: 67, size: 24, zIndex: 4, kind: "drum" },
  open_hh: { x: 92.8, y: 88, size: 19, zIndex: 5, kind: "cymbal" },
  close_hh: { x: 90, y: 61, size: 19, zIndex: 6, kind: "cymbal" },
  tom_1: { x: 36, y: 51.1, size: 17.8, zIndex: 7, kind: "drum" },
  tom_2: { x: 53, y: 37, size: 18, zIndex: 8, kind: "drum" },
  tom_3: { x: 71, y: 52, size: 20, zIndex: 9, kind: "drum" },
  crash_l: { x: 20, y: 31, size: 24, zIndex: 10, kind: "cymbal" },
  splash: { x: 40.1, y: 23, size: 15, zIndex: 11, kind: "cymbal" },
  crash_r: { x: 64.5, y: 22, size: 19, zIndex: 12, kind: "cymbal" },
  ride: { x: 86, y: 31, size: 26, zIndex: 13, kind: "cymbal" },
};

export function findDrumKit(id: string): DrumKit {
  return DRUM_KITS.find((kit) => kit.id === id) ?? DRUM_KITS[0];
}
