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

run_query() {
  local title="$1"
  local sql="$2"

  printf "\n==> %s\n" "$title"
  psql "$PSQL_DATABASE_URL" -v ON_ERROR_STOP=1 -P pager=off -c "$sql"
}

MIGRATIONS_TABLE=$(psql "$PSQL_DATABASE_URL" -v ON_ERROR_STOP=1 -Atc "
select quote_ident(n.nspname) || '.' || quote_ident(c.relname)
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where c.relkind = 'r'
  and c.relname = '__drizzle_migrations'
order by case when n.nspname = 'public' then 0 else 1 end, n.nspname
limit 1;
")

if [[ -n "$MIGRATIONS_TABLE" ]]; then
  run_query "Latest drizzle migrations ($MIGRATIONS_TABLE)" "
  select id, hash, created_at
  from $MIGRATIONS_TABLE
  order by created_at desc
  limit 10;
  "
else
  printf "\n==> Latest drizzle migrations\n"
  printf "Warning: table __drizzle_migrations was not found in this database.\n"
fi

run_query "Pending articles (hero_asset_id is null)" "
select id, img, hero_asset_id
from content_article
where hero_asset_id is null
  and img is not null
  and img <> '';
"

run_query "Legacy assets created by backfill" "
select id, url, provider, provider_key
from content_asset
where provider = 'legacy-url'
order by created_at desc
limit 20;
"

run_query "Expected provider_key for pending articles" "
select
  id,
  img,
  'legacy:article-img:' || md5(img) as expected_provider_key
from content_article
where hero_asset_id is null
  and img is not null
  and img <> '';
"

run_query "Pending articles joined with matching legacy asset" "
select
  a.id as article_id,
  a.img,
  s.id as asset_id,
  s.provider_key
from content_article a
left join content_asset s
  on s.provider_key = 'legacy:article-img:' || md5(a.img)
where a.hero_asset_id is null
  and a.img is not null
  and a.img <> '';
"

printf "\n==> Phase 2 debug queries completed\n"
