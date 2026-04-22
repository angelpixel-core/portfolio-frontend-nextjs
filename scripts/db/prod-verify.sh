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

if [[ "$DATABASE_URL" == *"uselibpqcompat=true"* ]]; then
	printf "==> Using DATABASE_URL without uselibpqcompat for psql compatibility\n"
fi

printf "==> Verifying required tables\n"
required_tables=(user account session verification user_two_factor activity orders access webhook_event)
missing=()

for table_name in "${required_tables[@]}"; do
	exists=$(psql "$PSQL_DATABASE_URL" -v ON_ERROR_STOP=1 -Atc "select 1 from information_schema.tables where table_schema='public' and table_name='${table_name}' limit 1;")
	if [[ "$exists" != "1" ]]; then
		missing+=("$table_name")
	fi
done

if ((${#missing[@]} > 0)); then
	printf "Missing required tables: %s\n" "${missing[*]}" >&2
	exit 1
fi

printf "==> Verifying orders constraints and indexes\n"
orders_status_check=$(psql "$PSQL_DATABASE_URL" -v ON_ERROR_STOP=1 -Atc "
select count(*)
from pg_constraint c
join pg_class t on c.conrelid=t.oid
join pg_namespace n on n.oid=t.relnamespace
where n.nspname='public'
  and t.relname='orders'
  and c.contype='c'
  and pg_get_constraintdef(c.oid) like '%status%pending%paid%failed%';
")

if [[ "$orders_status_check" -lt "1" ]]; then
	printf "Missing orders status check constraint (pending|paid|failed).\n" >&2
	exit 1
fi

orders_session_unique=$(psql "$PSQL_DATABASE_URL" -v ON_ERROR_STOP=1 -Atc "
select count(*)
from pg_indexes
where schemaname='public'
  and tablename='orders'
  and (
    indexname='orders_stripe_session_id_unique'
    or (
      indexdef like '%UNIQUE INDEX%'
      and indexdef like '%(stripe_session_id)%'
    )
  );
")

if [[ "$orders_session_unique" -lt "1" ]]; then
	printf "Missing orders unique index for stripe_session_id.\n" >&2
	exit 1
fi

printf "==> Verifying access constraints and indexes\n"
access_unique=$(psql "$PSQL_DATABASE_URL" -v ON_ERROR_STOP=1 -Atc "
select count(*)
from pg_indexes
where schemaname='public'
  and tablename='access'
  and (
    indexname='access_user_id_product_key_unique'
    or (
      indexdef like '%UNIQUE INDEX%'
      and indexdef like '%(user_id, product_key)%'
    )
  );
")

if [[ "$access_unique" -lt "1" ]]; then
	printf "Missing access unique index for (user_id, product_key).\n" >&2
	exit 1
fi

printf "==> Verifying verification columns\n"
psql "$PSQL_DATABASE_URL" -v ON_ERROR_STOP=1 -c "
select column_name, data_type
from information_schema.columns
where table_schema='public' and table_name='verification'
order by ordinal_position;
"

printf "==> Verifying activity indexes\n"
status_index_count=$(psql "$PSQL_DATABASE_URL" -v ON_ERROR_STOP=1 -Atc "
select count(*)
from pg_indexes
where schemaname='public'
  and tablename='activity'
  and (
    indexname in ('activity_user_type_status_created_idx', 'activity_user_type_status_created_at_idx')
    or indexdef like '%(user_id, type, status, created_at)%'
  );
")

requested_unique_count=$(psql "$PSQL_DATABASE_URL" -v ON_ERROR_STOP=1 -Atc "
select count(*)
from pg_indexes
where schemaname='public'
  and tablename='activity'
  and (
    indexname in ('activity_request_resume_requested_idx', 'activity_user_type_requested_unique')
    or (
      indexdef like '%UNIQUE INDEX%'
      and indexdef like '%(user_id, type)%'
      and indexdef like '%WHERE (status = ''requested''%'
    )
  );
")

if [[ "$status_index_count" -lt "1" ]]; then
	printf "Missing activity status/timeline index (user_id, type, status, created_at).\n" >&2
	exit 1
fi

if [[ "$requested_unique_count" -lt "1" ]]; then
	printf "Missing activity requested unique index (user_id, type) where status='requested'.\n" >&2
	exit 1
fi

printf "==> Verifying auth foreign keys\n"
fk_count=$(psql "$PSQL_DATABASE_URL" -v ON_ERROR_STOP=1 -Atc "
select count(*)
from information_schema.table_constraints
where table_schema='public'
  and table_name in ('account', 'session', 'activity', 'user_two_factor')
  and constraint_type='FOREIGN KEY';
")

if [[ "$fk_count" -lt "4" ]]; then
	printf "Expected auth foreign keys are missing (found %s, expected at least 4).\n" "$fk_count" >&2
	exit 1
fi

printf "==> Production schema verification passed\n"
