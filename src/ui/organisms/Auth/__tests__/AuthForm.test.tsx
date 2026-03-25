import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

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

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      email: (...args: unknown[]) => mockSignInEmail(...args),
    },
    signUp: {
      email: (...args: unknown[]) => mockSignUpEmail(...args),
    },
    getSession: (...args: unknown[]) => mockGetSession(...args),
  },
}));

import AuthForm from "../Form/AuthForm";

beforeEach(() => {
  jest.clearAllMocks();
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
          callbackURL: window.location.href,
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
          callbackURL: window.location.href,
        });
        expect(mockLoginSuccess).toHaveBeenCalledWith({
          email: "new@test.com",
          name: "New User",
        });
      });
    });
  });
});
