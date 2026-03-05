const {
  MAX_WAIVER_VALIDITY_DAYS,
  isTraceableIssueReference,
  isValidWaiver,
  isWaiverActive,
  canUseBreakGlass,
  collectSkippedTestsFromReport,
  executeSkipBudgetGate,
} = require("../skip-budget-gate.cjs");

describe("skip budget gate waiver logic", () => {
  const validWaiver = {
    enabled: true,
    issue: "org/repo#123",
    owner: "@qa-lead",
    reason: "Temporary waiver while deterministic fixture is in progress",
    expiresOn: "2026-03-12",
    baselineMax: 5,
    allowedSkips: [
      {
        enabled: true,
        match: "e2e/contact.spec.ts",
        issue: "org/repo#456",
        owner: "@qa-lead",
        reason: "Calendly optional data path",
        expiresOn: "2026-03-12",
      },
    ],
  };

  it("accepts traceable issue references", () => {
    expect(
      isTraceableIssueReference("https://github.com/org/repo/issues/123")
    ).toBe(true);
    expect(isTraceableIssueReference("org/repo#42")).toBe(true);
  });

  it("rejects non-traceable issue references", () => {
    expect(isTraceableIssueReference("SEC-1234")).toBe(false);
    expect(isTraceableIssueReference("repo#0")).toBe(false);
    expect(isTraceableIssueReference("")).toBe(false);
  });

  it("accepts waiver with required fields", () => {
    expect(isValidWaiver(validWaiver)).toBe(true);
  });

  it("rejects waiver when required fields are missing", () => {
    expect(
      isValidWaiver({
        enabled: true,
        owner: "@qa-lead",
        expiresOn: "2026-03-12",
        baselineMax: 5,
      })
    ).toBe(false);
  });

  it("treats expired waiver as inactive", () => {
    const now = new Date("2026-03-13T00:00:00.000Z");
    expect(isWaiverActive(validWaiver, now)).toBe(false);
  });

  it("rejects waivers beyond maximum validity window", () => {
    const now = new Date("2026-03-05T00:00:00.000Z");
    expect(
      isWaiverActive(
        {
          ...validWaiver,
          expiresOn: "2026-04-30",
        },
        now
      )
    ).toBe(false);
  });

  it("accepts waivers inside maximum validity window", () => {
    const now = new Date("2026-03-05T00:00:00.000Z");
    const expiresDate = new Date(
      now.getTime() + (MAX_WAIVER_VALIDITY_DAYS - 1) * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .slice(0, 10);

    expect(
      isWaiverActive(
        {
          ...validWaiver,
          expiresOn: expiresDate,
        },
        now
      )
    ).toBe(true);
  });

  it("requires break-glass env flag in addition to active waiver", () => {
    const now = new Date("2026-03-06T00:00:00.000Z");
    expect(
      canUseBreakGlass(validWaiver, now, { E2E_SKIP_BREAK_GLASS: "1" })
    ).toBe(true);
    expect(
      canUseBreakGlass(validWaiver, now, { E2E_SKIP_BREAK_GLASS: "" })
    ).toBe(false);
  });
});

describe("skip budget gate report parsing", () => {
  it("collects skipped tests from expectedStatus and result status", () => {
    const report = {
      suites: [
        {
          title: "",
          suites: [],
          specs: [
            {
              file: "e2e/contact.spec.ts",
              title: "Calendly button is visible",
              tests: [
                {
                  title: "Calendly button is visible",
                  expectedStatus: "skipped",
                  results: [],
                },
              ],
            },
            {
              file: "footer-consistency.spec.ts",
              title: "dark theme hover",
              tests: [
                {
                  title: "dark theme hover",
                  expectedStatus: "passed",
                  results: [{ status: "skipped" }],
                },
              ],
            },
            {
              file: "flaky-network.spec.ts",
              title: "infra interruption",
              tests: [
                {
                  title: "infra interruption",
                  expectedStatus: "passed",
                  results: [{ status: "interrupted" }],
                },
              ],
            },
          ],
        },
      ],
    };

    const skipped = collectSkippedTestsFromReport(report);
    expect(skipped).toHaveLength(2);
    expect(skipped[0].id).toContain("e2e/contact.spec.ts");
    expect(skipped[1].id).toContain("e2e/footer-consistency.spec.ts");
  });
});

describe("skip budget gate full flow", () => {
  const baseReport = {
    stats: { skipped: 2 },
    suites: [
      {
        title: "",
        suites: [],
        specs: [
          {
            file: "e2e/contact.spec.ts",
            title: "Calendly button is visible",
            tests: [
              {
                title: "Calendly button is visible",
                expectedStatus: "skipped",
                results: [],
              },
            ],
          },
          {
            file: "e2e/reduced-motion.spec.ts",
            title: "AC6",
            tests: [
              {
                title: "AC6",
                expectedStatus: "skipped",
                results: [],
              },
            ],
          },
        ],
      },
    ],
  };

  const activeWaiver = {
    enabled: true,
    issue: "org/repo#321",
    owner: "@platform-devops",
    reason: "Emergency release while skip-policy migration is in progress",
    expiresOn: "2026-03-12",
    baselineMax: 2,
    allowedSkips: [
      {
        enabled: true,
        match: "e2e/contact.spec.ts",
        issue: "org/repo#111",
        owner: "@qa-lead",
        reason: "Calendly optional",
        expiresOn: "2026-03-12",
      },
      {
        enabled: true,
        match: "e2e/reduced-motion.spec.ts",
        issue: "org/repo#112",
        owner: "@qa-lead",
        reason: "Slider optional",
        expiresOn: "2026-03-12",
      },
    ],
  };

  it("returns 0 when skip budget and allowed list are satisfied", () => {
    const logger = { log: jest.fn(), warn: jest.fn(), error: jest.fn() };

    const exitCode = executeSkipBudgetGate({
      env: { E2E_SKIP_BUDGET_MAX: "2" },
      now: new Date("2026-03-06T00:00:00.000Z"),
      reportLoader: () => baseReport,
      waiverLoader: () => activeWaiver,
      logger,
      stderrWriter: jest.fn(),
    });

    expect(exitCode).toBe(0);
  });

  it("fails when budget is exceeded", () => {
    const logger = { log: jest.fn(), warn: jest.fn(), error: jest.fn() };
    const stderrWriter = jest.fn();

    const exitCode = executeSkipBudgetGate({
      env: { E2E_SKIP_BUDGET_MAX: "1" },
      now: new Date("2026-03-05T00:00:00.000Z"),
      reportLoader: () => baseReport,
      waiverLoader: () => activeWaiver,
      logger,
      stderrWriter,
    });

    expect(exitCode).toBe(1);
    expect(logger.error).toHaveBeenCalled();
    expect(stderrWriter).toHaveBeenCalled();
  });

  it("fails when an unexpected skipped test appears", () => {
    const logger = { log: jest.fn(), warn: jest.fn(), error: jest.fn() };
    const stderrWriter = jest.fn();

    const report = {
      ...baseReport,
      stats: { skipped: 3 },
      suites: [
        ...baseReport.suites,
        {
          title: "",
          suites: [],
          specs: [
            {
              file: "e2e/unknown.spec.ts",
              title: "new skip",
              tests: [
                {
                  title: "new skip",
                  expectedStatus: "skipped",
                  results: [],
                },
              ],
            },
          ],
        },
      ],
    };

    const exitCode = executeSkipBudgetGate({
      env: { E2E_SKIP_BUDGET_MAX: "3" },
      now: new Date("2026-03-05T00:00:00.000Z"),
      reportLoader: () => report,
      waiverLoader: () => activeWaiver,
      logger,
      stderrWriter,
    });

    expect(exitCode).toBe(1);
    expect(logger.error).toHaveBeenCalled();
  });

  it("returns 0 when break-glass is active for a failing policy", () => {
    const logger = { log: jest.fn(), warn: jest.fn(), error: jest.fn() };

    const exitCode = executeSkipBudgetGate({
      env: { E2E_SKIP_BUDGET_MAX: "1", E2E_SKIP_BREAK_GLASS: "1" },
      now: new Date("2026-03-06T00:00:00.000Z"),
      reportLoader: () => baseReport,
      waiverLoader: () => activeWaiver,
      logger,
      stderrWriter: jest.fn(),
    });

    expect(exitCode).toBe(0);
    expect(logger.warn).toHaveBeenCalled();
  });
});
