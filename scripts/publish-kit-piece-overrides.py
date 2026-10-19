#!/usr/bin/env python3
"""Publish reviewed kit-piece images to immutable R2 paths and update Supabase.

The command is a dry-run unless --apply is passed. Existing versioned objects
must contain identical bytes; a different object is never overwritten.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import subprocess
import urllib.parse
import urllib.request
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path


SOURCE_PATTERN = re.compile(r"/kits/([^/]+)/cover(?:-[^/]+)?\.[a-z0-9]+", re.I)


@dataclass(frozen=True)
class Asset:
    source_id: str
    piece_id: str
    piece_name: str
    field: str
    file: Path
    key: str
    url: str
    sha256: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--overrides", required=True, type=Path)
    parser.add_argument("--env", default=Path(".env.cover-publish.local"), type=Path)
    parser.add_argument("--rollback-dir", required=True, type=Path)
    parser.add_argument("--asset-version", required=True, type=int)
    parser.add_argument("--source-id", action="append", default=[])
    parser.add_argument("--apply", action="store_true")
    return parser.parse_args()


def load_env(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if line and not line.startswith("#") and "=" in line:
            key, value = line.split("=", 1)
            values[key.strip()] = value.strip()
    required = [
        "MEGADRUM_R2_ACCOUNT_ID",
        "MEGADRUM_R2_ACCESS_KEY_ID",
        "MEGADRUM_R2_SECRET_ACCESS_KEY",
        "MEGADRUM_R2_BUCKET",
        "MEGADRUM_R2_PUBLIC_BASE_URL",
        "MEGADRUM_SUPABASE_URL",
        "MEGADRUM_SUPABASE_SECRET_KEY",
    ]
    missing = [key for key in required if not values.get(key)]
    if missing:
        raise SystemExit(f"Missing values in {path}: {', '.join(missing)}")
    return values


def api_json(url: str, key: str, method: str = "GET", payload: object | None = None) -> object:
    data = None if payload is None else json.dumps(payload).encode("utf-8")
    headers = {"apikey": key, "Authorization": f"Bearer {key}", "Accept": "application/json"}
    if data is not None:
        headers.update({"Content-Type": "application/json", "Prefer": "return=representation"})
    request = urllib.request.Request(url, data=data, headers=headers, method=method)
    with urllib.request.urlopen(request, timeout=60) as response:
        body = response.read()
    return json.loads(body) if body else None


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def aws_environment(config: dict[str, str]) -> dict[str, str]:
    environment = os.environ.copy()
    environment.update({
        "AWS_ACCESS_KEY_ID": config["MEGADRUM_R2_ACCESS_KEY_ID"],
        "AWS_SECRET_ACCESS_KEY": config["MEGADRUM_R2_SECRET_ACCESS_KEY"],
        "AWS_DEFAULT_REGION": "auto",
    })
    return environment


def endpoint(config: dict[str, str]) -> str:
    return f"https://{config['MEGADRUM_R2_ACCOUNT_ID']}.r2.cloudflarestorage.com"


def object_matches(asset: Asset, config: dict[str, str]) -> bool | None:
    result = subprocess.run(
        [
            "aws", "s3api", "head-object", "--bucket", config["MEGADRUM_R2_BUCKET"],
            "--key", asset.key, "--endpoint-url", endpoint(config), "--no-cli-pager",
        ],
        env=aws_environment(config), text=True, capture_output=True,
    )
    if result.returncode != 0:
        if "(404)" in result.stderr or "Not Found" in result.stderr:
            return None
        raise SystemExit(f"R2 head-object failed for {asset.key}: {result.stderr.strip()}")
    head = json.loads(result.stdout)
    remote_hash = str(head.get("Metadata", {}).get("sha256", ""))
    return remote_hash == asset.sha256 if remote_hash else False


def upload(asset: Asset, config: dict[str, str]) -> None:
    subprocess.run(
        [
            "aws", "s3api", "put-object", "--bucket", config["MEGADRUM_R2_BUCKET"],
            "--key", asset.key, "--body", str(asset.file), "--content-type", "image/png",
            "--cache-control", "public, max-age=31536000, immutable",
            "--metadata", f"sha256={asset.sha256},source-id={asset.source_id},asset-kind=piece",
            "--endpoint-url", endpoint(config), "--no-cli-pager",
        ],
        check=True, env=aws_environment(config), stdout=subprocess.DEVNULL,
    )


def source_kits(base: str, key: str) -> dict[str, dict[str, object]]:
    query = urllib.parse.urlencode({"select": "id,name,cover_url"}, safe=",.")
    rows = api_json(f"{base}/rest/v1/kits?{query}", key)
    assert isinstance(rows, list)
    resolved: dict[str, dict[str, object]] = {}
    for row in rows:
        match = SOURCE_PATTERN.search(str(row.get("cover_url") or ""))
        if match:
            resolved[match.group(1)] = row
    return resolved


def kit_pieces(base: str, key: str, kit_id: str) -> dict[str, dict[str, object]]:
    query = urllib.parse.urlencode({
        "select": "id,kit_id,name,image_url,left_handed_image_url",
        "kit_id": f"eq.{kit_id}",
    }, safe=",.")
    rows = api_json(f"{base}/rest/v1/kit_pieces?{query}", key)
    assert isinstance(rows, list)
    return {str(row["name"]): row for row in rows}


def main() -> None:
    args = parse_args()
    config = load_env(args.env)
    base = config["MEGADRUM_SUPABASE_URL"].rstrip("/")
    public = config["MEGADRUM_R2_PUBLIC_BASE_URL"].rstrip("/")
    kits = source_kits(base, config["MEGADRUM_SUPABASE_SECRET_KEY"])
    requested = set(args.source_id)
    assets: list[Asset] = []
    previous: list[dict[str, object]] = []

    for source_dir in sorted(args.overrides.resolve().glob("source-*")):
        source_id = source_dir.name.removeprefix("source-")
        if requested and source_id not in requested:
            continue
        kit = kits.get(source_id)
        if kit is None:
            raise SystemExit(f"Catalog kit not found for source {source_id}")
        pieces = kit_pieces(base, config["MEGADRUM_SUPABASE_SECRET_KEY"], str(kit["id"]))
        for file in sorted(source_dir.glob("*.png")):
            if file.name == "contact-sheet.png":
                continue
            left_handed = file.stem.endswith("_left_handed")
            piece_name = file.stem.removesuffix("_left_handed")
            piece = pieces.get(piece_name)
            if piece is None:
                raise SystemExit(f"Unknown piece {file.name} for source {source_id}")
            field = "left_handed_image_url" if left_handed else "image_url"
            key_path = f"kits/{source_id}/img-v{args.asset_version}/{file.name}"
            assets.append(Asset(
                source_id=source_id,
                piece_id=str(piece["id"]),
                piece_name=piece_name,
                field=field,
                file=file,
                key=key_path,
                url=f"{public}/{key_path}",
                sha256=sha256(file),
            ))
            previous.append({
                "id": piece["id"], "kit_id": piece["kit_id"], "name": piece["name"],
                "field": field, "previous_url": piece.get(field),
            })

    if not assets:
        raise SystemExit("No piece overrides matched the request.")

    args.rollback_dir.mkdir(parents=True, exist_ok=True)
    rollback = args.rollback_dir / "piece-rollback.json"
    rollback.write_text(json.dumps({
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "assetVersion": args.asset_version,
        "records": previous,
    }, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    existing = uploads = updates = 0
    for asset in assets:
        matches = object_matches(asset, config)
        if matches is False:
            raise SystemExit(f"Refusing to overwrite different versioned object {asset.key}")
        if matches is True:
            existing += 1
        else:
            uploads += 1
            if args.apply:
                upload(asset, config)
                if object_matches(asset, config) is not True:
                    raise SystemExit(f"R2 verification failed for {asset.key}")

        record = next(row for row in previous if str(row["id"]) == asset.piece_id and row["field"] == asset.field)
        if record["previous_url"] == asset.url:
            continue
        updates += 1
        if args.apply:
            query = urllib.parse.urlencode({"id": f"eq.{asset.piece_id}"})
            result = api_json(
                f"{base}/rest/v1/kit_pieces?{query}",
                config["MEGADRUM_SUPABASE_SECRET_KEY"],
                method="PATCH", payload={asset.field: asset.url},
            )
            if not isinstance(result, list) or len(result) != 1:
                raise SystemExit(f"Unexpected PATCH result for {asset.piece_id}: {result!r}")

    print(json.dumps({
        "mode": "apply" if args.apply else "dry-run",
        "assets": len(assets), "existingIdenticalAssets": existing,
        "assetsToUpload": uploads, "recordsToUpdate": updates,
        "rollback": str(rollback),
    }, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
