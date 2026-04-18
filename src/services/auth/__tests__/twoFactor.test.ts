describe("two-factor service helpers", () => {
  const originalEnv = process.env.NEXT_PUBLIC_USE_MOCKS;

  const mockGetSession = jest.fn();
  const mockEnable = jest.fn();
  const mockVerifyTotp = jest.fn();
  const mockDisable = jest.fn();
  const mockGenerateBackupCodes = jest.fn();

  jest.mock("@/lib/auth-client", () => ({
    authClient: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
      twoFactor: {
        enable: (...args: unknown[]) => mockEnable(...args),
        verifyTotp: (...args: unknown[]) => mockVerifyTotp(...args),
        disable: (...args: unknown[]) => mockDisable(...args),
        generateBackupCodes: (...args: unknown[]) =>
          mockGenerateBackupCodes(...args),
      },
    },
  }));

  afterEach(() => {
    process.env.NEXT_PUBLIC_USE_MOCKS = originalEnv;
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("uses mock helpers when NEXT_PUBLIC_USE_MOCKS is true", async () => {
    process.env.NEXT_PUBLIC_USE_MOCKS = "true";

    const mockTwoFactorStatus = jest.fn().mockResolvedValue({ enabled: false });
    const mockTwoFactorEnroll = jest.fn().mockResolvedValue({
      otpauthUrl: "mock",
      qrCodeDataUrl: "mock",
      recoveryCodes: [],
    });
    const mockTwoFactorVerify = jest
      .fn()
      .mockResolvedValue({ enabled: true, recoveryCodes: ["code-1"] });
    const mockTwoFactorDisable = jest
      .fn()
      .mockResolvedValue({ enabled: false });
    const mockTwoFactorRecovery = jest
      .fn()
      .mockResolvedValue({ recoveryCodes: ["code-2"] });

    jest.doMock("../mock", () => ({
      mockTwoFactorStatus,
      mockTwoFactorEnroll,
      mockTwoFactorVerify,
      mockTwoFactorDisable,
      mockTwoFactorRecovery,
    }));

    const {
      getStatus,
      startEnrollment,
      verifyEnrollment,
      disableTwoFactor,
      regenerateRecoveryCodes,
    } = await import("../twoFactor");

    await getStatus();
    await startEnrollment({ password: "password123" });
    await verifyEnrollment({ code: "123456" });
    await disableTwoFactor({ password: "password123", confirm: true });
    await regenerateRecoveryCodes({ password: "password123" });

    expect(mockTwoFactorStatus).toHaveBeenCalled();
    expect(mockTwoFactorEnroll).toHaveBeenCalled();
    expect(mockTwoFactorVerify).toHaveBeenCalled();
    expect(mockTwoFactorDisable).toHaveBeenCalled();
    expect(mockTwoFactorRecovery).toHaveBeenCalled();
    expect(mockGetSession).not.toHaveBeenCalled();
  });

  it("calls auth client when mocks are disabled", async () => {
    process.env.NEXT_PUBLIC_USE_MOCKS = "false";
    jest.dontMock("../mock");

    mockGetSession.mockResolvedValue({
      data: { user: { twoFactorEnabled: true } },
    });

    const { getStatus } = await import("../twoFactor");
    const result = await getStatus();

    expect(result).toEqual({ enabled: true });
    expect(mockGetSession).toHaveBeenCalled();
  });

  it("sends payloads for verification requests", async () => {
    process.env.NEXT_PUBLIC_USE_MOCKS = "false";
    jest.dontMock("../mock");

    mockVerifyTotp.mockResolvedValue({ data: { token: "token" }, error: null });

    const { verifyEnrollment } = await import("../twoFactor");
    await verifyEnrollment({ code: "999000" });

    expect(mockVerifyTotp).toHaveBeenCalledWith({ code: "999000" });
  });

  it("throws when the API returns an error", async () => {
    process.env.NEXT_PUBLIC_USE_MOCKS = "false";
    jest.dontMock("../mock");

    mockDisable.mockResolvedValue({
      data: null,
      error: { message: "Bad request" },
    });

    const { disableTwoFactor } = await import("../twoFactor");

    await expect(
      disableTwoFactor({ password: "password123", confirm: true })
    ).rejects.toThrow("Bad request");
  });
});
