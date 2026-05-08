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

printf "==> Phase 3 dual-read/write audit\n"

psql "$PSQL_DATABASE_URL" -v ON_ERROR_STOP=1 -P pager=off -c "
SELECT
  COUNT(*) AS total_articles,
  COUNT(*) FILTER (WHERE a.hero_asset_id IS NOT NULL) AS with_hero_asset,
  COUNT(*) FILTER (WHERE a.hero_asset_id IS NULL) AS without_hero_asset,
  COUNT(*) FILTER (WHERE a.hero_asset_id IS NOT NULL AND s.id IS NULL) AS broken_asset_fk,
  COUNT(*) FILTER (
    WHERE a.hero_asset_id IS NOT NULL
      AND s.id IS NOT NULL
      AND a.img IS DISTINCT FROM s.url
  ) AS img_asset_url_mismatch
FROM content_article a
LEFT JOIN content_asset s ON s.id = a.hero_asset_id;
"

printf "\n==> Mismatch details (if any)\n"

psql "$PSQL_DATABASE_URL" -v ON_ERROR_STOP=1 -P pager=off -c "
SELECT
  a.id AS article_id,
  a.slug,
  a.img AS article_img,
  s.url AS asset_url,
  a.hero_asset_id,
  s.provider,
  s.provider_key
FROM content_article a
LEFT JOIN content_asset s ON s.id = a.hero_asset_id
WHERE a.hero_asset_id IS NOT NULL
  AND s.id IS NOT NULL
  AND a.img IS DISTINCT FROM s.url
ORDER BY a.id;
"

printf "\n==> Phase 3 audit completed\n"
