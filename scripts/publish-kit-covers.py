#!/usr/bin/env python3
"""Publish generated Mega Drum covers and reviewed backgrounds to R2/Supabase.

The command is a dry-run unless --apply is passed. Existing versioned objects
must have identical bytes; the script never overwrites a different object.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path


@dataclass(frozen=True)
class Asset:
    source_id: str
    kind: str
    file: Path
    key: str
    sha256: str


@dataclass(frozen=True)
class RecordUpdate:
    source_id: str
    record_id: str
    name: str
    cover_url: str
    background_url: str | None


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--generated", type=Path, required=True)
    parser.add_argument("--env", type=Path, default=Path(".env.cover-publish.local"))
    parser.add_argument("--rollback-dir", type=Path, required=True)
    parser.add_argument("--apply", action="store_true")
    return parser.parse_args()


def load_env(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
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


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def file_md5(path: Path) -> str:
    digest = hashlib.md5(usedforsecurity=False)
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def api_json(url: str, key: str, method: str = "GET", payload: object | None = None) -> object:
    data = None if payload is None else json.dumps(payload).encode("utf-8")
    headers = {"apikey": key, "Accept": "application/json"}
    if data is not None:
        headers["Content-Type"] = "application/json"
        headers["Prefer"] = "return=representation"
    request = urllib.request.Request(url, data=data, headers=headers, method=method)
    with urllib.request.urlopen(request, timeout=60) as response:
        body = response.read()
    return json.loads(body) if body else None


def load_plan(generated: Path, public_base: str) -> tuple[list[Asset], list[RecordUpdate]]:
    assets: list[Asset] = []
    updates: list[RecordUpdate] = []
    manifests = sorted(generated.glob("source-*/manifest.json"), key=lambda path: int(path.parent.name[7:]))
    if not manifests:
        raise SystemExit(f"No manifests found under {generated}")

    for manifest_path in manifests:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        source_id = str(manifest["sourceId"])
        cover_file = manifest_path.parent / manifest["master"]["file"]
        cover_key = str(manifest["suggestedR2Path"])
        if not cover_file.is_file():
            raise SystemExit(f"Missing generated cover: {cover_file}")
        assets.append(Asset(source_id, "cover", cover_file, cover_key, file_sha256(cover_file)))

        background = manifest["background"]
        background_url: str | None = None
        if background["mode"] == "reviewed-override":
            background_file = Path(background["file"])
            if not background_file.is_file():
                raise SystemExit(f"Missing reviewed background: {background_file}")
            background_key = f"kits/{source_id}/background-v2.png"
            assets.append(
                Asset(source_id, "background", background_file, background_key, file_sha256(background_file))
            )
            background_url = f"{public_base}/{background_key}"

        for record in manifest["catalogRecords"]:
            updates.append(
                RecordUpdate(
                    source_id=source_id,
                    record_id=str(record["id"]),
                    name=str(record["name"]),
                    cover_url=f"{public_base}/{cover_key}",
                    background_url=background_url,
                )
            )
    return assets, updates


def fetch_rows(base_url: str, key: str) -> dict[str, dict[str, object]]:
    query = urllib.parse.urlencode(
        {"select": "id,name,cover_url,background_url", "order": "sort_order.asc"}, safe=",."
    )
    rows = api_json(f"{base_url}/rest/v1/kits?{query}", key)
    assert isinstance(rows, list)
    return {str(row["id"]): row for row in rows}


def aws_environment(config: dict[str, str]) -> dict[str, str]:
    aws_env = os.environ.copy()
    aws_env.update(
        {
            "AWS_ACCESS_KEY_ID": config["MEGADRUM_R2_ACCESS_KEY_ID"],
            "AWS_SECRET_ACCESS_KEY": config["MEGADRUM_R2_SECRET_ACCESS_KEY"],
            "AWS_DEFAULT_REGION": "auto",
        }
    )
    return aws_env


def object_matches(asset: Asset, config: dict[str, str]) -> bool | None:
    endpoint = f"https://{config['MEGADRUM_R2_ACCOUNT_ID']}.r2.cloudflarestorage.com"
    result = subprocess.run(
        [
            "aws",
            "s3api",
            "head-object",
            "--bucket",
            config["MEGADRUM_R2_BUCKET"],
            "--key",
            asset.key,
            "--endpoint-url",
            endpoint,
            "--no-cli-pager",
        ],
        env=aws_environment(config),
        text=True,
        capture_output=True,
    )
    if result.returncode != 0:
        if "(404)" in result.stderr or "Not Found" in result.stderr:
            return None
        raise SystemExit(f"R2 head-object failed for {asset.key}: {result.stderr.strip()}")
    head = json.loads(result.stdout)
    metadata_hash = str(head.get("Metadata", {}).get("sha256", ""))
    if metadata_hash:
        return metadata_hash == asset.sha256
    etag = str(head.get("ETag", "")).strip('"')
    return etag == file_md5(asset.file)


def upload_asset(asset: Asset, config: dict[str, str]) -> None:
    endpoint = f"https://{config['MEGADRUM_R2_ACCOUNT_ID']}.r2.cloudflarestorage.com"
    subprocess.run(
        [
            "aws",
            "s3api",
            "put-object",
            "--bucket",
            config["MEGADRUM_R2_BUCKET"],
            "--key",
            asset.key,
            "--body",
            str(asset.file),
            "--content-type",
            "image/png",
            "--cache-control",
            "public, max-age=31536000, immutable",
            "--metadata",
            f"sha256={asset.sha256},source-id={asset.source_id},asset-kind={asset.kind}",
            "--endpoint-url",
            endpoint,
            "--no-cli-pager",
        ],
        check=True,
        env=aws_environment(config),
        stdout=subprocess.DEVNULL,
    )


def main() -> int:
    args = parse_args()
    config = load_env(args.env)
    public_base = config["MEGADRUM_R2_PUBLIC_BASE_URL"].rstrip("/")
    supabase_base = config["MEGADRUM_SUPABASE_URL"].rstrip("/")
    assets, updates = load_plan(args.generated.resolve(), public_base)
    current = fetch_rows(supabase_base, config["MEGADRUM_SUPABASE_SECRET_KEY"])

    missing_records = [update.record_id for update in updates if update.record_id not in current]
    if missing_records:
        raise SystemExit(f"Catalog records not found: {', '.join(missing_records)}")

    rollback = {
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "generatedRoot": str(args.generated.resolve()),
        "records": [current[update.record_id] for update in updates],
    }
    args.rollback_dir.mkdir(parents=True, exist_ok=True)
    rollback_path = args.rollback_dir / "rollback.json"
    rollback_path.write_text(json.dumps(rollback, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    existing_same = 0
    missing_remote = 0
    for index, asset in enumerate(assets, start=1):
        matches = object_matches(asset, config)
        if matches is True:
            existing_same += 1
            continue
        if matches is False:
            raise SystemExit(
                f"Refusing to overwrite different versioned object {asset.key}"
            )
        missing_remote += 1
        if args.apply:
            upload_asset(asset, config)
            if object_matches(asset, config) is not True:
                raise SystemExit(f"R2 verification failed for {asset.key}")
        if index % 20 == 0:
            print(f"Checked {index}/{len(assets)} assets", flush=True)

    changed_records = 0
    for update in updates:
        before = current[update.record_id]
        payload: dict[str, str] = {"cover_url": update.cover_url}
        if update.background_url is not None:
            payload["background_url"] = update.background_url
        if all(before.get(key) == value for key, value in payload.items()):
            continue
        changed_records += 1
        if args.apply:
            query = urllib.parse.urlencode({"id": f"eq.{update.record_id}"})
            result = api_json(
                f"{supabase_base}/rest/v1/kits?{query}",
                config["MEGADRUM_SUPABASE_SECRET_KEY"],
                method="PATCH",
                payload=payload,
            )
            if not isinstance(result, list) or len(result) != 1:
                raise SystemExit(f"Unexpected PATCH result for {update.record_id}: {result!r}")

    summary = {
        "mode": "apply" if args.apply else "dry-run",
        "covers": sum(asset.kind == "cover" for asset in assets),
        "reviewedBackgrounds": sum(asset.kind == "background" for asset in assets),
        "existingIdenticalAssets": existing_same,
        "assetsToUpload": missing_remote,
        "catalogRecords": len(updates),
        "recordsToUpdate": changed_records,
        "rollback": str(rollback_path),
    }
    print(json.dumps(summary, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        print(f"HTTP {error.code}: {detail}", file=sys.stderr)
        raise
