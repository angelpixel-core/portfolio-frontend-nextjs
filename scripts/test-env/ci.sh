#!/usr/bin/env bash

set -o pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

export TEST_ENV_MODE="ci"
export TEST_ENV_PSQL_MODE="direct"

bash "${SCRIPT_DIR}/runner.sh"
