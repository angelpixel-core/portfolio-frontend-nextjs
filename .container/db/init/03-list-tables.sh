#!/usr/bin/env bash
set -euo pipefail

DB_USER="${POSTGRES_USER:-postgres}"
DB_PASSWORD="${POSTGRES_PASSWORD:-postgres}"
DB_NAME="${DB_NAME:-${POSTGRES_DB:-postgres}}"
DB_PORT="${DB_PORT:-5432}"

export PGPASSWORD="$DB_PASSWORD"
export PAGER=cat

psql \
	-X \
	-P pager=off \
	-p "$DB_PORT" \
	-U "$DB_USER" \
	-d "$DB_NAME" \
	-v ON_ERROR_STOP=1 \
	-c "\\dt"
