const REQUIRED_ENV = [
  "DATABASE_URL",
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "POSTGRES_USER",
  "POSTGRES_PASSWORD",
];

const MODE_CONFIG = {
  local: {
    mode: "local",
    label: "local",
    requiredEnv: REQUIRED_ENV,
  },
  ci: {
    mode: "ci",
    label: "ci",
    requiredEnv: REQUIRED_ENV,
  },
};

function resolveMode(env = process.env) {
  const rawMode = typeof env.TEST_ENV_MODE === "string" ? env.TEST_ENV_MODE : "";
  const normalized = rawMode.trim().toLowerCase();

  if (normalized === "ci") return "ci";
  return "local";
}

function getModeConfig(mode) {
  return MODE_CONFIG[mode] || MODE_CONFIG.local;
}

function resolveConfig(env = process.env) {
  const mode = resolveMode(env);
  const config = getModeConfig(mode);

  return {
    ...config,
    mode,
  };
}

module.exports = {
  REQUIRED_ENV,
  MODE_CONFIG,
  resolveMode,
  getModeConfig,
  resolveConfig,
};
