import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";

jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

const mockCloseAuthPanel = jest.fn();
const mockLogout = jest.fn();
const mockLoginSuccess = jest.fn();
const mockLoginError = jest.fn();
const mockClearError = jest.fn();
const mockPerformOAuthLogin = jest.fn();

jest.mock("@/state/slices", () => ({
  useAuthPanel: jest.fn(),
}));

jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useReducedMotion: () => false,
}));

jest.mock("@/services/auth", () => ({
  ...jest.requireActual("@/services/auth"),
  performOAuthLogin: (...args: unknown[]) => mockPerformOAuthLogin(...args),
}));

import { useAuthPanel } from "@/state/slices";
import AuthModal from "../AuthModal";

const mockUseAuthPanel = useAuthPanel as jest.Mock;

const defaultUnauthState = {
  isOpen: true,
  isAuthenticated: false,
  user: null,
  error: null,
  closeAuthPanel: mockCloseAuthPanel,
  logout: mockLogout,
  loginSuccess: mockLoginSuccess,
  loginError: mockLoginError,
  clearError: mockClearError,
  openAuthPanel: jest.fn(),
  setAuthPanel: jest.fn(),
  toggleAuthPanel: jest.fn(),
};

const authenticatedState = {
  ...defaultUnauthState,
  isAuthenticated: true,
  user: { email: "user@test.com", name: "Test User" },
};

beforeEach(() => {
  jest.clearAllMocks();
  mockUseAuthPanel.mockReturnValue(defaultUnauthState);
});

