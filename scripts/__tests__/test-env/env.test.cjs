const checkEnv = require("../../test-env/checks/env.cjs");

describe("test-env env validation", () => {
  it("fails when required env vars are missing or empty", () => {
    const result = checkEnv({
      modeConfig: { requiredEnv: ["DB_HOST", "DB_PORT"] },
      env: { DB_HOST: "localhost", DB_PORT: "  " },
    });

    expect(result.status).toBe("fail");
    expect(result.data.missing).toEqual(["DB_PORT"]);
    expect(result.details).toContain("DB_PORT");
  });

  it("passes when all required env vars are present", () => {
    const result = checkEnv({
      modeConfig: { requiredEnv: ["DB_HOST", "DB_PORT"] },
      env: { DB_HOST: "localhost", DB_PORT: "6432" },
    });

    expect(result.status).toBe("pass");
  });

  it("treats empty required list as pass", () => {
    const result = checkEnv({
      modeConfig: { requiredEnv: [] },
      env: {},
    });

    expect(result.status).toBe("pass");
  });
});
