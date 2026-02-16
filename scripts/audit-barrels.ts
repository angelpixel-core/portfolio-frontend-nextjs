/**
 * Barrel File Audit Script
 *
 * Scans src/ for barrel files (index.ts/index.js with re-exports) and reports:
 * - File path
 * - Number of exports
 * - Export type (named, wildcard, mixed)
 * - Whether it contains `export *` (candidate for conversion)
 *
 * Usage: npx tsx scripts/audit-barrels.ts
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

interface BarrelInfo {
  path: string;
  exportCount: number;
  wildcardCount: number;
  namedCount: number;
  type: "named" | "wildcard" | "mixed";
  status: "safe" | "candidate";
}

const SRC_DIR = join(process.cwd(), "src");

function findIndexFiles(dir: string): string[] {
  const results: string[] = [];

  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      results.push(...findIndexFiles(fullPath));
    } else if (entry === "index.ts" || entry === "index.js") {
      results.push(fullPath);
    }
  }

  return results;
}

function analyzeBarrel(filePath: string): BarrelInfo | null {
  const content = readFileSync(filePath, "utf-8");

  // Collapse multi-line exports into single lines for uniform parsing:
  // "export {\n  A,\n  B,\n} from" → "export { A, B, } from"
  const collapsed = content.replace(
    /^(export\s+(?:type\s+)?)\{([^}]*)\}(\s+from\s+)/gms,
    (_match, prefix: string, inner: string, suffix: string) => {
      const flat = inner
        .replace(/\/\/[^\n]*/g, "") // strip inline comments
        .replace(/\n/g, " ");
      return `${prefix}{${flat}}${suffix}`;
    },
  );
  const lines = collapsed.split("\n");

  let wildcardCount = 0;
  let namedExportNames = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    // Count export * from
    if (/^export\s+\*\s+from\s+/.test(trimmed)) {
      wildcardCount++;
      continue;
    }

    // Count named re-exports: export [type] { A, B, C } from "..."
    const namedMatch = trimmed.match(
      /^export\s+(?:type\s+)?\{([^}]*)\}\s+from\s+/,
    );
    if (namedMatch) {
      const names = namedMatch[1]
        .split(",")
        .map((n) => n.trim())
        .filter((n) => n.length > 0);
      namedExportNames += names.length;
    }
  }

  const totalExports = namedExportNames + wildcardCount;

  // Skip files with no re-exports (component entry points, not barrels)
  if (totalExports === 0) return null;

  // Skip single default export files (component wrappers, not barrels)
  if (totalExports === 1 && wildcardCount === 0) {
    // Check if it's just re-exporting a single default — likely a component entry point
    const hasOnlyDefaultReExport =
      /export\s+\{\s*default\s*(as\s+\w+)?\s*\}/.test(content) &&
      namedExportNames <= 1;
    if (hasOnlyDefaultReExport) return null;
  }

  const type: BarrelInfo["type"] =
    wildcardCount > 0 && namedExportNames > 0
      ? "mixed"
      : wildcardCount > 0
        ? "wildcard"
        : "named";

  const status: BarrelInfo["status"] = wildcardCount > 0 ? "candidate" : "safe";

  return {
    path: relative(process.cwd(), filePath),
    exportCount: totalExports,
    wildcardCount,
    namedCount: namedExportNames,
    type,
    status,
  };
}

function main(): void {
  const indexFiles = findIndexFiles(SRC_DIR);
  const barrels: BarrelInfo[] = [];

  for (const file of indexFiles) {
    const info = analyzeBarrel(file);
    if (info) barrels.push(info);
  }

  // Sort: candidates first, then by path
  barrels.sort((a, b) => {
    if (a.status !== b.status)
      return a.status === "candidate" ? -1 : 1;
    return a.path.localeCompare(b.path);
  });

  // Print header
  console.log("\n📦 Barrel File Audit Report\n");
  console.log(
    `${"File".padEnd(55)}  ${"Exports".padStart(7)}  ${"E*".padStart(4)}  ${"Type".padEnd(8)}  Status`,
  );
  console.log("-".repeat(95));

  // Print rows
  let candidateCount = 0;
  for (const b of barrels) {
    if (b.status === "candidate") candidateCount++;
    const statusIcon = b.status === "candidate" ? "⚠️  candidate" : "✅ safe";
    console.log(
      `${b.path.padEnd(55)}  ${String(b.exportCount).padStart(7)}  ${String(b.wildcardCount).padStart(4)}  ${b.type.padEnd(8)}  ${statusIcon}`,
    );
  }

  // Summary
  console.log("-".repeat(95));
  console.log(
    `\nTotal: ${barrels.length} barrel files (${candidateCount} candidates for conversion)\n`,
  );

  // Exit with non-zero code if candidates found (useful for CI gates)
  if (candidateCount > 0) {
    console.log(
      "⚠️  Found barrels with `export *` — consider converting to named re-exports.\n",
    );
    process.exit(1);
  }
}

main();
