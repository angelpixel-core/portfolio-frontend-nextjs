const LOG_LEVELS = {
  info: 0,
  warn: 1,
  error: 2,
};

function normalizeLogLevel(value) {
  if (typeof value !== "string") return "info";
  const normalized = value.trim().toLowerCase();
  return Object.prototype.hasOwnProperty.call(LOG_LEVELS, normalized)
    ? normalized
    : "info";
}

function normalizeOutputMode(value) {
  if (typeof value !== "string") return "text";
  const normalized = value.trim().toLowerCase();
  return normalized === "json" ? "json" : "text";
}

function shouldLog(level, minLevel) {
  return LOG_LEVELS[level] >= LOG_LEVELS[minLevel];
}

function formatTextResult({ mode, category, status, details }) {
  const safeDetails = details ? ` details="${details}"` : "";
  return `[test-env] mode=${mode} category=${category} status=${status}${safeDetails}`;
}

function formatTextSummary({ mode, result, categories, exit }) {
  const categoryList = Object.keys(categories || {})
    .filter((key) => categories[key]?.status === "fail")
    .join(",");

  return `[test-env] mode=${mode} result=${result} categories=${categoryList || "none"} exit=${exit}`;
}

function createOutput({ mode, env = process.env, stdout, stderr } = {}) {
  const output = normalizeOutputMode(env.TEST_ENV_OUTPUT);
  const logLevel = normalizeLogLevel(env.TEST_ENV_LOG_LEVEL);
  const out = stdout || process.stdout;
  const err = stderr || process.stderr;

  const results = [];

  function writeLine(line, level = "info") {
    if (!shouldLog(level, logLevel)) return;
    const writer = level === "error" ? err : out;
    writer.write(`${line}\n`);
  }

  function writeResult(result) {
    if (output === "json") {
      results.push(result);
      return;
    }

    const level =
      result.status === "fail"
        ? "error"
        : result.status === "skip"
          ? "warn"
          : "info";

    writeLine(formatTextResult({ ...result, mode }), level);
  }

  function writeSummary(summary) {
    if (output === "json") {
      out.write(`${JSON.stringify(summary, null, 2)}\n`);
      return;
    }

    writeLine(formatTextSummary(summary), summary.result === "fail" ? "error" : "info");
  }

  return {
    output,
    logLevel,
    results,
    writeResult,
    writeSummary,
  };
}

module.exports = {
  LOG_LEVELS,
  normalizeLogLevel,
  normalizeOutputMode,
  formatTextResult,
  formatTextSummary,
  createOutput,
};