describe("AuthModal", () => {
  describe("rendering", () => {
    it("does not render when isOpen is false", () => {
      mockUseAuthPanel.mockReturnValue({
        ...defaultUnauthState,
        isOpen: false,
      });

      const { container } = render(<AuthModal />);
      expect(container.innerHTML).toBe("");
    });

    it("renders unauthenticated view when open and not authenticated", () => {
      render(<AuthModal />);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Welcome back")).toBeInTheDocument();
      // Sign In appears in both tab and submit button
      expect(screen.getAllByText("Sign In")).toHaveLength(2);
      expect(screen.getByText("Sign Up")).toBeInTheDocument();
      expect(screen.getByText("or continue with")).toBeInTheDocument();
    });

    it("renders authenticated view when open and authenticated", () => {
      mockUseAuthPanel.mockReturnValue(authenticatedState);

      render(<AuthModal />);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Welcome back!")).toBeInTheDocument();
      expect(
        screen.getByText("Signed in as user@test.com")
      ).toBeInTheDocument();
      expect(screen.getByText("Sign Out")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has role=dialog and aria-modal=true in unauthenticated view", () => {
      render(<AuthModal />);

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(dialog).toHaveAttribute("aria-labelledby", "auth-dialog-title");
    });

    it("has role=dialog and aria-modal=true in authenticated view", () => {
      mockUseAuthPanel.mockReturnValue(authenticatedState);

      render(<AuthModal />);

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(dialog).toHaveAttribute("aria-labelledby", "auth-dialog-title");
    });

    it("has aria-labelledby linked to title in both views", () => {
      render(<AuthModal />);

      const title = screen.getByText("Welcome back");
      expect(title).toHaveAttribute("id", "auth-dialog-title");
    });

    it("close button has aria-label", () => {
      render(<AuthModal />);

      const closeBtn = screen.getByLabelText("Close dialog");
      expect(closeBtn).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("close button calls closeAuthPanel in unauthenticated view", () => {
      render(<AuthModal />);

      fireEvent.click(screen.getByLabelText("Close dialog"));
      expect(mockCloseAuthPanel).toHaveBeenCalledTimes(1);
    });

    it("close button calls closeAuthPanel in authenticated view", () => {
      mockUseAuthPanel.mockReturnValue(authenticatedState);

      render(<AuthModal />);

      fireEvent.click(screen.getByLabelText("Close dialog"));
      expect(mockCloseAuthPanel).toHaveBeenCalledTimes(1);
    });

    it("clicking backdrop closes the modal", () => {
      render(<AuthModal />);

      const backdrop = screen.getByRole("dialog");
      fireEvent.click(backdrop);
      expect(mockCloseAuthPanel).toHaveBeenCalledTimes(1);
    });

    it("clicking inside panel does not close the modal", () => {
      render(<AuthModal />);

      const title = screen.getByText("Welcome back");
      fireEvent.click(title);
      expect(mockCloseAuthPanel).not.toHaveBeenCalled();
    });

    it("tab switching updates active tab", () => {
      render(<AuthModal />);

      const signUpTab = screen.getByText("Sign Up");
      fireEvent.click(signUpTab);

      expect(signUpTab).toHaveClass("auth-tab--active");
    });

    it("Sign Out button calls logout", () => {
      mockUseAuthPanel.mockReturnValue(authenticatedState);

      render(<AuthModal />);

      fireEvent.click(screen.getByText("Sign Out"));
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it("Escape key calls closeAuthPanel", () => {
      render(<AuthModal />);

      fireEvent.keyDown(document, { key: "Escape" });
      expect(mockCloseAuthPanel).toHaveBeenCalledTimes(1);
    });

    it("Escape key calls closeAuthPanel in authenticated view", () => {
      mockUseAuthPanel.mockReturnValue(authenticatedState);

      render(<AuthModal />);

      fireEvent.keyDown(document, { key: "Escape" });
      expect(mockCloseAuthPanel).toHaveBeenCalledTimes(1);
    });
  });

  describe("OAuth flow", () => {
    it("clicking OAuth button triggers flow and calls loginSuccess on success", async () => {
      mockPerformOAuthLogin.mockResolvedValue({
        success: true,
        user: { email: "john.doe@gmail.com", name: "John Doe" },
      });

      render(<AuthModal />);

      await act(async () => {
        fireEvent.click(screen.getByLabelText("Continue with Google"));
      });

      await waitFor(() => {
        expect(mockClearError).toHaveBeenCalledTimes(1);
        expect(mockPerformOAuthLogin).toHaveBeenCalledWith("google");
        expect(mockLoginSuccess).toHaveBeenCalledWith({
          email: "john.doe@gmail.com",
          name: "John Doe",
        });
        expect(mockCloseAuthPanel).toHaveBeenCalledTimes(1);
      });
    });

    it("clicking OAuth button calls loginError on failure", async () => {
      mockPerformOAuthLogin.mockResolvedValue({
        success: false,
        error: "Unsupported provider",
      });

      render(<AuthModal />);

      await act(async () => {
        fireEvent.click(screen.getByLabelText("Continue with LinkedIn"));
      });

      await waitFor(() => {
        expect(mockClearError).toHaveBeenCalledTimes(1);
        expect(mockPerformOAuthLogin).toHaveBeenCalledWith("linkedin");
        expect(mockLoginError).toHaveBeenCalledWith("Unsupported provider");
        expect(mockCloseAuthPanel).not.toHaveBeenCalled();
      });
    });

    it("OAuth buttons are disabled during loading", async () => {
      let resolveOAuth: (_value: unknown) => void;
      mockPerformOAuthLogin.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveOAuth = resolve;
          })
      );

      render(<AuthModal />);

      // Start the OAuth flow
      await act(async () => {
        fireEvent.click(screen.getByLabelText("Continue with Google"));
      });

      // While loading, buttons should be disabled
      expect(screen.getByLabelText("Continue with Google")).toBeDisabled();
      expect(screen.getByLabelText("Continue with LinkedIn")).toBeDisabled();
      expect(screen.getByLabelText("Continue with Microsoft")).toBeDisabled();

      // Resolve the OAuth flow
      await act(async () => {
        resolveOAuth!({
          success: true,
          user: { email: "john.doe@gmail.com", name: "John Doe" },
        });
      });
    });

    it("OAuth error from exception calls loginError", async () => {
      mockPerformOAuthLogin.mockRejectedValue(new Error("Network error"));

      render(<AuthModal />);

      await act(async () => {
        fireEvent.click(screen.getByLabelText("Continue with Microsoft"));
      });

      await waitFor(() => {
        expect(mockLoginError).toHaveBeenCalledWith(
          "An unexpected error occurred"
        );
      });
    });
  });
});
