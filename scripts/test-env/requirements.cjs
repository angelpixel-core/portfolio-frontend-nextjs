module.exports = {
  schema: process.env.TEST_ENV_SCHEMA || "public",
  roles: [process.env.DB_USER].filter(Boolean),
  tables: ["user", "session", "account", "verification"],
  privileges: {
    database: ["CONNECT"],
    schema: ["USAGE", "CREATE"],
    tables: ["SELECT", "INSERT", "UPDATE", "DELETE"],
  },
};
