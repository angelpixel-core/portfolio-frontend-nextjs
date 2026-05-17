import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

type Layer =
  | "presentation"
  | "application"
  | "domain"
  | "infrastructure"
  | "shared"
  | "observability"
  | "config"
  | "external"
  | "unknown";

type Severity = "high" | "medium" | "low";
type Bucket = "A1" | "A2" | "A3" | "A4";

type Violation = {
  file: string;
  importPath: string;
  sourceLayer: Layer;
  targetLayer: Layer;
  rule: string;
  bucket: Bucket;
  severity: Severity;
};

type Report = {
  generatedAt: string;
  branch: string;
  commitSha: string;
  command: string;
  totals: {
    violations: number;
    filesAffected: number;
    rules: number;
  };
  byRule: Array<{ rule: string; count: number; severity: Severity }>;
  byBucket: Array<{ bucket: Bucket; count: number; severity: Severity }>;
  topFiles: Array<{ file: string; count: number }>;
  violations: Violation[];
};

const ROOT = process.cwd();
const SRC_DIR = join(ROOT, "src");
const REPORTS_DIR = join(ROOT, "reports", "architecture");
const JSON_OUTPUT = join(REPORTS_DIR, "baseline.json");
const MD_OUTPUT = join(REPORTS_DIR, "baseline.md");

const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);
const IGNORE_SEGMENTS = new Set(["node_modules", ".next", ".git", "dist", "build"]);

