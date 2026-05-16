#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
SEEDS_DIR="${PROJECT_ROOT}/drizzle-seeds"

if [[ ! -d "$SEEDS_DIR" ]]; then
  printf "Seeds directory not found: %s\n" "$SEEDS_DIR" >&2
  exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
  printf "psql is required but not found in PATH.\n" >&2
  exit 1
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
  printf "DATABASE_URL is required to run seeds.\n" >&2
  exit 1
fi

if [[ "${DATABASE_URL}" == *"@db:"* || "${DATABASE_URL}" == *"@db/"* ]]; then
  HOST_DB_PORT="${DB_EXPOSE_PORT:-6432}"
  DATABASE_URL="$(printf "%s" "$DATABASE_URL" | sed -E "s/@db:([0-9]+)/@localhost:${HOST_DB_PORT}/; s/@db\//@localhost:${HOST_DB_PORT}\//")"
  export DATABASE_URL
  printf "Using host DATABASE_URL override for local compose: %s\n" "$DATABASE_URL"
fi

MISSING_TABLES=$(psql "$DATABASE_URL" -t -A -v ON_ERROR_STOP=1 -c "
SELECT string_agg(t, ', ')
FROM (
  VALUES
    ('content_project'),
    ('content_article'),
    ('content_word_cloud_concept')
) AS required(t)
WHERE to_regclass(t) IS NULL;
")

if [[ -n "${MISSING_TABLES// }" ]]; then
  printf "Missing required tables: %s\n" "$MISSING_TABLES" >&2
  printf "Run migrations first (e.g. npm run db:migrate), then retry seed.\n" >&2
  exit 1
fi

for seed_file in "$SEEDS_DIR"/*.sql; do
  printf "==> Applying seed: %s\n" "$(basename "$seed_file")"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$seed_file"
done

printf "==> Content admin SQL seeds applied successfully\n"
