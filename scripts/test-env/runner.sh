#!/usr/bin/env bash

set -o pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

MODE="${TEST_ENV_MODE:-local}"
OUTPUT_MODE="${TEST_ENV_OUTPUT:-text}"
LOG_LEVEL="${TEST_ENV_LOG_LEVEL:-info}"
SCHEMA="${TEST_ENV_SCHEMA:-public}"
PSQL_MODE="${TEST_ENV_PSQL_MODE:-direct}"
AUTO_MIGRATE="${TEST_ENV_AUTO_MIGRATE:-false}"
DEBUG_MODE="${TEST_ENV_DEBUG:-false}"

REQUIRED_ENV=(
	DATABASE_URL
	DB_HOST
	DB_PORT
	DB_NAME
	DB_USER
	DB_PASSWORD
	POSTGRES_USER
	POSTGRES_PASSWORD
)

log_level_value() {
	case "$1" in
	info) echo 0 ;;
	warn) echo 1 ;;
	error) echo 2 ;;
	*) echo 0 ;;
	esac
}

should_log() {
	local level_value
	local min_value
	level_value="$(log_level_value "$1")"
	min_value="$(log_level_value "$LOG_LEVEL")"
	[ "$level_value" -ge "$min_value" ]
}

write_line() {
	local level="$1"
	local line="$2"

	if ! should_log "$level"; then
		return 0
	fi

	if [ "$level" = "error" ]; then
		printf '%s\n' "$line" >&2
	else
		printf '%s\n' "$line"
	fi
}

emit_result() {
	local category="$1"
	local status="$2"
	local details="$3"
	local level
	local line

	if [ "$OUTPUT_MODE" != "text" ]; then
		return 0
	fi

	case "$status" in
	fail) level="error" ;;
	skip) level="warn" ;;
	*) level="info" ;;
	esac

	line="[test-env] mode=${MODE} category=${category} status=${status}"
	if [ -n "$details" ]; then
		line="${line} details=\"${details}\""
	fi

	write_line "$level" "$line"
}

json_escape() {
	local raw="$1"
	raw="${raw//\\/\\\\}"
	raw="${raw//\"/\\\"}"
	raw="${raw//$'\n'/\\n}"
	printf '%s' "$raw"
}

json_array() {
	local -a items=("$@")
	local output=""
	local item
	local escaped

	for item in "${items[@]}"; do
		escaped="$(json_escape "$item")"
		if [ -n "$output" ]; then
			output="${output},"
		fi
		output="${output}\"${escaped}\""
	done

	printf '[%s]' "$output"
}

sql_list() {
	local output=""
	local item

	for item in "$@"; do
		if [ -n "$output" ]; then
			output="${output},"
		fi
		output="${output}'${item}'"
	done

	printf '%s' "$output"
}

psql_connection() {
	if [ -n "${DATABASE_URL:-}" ]; then
		printf '%s' "$DATABASE_URL"
		return 0
	fi

	build_database_url "${DB_HOST:-}"
}

build_database_url() {
	local host="$1"
	printf 'postgresql://%s:%s@%s:%s/%s' "${DB_USER:-}" "${DB_PASSWORD:-}" "$host" "${DB_PORT:-}" "${DB_NAME:-}"
}

build_admin_database_url() {
	local host="$1"
	printf 'postgresql://%s:%s@%s:%s/%s' "${POSTGRES_USER:-}" "${POSTGRES_PASSWORD:-}" "$host" "${DB_PORT:-}" "${DB_NAME:-}"
}

migration_database_url() {
	if [ "$PSQL_MODE" = "compose" ]; then
		printf 'postgresql://%s:%s@%s:%s/%s' \
			"${DB_USER:-}" "${DB_PASSWORD:-}" "${DB_HOST:-db}" "${DB_INTERNAL_PORT:-5432}" "${DB_NAME:-}"
		return 0
	fi

	if [ -n "${DATABASE_URL:-}" ]; then
		printf '%s' "$DATABASE_URL"
		return 0
	fi

	build_database_url "${DB_HOST:-}"
}

