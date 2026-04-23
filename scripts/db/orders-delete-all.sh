#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${DATABASE_URL:-}" ]]; then
	printf "DATABASE_URL is required in environment.\n" >&2
	exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
	printf "psql is required but not found in PATH.\n" >&2
	exit 1
fi

if [[ "${ALLOW_ORDER_DELETE_ALL:-false}" != "true" ]]; then
	printf "Refusing to continue. Set ALLOW_ORDER_DELETE_ALL=true explicitly.\n" >&2
	exit 1
fi

printf "This will DELETE ALL rows from orders (cascade applies).\n"
printf "Type DELETE_ALL_ORDERS to continue: "
read -r CONFIRM

if [[ "$CONFIRM" != "DELETE_ALL_ORDERS" ]]; then
	printf "Aborted.\n"
	exit 1
fi

psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c "BEGIN; DELETE FROM orders; COMMIT;"

printf "All orders deleted successfully.\n"
