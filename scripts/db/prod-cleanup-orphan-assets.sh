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
DRY_RUN="${DRY_RUN:-true}"
MIN_AGE_DAYS="${MIN_AGE_DAYS:-7}"
LIMIT_ROWS="${LIMIT_ROWS:-200}"

if [[ "$DRY_RUN" != "true" && "$DRY_RUN" != "false" ]]; then
  printf "DRY_RUN must be 'true' or 'false'.\n" >&2
  exit 1
fi

if ! [[ "$MIN_AGE_DAYS" =~ ^[0-9]+$ ]]; then
  printf "MIN_AGE_DAYS must be a non-negative integer.\n" >&2
  exit 1
fi

if ! [[ "$LIMIT_ROWS" =~ ^[0-9]+$ ]]; then
  printf "LIMIT_ROWS must be a non-negative integer.\n" >&2
  exit 1
fi

printf "==> Orphan assets cleanup\n"
printf "    DRY_RUN=%s MIN_AGE_DAYS=%s LIMIT_ROWS=%s\n" "$DRY_RUN" "$MIN_AGE_DAYS" "$LIMIT_ROWS"

if [[ "$DRY_RUN" == "true" ]]; then
  psql "$PSQL_DATABASE_URL" -v ON_ERROR_STOP=1 -P pager=off -c "
  WITH asset_refs AS (
    SELECT hero_asset_id AS asset_id FROM content_article WHERE hero_asset_id IS NOT NULL
    UNION ALL
    SELECT hero_asset_id AS asset_id FROM content_project WHERE hero_asset_id IS NOT NULL
  )
  SELECT
    a.id,
    a.url,
    a.provider,
    a.provider_key,
    a.updated_at
  FROM content_asset a
  WHERE NOT EXISTS (SELECT 1 FROM asset_refs r WHERE r.asset_id = a.id)
    AND a.updated_at < now() - ($MIN_AGE_DAYS::text || ' days')::interval
  ORDER BY a.updated_at ASC
  LIMIT $LIMIT_ROWS;
  "

  printf "==> Dry run completed. No rows deleted.\n"
  exit 0
fi

psql "$PSQL_DATABASE_URL" -v ON_ERROR_STOP=1 -P pager=off -c "
WITH asset_refs AS (
  SELECT hero_asset_id AS asset_id FROM content_article WHERE hero_asset_id IS NOT NULL
  UNION ALL
  SELECT hero_asset_id AS asset_id FROM content_project WHERE hero_asset_id IS NOT NULL
),
to_delete AS (
  SELECT a.id
  FROM content_asset a
  WHERE NOT EXISTS (SELECT 1 FROM asset_refs r WHERE r.asset_id = a.id)
    AND a.updated_at < now() - ($MIN_AGE_DAYS::text || ' days')::interval
  ORDER BY a.updated_at ASC
  LIMIT $LIMIT_ROWS
),
deleted AS (
  DELETE FROM content_asset a
  USING to_delete d
  WHERE a.id = d.id
  RETURNING a.id
)
SELECT COUNT(*) AS deleted_rows FROM deleted;
"

printf "==> Cleanup completed.\n"
