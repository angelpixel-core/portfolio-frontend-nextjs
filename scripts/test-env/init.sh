#!/usr/bin/env bash

set -o pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

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

export TEST_ENV_MODE="local"
export TEST_ENV_PSQL_MODE="compose"

bash "${SCRIPT_DIR}/runner.sh"
