# Kit image cleanup checkpoint — 2026-10-19

This checkpoint separates assets that were published after visual review from
work-in-progress files that must not be released yet.

## Published and verified

- The deterministic cover pipeline uses the Android `PadLayout` order and
  `KitCoverGenerator` 1200×600 contract for Android, iOS, and web.
- All 147 catalog covers and the reviewed background batch were published in
  the earlier cover migration.
- Green Metal (`source-95` free and `source-1017` premium) has reviewed
  `snare`, `tom_1`, and `crash_l` pieces on `img-v2`, a regenerated
  `cover-v3`, and synchronized downloadable packages.
- Guns n' Roses Standard (`source-17`) now has reviewed `kick_l`, `kick_r`,
  and `snare` pieces on `img-v2`, plus `cover-v3`.
- Brooks (`source-111`) now has reviewed `kick_l` and `kick_r` pieces on
  `img-v2`, plus `cover-v3`.
- The free-kit repository packages and index were synchronized in commit
  `5057861`; both affected package versions are now `2`.
- The refreshed static web catalog and its downloaded cover assets were
  published in web commits `b6d220e2` and `5d61ba54`.
- Valuable kit analytics events are shipped in Android commit `c1ef5e2` and
  iOS commit `53cad36`.

Rollback JSON for the last partial image release is stored locally under:

`output/publication-checkpoint-2026-10-19/`

## Local reviewed source assets

The five assets included in the partial release are stored under:

`output/pieces-ready-checkpoint-2026-10-19/`

Their regenerated covers and manifests are stored under:

`output/covers-ready-checkpoint-2026-10-19/`

ImageGen source outputs remain in the Codex generated-image directory. The
production PNGs preserve the original 512×512 alpha silhouette and composite
only the reviewed drumhead region over the source piece.

## Pending — do not publish yet

- A7X (`source-5`): the local edited set removes major artwork but still has
  REMO marks and a conspicuous blue patch. Its downloadable archive is locally
  missing as `kit.megadrum`; the untracked `kit.zip` is byte-identical to the
  last committed archive and can be used to restore it before synchronization.
- Guns n' Roses Standard (`source-17`): finish the remaining drum/cymbal marks.
  A future regenerated cover must use `cover-v4` because `cover-v3` is live.
- Guns n' Roses Top View (`source-18`): reuse the reviewed common pieces from
  source 17, then clean the top-view-only kick/open-hat variants.
- Rob Bourdon (`source-38`): clean the EVANS/REMO marks and cymbal printing.
- Brooks (`source-111`): finish the snare and cymbals. A future regenerated
  cover must use `cover-v4` because `cover-v3` is live.
- The radial texture-cloning experiment under
  `output/pieces-cleaned/round-2026-10-19/` is intentionally unpublished: some
  cymbals retained text or acquired visible texture patches. Keep it only as a
  mask/coordinate reference for the next pass.

When the next piece batch is approved, publish previously unused filenames to
`img-v2`. If any already-published piece must be replaced, use `img-v3` rather
than overwriting immutable R2 objects. Synchronizing another package update
will bump the corresponding kit version from `2` to `3`.

## Final ImageGen prompts used in this checkpoint

### Guns n' Roses kick heads

Precise object edit: replace only the inner black head artwork, text, and logos
with a professional dark-charcoal drumhead and a subtle centered concentric-ring
motif. Preserve the 512×512 geometry, rim, lugs, highlights, perspective, and
transparent background. No skulls, roses, guns, band references, words, or
logos.

### Guns n' Roses snare

Precise object edit: preserve the complete snare geometry, black rim, metal
lugs, perspective, lighting, head rings, canvas, and transparency. Remove all
branding, watermarks, band artwork, the central emblem, and the REMO mark.
Reconstruct a natural white head with a subtle neutral circular wear pattern
and no words or logos.

### Brooks kick heads

Precise object edit: remove the skull, wings, signature, JAMKI text, and brands
from the silver head. Replace them with brushed silver and a subtle abstract
circular-groove motif. Preserve the orange rim, metal lugs, left/right port
hole, silhouette, perspective, lighting, and transparency. No words or logos.
