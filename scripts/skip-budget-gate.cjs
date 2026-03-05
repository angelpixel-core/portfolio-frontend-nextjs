const fs = require("node:fs");

const WAIVER_FILE_DEFAULT = ".github/e2e-skip-waiver.json";
const REPORT_FILE_DEFAULT = "test-results/e2e-results.json";
const MAX_WAIVER_VALIDITY_DAYS = 7;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function isTraceableIssueReference(value) {
  if (typeof value !== "string") return false;

  const normalized = value.trim();
  if (!normalized) return false;

  const issueUrlPattern = /^https?:\/\/[^\s]+$/i;
  const ownerRepoIssuePattern =
    /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+#[1-9][0-9]*$/;

  return (
    issueUrlPattern.test(normalized) || ownerRepoIssuePattern.test(normalized)
  );
}

function isValidSkipWaiverEntry(entry) {
  if (!entry || typeof entry !== "object") return false;

  const requiredStringFields = ["match", "owner", "reason", "expiresOn"];
  const hasRequiredStrings = requiredStringFields.every(
    (key) => typeof entry[key] === "string" && entry[key].trim().length > 0
  );

  return Boolean(
    entry.enabled === true &&
    hasRequiredStrings &&
    isTraceableIssueReference(entry.issue)
  );
}

function isValidWaiver(waiver) {
  if (!waiver || typeof waiver !== "object") return false;

  const requiredStringFields = ["owner", "reason", "expiresOn"];
  const hasRequiredStrings = requiredStringFields.every(
    (key) => typeof waiver[key] === "string" && waiver[key].trim().length > 0
  );
  const hasTraceableIssue = isTraceableIssueReference(waiver.issue);

  if (!(waiver.enabled === true && hasRequiredStrings && hasTraceableIssue)) {
    return false;
  }

  if (
    typeof waiver.baselineMax !== "number" ||
    !Number.isInteger(waiver.baselineMax) ||
    waiver.baselineMax < 0
  ) {
    return false;
  }

  if (!Array.isArray(waiver.allowedSkips)) return false;

  return waiver.allowedSkips.every((entry) => isValidSkipWaiverEntry(entry));
}

function isWaiverActive(waiverLike, now = new Date()) {
  if (!waiverLike || typeof waiverLike !== "object") return false;

  const isTopWaiver = Object.prototype.hasOwnProperty.call(
    waiverLike,
    "allowedSkips"
  );

  if (isTopWaiver && !isValidWaiver(waiverLike)) return false;
  if (!isTopWaiver && !isValidSkipWaiverEntry(waiverLike)) return false;

  const expiresAt = new Date(`${waiverLike.expiresOn}T23:59:59.999Z`);
  if (Number.isNaN(expiresAt.getTime())) return false;

  const msUntilExpiry = expiresAt.getTime() - now.getTime();
  const maxValidityWindowMs = MAX_WAIVER_VALIDITY_DAYS * ONE_DAY_MS;

  if (msUntilExpiry > maxValidityWindowMs) return false;

  return msUntilExpiry >= 0;
}

function canUseBreakGlass(waiver, now = new Date(), env = process.env) {
  const breakGlassEnabled = env.E2E_SKIP_BREAK_GLASS === "1";
  return breakGlassEnabled && isWaiverActive(waiver, now);
}

function loadWaiver(waiverPath) {
  if (!fs.existsSync(waiverPath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(waiverPath, "utf8"));
  } catch (error) {
    throw new Error(`Invalid waiver file at ${waiverPath}: ${error.message}`);
  }
}

function loadReport(reportPath) {
  if (!fs.existsSync(reportPath)) {
    throw new Error(`Playwright JSON report not found at ${reportPath}`);
  }

  try {
    return JSON.parse(fs.readFileSync(reportPath, "utf8"));
  } catch (error) {
    throw new Error(
      `Invalid Playwright JSON report at ${reportPath}: ${error.message}`
    );
  }
}

function collectSkippedTestsFromReport(report) {
  if (!report || typeof report !== "object") return [];

  const skipped = [];

  function normalizeReportFile(file) {
    const normalized =
      typeof file === "string" && file.trim().length > 0
        ? file.replace(/\\/g, "/")
        : "unknown-file";

    if (normalized === "unknown-file") {
      return normalized;
    }

    return normalized.includes("/") ? normalized : `e2e/${normalized}`;
  }

  function visitSuite(suite, titleStack = []) {
    if (!suite || typeof suite !== "object") return;

    const nextStack = suite.title ? [...titleStack, suite.title] : titleStack;

    if (Array.isArray(suite.specs)) {
      suite.specs.forEach((spec) => {
        const file = normalizeReportFile(spec.file);
        const specTitle = spec.title || "unknown-spec";
        const specTitlePath = Array.isArray(spec.titlePath)
          ? spec.titlePath
          : [...nextStack, specTitle];

        const tests = Array.isArray(spec.tests) ? spec.tests : [];
        tests.forEach((test) => {
          const expectedSkip = test.expectedStatus === "skipped";
          const hasSkippedResult = Array.isArray(test.results)
            ? test.results.some((result) =>
                ["skipped", "interrupted"].includes(result.status)
              )
            : false;

          if (!expectedSkip && !hasSkippedResult) {
            return;
          }

          const titleSegments = [
            ...specTitlePath,
            test.title || specTitle || "unknown-test",
          ].filter(Boolean);
          const title = titleSegments.join(" > ");
          const id = `${file}::${title}`;

          skipped.push({
            id,
            file,
            title,
            kind: expectedSkip ? "expected" : "unexpected",
          });
        });
      });
    }

    if (Array.isArray(suite.suites)) {
      suite.suites.forEach((childSuite) => visitSuite(childSuite, nextStack));
    }
  }

  const suites = Array.isArray(report.suites) ? report.suites : [];
  suites.forEach((suite) => visitSuite(suite));

  return skipped;
}

