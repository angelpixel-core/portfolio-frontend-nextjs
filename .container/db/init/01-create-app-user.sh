#!/bin/bash
# ==============================================================================
# Create application database user and database
# ==============================================================================
# Runs once on first Postgres initialization (empty pgdata volume)
# Uses env vars from compose.yaml -> env_file: .env
# ==============================================================================

set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname postgres <<-EOSQL
	    -- Create application user (if not exists)
	    DO \$\$
	    BEGIN
	        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
	            CREATE ROLE $DB_USER WITH LOGIN PASSWORD '$DB_PASSWORD';
	        END IF;
	    END
	    \$\$;

	    -- Create application database (if not exists)
	    DO \$\$
	    BEGIN
	        IF NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME') THEN
	            CREATE DATABASE $DB_NAME OWNER $DB_USER;
	        END IF;
	    END
	    \$\$;

	    -- Grant privileges on database
	    GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DB_NAME" <<-EOSQL
	    -- Grant privileges on schema in target database
	    GRANT USAGE, CREATE ON SCHEMA public TO $DB_USER;
	    ALTER SCHEMA public OWNER TO $DB_USER;
EOSQL

echo "✓ Created database '$DB_NAME' with owner '$DB_USER'"
