#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

DB_NAME="${DB_NAME:-portfolio_frontend_development}"
DB_USER="${DB_USER:-developer}"
DB_PASSWORD="${DB_PASSWORD:-abc123}"
DB_PORT="${DB_PORT:-5432}"
DB_HOST="db"

DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

(
  cd "${ROOT_DIR}"
  docker compose exec -T -e DATABASE_URL="${DATABASE_URL}" web npm run db:migrate
  docker compose exec -T db psql -U postgres -d "${DB_NAME}" -c "\\dt"
)
