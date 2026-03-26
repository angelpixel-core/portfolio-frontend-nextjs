const { Client } = require("pg");

async function checkPrivileges({ env = process.env, requirements } = {}) {
  const roles = requirements?.roles || [];
  const privileges = requirements?.privileges || {};
  const schema = requirements?.schema || "public";
  const tables = requirements?.tables || [];

  if (roles.length === 0) {
    return {
      category: "privileges",
      status: "skip",
      details: "No roles configured for privilege validation",
    };
  }

  const databaseUrl = env.DATABASE_URL;
  const client = new Client({
    connectionString: databaseUrl,
    connectionTimeoutMillis: 5000,
  });

  const missing = [];

  try {
    await client.connect();
    const databaseName = env.DB_NAME || client.database;

    for (const role of roles) {
      for (const privilege of privileges.database || []) {
        const result = await client.query(
          "SELECT has_database_privilege($1, $2, $3) AS has",
          [role, databaseName, privilege]
        );
        if (!result.rows[0]?.has) {
          missing.push({ role, scope: "database", target: databaseName, privilege });
        }
      }

      for (const privilege of privileges.schema || []) {
        const result = await client.query(
          "SELECT has_schema_privilege($1, $2, $3) AS has",
          [role, schema, privilege]
        );
        if (!result.rows[0]?.has) {
          missing.push({ role, scope: "schema", target: schema, privilege });
        }
      }

      for (const table of tables) {
        const tableName = `${schema}.${table}`;
        for (const privilege of privileges.tables || []) {
          const result = await client.query(
            "SELECT has_table_privilege($1, to_regclass($2), $3) AS has",
            [role, tableName, privilege]
          );
          if (!result.rows[0]?.has) {
            missing.push({ role, scope: "table", target: tableName, privilege });
          }
        }
      }
    }

    if (missing.length > 0) {
      return {
        category: "privileges",
        status: "fail",
        details: `Missing privileges: ${missing
          .map((entry) => `${entry.role}:${entry.scope}:${entry.target}:${entry.privilege}`)
          .join(", ")}`,
        data: { missing },
      };
    }

    return {
      category: "privileges",
      status: "pass",
      details: "All required privileges granted",
    };
  } catch (error) {
    return {
      category: "privileges",
      status: "fail",
      details: `Privilege validation failed: ${error.message}`,
      data: { error: error.message },
    };
  } finally {
    await client.end().catch(() => undefined);
  }
}

module.exports = checkPrivileges;
