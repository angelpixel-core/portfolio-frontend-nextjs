/**
 * @jest-environment node
 * @fileoverview Tests for TypeScript infrastructure setup
 * Story 1.1: Fundación TypeScript y CI
 *
 * These tests verify that TypeScript is properly configured with strict mode.
 * Uses Node.js environment to avoid SWC transformer issues with jsconfig.
 */

import fs from "fs";
import path from "path";

describe("TypeScript Setup", () => {
  const rootDir: string = path.resolve(__dirname, "../..");

  describe("tsconfig.json", () => {
    it("should exist in project root", () => {
      const tsconfigPath = path.join(rootDir, "tsconfig.json");
      expect(fs.existsSync(tsconfigPath)).toBe(true);
    });

    it("should have strict mode enabled", () => {
      const tsconfigPath = path.join(rootDir, "tsconfig.json");
      const tsconfig: Record<string, unknown> = JSON.parse(
        fs.readFileSync(tsconfigPath, "utf-8")
      );
      expect(
        (tsconfig.compilerOptions as Record<string, unknown>)?.strict
      ).toBe(true);
    });

    it("should have allowJs enabled for incremental migration", () => {
      const tsconfigPath = path.join(rootDir, "tsconfig.json");
      const tsconfig: Record<string, unknown> = JSON.parse(
        fs.readFileSync(tsconfigPath, "utf-8")
      );
      expect(
        (tsconfig.compilerOptions as Record<string, unknown>)?.allowJs
      ).toBe(true);
    });

    it("should have Next.js plugin configured", () => {
      const tsconfigPath = path.join(rootDir, "tsconfig.json");
      const tsconfig: Record<string, unknown> = JSON.parse(
        fs.readFileSync(tsconfigPath, "utf-8")
      );
      const compilerOptions = tsconfig.compilerOptions as Record<
        string,
        unknown
      >;
      const plugins = compilerOptions?.plugins as
        | Array<{ name: string }>
        | undefined;
      const hasNextPlugin = plugins?.some((p) => p.name === "next");
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
      const packageJson: Record<string, unknown> = JSON.parse(
        fs.readFileSync(packagePath, "utf-8")
      );
      const scripts = packageJson.scripts as Record<string, string> | undefined;
      expect(scripts?.typecheck).toBeDefined();
      expect(scripts?.typecheck).toContain("tsc");
    });
  });
});
