describe("two-factor service helpers", () => {
  const originalEnv = process.env.NEXT_PUBLIC_USE_MOCKS;

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

    global.fetch = jest.fn();

    const {
      getStatus,
      startEnrollment,
      verifyEnrollment,
      disableTwoFactor,
      regenerateRecoveryCodes,
    } = await import("../twoFactor");

    await getStatus();
    await startEnrollment();
    await verifyEnrollment({ code: "123456" });
    await disableTwoFactor({ code: "654321", confirm: true });
    await regenerateRecoveryCodes();

    expect(mockTwoFactorStatus).toHaveBeenCalled();
    expect(mockTwoFactorEnroll).toHaveBeenCalled();
    expect(mockTwoFactorVerify).toHaveBeenCalled();
    expect(mockTwoFactorDisable).toHaveBeenCalled();
    expect(mockTwoFactorRecovery).toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("calls the API when mocks are disabled", async () => {
    process.env.NEXT_PUBLIC_USE_MOCKS = "false";
    jest.dontMock("../mock");

    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ enabled: true }),
      text: async () => "",
    });

    global.fetch = fetchMock as typeof fetch;

    const { getStatus } = await import("../twoFactor");
    const result = await getStatus();

    expect(result).toEqual({ enabled: true });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/2fa/status",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      })
    );
  });

  it("sends payloads for verification requests", async () => {
    process.env.NEXT_PUBLIC_USE_MOCKS = "false";
    jest.dontMock("../mock");

    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ enabled: true }),
      text: async () => "",
    });

    global.fetch = fetchMock as typeof fetch;

    const { verifyEnrollment } = await import("../twoFactor");
    await verifyEnrollment({ code: "999000" });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/2fa/verify",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ code: "999000" }),
      })
    );
  });

  it("throws when the API returns an error", async () => {
    process.env.NEXT_PUBLIC_USE_MOCKS = "false";
    jest.dontMock("../mock");

    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
      text: async () => "Bad request",
    });

    global.fetch = fetchMock as typeof fetch;

    const { disableTwoFactor } = await import("../twoFactor");

    await expect(
      disableTwoFactor({ code: "111222", confirm: true })
    ).rejects.toThrow("Bad request");
  });
});
