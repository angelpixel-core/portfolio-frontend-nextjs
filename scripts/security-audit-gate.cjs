const { spawnSync } = require("node:child_process");
const fs = require("node:fs");

const WAIVER_FILE_DEFAULT = ".github/security-audit-waiver.json";

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

function isValidWaiver(waiver) {
  if (!waiver || typeof waiver !== "object") return false;

  const requiredStringFields = ["owner", "reason", "expiresOn"];
  const hasRequiredStrings = requiredStringFields.every(
    (key) => typeof waiver[key] === "string" && waiver[key].trim().length > 0
  );
  const hasTraceableIssue = isTraceableIssueReference(waiver.issue);

  return Boolean(
    waiver.enabled === true && hasRequiredStrings && hasTraceableIssue
  );
}

function isWaiverActive(waiver, now = new Date()) {
  if (!isValidWaiver(waiver)) return false;

  const expiresAt = new Date(`${waiver.expiresOn}T23:59:59.999Z`);
  if (Number.isNaN(expiresAt.getTime())) return false;

  return expiresAt.getTime() >= now.getTime();
}

function canUseBreakGlass(waiver, now = new Date(), env = process.env) {
  const breakGlassEnabled = env.SECURITY_AUDIT_BREAK_GLASS === "1";
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

function runRuntimeAudit() {
  const result = spawnSync(
    "npm",
    ["audit", "--omit=dev", "--audit-level=high", "--json"],
    {
      encoding: "utf8",
      stdio: ["inherit", "pipe", "pipe"],
    }
  );

  const stdout = result.stdout || "";
  const stderr = result.stderr || "";

  if (result.error) {
    throw result.error;
  }

  let parsed = null;
  if (stdout.trim().length > 0) {
    try {
      parsed = JSON.parse(stdout);
    } catch {
      parsed = null;
    }
  }

  return {
    status: result.status,
    stdout,
    stderr,
    parsed,
  };
}

function executeSecurityGate({
  env = process.env,
  now = new Date(),
  waiverLoader = loadWaiver,
  auditRunner = runRuntimeAudit,
  logger = console,
  stderrWriter = (message) => process.stderr.write(message),
} = {}) {
  const waiverPath = env.SECURITY_AUDIT_WAIVER_FILE || WAIVER_FILE_DEFAULT;
  const waiver = waiverLoader(waiverPath);

  const audit = auditRunner();

  if (audit.status === 0) {
    logger.log(
      "[security-gate] Runtime dependency audit passed (no high/critical vulnerabilities)."
    );
    return 0;
  }

  if (canUseBreakGlass(waiver, now, env)) {
    logger.warn(
      "[security-gate] BREAK-GLASS ACTIVE: bypassing failing runtime dependency audit."
    );
    logger.warn(`[security-gate] Waiver issue: ${waiver.issue}`);
    logger.warn(`[security-gate] Waiver owner: ${waiver.owner}`);
    logger.warn(`[security-gate] Waiver expiresOn: ${waiver.expiresOn}`);
    logger.warn(`[security-gate] Waiver reason: ${waiver.reason}`);
    return 0;
  }

  logger.error("[security-gate] Runtime dependency audit failed.");
  if (waiver && !canUseBreakGlass(waiver, now, env)) {
    logger.error(
      "[security-gate] Waiver file exists but is inactive/invalid or SECURITY_AUDIT_BREAK_GLASS is not set to '1'."
    );
  }

  if (audit.stderr.trim()) {
    stderrWriter(`${audit.stderr}\n`);
  }
  if (audit.stdout.trim()) {
    stderrWriter(`${audit.stdout}\n`);
  }

  return audit.status || 1;
}

function main() {
  process.exit(executeSecurityGate());
}

if (require.main === module) {
  main();
}

module.exports = {
  isTraceableIssueReference,
  isValidWaiver,
  isWaiverActive,
  canUseBreakGlass,
  executeSecurityGate,
};
