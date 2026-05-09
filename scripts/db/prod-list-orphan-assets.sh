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

LIMIT_ROWS="${LIMIT_ROWS:-200}"

printf "==> Listing orphan assets (limit=%s)\n" "$LIMIT_ROWS"

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
  a.created_at,
  a.updated_at
FROM content_asset a
WHERE NOT EXISTS (
  SELECT 1 FROM asset_refs r WHERE r.asset_id = a.id
)
ORDER BY a.updated_at ASC, a.created_at ASC, a.id ASC
LIMIT $LIMIT_ROWS;
"

printf "==> Orphan asset listing completed\n"
