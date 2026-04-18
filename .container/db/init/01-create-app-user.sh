#!/bin/bash
# ==============================================================================
# Create application database user and database
# ==============================================================================
# Runs once on first Postgres initialization (empty pgdata volume)
# Uses env vars from compose.yaml -> env_file: .env
# ==============================================================================

set -euo pipefail

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname postgres <<-EOSQL
	DO \$\$
	BEGIN
		IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
			EXECUTE format('CREATE ROLE %I WITH LOGIN PASSWORD %L', '$DB_USER', '$DB_PASSWORD');
		END IF;
	END
	\$\$;

	GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOSQL

DB_EXISTS=$(psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'")
DB_EXISTS="${DB_EXISTS//[[:space:]]/}"

if [ "$DB_EXISTS" != "1" ]; then
	createdb --username "$POSTGRES_USER" --owner "$DB_USER" "$DB_NAME"
fi

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DB_NAME" <<-EOSQL
	GRANT USAGE, CREATE ON SCHEMA public TO $DB_USER;
	ALTER SCHEMA public OWNER TO $DB_USER;

	GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
	GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;
	GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO $DB_USER;

	ALTER DEFAULT PRIVILEGES FOR ROLE $DB_USER IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
	ALTER DEFAULT PRIVILEGES FOR ROLE $DB_USER IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;
	ALTER DEFAULT PRIVILEGES FOR ROLE $DB_USER IN SCHEMA public GRANT ALL ON FUNCTIONS TO $DB_USER;
EOSQL

echo "✓ Created database '$DB_NAME' with owner '$DB_USER'"
