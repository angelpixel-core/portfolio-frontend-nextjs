#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
ENV_FILE="${ENV_FILE:-${PROJECT_ROOT}/.env}"

show_help() {
	printf "Apply one SQL migration file on local Docker DB.\n\n"
	printf "Usage:\n"
	printf "  %s <migration-file-path>\n\n" "${0##*/}"
	printf "Examples:\n"
	printf "  npm run db:migrate:docker:file -- drizzle/0009_create_orders.sql\n"
	printf "  ENV_FILE=.env.local npm run db:migrate:docker:file -- docs/sql/fix.sql\n"
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
	show_help
	exit 0
fi

MIGRATION_FILE="${1:-}"

if [[ -z "$MIGRATION_FILE" && -t 0 ]]; then
	printf "Missing required migration file path.\n" >&2
	read -r -p "Enter migration file path (e.g. drizzle/0009_create_orders.sql): " MIGRATION_FILE
fi

if [[ -z "$MIGRATION_FILE" ]]; then
	printf "Missing required argument: migration file path.\n" >&2
	printf "Run: npm run db:migrate:docker:file -- <path/to/migration.sql>\n" >&2
	exit 1
fi

if [[ "$MIGRATION_FILE" = /* ]]; then
	MIGRATION_ABS="$MIGRATION_FILE"
else
	MIGRATION_ABS="${PROJECT_ROOT}/${MIGRATION_FILE}"
fi

if [[ ! -f "$MIGRATION_ABS" ]]; then
	printf "Migration file not found: %s\n" "$MIGRATION_ABS" >&2
	exit 1
fi

if [[ ! -r "$MIGRATION_ABS" ]]; then
	printf "Migration file is not readable: %s\n" "$MIGRATION_ABS" >&2
	exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
	printf "Missing env file: %s\n" "$ENV_FILE" >&2
	printf "Set ENV_FILE=/path/to/.env or create %s\n" "$ENV_FILE" >&2
	exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

if ! command -v docker >/dev/null 2>&1; then
	printf "docker is required but not found in PATH.\n" >&2
	exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
	printf "docker compose is required but not available.\n" >&2
	exit 1
fi

printf "==> Applying migration file: %s\n" "$MIGRATION_ABS"
printf "==> Target DB: %s (user: %s)\n" "${DB_NAME:-portfolio_frontend_development}" "${DB_USER:-developer}"

docker compose --profile app exec -T db \
	env PGPASSWORD="${DB_PASSWORD:-abc123}" \
	psql \
	-U "${DB_USER:-developer}" \
	-d "${DB_NAME:-portfolio_frontend_development}" \
	-v ON_ERROR_STOP=1 \
	-f - <"$MIGRATION_ABS"

printf "==> Migration applied successfully\n"
