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

printf "==> Repairing missing content_article.hero_asset_id links\n"

psql "$PSQL_DATABASE_URL" -v ON_ERROR_STOP=1 -P pager=off -c "
WITH updated_rows AS (
  UPDATE content_article AS a
  SET
    hero_asset_id = s.id,
    updated_at = now()
  FROM content_asset AS s
  WHERE a.hero_asset_id IS NULL
    AND a.img IS NOT NULL
    AND a.img <> ''
    AND s.provider_key = 'legacy:article-img:' || md5(a.img)
  RETURNING a.id
)
SELECT COUNT(*) AS repaired_rows FROM updated_rows;
"

printf "==> Verifying backfill coverage after repair\n"

psql "$PSQL_DATABASE_URL" -v ON_ERROR_STOP=1 -P pager=off -c "
SELECT
  COUNT(*) FILTER (WHERE img IS NOT NULL AND img <> '') AS articles_with_img,
  COUNT(*) FILTER (WHERE hero_asset_id IS NOT NULL) AS articles_with_hero_asset,
  COUNT(*) FILTER (
    WHERE hero_asset_id IS NULL
      AND img IS NOT NULL
      AND img <> ''
  ) AS pending_backfill
FROM content_article;
"

pending=$(psql "$PSQL_DATABASE_URL" -v ON_ERROR_STOP=1 -Atc "
SELECT COUNT(*)
FROM content_article
WHERE hero_asset_id IS NULL
  AND img IS NOT NULL
  AND img <> '';
")

if [[ "$pending" != "0" ]]; then
  printf "Repair incomplete: %s rows still pending.\n" "$pending" >&2
  exit 1
fi

printf "==> Repair completed successfully\n"
