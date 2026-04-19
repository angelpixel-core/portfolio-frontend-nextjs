#!/usr/bin/env bash
set -euo pipefail

DB_USER="${DB_USER:-developer}"
DB_PASSWORD="${DB_PASSWORD:-abc123}"
DB_NAME="${DB_NAME:-${POSTGRES_DB:-postgres}}"
DB_PORT="${DB_INTERNAL_PORT:-${DB_PORT:-5432}}"
MIGRATIONS_DIR="/migrations"
JOURNAL_FILE="${MIGRATIONS_DIR}/meta/_journal.json"

if [[ ! -d "$MIGRATIONS_DIR" ]]; then
	echo "Migrations directory not found: $MIGRATIONS_DIR" >&2
	exit 1
fi

migration_files=()

if [[ -f "$JOURNAL_FILE" ]] && command -v node >/dev/null 2>&1; then
	mapfile -t migration_files < <(
		node -e '
			const fs = require("fs");
			const journalPath = process.argv[1];
			const baseDir = process.argv[2];
			const journal = JSON.parse(fs.readFileSync(journalPath, "utf8"));
			for (const entry of journal.entries || []) {
				if (!entry || !entry.tag) continue;
				process.stdout.write(`${baseDir}/${entry.tag}.sql\n`);
			}
		' "$JOURNAL_FILE" "$MIGRATIONS_DIR"
	)
else
	shopt -s nullglob
	migration_files=("$MIGRATIONS_DIR"/*.sql)
	shopt -u nullglob
fi

if ((${#migration_files[@]} == 0)); then
	echo "No migration files found in $MIGRATIONS_DIR" >&2
	exit 1
fi

for migration in "${migration_files[@]}"; do
	if [[ ! -f "$migration" ]]; then
		echo "Migration listed but not found: $migration" >&2
		exit 1
	fi
done

export PGPASSWORD="$DB_PASSWORD"

for migration in "${migration_files[@]}"; do
	echo "Applying migration: $migration"
	psql \
		-p "$DB_PORT" \
		-U "$DB_USER" \
		-d "$DB_NAME" \
		-v ON_ERROR_STOP=1 \
		-f "$migration"
done

echo "All migrations applied successfully."
