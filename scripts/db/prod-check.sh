#!/usr/bin/env bash
set -euo pipefail

STRICT_TABLES="${DB_CHECK_TABLES_STRICT:-false}"
ENFORCE_TLS="${DB_ENFORCE_TLS_URL:-true}"

strip_uselibpqcompat() {
	local url="$1"
	url=$(printf '%s' "$url" | sed -E "s/([?&])uselibpqcompat=true(&|$)/\\1/g")
	url=$(printf '%s' "$url" | sed -E "s/([?&])supa=[^&]*(&|$)/\\1/g")
	url=$(printf '%s' "$url" | sed -E "s/\?&/\?/g; s/[?&]$//g")
	printf "%s" "$url"
}

if [[ -z "${DATABASE_URL:-}" ]]; then
	printf "DATABASE_URL is required. Export it before running this script.\n" >&2
	exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
	printf "psql is required but was not found in PATH.\n" >&2
	exit 1
fi

if [[ "$ENFORCE_TLS" == "true" ]]; then
	if [[ "$DATABASE_URL" == *"sslmode=verify-full"* ]]; then
		:
	elif [[ "$DATABASE_URL" == *"sslmode=require"* ]]; then
		:
	else
		printf "DATABASE_URL TLS params look unsafe/incompatible for production runtime.\n" >&2
		printf "Use one of:\n" >&2
		printf "  - ...?sslmode=verify-full\n" >&2
		printf "  - ...?sslmode=require&uselibpqcompat=true\n" >&2
		exit 1
	fi
fi

PSQL_DATABASE_URL="$(strip_uselibpqcompat "$DATABASE_URL")"

if [[ "$DATABASE_URL" == *"uselibpqcompat=true"* ]]; then
	printf "==> Using DATABASE_URL without uselibpqcompat for psql compatibility\n"
fi

printf "==> Connectivity check\n"
psql "$PSQL_DATABASE_URL" -v ON_ERROR_STOP=1 -c "select current_database(), current_user;"

printf "==> Current public tables\n"
psql "$PSQL_DATABASE_URL" -v ON_ERROR_STOP=1 -c "select table_name from information_schema.tables where table_schema='public' order by table_name;"

EXPECTED_TABLES="user account session verification user_two_factor activity"
missing=()
for table_name in $EXPECTED_TABLES; do
	exists=$(psql "$PSQL_DATABASE_URL" -v ON_ERROR_STOP=1 -Atc "select 1 from information_schema.tables where table_schema='public' and table_name='${table_name}' limit 1;")
	if [[ "$exists" != "1" ]]; then
		missing+=("$table_name")
	fi
done

if ((${#missing[@]} > 0)); then
	printf "==> Missing required tables: %s\n" "${missing[*]}" >&2
	if [[ "$STRICT_TABLES" == "true" ]]; then
		exit 1
	fi
	printf "==> Next step: run migrations (npm run db:prod:migrate) and verify (npm run db:prod:verify).\n"
else
	printf "==> Required auth tables are present\n"
fi

printf "==> prod-check complete\n"
