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
const mockClearError = jest.fn();
const mockSignInSocial = jest.fn();

jest.mock("@/state/slices/authPanel/hooks", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useReducedMotion: () => false,
}));

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      social: (...args: unknown[]) => mockSignInSocial(...args),
    },
  },
}));

import useAuthPanel from "@/state/slices/authPanel/hooks";
import AuthModal from "../AuthModal";

const mockUseAuthPanel = useAuthPanel as jest.Mock;

const defaultUnauthState = {
  isOpen: true,
  isAuthenticated: false,
  user: null,
  error: null,
  closeAuthPanel: mockCloseAuthPanel,
  logout: mockLogout,
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
      expect(screen.getAllByText("Sign In")).toHaveLength(2);
      expect(screen.getByText("Sign Up")).toBeInTheDocument();
      expect(screen.getByText("or continue with")).toBeInTheDocument();
    });

    it("does not render when authenticated (dropdown handles that)", () => {
      mockUseAuthPanel.mockReturnValue(authenticatedState);

      const { container } = render(<AuthModal />);
      expect(container.innerHTML).toBe("");
    });
  });

  describe("accessibility", () => {
    it("has role=dialog and aria-modal=true in unauthenticated view", () => {
      render(<AuthModal />);

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(dialog).toHaveAttribute("aria-labelledby", "auth-dialog-title");
    });

    it("does not render dialog when authenticated (handled by AuthButton dropdown)", () => {
      mockUseAuthPanel.mockReturnValue(authenticatedState);

      const { container } = render(<AuthModal />);
      expect(container.innerHTML).toBe("");
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

    it("does not render authenticated view (handled by AuthButton dropdown)", () => {
      mockUseAuthPanel.mockReturnValue(authenticatedState);

      const { container } = render(<AuthModal />);
      expect(container.innerHTML).toBe("");
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

    it("does not show Sign Out in modal (handled by AuthButton dropdown)", () => {
      mockUseAuthPanel.mockReturnValue(authenticatedState);

      const { container } = render(<AuthModal />);
      expect(container.innerHTML).toBe("");
    });

    it("Escape key calls closeAuthPanel", () => {
      render(<AuthModal />);

      fireEvent.keyDown(document, { key: "Escape" });
      expect(mockCloseAuthPanel).toHaveBeenCalledTimes(1);
    });

    it("does not render when authenticated so Escape has no effect", () => {
      mockUseAuthPanel.mockReturnValue(authenticatedState);

      const { container } = render(<AuthModal />);
      expect(container.innerHTML).toBe("");
    });
  });

  describe("OAuth flow", () => {
    it("clicking OAuth button triggers signIn", async () => {
      mockSignInSocial.mockResolvedValue({ data: {} });

      render(<AuthModal />);

      await act(async () => {
        fireEvent.click(screen.getByLabelText("Continue with Google"));
      });

      await waitFor(() => {
        expect(mockClearError).toHaveBeenCalledTimes(1);
        expect(mockSignInSocial).toHaveBeenCalledWith({
          provider: "google",
          callbackURL: "/",
        });
      });
    });

    it("OAuth buttons are disabled during loading", async () => {
      let resolveOAuth: (_value: unknown) => void;
      mockSignInSocial.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveOAuth = resolve;
          })
      );

      render(<AuthModal />);

      await act(async () => {
        fireEvent.click(screen.getByLabelText("Continue with Google"));
      });

      expect(screen.getByLabelText("Continue with Google")).toBeDisabled();
      expect(screen.getByLabelText("Continue with LinkedIn")).toBeDisabled();
      expect(screen.getByLabelText("Continue with Microsoft")).toBeDisabled();

      await act(async () => {
        resolveOAuth!({ data: {} });
      });

      await waitFor(() => {
        expect(
          screen.getByLabelText("Continue with Google")
        ).not.toBeDisabled();
      });
    });
  });
});
