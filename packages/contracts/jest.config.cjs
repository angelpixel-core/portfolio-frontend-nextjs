const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "../.." });

module.exports = createJestConfig({
  rootDir: "../..",
  testEnvironment: "node",
  testMatch: ["<rootDir>/packages/contracts/src/**/__tests__/**/*.test.ts"],
});