run_psql() {
	local sql="$1"

	if [ "$PSQL_MODE" = "compose" ]; then
		docker compose --profile app exec -T db env PGPASSWORD="$DB_PASSWORD" \
			psql -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 -tA -c "$sql"
	else
		if ! command -v psql >/dev/null 2>&1; then
			return 127
		fi
		PGPASSWORD="$DB_PASSWORD" psql "$(psql_connection)" -v ON_ERROR_STOP=1 -tA -c "$sql"
	fi
}

run_psql_tables() {
	local sql="$1"

	if [ "$PSQL_MODE" = "compose" ]; then
		if [ -n "${POSTGRES_USER:-}" ] && [ -n "${POSTGRES_PASSWORD:-}" ]; then
			docker compose --profile app exec -T db env PGPASSWORD="$POSTGRES_PASSWORD" \
				psql -U "$POSTGRES_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 -tA -c "$sql"
			return $?
		fi
		run_psql "$sql"
		return $?
	fi

	if [ -n "${POSTGRES_USER:-}" ] && [ -n "${POSTGRES_PASSWORD:-}" ]; then
		if ! command -v psql >/dev/null 2>&1; then
			return 127
		fi
		PGPASSWORD="$POSTGRES_PASSWORD" psql "$(build_admin_database_url "${DB_HOST:-}")" -v ON_ERROR_STOP=1 -tA -c "$sql"
		return $?
	fi

	run_psql "$sql"
}

should_auto_migrate() {
	case "${AUTO_MIGRATE}" in
	true | 1 | yes | on) return 0 ;;
	*) return 1 ;;
	esac
}

should_debug() {
	case "${DEBUG_MODE}" in
	true | 1 | yes | on) return 0 ;;
	*) return 1 ;;
	esac
}

has_npm_migrate_script() {
	if ! command -v node >/dev/null 2>&1; then
		return 1
	fi
	if [ ! -f "${PROJECT_ROOT}/package.json" ]; then
		return 1
	fi
	node -e "const pkg=require('${PROJECT_ROOT}/package.json');process.exit(pkg.scripts&&pkg.scripts['db:migrate']?0:1)"
}

