#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${DATABASE_URL:-}" ]]; then
	printf "DATABASE_URL is required. Export it before running this script.\n" >&2
	exit 1
fi

append_query_param() {
	local url="$1"
	local param="$2"
	if [[ "$url" == *"?"* ]]; then
		printf "%s&%s" "$url" "$param"
	else
		printf "%s?%s" "$url" "$param"
	fi
}

MIGRATE_DATABASE_URL="$DATABASE_URL"

if [[ "$MIGRATE_DATABASE_URL" == *"sslmode=require"* && "$MIGRATE_DATABASE_URL" != *"uselibpqcompat=true"* ]]; then
	MIGRATE_DATABASE_URL="$(append_query_param "$MIGRATE_DATABASE_URL" "uselibpqcompat=true")"
	printf "==> Added uselibpqcompat=true for node/pg migration compatibility\n"
fi

if [[ "${DB_SKIP_PRECHECK:-false}" != "true" ]]; then
	bash "$(dirname "$0")/prod-check.sh"
fi

printf "==> Running drizzle migrations against DATABASE_URL\n"
DATABASE_URL="$MIGRATE_DATABASE_URL" npx drizzle-kit migrate

printf "==> Migration execution finished\n"
