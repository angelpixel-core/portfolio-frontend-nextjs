const { Client } = require("pg");

async function checkTables({ env = process.env, requirements } = {}) {
  const schema = requirements?.schema || "public";
  const tables = requirements?.tables || [];

  if (tables.length === 0) {
    return {
      category: "tables",
      status: "skip",
      details: "No tables configured for validation",
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
      "SELECT table_name FROM information_schema.tables WHERE table_schema = $1 AND table_name = ANY($2)",
      [schema, tables]
    );

    const found = new Set(result.rows.map((row) => row.table_name));
    const missing = tables.filter((table) => !found.has(table));

    if (missing.length > 0) {
      return {
        category: "tables",
        status: "fail",
        details: `Missing tables: ${missing.join(", ")}`,
        data: { missing },
      };
    }

    return {
      category: "tables",
      status: "pass",
      details: "All required tables exist",
    };
  } catch (error) {
    return {
      category: "tables",
      status: "fail",
      details: `Table validation failed: ${error.message}`,
      data: { error: error.message },
    };
  } finally {
    await client.end().catch(() => undefined);
  }
}

module.exports = checkTables;
