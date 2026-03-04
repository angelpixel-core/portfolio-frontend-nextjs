const { spawnSync } = require("node:child_process");
const fs = require("node:fs");

const WAIVER_FILE_DEFAULT = ".github/security-audit-waiver.json";

function isValidWaiver(waiver) {
  if (!waiver || typeof waiver !== "object") return false;

  const requiredStringFields = ["issue", "owner", "reason", "expiresOn"];
  const hasRequiredStrings = requiredStringFields.every(
    (key) => typeof waiver[key] === "string" && waiver[key].trim().length > 0
  );

  return Boolean(waiver.enabled === true && hasRequiredStrings);
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

function main() {
  const waiverPath =
    process.env.SECURITY_AUDIT_WAIVER_FILE || WAIVER_FILE_DEFAULT;
  const waiver = loadWaiver(waiverPath);

  const audit = runRuntimeAudit();

  if (audit.status === 0) {
    console.log(
      "[security-gate] Runtime dependency audit passed (no high/critical vulnerabilities)."
    );
    process.exit(0);
  }

  if (canUseBreakGlass(waiver)) {
    console.warn(
      "[security-gate] BREAK-GLASS ACTIVE: bypassing failing runtime dependency audit."
    );
    console.warn(`[security-gate] Waiver issue: ${waiver.issue}`);
    console.warn(`[security-gate] Waiver owner: ${waiver.owner}`);
    console.warn(`[security-gate] Waiver expiresOn: ${waiver.expiresOn}`);
    console.warn(`[security-gate] Waiver reason: ${waiver.reason}`);
    process.exit(0);
  }

  console.error("[security-gate] Runtime dependency audit failed.");
  if (waiver && !canUseBreakGlass(waiver)) {
    console.error(
      "[security-gate] Waiver file exists but is inactive/invalid or SECURITY_AUDIT_BREAK_GLASS is not set to '1'."
    );
  }

  if (audit.stderr.trim()) {
    process.stderr.write(`${audit.stderr}\n`);
  }
  if (audit.stdout.trim()) {
    process.stderr.write(`${audit.stdout}\n`);
  }

  process.exit(audit.status || 1);
}

if (require.main === module) {
  main();
}

module.exports = {
  isValidWaiver,
  isWaiverActive,
  canUseBreakGlass,
};
