import { execFile } from "node:child_process";
import { access, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pieces = [
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
];

const kits = [
  {
    slug: "sabian",
    source:
      process.env.MEGADRUM_SABIAN_SOURCE ??
      path.resolve(repoRoot, "../megadrum-kits/4/megadrumkit"),
    background: "background.png",
  },
  {
    slug: "green-metal",
    source:
      process.env.MEGADRUM_GREEN_METAL_SOURCE ??
      path.resolve(repoRoot, "../megadrum-kits-premium/1017/megadrumkit"),
    background:
      process.env.MEGADRUM_GREEN_METAL_BACKGROUND ??
      path.resolve(
        repoRoot,
        "../../ChatGPT/Mega Drum New/output/backgrounds-cleaned/source-1017/background.png",
      ),
  },
];

async function requireFile(file) {
  await access(file);
  const info = await stat(file);
  if (!info.isFile() || info.size === 0) {
    throw new Error(`Invalid source asset: ${file}`);
  }
}

async function run(binary, args) {
  try {
    await execFileAsync(binary, args);
  } catch (error) {
    const detail = error?.stderr?.trim() || error?.message || String(error);
    throw new Error(`${binary} failed: ${detail}`);
  }
}

for (const kit of kits) {
  const output = path.join(repoRoot, "public/play/kits", kit.slug);
  await mkdir(output, { recursive: true });

  const background = path.isAbsolute(kit.background)
    ? kit.background
    : path.join(kit.source, kit.background);
  await requireFile(background);
  await run("cwebp", ["-quiet", "-q", "86", background, "-o", path.join(output, "background.webp")]);

  for (const piece of pieces) {
    const image = path.join(kit.source, `${piece}.png`);
    const audio = path.join(kit.source, `${piece}.wav`);
    await Promise.all([requireFile(image), requireFile(audio)]);

    await run("cwebp", ["-quiet", "-q", "88", image, "-o", path.join(output, `${piece}.webp`)]);
    await run("ffmpeg", [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-i",
      audio,
      "-vn",
      "-ac",
      "1",
      "-ar",
      "44100",
      "-codec:a",
      "libmp3lame",
      "-b:a",
      "160k",
      path.join(output, `${piece}.mp3`),
    ]);
  }

  process.stdout.write(`Prepared ${kit.slug} in ${path.relative(repoRoot, output)}\n`);
}
