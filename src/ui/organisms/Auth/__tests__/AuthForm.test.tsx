import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { getRecaptchaToken } from "@/lib/recaptcha";

jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

const mockLoginSuccess = jest.fn();
const mockLoginError = jest.fn();
const mockClearError = jest.fn();

jest.mock("@/state/slices/authPanel/hooks", () => ({
  __esModule: true,
  default: () => ({
    loginSuccess: mockLoginSuccess,
    loginError: mockLoginError,
    error: null,
    clearError: mockClearError,
  }),
}));

jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useReducedMotion: () => false,
}));

const mockSignInEmail = jest.fn();
const mockSignUpEmail = jest.fn();
const mockGetSession = jest.fn();
const mockVerifyTotp = jest.fn();
const mockVerifyBackupCode = jest.fn();

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      email: (...args: unknown[]) => mockSignInEmail(...args),
    },
    signUp: {
      email: (...args: unknown[]) => mockSignUpEmail(...args),
    },
    getSession: (...args: unknown[]) => mockGetSession(...args),
    twoFactor: {
      verifyTotp: (...args: unknown[]) => mockVerifyTotp(...args),
      verifyBackupCode: (...args: unknown[]) => mockVerifyBackupCode(...args),
    },
  },
}));

jest.mock("@/lib/recaptcha", () => ({
  getRecaptchaToken: jest.fn(),
}));

import AuthForm from "../Form/AuthForm";

const ORIGINAL_TWO_FACTOR_ENV = process.env.NEXT_PUBLIC_2FA_ENABLED;

beforeEach(() => {
  jest.clearAllMocks();
  process.env.NEXT_PUBLIC_2FA_ENABLED = "false";
  (getRecaptchaToken as jest.Mock).mockResolvedValue("token");
});

afterAll(() => {
  if (typeof ORIGINAL_TWO_FACTOR_ENV === "undefined") {
    delete process.env.NEXT_PUBLIC_2FA_ENABLED;
    return;
  }

  process.env.NEXT_PUBLIC_2FA_ENABLED = ORIGINAL_TWO_FACTOR_ENV;
});

