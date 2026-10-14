#!/usr/bin/env python3
"""Audit and generate clean, cross-client Mega Drum kit covers.

The generator only reads the source kit repositories. It never uploads files or
changes Supabase records, which makes it safe to use for local review and CI.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

try:
    from PIL import Image
except ImportError as error:  # pragma: no cover - actionable CLI error
    raise SystemExit(
        "Pillow is required. Install it with: "
        "python3 -m pip install -r scripts/requirements-cover-tools.txt"
    ) from error


ROOT = Path(__file__).resolve().parent.parent
WORKSPACE = ROOT.parent
DEFAULT_CATALOG = ROOT / "data/source/supabase-kits.json"
DEFAULT_FREE_ROOT = WORKSPACE / "megadrum-kits"
DEFAULT_PREMIUM_ROOT = WORKSPACE / "megadrum-kits-premium"
DEFAULT_ANDROID_ROOT = Path(
    os.environ.get("MEGADRUM_ANDROID_ROOT", str(Path.home() / "AndroidStudioProjects/MegaDrumNew"))
)
SOURCE_ID_PATTERN = re.compile(r"/kits/([^/]+)/cover(?:-[^/]+)?\.[a-z0-9]+(?:\?.*)?$", re.I)

MASTER_SIZE = (1200, 600)
SAFE_AREA = {"x": 0, "y": 0, "width": 1200, "height": 600}
FALLBACK_COLOR = (14, 15, 19, 255)
SIZE_CALIBRATION = 0.95
VARIANTS = {
    "cover-card.webp": (720, 360),
    "cover-mobile.webp": (960, 480),
    "cover-detail.webp": (1200, 600),
}

# Exact right-handed output of Android PadLayout.visiblePads(false). The order,
# centers and reference sizes are the same values used by ClassicLayout,
# PadStage and KitEditorViewModel.copyOfficial. Later entries draw above earlier
# entries, just as kit.pads.forEach does in KitCoverGenerator.
LAYOUT = [
    ("floor.png", 11.0, 78.0, 23.0),
    ("kick_l.png", 38.0, 92.0, 29.0),
    ("kick_r.png", 68.0, 92.0, 29.0),
    ("snare.png", 53.0, 67.0, 24.0),
    ("open_hh.png", 92.8, 88.0, 19.0),
    ("close_hh.png", 90.0, 61.0, 19.0),
    ("tom_1.png", 36.0, 51.1, 17.8),
    ("tom_2.png", 53.0, 37.0, 18.0),
    ("tom_3.png", 71.0, 52.0, 20.0),
    ("crash_l.png", 20.0, 31.0, 24.0),
    ("splash.png", 40.1, 23.0, 15.0),
    ("crash_r.png", 64.5, 22.0, 19.0),
    ("ride.png", 86.0, 31.0, 26.0),
]

REQUIRED_PIECES = tuple(item[0] for item in LAYOUT)


@dataclass(frozen=True)
class CatalogKit:
    id: str
    name: str
    source_id: str
    cover_url: str
    sort_order: int


def parse_args() -> argparse.Namespace:
    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--catalog", type=Path, default=DEFAULT_CATALOG)
    common.add_argument("--free-root", type=Path, default=DEFAULT_FREE_ROOT)
    common.add_argument("--premium-root", type=Path, default=DEFAULT_PREMIUM_ROOT)
    common.add_argument("--android-root", type=Path, default=DEFAULT_ANDROID_ROOT)

    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)

    audit = commands.add_parser("audit", parents=[common], help="Inventory cover readiness")
    audit.add_argument("--output", type=Path, required=True)

    generate = commands.add_parser("generate", parents=[common], help="Generate review covers")
    selection = generate.add_mutually_exclusive_group(required=True)
    selection.add_argument("--kit-id", action="append", default=[])
    selection.add_argument("--source-id", action="append", default=[])
    selection.add_argument("--all", action="store_true")
    generate.add_argument("--output", type=Path, required=True)
    generate.add_argument(
        "--background-overrides",
        type=Path,
        help=(
            "Optional reviewed backgrounds root. Files are resolved as "
            "source-<id>/background.(png|jpg|jpeg|webp) and replace only the "
            "source background during cover composition."
        ),
    )
    generate.add_argument("--force", action="store_true")
    return parser.parse_args()


def verify_android_contract(android_root: Path) -> dict[str, object]:
    """Fail fast if this port drifts from the Android source of truth."""
    kotlin_root = android_root.resolve() / "app/src/main/kotlin/com/oliveiralabs/megadrum"
    pad_layout_path = kotlin_root / "features/play/PadLayout.kt"
    cover_generator_path = kotlin_root / "features/create/KitCoverGenerator.kt"
    if not pad_layout_path.is_file() or not cover_generator_path.is_file():
        raise FileNotFoundError(
            "Android cover sources not found. Pass --android-root or set MEGADRUM_ANDROID_ROOT."
        )

    pad_source = pad_layout_path.read_text(encoding="utf-8")
    cover_source = cover_generator_path.read_text(encoding="utf-8")
    calibration_match = re.search(r"SIZE_CALIBRATION\s*=\s*([\d.]+)f", pad_source)
    width_match = re.search(r"COVER_WIDTH\s*=\s*(\d+)", cover_source)
    height_match = re.search(r"COVER_HEIGHT\s*=\s*(\d+)", cover_source)
    pad_pattern = re.compile(
        r'PadSpec\(\s*"([^"]+)",\s*Handed\.(\w+),\s*([\d.]+)f,\s*([\d.]+)f,\s*([\d.]+)f'
    )
    parsed_layout = [
        (f"{piece}.png", float(x), float(y), float(size))
        for piece, handed, x, y, size in pad_pattern.findall(pad_source)
        if handed in {"BOTH", "RIGHT_ONLY"}
    ]
    if not calibration_match or not width_match or not height_match or not parsed_layout:
        raise ValueError("Could not parse the Android cover/layout contract.")

    parsed_size = (int(width_match.group(1)), int(height_match.group(1)))
    parsed_calibration = float(calibration_match.group(1))
    if parsed_size != MASTER_SIZE or parsed_calibration != SIZE_CALIBRATION or parsed_layout != LAYOUT:
        raise ValueError(
            "Android PadLayout/KitCoverGenerator changed; update the cover pipeline contract before generating."
        )
    return {
        "androidRoot": str(android_root.resolve()),
        "padLayout": str(pad_layout_path),
        "padLayoutSha256": sha256(pad_layout_path),
        "coverGenerator": str(cover_generator_path),
        "coverGeneratorSha256": sha256(cover_generator_path),
    }


def load_catalog(path: Path) -> list[CatalogKit]:
    entries = json.loads(path.read_text(encoding="utf-8"))
    kits: list[CatalogKit] = []
    for entry in entries:
        cover_url = entry.get("cover_url") or ""
        match = SOURCE_ID_PATTERN.search(cover_url)
        if not match:
            raise ValueError(f"Cannot resolve source kit from cover URL: {cover_url}")
        kits.append(
            CatalogKit(
                id=str(entry["id"]),
                name=str(entry["name"]),
                source_id=match.group(1),
                cover_url=cover_url,
                sort_order=int(entry.get("sort_order") or 0),
            )
        )
    return kits


def find_package(kit: CatalogKit, roots: Iterable[Path]) -> Path | None:
    for root in roots:
        candidate = root / kit.source_id / "megadrumkit"
        if candidate.is_dir():
            return candidate
    return None


def find_background(package: Path | None) -> Path | None:
    if not package:
        return None
    for name in ("background.png", "fundo2x.jpg", "fundo2x.png", "background.jpg"):
        candidate = package / name
        if candidate.is_file():
            return candidate
    return None


def find_background_override(root: Path | None, source_id: str) -> Path | None:
    if not root:
        return None
    source_root = root.resolve() / f"source-{source_id}"
    for name in ("background.png", "background.jpg", "background.jpeg", "background.webp"):
        candidate = source_root / name
        if candidate.is_file():
            return candidate
    return None


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def image_info(path: Path) -> dict[str, object]:
    with Image.open(path) as image:
        return {
            "width": image.width,
            "height": image.height,
            "aspectRatio": round(image.width / image.height, 4),
            "mode": image.mode,
            "format": image.format,
            "bytes": path.stat().st_size,
            "sha256": sha256(path),
        }


def audit(args: argparse.Namespace) -> None:
    android_contract = verify_android_contract(args.android_root)
    roots = (args.free_root.resolve(), args.premium_root.resolve())
    kits = load_catalog(args.catalog.resolve())
    rows: list[dict[str, object]] = []
    hashes: defaultdict[str, list[dict[str, str]]] = defaultdict(list)
    background_hashes: defaultdict[str, list[dict[str, str]]] = defaultdict(list)

    for kit in kits:
        package = find_package(kit, roots)
        background = find_background(package)
        background_info = image_info(background) if background else None
        pieces = [name for name in REQUIRED_PIECES if package and (package / name).is_file()]
        cover = package / "cover.png" if package else None
        info = image_info(cover) if cover and cover.is_file() else None
        status = "ready" if len(pieces) >= 9 else "needs_review" if pieces else "missing_assets"
        row = {
            "id": kit.id,
            "name": kit.name,
            "sourceId": kit.source_id,
            "sortOrder": kit.sort_order,
            "status": status,
            "package": str(package) if package else None,
            "background": str(background) if background else None,
            "backgroundInfo": background_info,
            "pieceCount": len(pieces),
            "missingPieces": [name for name in REQUIRED_PIECES if name not in pieces],
            "originalCover": info,
        }
        rows.append(row)
        if info:
            hashes[str(info["sha256"])].append({"id": kit.id, "name": kit.name, "sourceId": kit.source_id})
        if background_info:
            background_hashes[str(background_info["sha256"])].append(
                {"id": kit.id, "name": kit.name, "sourceId": kit.source_id}
            )

    duplicate_groups = [group for group in hashes.values() if len(group) > 1]
    duplicate_background_groups = [group for group in background_hashes.values() if len(group) > 1]
    dimensions = Counter(
        f"{row['originalCover']['width']}x{row['originalCover']['height']}"
        for row in rows
        if row["originalCover"]
    )
    summary = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "catalogSize": len(rows),
        "status": dict(Counter(str(row["status"]) for row in rows)),
        "dimensionVariants": len(dimensions),
        "mostCommonDimensions": dimensions.most_common(12),
        "duplicateCoverGroups": len(duplicate_groups),
        "uniqueBackgrounds": len(background_hashes),
        "duplicateBackgroundGroups": len(duplicate_background_groups),
        "kitsWithSourceBackground": sum(bool(row["background"]) for row in rows),
        "master": {"width": MASTER_SIZE[0], "height": MASTER_SIZE[1], "aspectRatio": 2.0},
        "safeArea": SAFE_AREA,
        "androidContract": android_contract,
    }

    args.output.mkdir(parents=True, exist_ok=True)
    (args.output / "kit-cover-audit.json").write_text(
        json.dumps(
            {
                "summary": summary,
                "duplicates": duplicate_groups,
                "backgroundDuplicates": duplicate_background_groups,
                "kits": rows,
            },
            indent=2,
            ensure_ascii=False,
        )
        + "\n",
        encoding="utf-8",
    )
    markdown = [
        "# Mega Drum cover audit",
        "",
        f"- Catalog kits: {summary['catalogSize']}",
        f"- Ready for deterministic generation: {summary['status'].get('ready', 0)}",
        f"- Dimension variants in current covers: {summary['dimensionVariants']}",
        f"- Duplicate cover groups: {summary['duplicateCoverGroups']}",
        f"- Kits with an original background: {summary['kitsWithSourceBackground']}",
        f"- Unique source backgrounds: {summary['uniqueBackgrounds']}",
        f"- Duplicate background groups: {summary['duplicateBackgroundGroups']}",
        f"- New master contract: {MASTER_SIZE[0]}×{MASTER_SIZE[1]} (2:1)",
        f"- Shared safe area: {SAFE_AREA['width']}×{SAFE_AREA['height']} at ({SAFE_AREA['x']}, {SAFE_AREA['y']})",
        "",
        "## Most common current dimensions",
        "",
        "| Dimensions | Kits |",
        "| --- | ---: |",
        *[f"| {size} | {count} |" for size, count in dimensions.most_common(12)],
        "",
        "The audit is structural. Text, logos and trademarks still require visual review until the individual pieces are treated.",
        "",
    ]
    (args.output / "kit-cover-audit.md").write_text("\n".join(markdown), encoding="utf-8")
    print(json.dumps(summary, indent=2, ensure_ascii=False))


def source_background(path: Path, size: tuple[int, int]) -> Image.Image:
    """Match KitCoverGenerator: stretch the source background to the canvas."""
    with Image.open(path) as source:
        return source.convert("RGBA").resize(size, Image.Resampling.BILINEAR)


def fitted_piece(path: Path, box_size: float) -> Image.Image:
    """Match drawPad: fit the complete bitmap, including transparent padding, in a square."""
    with Image.open(path) as source:
        piece = source.convert("RGBA")
    if piece.width <= 0 or piece.height <= 0 or box_size <= 0:
        return piece
    scale = min(box_size / piece.width, box_size / piece.height)
    width = max(1, round(piece.width * scale))
    height = max(1, round(piece.height * scale))
    return piece.resize((width, height), Image.Resampling.BILINEAR)


def composite_piece(canvas: Image.Image, piece: Image.Image, center: tuple[int, int]) -> None:
    left = round(center[0] - piece.width / 2)
    top = round(center[1] - piece.height / 2)
    canvas.alpha_composite(piece, (left, top))


def build_master(
    package: Path,
    background_override: Path | None = None,
) -> tuple[Image.Image, list[str], dict[str, object]]:
    original_background_path = find_background(package)
    background_path = background_override or original_background_path
    if background_path:
        canvas = source_background(background_path, MASTER_SIZE)
        background_info = {
            "mode": "reviewed-override" if background_override else "source",
            "file": str(background_path),
            "sha256": sha256(background_path),
            "originalFile": str(original_background_path) if original_background_path else None,
            "originalSha256": sha256(original_background_path) if original_background_path else None,
            "contentScale": "fillBounds",
            "treatment": "promotional-marks-removed" if background_override else "none",
        }
    else:
        canvas = Image.new("RGBA", MASTER_SIZE, FALLBACK_COLOR)
        background_info = {"mode": "fallback-color", "file": None, "color": "#0E0F13"}
    used: list[str] = []
    for name, x_percent, y_percent, rel_size in LAYOUT:
        path = package / name
        if not path.is_file():
            continue
        box_size = rel_size * SIZE_CALIBRATION / 100 * MASTER_SIZE[0]
        piece = fitted_piece(path, box_size)
        center = (
            round(x_percent / 100 * MASTER_SIZE[0]),
            round(y_percent / 100 * MASTER_SIZE[1]),
        )
        composite_piece(canvas, piece, center)
        used.append(name)
    return canvas.convert("RGB"), used, background_info


def select_kits(args: argparse.Namespace, kits: list[CatalogKit]) -> list[CatalogKit]:
    if args.all:
        return kits
    wanted_ids = set(args.kit_id)
    wanted_sources = set(args.source_id)
    selected = [kit for kit in kits if kit.id in wanted_ids or kit.source_id in wanted_sources]
    if not selected:
        raise SystemExit("No catalog kits matched the requested IDs.")
    return selected


def generate(args: argparse.Namespace) -> None:
    android_contract = verify_android_contract(args.android_root)
    roots = (args.free_root.resolve(), args.premium_root.resolve())
    kits = load_catalog(args.catalog.resolve())
    selected = select_kits(args, kits)
    generated_sources: dict[str, Path] = {}

    for kit in selected:
        package = find_package(kit, roots)
        if not package:
            raise FileNotFoundError(f"Source package not found for {kit.name} ({kit.source_id})")

        # Multiple catalog records can point to the same free/premium asset set.
        # Render once, then write a manifest entry for each catalog UUID.
        output_dir = args.output.resolve() / f"source-{kit.source_id}"
        master_path = output_dir / "cover.png"
        if kit.source_id not in generated_sources:
            if output_dir.exists() and master_path.exists() and not args.force:
                raise FileExistsError(f"Output exists; pass --force to replace it: {output_dir}")
            output_dir.mkdir(parents=True, exist_ok=True)
            background_override = find_background_override(
                args.background_overrides,
                kit.source_id,
            )
            master, used, background_info = build_master(package, background_override)
            # Android Canvas outputs a plain sRGB bitmap; discard inherited PNG
            # metadata/ICC chunks so the published file behaves the same way.
            master.info.clear()
            master.save(master_path, format="PNG", optimize=True, compress_level=9)
            for filename, size in VARIANTS.items():
                master.resize(size, Image.Resampling.BILINEAR).save(
                    output_dir / filename,
                    format="WEBP",
                    quality=88,
                    method=6,
                )
            generated_sources[kit.source_id] = output_dir
            manifest = {
                "generatorVersion": 4,
                "sourceId": kit.source_id,
                "sourcePackage": str(package),
                "sourceCover": str(package / "cover.png"),
                "master": {"file": "cover.png", "width": MASTER_SIZE[0], "height": MASTER_SIZE[1]},
                "safeArea": SAFE_AREA,
                "variants": {name: {"width": size[0], "height": size[1]} for name, size in VARIANTS.items()},
                "background": background_info,
                "pieces": used,
                "layout": {
                    "source": "MegaDrumNew PadLayout.visiblePads(false)",
                    "sizeCalibration": SIZE_CALIBRATION,
                    "drawOrder": "list-order",
                    "bitmapFit": "fit-center-with-transparent-padding",
                    "effects": "none",
                    "androidContract": android_contract,
                },
                "suggestedR2Path": f"kits/{kit.source_id}/cover-v2.png",
                "catalogRecords": [],
            }
            (output_dir / "manifest.json").write_text(
                json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
            )

        manifest_path = generated_sources[kit.source_id] / "manifest.json"
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        record = {"id": kit.id, "name": kit.name, "sortOrder": kit.sort_order, "previousCoverUrl": kit.cover_url}
        if record not in manifest["catalogRecords"]:
            manifest["catalogRecords"].append(record)
        manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"Generated {len(generated_sources)} source covers for {len(selected)} catalog records in {args.output.resolve()}")


def main() -> None:
    args = parse_args()
    if args.command == "audit":
        audit(args)
    else:
        generate(args)


if __name__ == "__main__":
    main()
