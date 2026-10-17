import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../public/play/kits");
const pieces = [
  "kick_l", "kick_r", "snare", "close_hh", "open_hh", "tom_1", "tom_2",
  "tom_3", "floor", "crash_l", "crash_r", "ride", "splash",
];

for (const kit of ["sabian", "green-metal"]) {
  test(`${kit} ships a complete, optimized web kit`, async () => {
    const directory = path.join(root, kit);
    const files = ["background.webp", ...pieces.flatMap((piece) => [`${piece}.webp`, `${piece}.mp3`])];
    let totalBytes = 0;

    for (const file of files) {
      const filePath = path.join(directory, file);
      const info = await stat(filePath);
      assert.equal(info.isFile(), true, `${file} must be a file`);
      assert.ok(info.size > 128, `${file} must not be empty`);
      totalBytes += info.size;
    }

    assert.ok(totalBytes < 3_000_000, `${kit} should remain below the 3 MB transfer budget`);
    const webpHeader = await readFile(path.join(directory, "background.webp"));
    assert.equal(webpHeader.subarray(0, 4).toString("ascii"), "RIFF");
    assert.equal(webpHeader.subarray(8, 12).toString("ascii"), "WEBP");
  });
}
