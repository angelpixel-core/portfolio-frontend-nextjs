#!/bin/bash
# ==============================================================================
# List tables in application database
# ==============================================================================
# Runs once on first Postgres initialization (empty pgdata volume)
# ==============================================================================

set -e

PGPASSWORD="$DB_PASSWORD" psql -v ON_ERROR_STOP=1 --username "$DB_USER" --dbname "$DB_NAME" -c "\dt"

echo "✓ Listed tables for database '$DB_NAME'"
