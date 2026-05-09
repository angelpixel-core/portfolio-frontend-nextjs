#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${DATABASE_URL:-}" ]]; then
  printf "DATABASE_URL is required. Export it before running this script.\n" >&2
  exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
  printf "psql is required but was not found in PATH.\n" >&2
  exit 1
fi

strip_uselibpqcompat() {
  local url="$1"
  url=$(printf '%s' "$url" | sed -E "s/([?&])uselibpqcompat=true(&|$)/\\1/g")
  url=$(printf '%s' "$url" | sed -E "s/([?&])supa=[^&]*(&|$)/\\1/g")
  url=$(printf '%s' "$url" | sed -E "s/\?&/\?/g; s/[?&]$//g")
  printf "%s" "$url"
}

PSQL_DATABASE_URL="$(strip_uselibpqcompat "$DATABASE_URL")"

printf "==> Project Phase 2 assets backfill verification\n"

psql "$PSQL_DATABASE_URL" -v ON_ERROR_STOP=1 -P pager=off -c "
SELECT
  COUNT(*) FILTER (WHERE img IS NOT NULL AND img <> '') AS projects_with_img,
  COUNT(*) FILTER (WHERE hero_asset_id IS NOT NULL) AS projects_with_hero_asset,
  COUNT(*) FILTER (
    WHERE hero_asset_id IS NULL
      AND img IS NOT NULL
      AND img <> ''
  ) AS pending_backfill
FROM content_project;
"

pending=$(psql "$PSQL_DATABASE_URL" -v ON_ERROR_STOP=1 -Atc "
SELECT COUNT(*)
FROM content_project
WHERE hero_asset_id IS NULL
  AND img IS NOT NULL
  AND img <> '';
")

if [[ "$pending" != "0" ]]; then
  printf "Project backfill is incomplete: %s projects still missing hero_asset_id.\n" "$pending" >&2
  exit 1
fi

printf "==> Project Phase 2 assets backfill verification passed\n"
