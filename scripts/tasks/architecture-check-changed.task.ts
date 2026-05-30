import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

type Violation = {
  file: string;
  importPath: string;
  rule: string;
  bucket: string;
  severity: string;
};

type Report = {
  totals: {
    violations: number;
  };
  violations: Violation[];
};

const ROOT = process.cwd();
const REPORT_PATH = join(ROOT, "reports", "architecture", "baseline.json");

function runArchitectureReport(): void {
  execSync("npm run architecture:report", {
    cwd: ROOT,
    stdio: "inherit",
    env: process.env,
  });
}

function getChangedFiles(baseRef: string): string[] {
  const normalizedBase = baseRef.startsWith("origin/")
    ? baseRef
    : `origin/${baseRef}`;

  try {
    execSync(`git fetch origin ${baseRef} --depth=200`, {
      cwd: ROOT,
      stdio: ["ignore", "ignore", "ignore"],
    });
  } catch {
    // Best effort fetch; diff command may still succeed in local usage.
  }

  const output = execSync(
    `git diff --name-only ${normalizedBase}...HEAD -- 'src/**/*.ts' 'src/**/*.tsx' 'src/**/*.js' 'src/**/*.jsx'`,
    {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }
  );

  return output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/\\/g, "/"));
}

function main(): void {
  const baseRef =
    process.env.ARCH_BASE_REF ||
    process.env.GITHUB_BASE_REF ||
    process.env.BASE_REF ||
    "main";

  runArchitectureReport();

  const changedFiles = getChangedFiles(baseRef);
  const changedSet = new Set(changedFiles);

  const report = JSON.parse(readFileSync(REPORT_PATH, "utf8")) as Report;
  const violationsInChanged = report.violations.filter((violation) =>
    changedSet.has(violation.file)
  );

  console.log("Architecture check (changed files mode):");
  console.log(`- Base ref: ${baseRef}`);
  console.log(`- Changed source files: ${changedFiles.length}`);
  console.log(`- Total violations in report: ${report.totals.violations}`);
  console.log(`- Violations in changed files: ${violationsInChanged.length}`);

  if (violationsInChanged.length === 0) {
    console.log("- Result: PASS");
    process.exit(0);
  }

  console.error("- Result: FAIL");
  console.error("\nViolations found in changed files:");
  for (const violation of violationsInChanged) {
    console.error(
      `  - ${violation.file} :: ${violation.rule} (${violation.bucket}/${violation.severity}) -> ${violation.importPath}`
    );
  }

  process.exit(1);
}

main();
