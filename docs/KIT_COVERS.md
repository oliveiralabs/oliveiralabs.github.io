# Mega Drum kit cover pipeline

The kit cover is a shared catalog asset. Android, iOS and the web must all read
the same `kits.cover_url`; no client-specific artwork is required.

## Image contract

- Master: PNG, 1200×600, 2:1, sRGB — the same canvas used by Android's
  `KitCoverGenerator`.
- The source of truth is `PadLayout.visiblePads(false)`: identical list order,
  centers, reference sizes and `SIZE_CALIBRATION = 0.95`.
- Kit name, access status and credits belong in client UI/metadata, not pixels.
- The original kit background, or an explicitly reviewed cleanup of that same
  background, is stretched to the full canvas with no crop, blur or darkening,
  matching `ContentScale.FillBounds`.
- Every complete piece bitmap is fitted inside its Android pad box without
  trimming transparent padding. No extra shadow, vignette or decoration is
  added by the pipeline.
- Piece stacking is exactly the native list order. It includes `open_hh`, and
  later pads — including the upper cymbals — draw above earlier pads.
- Existing files are never overwritten during review.
- Approved masters should be uploaded to a versioned R2 path such as
  `kits/{sourceId}/cover-v2.png`, followed by a `kits.cover_url` update.

The first generation phase intentionally keeps artwork found on individual
pieces. Removing manufacturer marks belongs to the later per-piece cleanup
phase; regenerating a cover after that cleanup requires no template changes.
If a creator/channel name exists both in the background and in a piece, the
background override removes only the background occurrence. The piece remains
unchanged until the per-piece phase so the generated cover stays faithful to
the playable kit.

## Local prerequisites

The script expects the website and both kit repositories to be siblings:

```text
oliveiralabs-github/
├── oliveiralabs.github.io/
├── megadrum-kits/
└── megadrum-kits-premium/
```

It also verifies the live Android sources before every audit or generation:

```text
~/AndroidStudioProjects/MegaDrumNew/
├── app/src/main/kotlin/.../features/play/PadLayout.kt
└── app/src/main/kotlin/.../features/create/KitCoverGenerator.kt
```

If the Android checkout lives elsewhere, set `MEGADRUM_ANDROID_ROOT` or pass
`--android-root`. Generation stops if the canvas, calibration, pad order or
geometry differs from the web pipeline, preventing silent visual drift.

Install the only Python dependency if it is not already available:

```bash
python3 -m pip install -r scripts/requirements-cover-tools.txt
```

## Audit

```bash
npm run covers:audit -- --output /absolute/path/to/audit
```

The audit reports source availability, dimensions and duplicate artwork. It is
structural: visual review remains required for text, logos and trademarks.

## Generate a review pilot

By catalog UUID:

```bash
npm run covers:generate -- \
  --kit-id 0aba0dc3-29b4-4f60-adda-add68147c479 \
  --output /absolute/path/to/pilot
```

By source package ID:

```bash
npm run covers:generate -- --source-id 95 --output /absolute/path/to/pilot
```

To use reviewed background cleanups without changing either source-kit
repository, organize them as `source-{id}/background.png` and pass their root:

```text
backgrounds-cleaned/
├── source-60/background.png
├── source-95/background.png
└── source-117/background.png
```

```bash
npm run covers:generate -- \
  --source-id 95 \
  --background-overrides /absolute/path/to/backgrounds-cleaned \
  --output /absolute/path/to/pilot-cleaned
```

The manifest records the override and the SHA-256 hashes of both the reviewed
file and its original. This keeps the edit traceable and makes rollback
straightforward.

Generate the complete catalog only after the pilot is approved:

```bash
npm run covers:generate -- --all --output /absolute/path/to/generated-covers
```

Use `--force` to replace an existing local review output. Generation never
uploads to R2 and never mutates Supabase.

Background cleanup is reviewed separately from composition. Keep the source
asset untouched, save the approved edit under the overrides root, then
regenerate. Duplicate source backgrounds can reuse the same approved edit; for
example, free source `95` and premium source `1017` currently share identical
background bytes.

## Approval and publication

Create `.env.cover-publish.local` from `.env.cover-publish.example`. That local
file is ignored by Git and must never be pasted into an issue, commit or chat.
Use an R2 token restricted to the production cover bucket. The Supabase secret
key is only needed for the controlled `kits.cover_url` update and should be
deleted or rotated after publication if it was created specifically for this
migration. Legacy `anon` keys remain supported for catalog refreshes.

1. Review `cover.png` and the three proportional previews in each output folder.
2. Upload the approved master to the `suggestedR2Path` in `manifest.json`.
3. Update `kits.cover_url` for every record listed in `catalogRecords`.
4. Refresh the static snapshot with `npm run catalog:refresh`.
5. Run `MEGADRUM_REFRESH_ASSETS=1 npm run check` and deploy the static export.
6. Keep the previous URL for rollback until all three clients are verified.

For a reviewed batch, run a dry-run first. The publisher refuses to overwrite
a different versioned object and writes the current catalog values to a
rollback file before any mutation:

```bash
npm run covers:publish -- \
  --generated /absolute/path/to/generated-covers \
  --rollback-dir /absolute/path/to/publication-record
```

After reviewing the summary, repeat the same command with `--apply`. Covers are
published for every manifest; `background-v2.png` is published only when the
manifest points to a reviewed background override.

The web catalog uses the same 2:1 ratio as the native generator, so no client
needs to crop or reinterpret the composition.