function matchesWaiverEntry(skipEntry, waiverEntry) {
  const match = waiverEntry.match.trim();
  return skipEntry.id.includes(match) || skipEntry.file.includes(match);
}

function buildSummary(
  report,
  skipEntries,
  waiver,
  budgetMax,
  now = new Date()
) {
  const activeEntries = Array.isArray(waiver?.allowedSkips)
    ? waiver.allowedSkips.filter((entry) => isWaiverActive(entry, now))
    : [];

  const expectedSkips = skipEntries.filter((item) => item.kind === "expected");
  const unexpectedSkips = skipEntries.filter(
    (item) => item.kind === "unexpected"
  );

  const unwaivedExpectedSkips = expectedSkips.filter(
    (skipItem) =>
      !activeEntries.some((entry) => matchesWaiverEntry(skipItem, entry))
  );

  const reportedSkipped =
    typeof report?.stats?.skipped === "number" ? report.stats.skipped : null;

  const totalSkipped = reportedSkipped ?? skipEntries.length;
  const overBudget = totalSkipped > budgetMax;

  return {
    budgetMax,
    totalSkipped,
    expectedSkipCount: expectedSkips.length,
    unexpectedSkipCount: unexpectedSkips.length,
    overBudget,
    unwaivedExpectedSkips,
    unexpectedSkips,
  };
}

function executeSkipBudgetGate({
  env = process.env,
  now = new Date(),
  waiverLoader = loadWaiver,
  reportLoader = loadReport,
  logger = console,
  stderrWriter = (message) => process.stderr.write(message),
} = {}) {
  const waiverPath = env.E2E_SKIP_WAIVER_FILE || WAIVER_FILE_DEFAULT;
  const reportPath = env.E2E_SKIP_REPORT_FILE || REPORT_FILE_DEFAULT;

  const waiver = waiverLoader(waiverPath);
  if (!waiver) {
    logger.error(`[skip-budget-gate] Missing waiver file at ${waiverPath}.`);
    return 1;
  }

  const report = reportLoader(reportPath);
  const skipEntries = collectSkippedTestsFromReport(report);

  const envBudget = Number.parseInt(env.E2E_SKIP_BUDGET_MAX || "", 10);
  const budgetMax = Number.isInteger(envBudget)
    ? envBudget
    : Number.isInteger(waiver.baselineMax)
      ? waiver.baselineMax
      : 0;

  const summary = buildSummary(report, skipEntries, waiver, budgetMax, now);

  const policyFailed =
    summary.overBudget ||
    summary.unwaivedExpectedSkips.length > 0 ||
    summary.unexpectedSkipCount > 0;

  if (!policyFailed) {
    logger.log(
      `[skip-budget-gate] PASS: skipped=${summary.totalSkipped}, budget=${summary.budgetMax}, unexpected=0, unwaived=0`
    );
    return 0;
  }

  if (canUseBreakGlass(waiver, now, env)) {
    logger.warn(
      "[skip-budget-gate] BREAK-GLASS ACTIVE: bypassing failing skip-budget policy."
    );
    logger.warn(`[skip-budget-gate] Waiver issue: ${waiver.issue}`);
    logger.warn(`[skip-budget-gate] Waiver owner: ${waiver.owner}`);
    logger.warn(`[skip-budget-gate] Waiver expiresOn: ${waiver.expiresOn}`);
    logger.warn(`[skip-budget-gate] Waiver reason: ${waiver.reason}`);
    return 0;
  }

  logger.error("[skip-budget-gate] E2E skip-budget policy failed.");
  logger.error(
    `[skip-budget-gate] skipped=${summary.totalSkipped}, budget=${summary.budgetMax}, unexpected=${summary.unexpectedSkipCount}, unwaived=${summary.unwaivedExpectedSkips.length}`
  );

  if (summary.unexpectedSkips.length > 0) {
    stderrWriter(
      `[skip-budget-gate] Unexpected skips:\n${summary.unexpectedSkips
        .map((item) => `- ${item.id}`)
        .join("\n")}\n`
    );
  }

  if (summary.unwaivedExpectedSkips.length > 0) {
    stderrWriter(
      `[skip-budget-gate] Unwaived expected skips:\n${summary.unwaivedExpectedSkips
        .map((item) => `- ${item.id}`)
        .join("\n")}\n`
    );
  }

  return 1;
}

function main() {
  process.exit(executeSkipBudgetGate());
}

if (require.main === module) {
  main();
}

module.exports = {
  MAX_WAIVER_VALIDITY_DAYS,
  isTraceableIssueReference,
  isValidWaiver,
  isWaiverActive,
  canUseBreakGlass,
  collectSkippedTestsFromReport,
  executeSkipBudgetGate,
};
