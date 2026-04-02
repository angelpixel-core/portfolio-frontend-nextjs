#!/usr/bin/env bash
set -euo pipefail

DB_USER="${POSTGRES_USER:-postgres}"
DB_PASSWORD="${POSTGRES_PASSWORD:-postgres}"
DB_NAME="${POSTGRES_DB:-${DB_NAME:-postgres}}"
DB_PORT="${DB_PORT:-5432}"
MIGRATIONS_DIR="/migrations"

if [[ ! -d "$MIGRATIONS_DIR" ]]; then
	echo "Migrations directory not found: $MIGRATIONS_DIR" >&2
	exit 1
fi

shopt -s nullglob
migration_files=("$MIGRATIONS_DIR"/*.sql)
shopt -u nullglob

if ((${#migration_files[@]} == 0)); then
	echo "No migration files found in $MIGRATIONS_DIR" >&2
	exit 1
fi

export PGPASSWORD="$DB_PASSWORD"

for migration in "${migration_files[@]}"; do
	echo "Applying migration: $migration"
	psql \
		-p "$DB_PORT" \
		-U "$DB_USER" \
		-d "$DB_NAME" \
		-v ON_ERROR_STOP=1 \
		-f "$migration"
done

echo "All migrations applied successfully."
