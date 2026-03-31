#!/bin/bash
# ==============================================================================
# Create application database user and database
# ==============================================================================
# Runs once on first Postgres initialization (empty pgdata volume)
# Uses env vars from compose.yaml -> env_file: .env
# ==============================================================================

set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname postgres <<-EOSQL
	    -- Create application user and database (if not exists)
	    DO \$\$
	    BEGIN
	        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
	            EXECUTE format('CREATE ROLE %I WITH LOGIN PASSWORD %L', '$DB_USER', '$DB_PASSWORD');
	        END IF;

	        IF NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME') THEN
	            EXECUTE format('CREATE DATABASE %I OWNER %I', '$DB_NAME', '$DB_USER');
	        END IF;
	    END
	    \$\$;

	    -- Grant privileges
	    GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DB_NAME" <<-EOSQL
	    -- Grant schema privileges in target database
	    GRANT USAGE, CREATE ON SCHEMA public TO $DB_USER;
	    ALTER SCHEMA public OWNER TO $DB_USER;
	    ALTER DEFAULT PRIVILEGES FOR ROLE $DB_USER IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
	    ALTER DEFAULT PRIVILEGES FOR ROLE $DB_USER IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;
	    ALTER DEFAULT PRIVILEGES FOR ROLE $DB_USER IN SCHEMA public GRANT ALL ON FUNCTIONS TO $DB_USER;
EOSQL

echo "✓ Created database '$DB_NAME' with owner '$DB_USER'"
