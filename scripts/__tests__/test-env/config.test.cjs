const {
  REQUIRED_ENV,
  MODE_CONFIG,
  resolveMode,
  getModeConfig,
  resolveConfig,
} = require("../../test-env/config.cjs");

describe("test-env config", () => {
  it("defaults to local mode when unset", () => {
    expect(resolveMode({})).toBe("local");
    expect(resolveMode({ TEST_ENV_MODE: "" })).toBe("local");
  });

  it("normalizes ci mode values", () => {
    expect(resolveMode({ TEST_ENV_MODE: "ci" })).toBe("ci");
    expect(resolveMode({ TEST_ENV_MODE: " CI " })).toBe("ci");
  });

  it("falls back to local for unknown mode", () => {
    expect(resolveMode({ TEST_ENV_MODE: "staging" })).toBe("local");
  });

  it("returns mode configs with required env", () => {
    expect(getModeConfig("ci")).toEqual(MODE_CONFIG.ci);
    expect(getModeConfig("unknown")).toEqual(MODE_CONFIG.local);
    expect(MODE_CONFIG.local.requiredEnv).toEqual(REQUIRED_ENV);
  });

  it("resolves config with normalized mode", () => {
    const config = resolveConfig({ TEST_ENV_MODE: "ci" });
    expect(config.mode).toBe("ci");
    expect(config.requiredEnv).toEqual(REQUIRED_ENV);
  });
});
