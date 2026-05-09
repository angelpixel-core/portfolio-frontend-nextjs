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

printf "==> Phase 4 asset metrics\n"

psql "$PSQL_DATABASE_URL" -v ON_ERROR_STOP=1 -P pager=off -c "
WITH asset_refs AS (
  SELECT hero_asset_id AS asset_id FROM content_article WHERE hero_asset_id IS NOT NULL
  UNION ALL
  SELECT hero_asset_id AS asset_id FROM content_project WHERE hero_asset_id IS NOT NULL
)
SELECT
  (SELECT COUNT(*) FROM content_asset) AS total_assets,
  (SELECT COUNT(*) FROM content_article) AS total_articles,
  (SELECT COUNT(*) FROM content_article WHERE hero_asset_id IS NOT NULL) AS articles_with_hero_asset,
  (SELECT COUNT(*) FROM content_article WHERE hero_asset_id IS NULL AND img IS NOT NULL AND img <> '') AS articles_pending_hero_asset,
  (SELECT COUNT(*) FROM content_project) AS total_projects,
  (SELECT COUNT(*) FROM content_project WHERE hero_asset_id IS NOT NULL) AS projects_with_hero_asset,
  (SELECT COUNT(*) FROM content_project WHERE hero_asset_id IS NULL AND img IS NOT NULL AND img <> '') AS projects_pending_hero_asset,
  (SELECT COUNT(*) FROM content_asset a WHERE NOT EXISTS (SELECT 1 FROM asset_refs r WHERE r.asset_id = a.id)) AS orphan_assets,
  (SELECT COUNT(*) FROM content_article a JOIN content_asset s ON s.id = a.hero_asset_id WHERE a.img IS DISTINCT FROM s.url) AS article_img_asset_mismatch,
  (SELECT COUNT(*) FROM content_project p JOIN content_asset s ON s.id = p.hero_asset_id WHERE p.img IS DISTINCT FROM s.url) AS project_img_asset_mismatch;
"

printf "==> Phase 4 metrics completed\n"