run_migrations() {
	local result=0
	local migration_url
	local stdout_file
	local stderr_file
	local stdout_content
	local stderr_content
	local compose_service
	local command_desc
	migration_url="$(migration_database_url)"
	stdout_file="$(mktemp)"
	stderr_file="$(mktemp)"
	if command -v npm >/dev/null 2>&1 && has_npm_migrate_script; then
		if [ "$PSQL_MODE" = "compose" ]; then
			compose_service="$(compose_service_for_migrations)"
			if [ -z "$compose_service" ]; then
				printf '%s' "Missing compose service for migrations. Expected 'web' or 'app' in docker compose --profile app config --services."
				result=127
			else
				if ! wait_for_compose_service "$compose_service"; then
					printf '%s' "Compose service '$compose_service' did not become ready for migrations."
					result=127
				else
					command_desc="docker compose --profile app exec -T ${compose_service} env DATABASE_URL=[redacted] CI=true npm_config_yes=true NPM_CONFIG_YES=true npm run db:migrate"
					docker compose --profile app exec -T "$compose_service" \
						env DATABASE_URL="$migration_url" CI=true npm_config_yes=true NPM_CONFIG_YES=true \
						npm run db:migrate >"$stdout_file" 2>"$stderr_file"
					result=$?
				fi
			fi
		else
			command_desc="npm --prefix ${PROJECT_ROOT} run db:migrate (DATABASE_URL=[redacted])"
			DATABASE_URL="$migration_url" CI=true npm_config_yes=true NPM_CONFIG_YES=true \
				npm --prefix "$PROJECT_ROOT" run db:migrate >"$stdout_file" 2>"$stderr_file"
			result=$?
		fi
	elif command -v npx >/dev/null 2>&1; then
		command_desc="npx --yes --prefix ${PROJECT_ROOT} drizzle-kit migrate --config ${PROJECT_ROOT}/drizzle.config.ts (DATABASE_URL=[redacted])"
		DATABASE_URL="$migration_url" CI=true npm_config_yes=true NPM_CONFIG_YES=true \
			npx --yes --prefix "$PROJECT_ROOT" drizzle-kit migrate --config "$PROJECT_ROOT/drizzle.config.ts" >"$stdout_file" 2>"$stderr_file"
		result=$?
	else
		result=127
	fi
	stdout_content="$(<"$stdout_file")"
	stderr_content="$(<"$stderr_file")"
	rm -f "$stdout_file" "$stderr_file"
	if [ $result -ne 0 ]; then
		if [ "$OUTPUT_MODE" = "text" ]; then
			write_line "error" "[test-env] action=auto-migrate status=failed service=${compose_service:-none} exit=${result} command=\"${command_desc:-unknown}\""
		fi
		if [ -n "$stderr_content" ]; then
			printf 'stderr: %s' "$stderr_content"
		fi
		if [ -n "$stdout_content" ]; then
			if [ -n "$stderr_content" ]; then
				printf '\n'
			fi
			printf 'stdout: %s' "$stdout_content"
		fi
		if should_debug && [ "$PSQL_MODE" = "compose" ] && command -v docker >/dev/null 2>&1; then
			write_line "warn" "[test-env] action=auto-migrate debug=compose-logs hint=Tail docker compose logs for web/db"
			docker compose --profile app logs --tail=60 web db 2>&1 | while IFS= read -r log_line; do
				write_line "warn" "[test-env] compose-log=${log_line}"
			done
		fi
	else
		if [ -n "$stdout_content" ]; then
			printf '%s' "$stdout_content"
		fi
	fi
	return $result
}

compose_service_for_migrations() {
	local service
	local services
	local compose_output

	if ! command -v docker >/dev/null 2>&1; then
		return 0
	fi

	compose_output="$(docker compose --profile app config --services 2>/dev/null)"
	if [ -z "$compose_output" ]; then
		return 0
	fi

	services=()
	while IFS= read -r service; do
		if [ -n "$service" ]; then
			services+=("$service")
		fi
	done <<<"$compose_output"

	for service in "${services[@]}"; do
		if [ "$service" = "web" ]; then
			printf '%s' "$service"
			return 0
		fi
	done

	for service in "${services[@]}"; do
		if [ "$service" = "app" ]; then
			printf '%s' "$service"
			return 0
		fi
	done

	return 0
}

wait_for_compose_service() {
	local service="$1"
	local attempts=0
	local max_attempts=30

	if [ -z "$service" ]; then
		return 1
	fi

	until docker compose --profile app exec -T "$service" node -v >/dev/null 2>&1; do
		attempts=$((attempts + 1))
		if [ "$attempts" -ge "$max_attempts" ]; then
			return 1
		fi
		sleep 1
	done

	return 0
}

missing_env=()
for name in "${REQUIRED_ENV[@]}"; do
	value="${!name:-}"
	if [ -z "$value" ]; then
		missing_env+=("$name")
	fi
done

env_status="pass"
env_details="All required env vars present"
if [ "${#missing_env[@]}" -gt 0 ]; then
	env_status="fail"
	env_details="Missing required env vars: $(printf '%s' "${missing_env[*]}")"
fi

emit_result "env" "$env_status" "$env_details"

connectivity_status="skip"
connectivity_details="Skipped due to env failures"
roles_status="skip"
roles_details="Skipped due to env failures"
privileges_status="skip"
privileges_details="Skipped due to env failures"
tables_status="skip"
tables_details="Skipped due to env failures"

roles_missing=()
privileges_missing=()
tables_missing=()

