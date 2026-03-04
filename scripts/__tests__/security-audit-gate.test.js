const path = require("path");

const {
  isTraceableIssueReference,
  isValidWaiver,
  isWaiverActive,
  canUseBreakGlass,
} = require("../security-audit-gate.cjs");

describe("security audit gate waiver logic", () => {
  const validWaiver = {
    enabled: true,
    issue: "org/repo#123",
    owner: "@platform-devops",
    reason: "Emergency release while remediation is in progress",
    expiresOn: "2099-12-31",
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
