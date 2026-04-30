#!/usr/bin/env bash
set -euo pipefail

SUBSCRIPTION_ID="${1:-}"

if [[ -z "$SUBSCRIPTION_ID" ]]; then
  printf "Usage: %s <subscription-id>\n" "${0##*/}" >&2
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

printf "This will DELETE subscription id: %s\n" "$SUBSCRIPTION_ID"
printf "Type DELETE_SUBSCRIPTION to continue: "
read -r CONFIRM

if [[ "$CONFIRM" != "DELETE_SUBSCRIPTION" ]]; then
  printf "Aborted.\n"
  exit 1
fi

psql "$DATABASE_URL" \
  -v ON_ERROR_STOP=1 \
  -v subscription_id="$SUBSCRIPTION_ID" \
  -c "DELETE FROM subscriptions WHERE id = :'subscription_id';"

printf "Subscription deletion completed for id: %s\n" "$SUBSCRIPTION_ID"
