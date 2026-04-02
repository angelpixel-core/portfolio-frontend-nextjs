import {
  TwoFactorEnrollResponseSchema,
  TwoFactorStatusSchema,
} from "../schema";
import type { TwoFactorEnrollResponse, TwoFactorStatus } from "../schema";

describe("TwoFactorStatusSchema", () => {
  const validStatus = {
    enabled: true,
    enrolledAt: "2024-01-10T12:30:00.000Z",
    lastVerifiedAt: "2024-01-12T08:15:00.000Z",
  };

  it("validates a valid status payload", () => {
    expect(() => TwoFactorStatusSchema.parse(validStatus)).not.toThrow();
  });

  it("returns typed status data", () => {
    const result: TwoFactorStatus = TwoFactorStatusSchema.parse(validStatus);
    expect(result.enabled).toBe(true);
    expect(result.enrolledAt).toBe("2024-01-10T12:30:00.000Z");
  });

  it("accepts optional timestamps", () => {
    expect(() =>
      TwoFactorStatusSchema.parse({
        enabled: false,
      })
    ).not.toThrow();
  });

  it("rejects missing enabled field", () => {
    expect(() => TwoFactorStatusSchema.parse({})).toThrow();
  });

  it("rejects invalid timestamp types", () => {
    expect(() =>
      TwoFactorStatusSchema.parse({
        enabled: true,
        enrolledAt: 123,
      })
    ).toThrow();
  });
});

describe("TwoFactorEnrollResponseSchema", () => {
  const validResponse = {
    otpauthUrl: "otpauth://totp/Angel?secret=BASE32&issuer=Angel",
    qrCodeDataUrl: "data:image/png;base64,Zm9v",
    recoveryCodes: ["code-1", "code-2", "code-3"],
  };

  it("validates a valid enrollment payload", () => {
    expect(() =>
      TwoFactorEnrollResponseSchema.parse(validResponse)
    ).not.toThrow();
  });

  it("returns typed enrollment data", () => {
    const result: TwoFactorEnrollResponse =
      TwoFactorEnrollResponseSchema.parse(validResponse);
    expect(result.recoveryCodes).toHaveLength(3);
    expect(result.qrCodeDataUrl).toContain("data:image/png");
  });

  it("rejects missing required fields", () => {
    expect(() => TwoFactorEnrollResponseSchema.parse({})).toThrow();
  });

  it("rejects non-string recovery codes", () => {
    expect(() =>
      TwoFactorEnrollResponseSchema.parse({
        ...validResponse,
        recoveryCodes: ["code-1", 2],
      })
    ).toThrow();
  });
});
