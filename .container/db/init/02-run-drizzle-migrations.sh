#!/bin/bash
# ==============================================================================
# Run Drizzle SQL migrations
# ==============================================================================
# Runs once on first Postgres initialization (empty pgdata volume)
# Expects pre-generated SQL files in /migrations (mounted read-only)
# ==============================================================================

set -e

MIGRATIONS_DIR="/migrations"

shopt -s nullglob
sql_files=("$MIGRATIONS_DIR"/*.sql)
shopt -u nullglob

if [ ${#sql_files[@]} -eq 0 ]; then
	echo "✗ No SQL migration files found in $MIGRATIONS_DIR."
	echo "  Generate migrations first (e.g. drizzle-kit generate) before starting the DB container."
	exit 1
fi

for sql_file in "${sql_files[@]}"; do
	echo "→ Applying migration: $(basename "$sql_file")"
	PGPASSWORD="$DB_PASSWORD" psql -v ON_ERROR_STOP=1 --username "$DB_USER" --dbname "$DB_NAME" --file "$sql_file"
done

echo "✓ Applied ${#sql_files[@]} migration(s) from $MIGRATIONS_DIR"
