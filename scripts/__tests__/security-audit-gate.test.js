const {
  MAX_WAIVER_VALIDITY_DAYS,
  isTraceableIssueReference,
  isValidWaiver,
  isWaiverActive,
  canUseBreakGlass,
  executeSecurityGate,
} = require("../security-audit-gate.cjs");

describe("security audit gate waiver logic", () => {
  const validWaiver = {
    enabled: true,
    issue: "org/repo#123",
    owner: "@platform-devops",
    reason: "Emergency release while remediation is in progress",
    expiresOn: "2026-03-08",
  };

  it("accepts waiver with required fields", () => {
    expect(isValidWaiver(validWaiver)).toBe(true);
  });

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

  it("rejects waiver when required fields are missing", () => {
    expect(
      isValidWaiver({
        enabled: true,
        owner: "@platform-devops",
        expiresOn: "2099-12-31",
      })
    ).toBe(false);
  });

  it("rejects waiver when issue reference is not traceable", () => {
    expect(
      isValidWaiver({
        ...validWaiver,
        issue: "SEC-1234",
      })
    ).toBe(false);
  });

  it("treats expired waiver as inactive", () => {
    const now = new Date("2026-03-04T00:00:00.000Z");
    expect(
      isWaiverActive(
        {
          ...validWaiver,
          expiresOn: "2026-03-03",
        },
        now
      )
    ).toBe(false);
  });

  it("rejects waivers beyond maximum validity window", () => {
    const now = new Date("2026-03-04T00:00:00.000Z");
    expect(
      isWaiverActive(
        {
          ...validWaiver,
          expiresOn: "2026-03-20",
        },
        now
      )
    ).toBe(false);
  });

  it("accepts waivers inside maximum validity window", () => {
    const now = new Date("2026-03-04T00:00:00.000Z");
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
    const now = new Date("2026-03-04T00:00:00.000Z");
    expect(
      canUseBreakGlass(validWaiver, now, { SECURITY_AUDIT_BREAK_GLASS: "1" })
    ).toBe(true);
    expect(
      canUseBreakGlass(validWaiver, now, { SECURITY_AUDIT_BREAK_GLASS: "" })
    ).toBe(false);
  });
});

describe("security audit gate full flow", () => {
  const activeWaiver = {
    enabled: true,
    issue: "org/repo#321",
    owner: "@platform-devops",
    reason: "Emergency release while remediation is in progress",
    expiresOn: "2026-03-08",
  };

  it("returns 0 when audit status is successful", () => {
    const logger = { log: jest.fn(), warn: jest.fn(), error: jest.fn() };

    const exitCode = executeSecurityGate({
      auditRunner: () => ({ status: 0, stdout: "", stderr: "" }),
      waiverLoader: () => null,
      logger,
      stderrWriter: jest.fn(),
    });

    expect(exitCode).toBe(0);
    expect(logger.log).toHaveBeenCalledWith(
      "[security-gate] Runtime dependency audit passed (no high/critical vulnerabilities)."
    );
  });

  it("returns 0 when break-glass is active for failing audit", () => {
    const logger = { log: jest.fn(), warn: jest.fn(), error: jest.fn() };

    const exitCode = executeSecurityGate({
      env: { SECURITY_AUDIT_BREAK_GLASS: "1" },
      now: new Date("2026-03-04T00:00:00.000Z"),
      auditRunner: () => ({ status: 1, stdout: "audit", stderr: "" }),
      waiverLoader: () => activeWaiver,
      logger,
      stderrWriter: jest.fn(),
    });

    expect(exitCode).toBe(0);
    expect(logger.warn).toHaveBeenCalledWith(
      "[security-gate] BREAK-GLASS ACTIVE: bypassing failing runtime dependency audit."
    );
  });

  it("returns audit status when failing and break-glass is inactive", () => {
    const logger = { log: jest.fn(), warn: jest.fn(), error: jest.fn() };
    const stderrWriter = jest.fn();

    const exitCode = executeSecurityGate({
      env: { SECURITY_AUDIT_BREAK_GLASS: "" },
      now: new Date("2026-03-04T00:00:00.000Z"),
      auditRunner: () => ({ status: 2, stdout: "audit-json", stderr: "err" }),
      waiverLoader: () => activeWaiver,
      logger,
      stderrWriter,
    });

    expect(exitCode).toBe(2);
    expect(logger.error).toHaveBeenCalledWith(
      "[security-gate] Runtime dependency audit failed."
    );
    expect(stderrWriter).toHaveBeenCalledWith("err\n");
    expect(stderrWriter).toHaveBeenCalledWith("audit-json\n");
  });
});
