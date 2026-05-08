import {
  getResumeRequestLinkState,
  hashResumeRequestToken,
} from "@/services/resumeRequest/publicLink";

describe("resume request public link helpers", () => {
  it("computes link state precedence correctly", () => {
    const now = new Date("2026-05-07T12:00:00.000Z");

    expect(
      getResumeRequestLinkState(
        {
          usedAt: new Date("2026-05-07T11:59:00.000Z"),
          revokedAt: null,
          expiresAt: new Date("2026-05-08T00:00:00.000Z"),
        },
        now
      )
    ).toBe("used");

    expect(
      getResumeRequestLinkState(
        {
          usedAt: null,
          revokedAt: new Date("2026-05-07T11:59:00.000Z"),
          expiresAt: new Date("2026-05-08T00:00:00.000Z"),
        },
        now
      )
    ).toBe("revoked");

    expect(
      getResumeRequestLinkState(
        {
          usedAt: null,
          revokedAt: null,
          expiresAt: new Date("2026-05-07T11:59:00.000Z"),
        },
        now
      )
    ).toBe("expired");

    expect(
      getResumeRequestLinkState(
        {
          usedAt: null,
          revokedAt: null,
          expiresAt: new Date("2026-05-08T00:00:00.000Z"),
        },
        now
      )
    ).toBe("active");
  });

  it("hashes token deterministically", () => {
    const token = "resume-token-123";
    expect(hashResumeRequestToken(token)).toBe(hashResumeRequestToken(token));
    expect(hashResumeRequestToken(token)).not.toBe(
      hashResumeRequestToken("resume-token-xyz")
    );
  });
});
