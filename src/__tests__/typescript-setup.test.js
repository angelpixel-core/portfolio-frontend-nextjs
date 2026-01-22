/**
 * @jest-environment node
 * @fileoverview Tests for TypeScript infrastructure setup
 * Story 1.1: Fundación TypeScript y CI
 *
 * These tests verify that TypeScript is properly configured with strict mode.
 * Uses Node.js environment to avoid SWC transformer issues with jsconfig.
 */

const fs = require("fs");
const path = require("path");

describe("TypeScript Setup", () => {
  const rootDir = path.resolve(__dirname, "../..");

  describe("tsconfig.json", () => {
    it("should exist in project root", () => {
      const tsconfigPath = path.join(rootDir, "tsconfig.json");
      expect(fs.existsSync(tsconfigPath)).toBe(true);
    });

    it("should have strict mode enabled", () => {
      const tsconfigPath = path.join(rootDir, "tsconfig.json");
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf-8"));
      expect(tsconfig.compilerOptions.strict).toBe(true);
    });

    it("should have allowJs enabled for incremental migration", () => {
      const tsconfigPath = path.join(rootDir, "tsconfig.json");
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf-8"));
      expect(tsconfig.compilerOptions.allowJs).toBe(true);
    });

    it("should have Next.js plugin configured", () => {
      const tsconfigPath = path.join(rootDir, "tsconfig.json");
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf-8"));
      const hasNextPlugin = tsconfig.compilerOptions.plugins?.some(
        (p) => p.name === "next"
      );
      expect(hasNextPlugin).toBe(true);
    });
  });

  describe("next-env.d.ts", () => {
    it("should exist in project root", () => {
      const nextEnvPath = path.join(rootDir, "next-env.d.ts");
      expect(fs.existsSync(nextEnvPath)).toBe(true);
    });
  });

  describe("package.json scripts", () => {
    it("should have typecheck script", () => {
      const packagePath = path.join(rootDir, "package.json");
      const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf-8"));
      expect(packageJson.scripts.typecheck).toBeDefined();
      expect(packageJson.scripts.typecheck).toContain("tsc");
    });
  });
});
