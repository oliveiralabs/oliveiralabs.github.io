#!/usr/bin/env python3
"""Synchronize generated covers and reviewed backgrounds with the iOS catalogs.

The script is a dry-run unless --apply is provided. It updates each catalog
cover, adds a content hash to coverUrl for cache busting, and rebuilds only the
kit archives whose manifest uses a reviewed background override.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import tempfile
import zipfile
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--generated", required=True, type=Path)
    parser.add_argument("--free-repo", required=True, type=Path)
    parser.add_argument("--premium-repo", required=True, type=Path)
    parser.add_argument(
        "--piece-overrides",
        type=Path,
        help=(
            "Optional reviewed piece root. PNG files under source-<id>/ replace the same "
            "megadrumkit/<file> entry and trigger a package version bump."
        ),
    )
    parser.add_argument("--apply", action="store_true")
    return parser.parse_args()


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def versioned_url(url: str, digest: str) -> str:
    parts = urlsplit(url)
    query = dict(parse_qsl(parts.query, keep_blank_values=True))
    query["v"] = digest[:12]
    return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query), parts.fragment))


def load_manifests(generated: Path) -> list[tuple[Path, dict]]:
    manifests = []
    for path in generated.glob("source-*/manifest.json"):
        manifests.append((path.parent, json.loads(path.read_text())))
    return sorted(manifests, key=lambda item: int(item[1]["sourceId"]))


def repository_for(source_id: str, free_repo: Path, premium_repo: Path) -> Path:
    free_dir = free_repo / source_id
    premium_dir = premium_repo / source_id
    if free_dir.is_dir() and not premium_dir.is_dir():
        return free_repo
    if premium_dir.is_dir() and not free_dir.is_dir():
        return premium_repo
    raise RuntimeError(f"Cannot resolve a unique iOS repository for source {source_id}")


def piece_overrides(root: Path | None, source_id: str) -> dict[str, bytes]:
    if root is None:
        return {}
    source = root.resolve() / f"source-{source_id}"
    if not source.is_dir():
        return {}
    ignored = {"contact-sheet.png"}
    return {
        file.name: file.read_bytes()
        for file in sorted(source.glob("*.png"))
        if file.name not in ignored
    }


def archive_changes(archive: Path, replacements: dict[str, bytes]) -> bool:
    with zipfile.ZipFile(archive) as source:
        names = set(source.namelist())
        expected = set(replacements)
        missing = expected - names
        if missing:
            raise RuntimeError(f"{archive} is missing {', '.join(sorted(missing))}")
        return any(source.read(name) != data for name, data in replacements.items())


def rebuild_archive(archive: Path, replacements: dict[str, bytes]) -> None:
    fd, temporary_name = tempfile.mkstemp(prefix=f".{archive.name}.", dir=archive.parent)
    os.close(fd)
    temporary = Path(temporary_name)
    try:
        with zipfile.ZipFile(archive) as source, zipfile.ZipFile(temporary, "w") as target:
            target.comment = source.comment
            for info in source.infolist():
                data = source.read(info.filename)
                if info.filename in replacements:
                    data = replacements[info.filename]
                target.writestr(info, data)
        temporary.replace(archive)
    finally:
        temporary.unlink(missing_ok=True)


def main() -> None:
    args = parse_args()
    manifests = load_manifests(args.generated)
    if not manifests:
        raise RuntimeError(f"No generated manifests found under {args.generated}")

    catalogs: dict[Path, list[dict]] = {}
    catalog_by_source: dict[tuple[Path, str], dict] = {}
    for repo in (args.free_repo, args.premium_repo):
        index_path = repo / "index.json"
        entries = json.loads(index_path.read_text())
        catalogs[repo] = entries
        for entry in entries:
            source_id = entry["path"].removeprefix("online_kit_")
            catalog_by_source[(repo, source_id)] = entry

    cover_updates = 0
    url_updates = 0
    archive_updates = 0
    version_updates = 0
    reviewed_backgrounds = 0
    reviewed_pieces = 0
    per_repo = {args.free_repo: {"covers": 0, "archives": 0}, args.premium_repo: {"covers": 0, "archives": 0}}

    for output_dir, manifest in manifests:
        source_id = str(manifest["sourceId"])
        repo = repository_for(source_id, args.free_repo, args.premium_repo)
        entry = catalog_by_source.get((repo, source_id))
        if entry is None:
            raise RuntimeError(f"Source {source_id} is not present in {repo / 'index.json'}")

        cover_data = (output_dir / manifest["master"]["file"]).read_bytes()
        cover_digest = sha256(cover_data)
        cover_target = repo / source_id / "cover.png"
        if not cover_target.is_file():
            raise RuntimeError(f"Missing catalog cover: {cover_target}")
        if cover_target.read_bytes() != cover_data:
            cover_updates += 1
            per_repo[repo]["covers"] += 1
            if args.apply:
                shutil.copyfile(output_dir / manifest["master"]["file"], cover_target)

        next_url = versioned_url(entry["coverUrl"], cover_digest)
        if entry["coverUrl"] != next_url:
            entry["coverUrl"] = next_url
            url_updates += 1

        overrides = piece_overrides(args.piece_overrides, source_id)
        reviewed_pieces += len(overrides)
        has_reviewed_background = manifest["background"]["mode"] == "reviewed-override"
        if not has_reviewed_background and not overrides:
            continue

        replacements = {"megadrumkit/cover.png": cover_data}
        if has_reviewed_background:
            reviewed_backgrounds += 1
            background_path = Path(manifest["background"]["file"])
            replacements["megadrumkit/background.png"] = background_path.read_bytes()
        replacements.update({f"megadrumkit/{name}": data for name, data in overrides.items()})
        archive = repo / source_id / "kit.megadrum"
        if not archive.is_file():
            raise RuntimeError(f"Missing kit archive: {archive}")
        if archive_changes(archive, replacements):
            archive_updates += 1
            per_repo[repo]["archives"] += 1
            current_version = entry.get("version", 1)
            if not isinstance(current_version, int):
                raise RuntimeError(f"Invalid version for source {source_id}: {current_version!r}")
            entry["version"] = current_version + 1
            version_updates += 1
            if args.apply:
                rebuild_archive(archive, replacements)

    if args.apply:
        for repo, entries in catalogs.items():
            (repo / "index.json").write_text(
                json.dumps(entries, ensure_ascii=False, indent=2) + "\n"
            )

    summary = {
        "mode": "apply" if args.apply else "dry-run",
        "manifests": len(manifests),
        "coverUpdates": cover_updates,
        "coverUrlUpdates": url_updates,
        "reviewedBackgrounds": reviewed_backgrounds,
        "reviewedPieces": reviewed_pieces,
        "archiveUpdates": archive_updates,
        "packageVersionUpdates": version_updates,
        "repositories": {
            str(repo): counts for repo, counts in per_repo.items()
        },
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
