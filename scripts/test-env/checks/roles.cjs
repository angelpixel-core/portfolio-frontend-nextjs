const { Client } = require("pg");

async function checkRoles({ env = process.env, requirements } = {}) {
  const roles = requirements?.roles || [];

  if (roles.length === 0) {
    return {
      category: "roles",
      status: "skip",
      details: "No roles configured for validation",
    };
  }

  const databaseUrl = env.DATABASE_URL;
  const client = new Client({
    connectionString: databaseUrl,
    connectionTimeoutMillis: 5000,
  });

  try {
    await client.connect();
    const result = await client.query(
      "SELECT rolname FROM pg_roles WHERE rolname = ANY($1)",
      [roles]
    );

    const found = new Set(result.rows.map((row) => row.rolname));
    const missing = roles.filter((role) => !found.has(role));

    if (missing.length > 0) {
      return {
        category: "roles",
        status: "fail",
        details: `Missing roles: ${missing.join(", ")}`,
        data: { missing },
      };
    }

    return {
      category: "roles",
      status: "pass",
      details: "All required roles exist",
    };
  } catch (error) {
    return {
      category: "roles",
      status: "fail",
      details: `Role validation failed: ${error.message}`,
      data: { error: error.message },
    };
  } finally {
    await client.end().catch(() => undefined);
  }
}

module.exports = checkRoles;