if [ "$env_status" = "pass" ]; then
	connectivity_details="Connected to database"
	connectivity_status="pass"

	connectivity_error=""
	connectivity_output="$(run_psql "SELECT 1" 2>&1)"
	connectivity_exit=$?

	if [ $connectivity_exit -ne 0 ]; then
		connectivity_status="fail"
		if [ $connectivity_exit -eq 127 ]; then
			connectivity_error="psql command not found"
		else
			connectivity_error="$connectivity_output"
		fi
		connectivity_details="Database connectivity failed: ${connectivity_error}"
	fi

	emit_result "connectivity" "$connectivity_status" "$connectivity_details"

	if [ "$connectivity_status" = "pass" ]; then
		roles=("${DB_USER:-}")
		roles=(${roles[@]})
		if [ -z "${roles[*]}" ]; then
			roles_status="fail"
			roles_details="Missing DB_USER for role validation"
		else
			role_list="$(sql_list "${roles[@]}")"
			role_query="SELECT rolname FROM pg_roles WHERE rolname IN (${role_list});"
			role_output="$(run_psql "$role_query" 2>&1)"
			role_exit=$?
			if [ $role_exit -ne 0 ]; then
				roles_status="fail"
				roles_details="Role validation failed: ${role_output}"
			else
				roles_status="pass"
				roles_details="All required roles present"
				for role in "${roles[@]}"; do
					if ! printf '%s\n' "$role_output" | grep -q "^${role}$"; then
						roles_missing+=("$role")
					fi
				done
				if [ "${#roles_missing[@]}" -gt 0 ]; then
					roles_status="fail"
					roles_details="Missing roles: ${roles_missing[*]}"
				fi
			fi
		fi

		emit_result "roles" "$roles_status" "$roles_details"

		if [ "$roles_status" = "pass" ]; then
			database_privs=("CONNECT")
			schema_privs=("USAGE" "CREATE")
			table_privs=("SELECT" "INSERT" "UPDATE" "DELETE")
			tables=("user" "session" "account" "verification")

			tables_status="pass"
			tables_details="All required tables present"

			table_list="$(sql_list "${tables[@]}")"
			table_query="SELECT tablename FROM pg_tables WHERE schemaname = '${SCHEMA}' AND tablename IN (${table_list});"
			table_output="$(run_psql_tables "$table_query" 2>&1)"
			table_exit=$?
			if [ $table_exit -ne 0 ]; then
				tables_status="fail"
				if [ -z "$table_output" ]; then
					table_output="(no output)"
				fi
				tables_details="Table validation failed running table existence query. error=${table_output}"
			else
				for table in "${tables[@]}"; do
					if ! printf '%s\n' "$table_output" | grep -q "^${table}$"; then
						tables_missing+=("$table")
					fi
				done
				if [ "${#tables_missing[@]}" -gt 0 ]; then
					tables_status="fail"
					tables_details="Missing tables: ${tables_missing[*]}"
					if should_auto_migrate; then
						if [ "$OUTPUT_MODE" = "text" ]; then
							write_line "warn" "[test-env] action=auto-migrate hint=Missing tables detected. Attempting migrations."
						fi
						migration_output="$(run_migrations 2>&1)"
						migration_exit=$?
						if [ $migration_exit -ne 0 ]; then
							tables_details="Missing tables: ${tables_missing[*]} | auto-migrate failed: ${migration_output}"
						else
							tables_missing=()
							table_exit=0
							table_output=""
							retry_attempts=6
							retry_sleep=1
							attempt=1
							while [ $attempt -le $retry_attempts ]; do
								table_output="$(run_psql_tables "$table_query" 2>&1)"
								table_exit=$?
								tables_missing=()
								if [ $table_exit -eq 0 ]; then
									for table in "${tables[@]}"; do
										if ! printf '%s\n' "$table_output" | grep -q "^${table}$"; then
											tables_missing+=("$table")
										fi
									done
								fi
								if [ $table_exit -eq 0 ] && [ "${#tables_missing[@]}" -eq 0 ]; then
									break
								fi
								if [ $attempt -lt $retry_attempts ]; then
									sleep $retry_sleep
								fi
								attempt=$((attempt + 1))
							done
							if [ $table_exit -ne 0 ]; then
								tables_status="fail"
								if [ -z "$table_output" ]; then
									table_output="(no output)"
								fi
								tables_details="Table validation failed after auto-migrate running table existence query. error=${table_output}"
							elif [ "${#tables_missing[@]}" -gt 0 ]; then
								tables_status="fail"
								tables_details="Missing tables after auto-migrate: ${tables_missing[*]}"
							else
								tables_status="pass"
								tables_details="Auto-migrate completed. All required tables present"
							fi
							if [ "$tables_status" = "fail" ] && should_debug; then
								write_line "warn" "[test-env] debug=tables table_query=${table_query}"
								write_line "warn" "[test-env] debug=tables table_output=${table_output}"
							fi
						fi
					else
						if [ "$OUTPUT_MODE" = "text" ]; then
							write_line "warn" "[test-env] next-step=run-migrations hint=Missing tables detected. Run database migrations locally (e.g. npm run db:migrate) and re-check."
						fi
					fi
				fi
			fi

			if [ "$tables_status" = "fail" ] && should_debug; then
				write_line "warn" "[test-env] debug=tables DB_NAME=${DB_NAME:-} DB_USER=${DB_USER:-} DB_HOST=${DB_HOST:-} SCHEMA=${SCHEMA:-}"
				write_line "warn" "[test-env] debug=tables table_output=${table_output}"
			fi

			privileges_status="pass"
			privileges_details="All required privileges granted"
			privileges_missing=()

			for priv in "${database_privs[@]}"; do
				priv_result="$(run_psql "SELECT has_database_privilege('${DB_USER}','${DB_NAME}','${priv}');" 2>&1)"
				if [ $? -ne 0 ] || [ "$priv_result" != "t" ]; then
					privileges_missing+=("database:${priv}")
				fi
			done

			for priv in "${schema_privs[@]}"; do
				priv_result="$(run_psql "SELECT has_schema_privilege('${DB_USER}','${SCHEMA}','${priv}');" 2>&1)"
				if [ $? -ne 0 ] || [ "$priv_result" != "t" ]; then
					privileges_missing+=("schema:${priv}")
				fi
			done

			if [ "${#privileges_missing[@]}" -gt 0 ]; then
				privileges_status="fail"
				privileges_details="Missing privileges: ${privileges_missing[*]}"
			else
				if [ "$tables_status" = "pass" ]; then
					for table in "${tables[@]}"; do
						for priv in "${table_privs[@]}"; do
							priv_result="$(run_psql "SELECT has_table_privilege('${DB_USER}','${SCHEMA}.${table}','${priv}');" 2>&1)"
							if [ $? -ne 0 ] || [ "$priv_result" != "t" ]; then
								privileges_missing+=("table:${table}:${priv}")
							fi
						done
					done

					if [ "${#privileges_missing[@]}" -gt 0 ]; then
						privileges_status="fail"
						privileges_details="Missing privileges: ${privileges_missing[*]}"
					fi
				else
					privileges_status="skip"
					privileges_details="Table privilege checks skipped because tables are missing"
				fi
			fi

			emit_result "privileges" "$privileges_status" "$privileges_details"
			emit_result "tables" "$tables_status" "$tables_details"
		else
			privileges_status="skip"
			privileges_details="Skipped due to role failures"
			tables_status="skip"
			tables_details="Skipped due to role failures"

			emit_result "privileges" "$privileges_status" "$privileges_details"
			emit_result "tables" "$tables_status" "$tables_details"
		fi
	else
		roles_status="skip"
		roles_details="Skipped due to connectivity failures"
		privileges_status="skip"
		privileges_details="Skipped due to connectivity failures"
		tables_status="skip"
		tables_details="Skipped due to connectivity failures"

		emit_result "roles" "$roles_status" "$roles_details"
		emit_result "privileges" "$privileges_status" "$privileges_details"
		emit_result "tables" "$tables_status" "$tables_details"
	fi
