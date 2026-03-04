const path = require("path");

const {
  isValidWaiver,
  isWaiverActive,
  canUseBreakGlass,
} = require("../security-audit-gate.cjs");

describe("security audit gate waiver logic", () => {
  const validWaiver = {
    enabled: true,
    issue: "SEC-1234",
    owner: "@platform-devops",
    reason: "Emergency release while remediation is in progress",
    expiresOn: "2099-12-31",
  };

  it("accepts waiver with required fields", () => {
    expect(isValidWaiver(validWaiver)).toBe(true);
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
