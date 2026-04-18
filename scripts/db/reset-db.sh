#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${ENV_FILE:-.env}"
START_WEB=false

for arg in "$@"; do
  case "$arg" in
    --web|--with-web)
      START_WEB=true
      ;;
    -h|--help)
      printf "Usage: %s [--web|--with-web]\n" "${0##*/}"
      printf "  --web, --with-web  Start the web service after migrations\n"
      printf "  ENV_FILE=path      Override env file (default: .env)\n"
      exit 0
      ;;
  esac
done

if [[ ! -f "$ENV_FILE" ]]; then
  printf "Missing %s. Create it from .env.template before running this script.\n" "$ENV_FILE" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

if [[ -z "${DATABASE_URL:-}" ]]; then
  if [[ -n "${DB_USER:-}" && -n "${DB_PASSWORD:-}" && -n "${DB_HOST:-}" && -n "${DB_PORT:-}" && -n "${DB_NAME:-}" ]]; then
    export DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
  else
    printf "DATABASE_URL is not set and DB_* variables are incomplete in %s.\n" "$ENV_FILE" >&2
    exit 1
  fi
fi

if ! command -v docker >/dev/null 2>&1; then
  printf "docker is required but not found in PATH.\n" >&2
  exit 1
fi

if docker compose version >/dev/null 2>&1; then
  DC=(docker compose)
elif docker-compose version >/dev/null 2>&1; then
  DC=(docker-compose)
else
  printf "docker compose is required but not available.\n" >&2
  exit 1
fi

export COMPOSE_PROFILES="${COMPOSE_PROFILES:-app}"
COMPOSE_ENV=(--env-file "$ENV_FILE")

printf "==> Stopping containers and removing volumes\n"
"${DC[@]}" "${COMPOSE_ENV[@]}" down -v --remove-orphans

project_name="${COMPOSE_PROJECT_NAME:-$(basename "$(pwd)")}" 
pgdata_candidates=("${project_name}_pgdata" "pgdata")

mapfile -t existing_volumes < <(docker volume ls --format "{{.Name}}")
for candidate in "${pgdata_candidates[@]}"; do
  for volume in "${existing_volumes[@]}"; do
    if [[ "$volume" == "$candidate" ]]; then
      printf "==> Removing volume %s\n" "$volume"
      docker volume rm "$volume"
    fi
  done
done

printf "==> Generating database artifacts\n"
npm run db:generate

printf "==> Starting database container\n"
"${DC[@]}" "${COMPOSE_ENV[@]}" up -d db

shopt -s nullglob
migrations=(drizzle/*.sql)
shopt -u nullglob
if (( ${#migrations[@]} > 0 )); then
  printf "==> Running migrations\n"
  npm run db:migrate
else
  printf "==> No migrations found; skipping migrate\n"
fi

if [[ "$START_WEB" == "true" ]]; then
  printf "==> Starting web container\n"
  "${DC[@]}" "${COMPOSE_ENV[@]}" up -d web
fi

printf "==> Reset complete\n"
