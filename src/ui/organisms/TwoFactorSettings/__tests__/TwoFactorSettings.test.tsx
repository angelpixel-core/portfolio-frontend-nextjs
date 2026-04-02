import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TwoFactorSettings from "../index";

const mockGetStatus = jest.fn();
const mockStartEnrollment = jest.fn();
const mockVerifyEnrollment = jest.fn();
const mockDisableTwoFactor = jest.fn();
const mockRegenerateRecoveryCodes = jest.fn();

jest.mock("@/services/auth/twoFactor", () => ({
  getStatus: (...args: unknown[]) => mockGetStatus(...args),
  startEnrollment: (...args: unknown[]) => mockStartEnrollment(...args),
  verifyEnrollment: (...args: unknown[]) => mockVerifyEnrollment(...args),
  disableTwoFactor: (...args: unknown[]) => mockDisableTwoFactor(...args),
  regenerateRecoveryCodes: (...args: unknown[]) =>
    mockRegenerateRecoveryCodes(...args),
}));

describe("TwoFactorSettings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows enabled status details", async () => {
    mockGetStatus.mockResolvedValueOnce({
      enabled: true,
      enrolledAt: "2024-01-01T10:00:00Z",
      lastVerifiedAt: "2024-01-02T10:00:00Z",
    });

    render(<TwoFactorSettings />);

    expect(await screen.findByText("Enabled")).toBeInTheDocument();
    expect(screen.getByText(/Enrolled:/i)).toBeInTheDocument();
    expect(screen.getByText(/Last verified:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Disable 2FA" })).toBeDisabled();
  });

  it("completes enrollment and shows recovery codes", async () => {
    mockGetStatus
      .mockResolvedValueOnce({ enabled: false })
      .mockResolvedValueOnce({
        enabled: true,
        enrolledAt: "2024-01-01T10:00:00Z",
        lastVerifiedAt: "2024-01-02T10:00:00Z",
      });
    mockStartEnrollment.mockResolvedValueOnce({
      otpauthUrl: "otpauth://test",
      qrCodeDataUrl: "data:image/png;base64,qr",
      recoveryCodes: [],
      secret: "SEED-123",
    });
    mockVerifyEnrollment.mockResolvedValueOnce({
      enabled: true,
      enrolledAt: "2024-01-01T10:00:00Z",
      lastVerifiedAt: "2024-01-02T10:00:00Z",
      recoveryCodes: ["code-1", "code-2"],
    });

    render(<TwoFactorSettings />);

    const startButton = await screen.findByRole("button", {
      name: "Start enrollment",
    });
    fireEvent.change(screen.getByLabelText("Account password"), {
      target: { value: "password123" },
    });
    fireEvent.click(startButton);

    expect(await screen.findByAltText("2FA QR code")).toBeInTheDocument();
    expect(screen.getByText("SEED-123")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Verification code"), {
      target: { value: "654321" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Verify and enable" }));

    expect(await screen.findByTestId("recovery-codes")).toBeInTheDocument();
    expect(mockVerifyEnrollment).toHaveBeenCalledWith({ code: "654321" });
    expect(mockStartEnrollment).toHaveBeenCalledWith({
      password: "password123",
    });
    expect(mockGetStatus).toHaveBeenCalledTimes(2);
  });

  it("disables two-factor after confirmation", async () => {
    mockGetStatus
      .mockResolvedValueOnce({ enabled: true })
      .mockResolvedValueOnce({ enabled: false });
    mockDisableTwoFactor.mockResolvedValueOnce({ enabled: false });

    render(<TwoFactorSettings />);

    const disableButton = await screen.findByRole("button", {
      name: "Disable 2FA",
    });

    fireEvent.change(screen.getByLabelText("Account password to disable"), {
      target: { value: "password123" },
    });

    expect(disableButton).toBeDisabled();

    fireEvent.click(screen.getByRole("checkbox"));

    expect(disableButton).toBeEnabled();

    fireEvent.click(disableButton);

    await waitFor(() => {
        expect(mockDisableTwoFactor).toHaveBeenCalledWith({
          password: "password123",
          confirm: true,
        });
      });

    expect(mockGetStatus).toHaveBeenCalledTimes(2);
  });

  it("regenerates recovery codes", async () => {
    mockGetStatus.mockResolvedValueOnce({ enabled: true });
    mockRegenerateRecoveryCodes.mockResolvedValueOnce({
      recoveryCodes: ["code-a", "code-b"],
    });

    render(<TwoFactorSettings />);

    const regenButton = await screen.findByRole("button", {
      name: "Regenerate recovery codes",
    });
    fireEvent.change(screen.getByLabelText("Password to regenerate"), {
      target: { value: "password123" },
    });
    fireEvent.click(regenButton);

    expect(await screen.findByTestId("recovery-codes")).toBeInTheDocument();
    expect(mockRegenerateRecoveryCodes).toHaveBeenCalled();
  });
});
