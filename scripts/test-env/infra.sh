#!/usr/bin/env bash

set -o pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

sanitize_port() {
	local raw="$1"
	local cleaned="${raw//\"/}"
	cleaned="${cleaned//\'/}"
	cleaned="${cleaned//[[:space:]]/}"

	if [ -z "$cleaned" ]; then
		printf '%s' ""
		return
	fi

	if [[ "$cleaned" =~ ^[0-9]+$ ]]; then
		printf '%s' "$cleaned"
		return
	fi

	printf '%s' ""
}

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

if [ -f "${PROJECT_ROOT}/.env" ]; then
	load_env_file "${PROJECT_ROOT}/.env"
fi

DEFAULT_WEB_PORT=9000
sanitized_web_port="$(sanitize_port "${WEB_PORT:-}")"
if [ -z "$sanitized_web_port" ]; then
	if [ -n "${WEB_PORT:-}" ]; then
		printf '%s\n' "[test-env] mode=local category=env status=warn details=\"Invalid WEB_PORT value; defaulting to ${DEFAULT_WEB_PORT}\"" >&2
	fi
	sanitized_web_port="$DEFAULT_WEB_PORT"
fi
export WEB_PORT="$sanitized_web_port"

if ! command -v docker >/dev/null 2>&1; then
	printf '%s\n' "[test-env] mode=local category=env status=fail details=\"docker command not found\"" >&2
	exit 1
fi

docker compose --profile app up -d db db_admin web

if ! docker compose --profile app exec -T db pg_isready -U "${POSTGRES_USER:-postgres}" >/dev/null 2>&1; then
	attempts=0
	until docker compose --profile app exec -T db pg_isready -U "${POSTGRES_USER:-postgres}" >/dev/null 2>&1; do
		attempts=$((attempts + 1))
		if [ "$attempts" -ge 20 ]; then
			printf '%s\n' "[test-env] mode=local category=connectivity status=fail details=\"Database did not become ready\"" >&2
			exit 1
		fi
		sleep 1
	done
fi
