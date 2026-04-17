#!/usr/bin/env bash
# Manual DB reset helper (Docker).
# - Loads .env from project root if present.
# - Generates Drizzle migrations before applying them.
# - Override DB_* vars via env if needed (see defaults below).
# Usage: bash scripts/test-env/manual-migrate.sh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

load_env_file() {
  local env_file="$1"
  local line key value

  while IFS= read -r line || [ -n "$line" ]; do
    line="${line%$'\r'}"

    case "$line" in
    '' | [[:space:]]*'#')
      continue
      ;;
    esac

    if [[ "$line" =~ ^[[:space:]]*export[[:space:]]+ ]]; then
      line="${line#export}"
      line="${line#${line%%[![:space:]]*}}"
    fi

    if [[ "$line" != *"="* ]]; then
      continue
    fi

    key="${line%%=*}"
    value="${line#*=}"

    key="${key#${key%%[![:space:]]*}}"
    key="${key%${key##*[![:space:]]}}"

    if [[ ! "$key" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]]; then
      continue
    fi

    value="${value#${value%%[![:space:]]*}}"
    value="${value%${value##*[![:space:]]}}"

    if [[ "$value" =~ ^".*"$ ]]; then
      value="${value:1:${#value}-2}"
    elif [[ "$value" =~ ^'.*'$ ]]; then
      value="${value:1:${#value}-2}"
    elif [[ "$value" =~ [[:space:]] || "$value" == *'#'* ]]; then
      continue
    fi

    export "$key=$value"
  done <"$env_file"
}

if [ -f "${ROOT_DIR}/.env" ]; then
  load_env_file "${ROOT_DIR}/.env"
fi

DB_NAME="${DB_NAME:-portfolio_frontend_development}"
DB_USER="${DB_USER:-developer}"
DB_PASSWORD="${DB_PASSWORD:-abc123}"
DB_PORT="${DB_PORT:-6432}"
DB_HOST="db"

DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

(
  cd "${ROOT_DIR}"
  docker compose exec -T -e DATABASE_URL="${DATABASE_URL}" web npm run db:generate
  docker compose exec -T -e DATABASE_URL="${DATABASE_URL}" web npm run db:migrate
  docker compose exec -T db psql -U postgres -d "${DB_NAME}" -c "\\dt"
)
