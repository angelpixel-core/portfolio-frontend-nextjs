function resolveRequiredEnv(config) {
  if (!config || !Array.isArray(config.requiredEnv)) return [];
  return config.requiredEnv;
}

function findMissingEnv(required, env) {
  return required.filter((name) => {
    const value = env[name];
    if (typeof value !== "string") return true;
    return value.trim().length === 0;
  });
}

function checkEnv({ modeConfig, env = process.env } = {}) {
  const required = resolveRequiredEnv(modeConfig);
  const missing = findMissingEnv(required, env);

  if (missing.length > 0) {
    return {
      category: "env",
      status: "fail",
      details: `Missing required env vars: ${missing.join(", ")}`,
      data: { missing },
    };
  }

  return {
    category: "env",
    status: "pass",
    details: "All required env vars present",
  };
}

module.exports = checkEnv;
