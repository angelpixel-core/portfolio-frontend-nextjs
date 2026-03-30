#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ENV_FILE="${ENV_FILE:-${ROOT_DIR}/.env}"
COMPOSE_BIN="${COMPOSE_BIN:-docker compose}"
read -r -a COMPOSE_CMD <<<"${COMPOSE_BIN}"
COMPOSE=("${COMPOSE_CMD[@]}")

if [[ -f "${ENV_FILE}" ]]; then
	set -a
	. "${ENV_FILE}"
	set +a
fi

POSTGRES_USER="${POSTGRES_USER:-postgres}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-postgres}"
DB_NAME="${DB_NAME:-${POSTGRES_DB:-test_db}}"
DB_USER="${DB_USER:-${POSTGRES_USER}}"
DB_PASSWORD="${DB_PASSWORD:-${POSTGRES_PASSWORD}}"
DB_HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-5432}"

COMPOSE_FLAGS=(--project-directory "${ROOT_DIR}" --env-file "${ENV_FILE}")

echo "Resetting database '${DB_NAME}' and role '${DB_USER}'..."

"${COMPOSE[@]}" "${COMPOSE_FLAGS[@]}" exec -T db \
	psql -v ON_ERROR_STOP=1 \
	-v db_name="${DB_NAME}" \
	-v db_user="${DB_USER}" \
	-v db_password="${DB_PASSWORD}" \
	-U "${POSTGRES_USER}" \
	-d postgres \
	<<'SQL'
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = :'db_name'
  AND pid <> pg_backend_pid();

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = :'db_user') THEN
    EXECUTE format('CREATE ROLE %I LOGIN PASSWORD %L', :'db_user', :'db_password');
  ELSE
    EXECUTE format('ALTER ROLE %I WITH LOGIN PASSWORD %L', :'db_user', :'db_password');
  END IF;
END
$$;

DO $$
BEGIN
  EXECUTE format('DROP DATABASE IF EXISTS %I', :'db_name');
  EXECUTE format('CREATE DATABASE %I OWNER %I', :'db_name', :'db_user');
  EXECUTE format('GRANT ALL PRIVILEGES ON DATABASE %I TO %I', :'db_name', :'db_user');
END
$$;
SQL

"${COMPOSE[@]}" "${COMPOSE_FLAGS[@]}" exec -T db \
	psql -v ON_ERROR_STOP=1 \
	-v db_user="${DB_USER}" \
	-U "${POSTGRES_USER}" \
	-d "${DB_NAME}" \
	<<'SQL'
DO $$
BEGIN
  EXECUTE format('GRANT USAGE, CREATE ON SCHEMA public TO %I', :'db_user');
  EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO %I', :'db_user');
  EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO %I', :'db_user');
  EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO %I', :'db_user');
END
$$;
SQL

"${COMPOSE[@]}" "${COMPOSE_FLAGS[@]}" exec -T web npm run db:migrate

echo "Database reset complete."