const importRegexes = [
  /import\s+[^"'`]*?\s+from\s+["'`]([^"'`]+)["'`]/g,
  /export\s+[^"'`]*?\s+from\s+["'`]([^"'`]+)["'`]/g,
  /require\(\s*["'`]([^"'`]+)["'`]\s*\)/g,
];

function getGitBranch(): string {
  try {
    const head = readFileSync(join(ROOT, ".git", "HEAD"), "utf8").trim();
    if (head.startsWith("ref:")) return head.split("/").pop() ?? "unknown";
    return "detached";
  } catch {
    return "unknown";
  }
}

function getCommitSha(): string {
  try {
    return readFileSync(join(ROOT, ".git", "HEAD"), "utf8").trim();
  } catch {
    return "unknown";
  }
}

function walkFiles(dir: string, result: string[]): void {
  for (const entry of readdirSync(dir)) {
    if (IGNORE_SEGMENTS.has(entry)) continue;
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      walkFiles(fullPath, result);
      continue;
    }

    const extension = entry.slice(entry.lastIndexOf("."));
    if (SOURCE_EXTENSIONS.has(extension)) {
      result.push(fullPath);
    }
  }
}

function collectImports(content: string): string[] {
  const imports = new Set<string>();
  for (const regex of importRegexes) {
    let match: RegExpExecArray | null;
    while ((match = regex.exec(content)) !== null) {
      imports.add(match[1]);
    }
  }
  return Array.from(imports);
}

function resolveAliasTarget(importPath: string): string | null {
  if (!importPath.startsWith("@/")) return null;
  const target = importPath.slice(2);
  return `src/${target}`;
}

function resolveRelativeTarget(file: string, importPath: string): string | null {
  if (!importPath.startsWith(".")) return null;
  const sourceDir = dirname(file);
  const absolute = resolve(sourceDir, importPath);
  return relative(ROOT, absolute).replace(/\\/g, "/");
}

function getLayerFromPath(path: string): Layer {
  const normalized = path.replace(/\\/g, "/");
  if (!normalized.startsWith("src/")) {
    if (normalized.startsWith("public/")) return "external";
    return "unknown";
  }

  if (normalized.startsWith("src/app/") || normalized.startsWith("src/ui/")) {
    return "presentation";
  }
  if (normalized.startsWith("src/application/")) return "application";
  if (normalized.startsWith("src/domains/")) return "domain";
  if (normalized.startsWith("src/observability/")) return "observability";
  if (normalized.startsWith("src/config/")) return "config";
  if (
    normalized.startsWith("src/services/") ||
    normalized.startsWith("src/db/") ||
    normalized.startsWith("src/providers/")
  ) {
    return "infrastructure";
  }
  if (normalized.startsWith("src/lib/")) return "shared";
  if (normalized.startsWith("src/state/") || normalized.startsWith("src/hooks/")) {
    return "shared";
  }
  return "unknown";
}

function isTestPath(path: string): boolean {
  return (
    path.includes("/__tests__/") ||
    path.endsWith(".test.ts") ||
    path.endsWith(".test.tsx") ||
    path.endsWith(".test.js") ||
    path.endsWith(".test.jsx") ||
    path.endsWith(".spec.ts") ||
    path.endsWith(".spec.tsx") ||
    path.endsWith(".spec.js") ||
    path.endsWith(".spec.jsx")
  );
}

function classifyViolation(file: string, targetPath: string, sourceLayer: Layer, targetLayer: Layer): Violation | null {
  const normalizedFile = file.replace(/\\/g, "/");
  const normalizedTarget = targetPath.replace(/\\/g, "/");

  if (normalizedFile.startsWith("src/ui/") && normalizedTarget.startsWith("src/services/")) {
    return {
      file: normalizedFile,
      importPath: normalizedTarget,
      sourceLayer,
      targetLayer,
      rule: "ui-to-services",
      bucket: "A2",
      severity: "high",
    };
  }

  if (normalizedFile.startsWith("src/app/api/") && normalizedTarget.startsWith("src/services/")) {
    return {
      file: normalizedFile,
      importPath: normalizedTarget,
      sourceLayer,
      targetLayer,
      rule: "api-to-services",
      bucket: "A1",
      severity: "medium",
    };
  }

  if (isTestPath(normalizedFile) && targetLayer === "infrastructure") {
    return {
      file: normalizedFile,
      importPath: normalizedTarget,
      sourceLayer,
      targetLayer,
      rule: "test-to-infrastructure",
      bucket: "A3",
      severity: "low",
    };
  }

  if (sourceLayer === "presentation" && targetLayer === "infrastructure") {
    return {
      file: normalizedFile,
      importPath: normalizedTarget,
      sourceLayer,
      targetLayer,
      rule: "presentation-to-infrastructure",
      bucket: "A4",
      severity: "high",
    };
  }

  return null;
}

function countBy<T extends string>(values: T[]): Map<T, number> {
  const map = new Map<T, number>();
  for (const value of values) {
    map.set(value, (map.get(value) ?? 0) + 1);
  }
  return map;
}

function toMarkdown(report: Report): string {
  const byRuleRows = report.byRule
    .map((entry) => `| ${entry.rule} | ${entry.count} | ${entry.severity} |`)
    .join("\n");
  const byBucketRows = report.byBucket
    .map((entry) => `| ${entry.bucket} | ${entry.count} | ${entry.severity} |`)
    .join("\n");
  const topFileRows = report.topFiles
    .map((entry) => `| ${entry.file} | ${entry.count} |`)
    .join("\n");

  return [
    "# Architecture Baseline Report",
    "",
    `- Generated at: ${report.generatedAt}`,
    `- Branch: ${report.branch}`,
    `- Commit SHA: ${report.commitSha}`,
    `- Command: ${report.command}`,
    "",
    "## Totals",
    "",
    `- Violations: ${report.totals.violations}`,
    `- Files affected: ${report.totals.filesAffected}`,
    `- Rules violated: ${report.totals.rules}`,
    "",
    "## By Rule",
    "",
    "| Rule | Count | Severity |",
    "| --- | ---: | --- |",
    byRuleRows || "| none | 0 | n/a |",
    "",
    "## By Bucket",
    "",
    "| Bucket | Count | Severity |",
    "| --- | ---: | --- |",
    byBucketRows || "| none | 0 | n/a |",
    "",
    "## Top Files",
    "",
    "| File | Count |",
    "| --- | ---: |",
    topFileRows || "| none | 0 |",
    "",
  ].join("\n");
}

function main(): void {
  const files: string[] = [];
  walkFiles(SRC_DIR, files);

  const violations: Violation[] = [];

  for (const absoluteFile of files) {
    const file = relative(ROOT, absoluteFile).replace(/\\/g, "/");
    const sourceLayer = getLayerFromPath(file);
    const content = readFileSync(absoluteFile, "utf8");
    const importPaths = collectImports(content);

    for (const importPath of importPaths) {
      const aliasTarget = resolveAliasTarget(importPath);
      const relativeTarget = resolveRelativeTarget(absoluteFile, importPath);
      const targetPath = aliasTarget ?? relativeTarget;
      if (!targetPath) continue;

      const targetLayer = getLayerFromPath(targetPath);
      const violation = classifyViolation(file, targetPath, sourceLayer, targetLayer);
      if (violation) violations.push(violation);
    }
  }

  const byRuleCount = countBy(violations.map((item) => item.rule));
  const byBucketCount = countBy(violations.map((item) => item.bucket));
  const byFileCount = countBy(violations.map((item) => item.file));

  const severityByRule = new Map<string, Severity>();
  const severityByBucket = new Map<Bucket, Severity>([
    ["A1", "medium"],
    ["A2", "high"],
    ["A3", "low"],
    ["A4", "high"],
  ]);
  for (const violation of violations) {
    severityByRule.set(violation.rule, violation.severity);
  }

  const byRule = Array.from(byRuleCount.entries())
    .map(([rule, count]) => ({
      rule,
      count,
      severity: severityByRule.get(rule) ?? "low",
    }))
    .sort((a, b) => b.count - a.count);

  const byBucket = Array.from(byBucketCount.entries())
    .map(([bucket, count]) => ({
      bucket,
      count,
      severity: severityByBucket.get(bucket) ?? "low",
    }))
    .sort((a, b) => b.count - a.count);

  const topFiles = Array.from(byFileCount.entries())
    .map(([file, count]) => ({ file, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  const report: Report = {
    generatedAt: new Date().toISOString(),
    branch: getGitBranch(),
    commitSha: getCommitSha(),
    command: "npm run architecture:report",
    totals: {
      violations: violations.length,
      filesAffected: byFileCount.size,
      rules: byRuleCount.size,
    },
    byRule,
    byBucket,
    topFiles,
    violations,
  };

  mkdirSync(REPORTS_DIR, { recursive: true });
  writeFileSync(JSON_OUTPUT, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  writeFileSync(MD_OUTPUT, `${toMarkdown(report)}\n`, "utf8");

  console.log("Architecture report generated (report-only):");
  console.log(`- Violations: ${report.totals.violations}`);
  console.log(`- Files affected: ${report.totals.filesAffected}`);
  console.log(`- Rules: ${report.totals.rules}`);
  console.log(`- JSON: ${relative(ROOT, JSON_OUTPUT)}`);
  console.log(`- Markdown: ${relative(ROOT, MD_OUTPUT)}`);

  process.exit(0);
}

main();
