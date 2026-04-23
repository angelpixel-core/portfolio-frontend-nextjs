#!/usr/bin/env bash
set -euo pipefail

ORDER_ID="${1:-}"

if [[ -z "$ORDER_ID" ]]; then
	printf "Usage: %s <order-id>\n" "${0##*/}" >&2
	exit 1
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
	printf "DATABASE_URL is required in environment.\n" >&2
	exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
	printf "psql is required but not found in PATH.\n" >&2
	exit 1
fi

printf "This will DELETE order id: %s\n" "$ORDER_ID"
printf "Type DELETE_ORDER to continue: "
read -r CONFIRM

if [[ "$CONFIRM" != "DELETE_ORDER" ]]; then
	printf "Aborted.\n"
	exit 1
fi

psql "$DATABASE_URL" \
	-v ON_ERROR_STOP=1 \
	-v order_id="$ORDER_ID" \
	-c "DELETE FROM orders WHERE id = :'order_id';"

printf "Order deletion completed for id: %s\n" "$ORDER_ID"
