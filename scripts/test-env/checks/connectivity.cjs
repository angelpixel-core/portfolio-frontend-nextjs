const { Client } = require("pg");

async function checkConnectivity({ env = process.env } = {}) {
  const databaseUrl = env.DATABASE_URL;
  if (typeof databaseUrl !== "string" || databaseUrl.trim().length === 0) {
    return {
      category: "connectivity",
      status: "fail",
      details: "DATABASE_URL is not set",
      data: { missing: ["DATABASE_URL"] },
    };
  }

  const client = new Client({
    connectionString: databaseUrl,
    connectionTimeoutMillis: 5000,
  });

  try {
    await client.connect();
    await client.query("SELECT 1");
    return {
      category: "connectivity",
      status: "pass",
      details: "Connected to database",
    };
  } catch (error) {
    return {
      category: "connectivity",
      status: "fail",
      details: `Database connectivity failed: ${error.message}`,
      data: { error: error.message },
    };
  } finally {
    await client.end().catch(() => undefined);
  }
}

module.exports = checkConnectivity;
