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

printf "==> Article publication filter verification\n"

psql "$PSQL_DATABASE_URL" -v ON_ERROR_STOP=1 -P pager=off -c "
WITH normalized AS (
  SELECT
    id,
    slug,
    title,
    status,
    COALESCE(visible, true) AS visible,
    published_at,
    CASE
      WHEN published_at ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' THEN to_date(published_at, 'YYYY-MM-DD')
      ELSE NULL
    END AS published_date
  FROM content_article
),
eligible AS (
  SELECT *
  FROM normalized
  WHERE status <> 'draft'
    AND visible = true
    AND published_date IS NOT NULL
    AND published_date <= CURRENT_DATE
)
SELECT
  (SELECT COUNT(*) FROM normalized) AS total_articles,
  (SELECT COUNT(*) FROM eligible) AS eligible_public_articles,
  (SELECT COUNT(*) FROM normalized WHERE status = 'draft') AS excluded_draft,
  (SELECT COUNT(*) FROM normalized WHERE visible = false) AS excluded_not_visible,
  (SELECT COUNT(*) FROM normalized WHERE published_date IS NULL) AS excluded_invalid_date,
  (SELECT COUNT(*) FROM normalized WHERE published_date > CURRENT_DATE) AS excluded_future_date;
"

printf "\n==> Eligible public article slugs\n"

psql "$PSQL_DATABASE_URL" -v ON_ERROR_STOP=1 -P pager=off -c "
SELECT id, slug, title, published_at, status, visible
FROM content_article
WHERE status <> 'draft'
  AND COALESCE(visible, true) = true
  AND published_at ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
  AND to_date(published_at, 'YYYY-MM-DD') <= CURRENT_DATE
ORDER BY to_date(published_at, 'YYYY-MM-DD') DESC, id DESC;
"

printf "==> Publication filter verification completed\n"
