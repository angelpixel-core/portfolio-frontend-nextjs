import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

const mockCloseAuthPanel = jest.fn();
const mockLogout = jest.fn();

jest.mock("@/state/slices", () => ({
  useAuthPanel: jest.fn(),
}));

jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useReducedMotion: () => false,
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
  loginSuccess: jest.fn(),
  loginError: jest.fn(),
  clearError: jest.fn(),
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
});