describe("AuthForm", () => {
  describe("login mode", () => {
    it("renders email and password fields", () => {
      render(<AuthForm mode="login" />);

      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(screen.queryByLabelText("Name")).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText("Confirm Password")
      ).not.toBeInTheDocument();
    });

    it("shows Sign In submit button", () => {
      render(<AuthForm mode="login" />);

      expect(screen.getByText("Sign In")).toBeInTheDocument();
    });

    it("calls loginSuccess on successful login", async () => {
      mockSignInEmail.mockResolvedValue({
        data: { user: { email: "user@test.com", name: "Test" } },
        error: null,
      });
      mockGetSession.mockResolvedValue({
        data: { user: { email: "user@test.com", name: "Test" } },
      });

      render(<AuthForm mode="login" />);

      fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "user@test.com" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "password123" },
      });
      fireEvent.click(screen.getByText("Sign In"));

      await waitFor(() => {
        expect(mockSignInEmail).toHaveBeenCalledWith({
          email: "user@test.com",
          password: "password123",
          callbackURL: "/",
          recaptchaToken: "token",
          recaptchaAction: "auth_login",
        });
        expect(mockLoginSuccess).toHaveBeenCalledWith({
          email: "user@test.com",
          name: "Test",
        });
      });
    });

    it("calls loginError on failed login", async () => {
      mockSignInEmail.mockResolvedValue({
        data: null,
        error: { message: "Invalid email or password" },
      });
      mockGetSession.mockResolvedValue({ data: null });

      render(<AuthForm mode="login" />);

      fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "wrong@test.com" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "wrong" },
      });
      fireEvent.click(screen.getByText("Sign In"));

      await waitFor(() => {
        expect(mockLoginError).toHaveBeenCalledWith(
          "Invalid email or password"
        );
      });
    });

    it("shows loading state during submit", async () => {
      mockSignInEmail.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      mockGetSession.mockResolvedValue({
        data: { user: { email: "user@test.com", name: "Test" } },
      });

      render(<AuthForm mode="login" />);

      fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "user@test.com" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "password123" },
      });
      fireEvent.click(screen.getByText("Sign In"));

      await waitFor(() => {
        expect(screen.getByText("Signing in...")).toBeInTheDocument();
      });
    });

    it("ignores two-factor challenge when feature is disabled", async () => {
      mockSignInEmail.mockResolvedValue({
        data: {
          twoFactor: {
            requiresTwoFactor: true,
            challenge: { method: "totp" },
          },
        },
        error: null,
      });
      mockVerifyTotp.mockResolvedValue({
        data: { token: "token" },
        error: null,
      });
      mockGetSession.mockResolvedValue({
        data: { user: { email: "user@test.com", name: "Test" } },
      });

      render(<AuthForm mode="login" />);

      fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "user@test.com" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "password123" },
      });
      fireEvent.click(screen.getByText("Sign In"));

      await waitFor(() => {
        expect(
          screen.queryByLabelText("Two-factor code")
        ).not.toBeInTheDocument();
      });

      expect(mockVerifyTotp).not.toHaveBeenCalled();

      await waitFor(() => {
        expect(mockLoginSuccess).toHaveBeenCalledWith({
          email: "user@test.com",
          name: "Test",
        });
      });
    });

    describe("with two-factor feature enabled", () => {
      beforeEach(() => {
        process.env.NEXT_PUBLIC_2FA_ENABLED = "true";
      });

      it("handles two-factor challenge verification", async () => {
        mockSignInEmail.mockResolvedValue({
          data: {
            twoFactor: {
              requiresTwoFactor: true,
              challenge: { method: "totp" },
            },
          },
          error: null,
        });
        mockVerifyTotp.mockResolvedValue({
          data: { token: "token" },
          error: null,
        });
        mockGetSession.mockResolvedValue({
          data: { user: { email: "user@test.com", name: "Test" } },
        });

        render(<AuthForm mode="login" />);

        fireEvent.change(screen.getByLabelText("Email"), {
          target: { value: "user@test.com" },
        });
        fireEvent.change(screen.getByLabelText("Password"), {
          target: { value: "password123" },
        });
        fireEvent.click(screen.getByText("Sign In"));

        expect(
          await screen.findByLabelText("Two-factor code")
        ).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText("Two-factor code"), {
          target: { value: "123456" },
        });
        fireEvent.click(screen.getByText("Verify"));

        await waitFor(() => {
          expect(mockVerifyTotp).toHaveBeenCalledWith({ code: "123456" });
          expect(mockLoginSuccess).toHaveBeenCalledWith({
            email: "user@test.com",
            name: "Test",
          });
        });
      });

      it("shows error when two-factor verification fails", async () => {
        mockSignInEmail.mockResolvedValue({
          data: {
            twoFactor: {
              requiresTwoFactor: true,
              challenge: { method: "totp" },
            },
          },
          error: null,
        });
        mockVerifyTotp.mockResolvedValue({
          data: null,
          error: { message: "Invalid code" },
        });

        render(<AuthForm mode="login" />);

        fireEvent.change(screen.getByLabelText("Email"), {
          target: { value: "user@test.com" },
        });
        fireEvent.change(screen.getByLabelText("Password"), {
          target: { value: "password123" },
        });
        fireEvent.click(screen.getByText("Sign In"));

        expect(
          await screen.findByLabelText("Two-factor code")
        ).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText("Two-factor code"), {
          target: { value: "000000" },
        });
        fireEvent.click(screen.getByText("Verify"));

        await waitFor(() => {
          expect(mockLoginError).toHaveBeenCalledWith("Invalid code");
        });
      });
    });
  });

  describe("signup mode", () => {
    it("renders name, email, password, and confirm password fields", () => {
      render(<AuthForm mode="signup" />);

      expect(screen.getByLabelText("Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    });

    it("shows error when passwords do not match", async () => {
      render(<AuthForm mode="signup" />);

      fireEvent.change(screen.getByLabelText("Name"), {
        target: { value: "Test" },
      });
      fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "test@test.com" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "password123" },
      });
      fireEvent.change(screen.getByLabelText("Confirm Password"), {
        target: { value: "different" },
      });
      fireEvent.click(screen.getByText("Subscribe"));

      await waitFor(() => {
        expect(mockLoginError).toHaveBeenCalledWith("Passwords do not match");
      });
      expect(mockSignUpEmail).not.toHaveBeenCalled();
      expect(getRecaptchaToken).not.toHaveBeenCalled();
    });

    it("calls loginSuccess on successful signup", async () => {
      mockSignUpEmail.mockResolvedValue({
        data: { user: { email: "new@test.com", name: "New User" } },
        error: null,
      });
      mockGetSession.mockResolvedValue({
        data: { user: { email: "new@test.com", name: "New User" } },
      });

      render(<AuthForm mode="signup" />);

      fireEvent.change(screen.getByLabelText("Name"), {
        target: { value: "New User" },
      });
      fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "new@test.com" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "password123" },
      });
      fireEvent.change(screen.getByLabelText("Confirm Password"), {
        target: { value: "password123" },
      });
      fireEvent.click(screen.getByText("Subscribe"));

      await waitFor(() => {
        expect(mockSignUpEmail).toHaveBeenCalledWith({
          name: "New User",
          email: "new@test.com",
          password: "password123",
          callbackURL: "/",
          recaptchaToken: "token",
          recaptchaAction: "auth_signup",
        });
        expect(mockLoginSuccess).toHaveBeenCalledWith({
          email: "new@test.com",
          name: "New User",
        });
      });
    });
  });
});