else
	emit_result "connectivity" "$connectivity_status" "$connectivity_details"
	emit_result "roles" "$roles_status" "$roles_details"
	emit_result "privileges" "$privileges_status" "$privileges_details"
	emit_result "tables" "$tables_status" "$tables_details"
fi

failed_categories=()
if [ "$env_status" = "fail" ]; then failed_categories+=("env"); fi
if [ "$connectivity_status" = "fail" ]; then failed_categories+=("connectivity"); fi
if [ "$roles_status" = "fail" ]; then failed_categories+=("roles"); fi
if [ "$privileges_status" = "fail" ]; then failed_categories+=("privileges"); fi
if [ "$tables_status" = "fail" ]; then failed_categories+=("tables"); fi

result="pass"
exit_code=0
if [ "${#failed_categories[@]}" -gt 0 ]; then
	result="fail"
	exit_code=1
fi

if [ "$OUTPUT_MODE" = "json" ]; then
	env_json="\"env\":{\"status\":\"${env_status}\""
	if [ -n "$env_details" ]; then
		env_json="${env_json},\"details\":\"$(json_escape "$env_details")\""
	fi
	if [ "${#missing_env[@]}" -gt 0 ]; then
		env_json="${env_json},\"missing\":$(json_array "${missing_env[@]}")"
	fi
	env_json="${env_json}}"

	conn_json="\"connectivity\":{\"status\":\"${connectivity_status}\""
	if [ -n "$connectivity_details" ]; then
		conn_json="${conn_json},\"details\":\"$(json_escape "$connectivity_details")\""
	fi
	conn_json="${conn_json}}"

	roles_json="\"roles\":{\"status\":\"${roles_status}\""
	if [ -n "$roles_details" ]; then
		roles_json="${roles_json},\"details\":\"$(json_escape "$roles_details")\""
	fi
	if [ "${#roles_missing[@]}" -gt 0 ]; then
		roles_json="${roles_json},\"missing\":$(json_array "${roles_missing[@]}")"
	fi
	roles_json="${roles_json}}"

	privileges_json="\"privileges\":{\"status\":\"${privileges_status}\""
	if [ -n "$privileges_details" ]; then
		privileges_json="${privileges_json},\"details\":\"$(json_escape "$privileges_details")\""
	fi
	if [ "${#privileges_missing[@]}" -gt 0 ]; then
		privileges_json="${privileges_json},\"missing\":$(json_array "${privileges_missing[@]}")"
	fi
	privileges_json="${privileges_json}}"

	tables_json="\"tables\":{\"status\":\"${tables_status}\""
	if [ -n "$tables_details" ]; then
		tables_json="${tables_json},\"details\":\"$(json_escape "$tables_details")\""
	fi
	if [ "${#tables_missing[@]}" -gt 0 ]; then
		tables_json="${tables_json},\"missing\":$(json_array "${tables_missing[@]}")"
	fi
	tables_json="${tables_json}}"

	printf '{"mode":"%s","result":"%s","categories":{%s,%s,%s,%s,%s}}\n' \
		"$(json_escape "$MODE")" \
		"$(json_escape "$result")" \
		"$env_json" \
		"$conn_json" \
		"$roles_json" \
		"$privileges_json" \
		"$tables_json"
else
	category_list="none"
	if [ "${#failed_categories[@]}" -gt 0 ]; then
		category_list="${failed_categories[*]}"
		category_list="${category_list// /,}"
	fi
	summary_line="[test-env] mode=${MODE} result=${result} categories=${category_list} exit=${exit_code}"
	write_line "info" "$summary_line"
fi

exit "$exit_code"
