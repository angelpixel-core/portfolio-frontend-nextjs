import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";

jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

// Mock UserIcon as direct import
jest.mock("@/atoms/icons/UserIcon", () => {
  const MockUserIcon = ({ className }: { className?: string }) => (
    <svg data-testid="user-icon" className={className} />
  );
  return { __esModule: true, default: MockUserIcon };
});

const mockToggleAuthPanel = jest.fn();
const mockLogout = jest.fn();
const mockUseAuthPanel = jest.fn();

jest.mock("@/state/slices/authPanel/hooks", () => ({
  __esModule: true,
  default: () => mockUseAuthPanel(),
}));

jest.mock("@/services/auth/utils", () => ({
  ...jest.requireActual("@/services/auth/utils"),
  getInitials: jest.requireActual("@/services/auth/utils").getInitials,
}));

jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useReducedMotion: () => false,
}));

jest.mock("@/services/auth/oauth", () => ({
  __esModule: true,
  performLogout: jest.fn().mockResolvedValue({ success: true }),
}));

import AuthButton from "../index";

describe("AuthButton", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, NEXT_PUBLIC_OAUTH_ENABLED: "true" };
    mockUseAuthPanel.mockReturnValue({
      isOpen: false,
      isAuthenticated: false,
      user: null,
      toggleAuthPanel: mockToggleAuthPanel,
      logout: mockLogout,
    });
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("Logged out state", () => {
    it("renders UserIcon when not authenticated", () => {
      render(<AuthButton />);
      expect(screen.getByTestId("user-icon")).toBeInTheDocument();
    });

    it("does not show initials when not authenticated", () => {
      render(<AuthButton />);
      expect(screen.queryByTestId("auth-initials")).not.toBeInTheDocument();
    });

    it('has aria-label "Open sign in panel" when closed', () => {
      render(<AuthButton />);
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-label",
        "Open sign in panel"
      );
    });

    it('has aria-label "Close sign in panel" when open', () => {
      mockUseAuthPanel.mockReturnValue({
        isOpen: true,
        isAuthenticated: false,
        user: null,
        toggleAuthPanel: mockToggleAuthPanel,
      });
      render(<AuthButton />);
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-label",
        "Close sign in panel"
      );
    });

    it("calls toggleAuthPanel when clicked (logged out)", () => {
      render(<AuthButton />);
      fireEvent.click(screen.getByRole("button"));
      expect(mockToggleAuthPanel).toHaveBeenCalledTimes(1);
    });

    it("does not have auth__button--active class when not authenticated", () => {
      render(<AuthButton />);
      expect(screen.getByRole("button")).not.toHaveClass(
        "auth__button--active"
      );
    });
  });

  describe("Logged in state", () => {
    beforeEach(() => {
      mockUseAuthPanel.mockReturnValue({
        isOpen: false,
        isAuthenticated: true,
        user: { email: "john@test.com", name: "John Doe" },
        toggleAuthPanel: mockToggleAuthPanel,
        logout: mockLogout,
      });
    });

    it("shows initials instead of UserIcon when authenticated", () => {
      render(<AuthButton />);
      expect(screen.getByTestId("auth-initials")).toBeInTheDocument();
      expect(screen.getByTestId("auth-initials")).toHaveTextContent("JD");
      expect(screen.queryByTestId("user-icon")).not.toBeInTheDocument();
    });

    it("shows single initial when user has no name", () => {
      mockUseAuthPanel.mockReturnValue({
        isOpen: false,
        isAuthenticated: true,
        user: { email: "mary@test.com" },
        toggleAuthPanel: mockToggleAuthPanel,
      });
      render(<AuthButton />);
      expect(screen.getByTestId("auth-initials")).toHaveTextContent("M");
    });

    it("has auth__button--active class when authenticated", () => {
      render(<AuthButton />);
      expect(screen.getByRole("button")).toHaveClass("auth__button--active");
    });

    it('has aria-label "View account (signed in)" when authenticated', () => {
      render(<AuthButton />);
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-label",
        "View account (signed in)"
      );
    });

    it("does NOT call toggleAuthPanel when clicked (logged in)", () => {
      render(<AuthButton />);
      fireEvent.click(screen.getByRole("button"));
      expect(mockToggleAuthPanel).not.toHaveBeenCalled();
    });

    it("shows dropdown when clicked (logged in)", () => {
      render(<AuthButton />);
      fireEvent.click(screen.getByRole("button"));
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("shows user info in dropdown", () => {
      render(<AuthButton />);
      fireEvent.click(screen.getByRole("button"));
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@test.com")).toBeInTheDocument();
    });

    it("calls logout from dropdown Sign Out", async () => {
      render(<AuthButton />);
      fireEvent.click(screen.getByRole("button"));

      await act(async () => {
        fireEvent.click(screen.getByRole("menuitem", { name: /sign out/i }));
      });

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it("closes dropdown after Sign Out", async () => {
      render(<AuthButton />);
      fireEvent.click(screen.getByRole("button"));
      expect(screen.getByRole("menu")).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(screen.getByRole("menuitem", { name: /sign out/i }));
      });

      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("toggles dropdown open/close on repeated clicks", () => {
      render(<AuthButton />);
      fireEvent.click(screen.getByRole("button"));
      expect(screen.getByRole("menu")).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button"));
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("has aria-haspopup when authenticated", () => {
      render(<AuthButton />);
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-haspopup",
        "true"
      );
    });
  });

  describe("Disabled state (OAUTH_ENABLED=false)", () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_OAUTH_ENABLED = "false";
    });

    it("renders as disabled when OAUTH_ENABLED is false", () => {
      render(<AuthButton />);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("has auth__button--disabled class", () => {
      render(<AuthButton />);
      expect(screen.getByRole("button")).toHaveClass("auth__button--disabled");
    });

    it('has aria-label "Sign in (coming soon)"', () => {
      render(<AuthButton />);
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-label",
        "Sign in (coming soon)"
      );
    });

    it("does not have aria-expanded or aria-controls", () => {
      render(<AuthButton />);
      const button = screen.getByRole("button");
      expect(button).not.toHaveAttribute("aria-expanded");
      expect(button).not.toHaveAttribute("aria-controls");
    });

    it("does not call toggleAuthPanel on click", () => {
      render(<AuthButton />);
      fireEvent.click(screen.getByRole("button"));
      expect(mockToggleAuthPanel).not.toHaveBeenCalled();
    });

    it("renders disabled even when env var is absent", () => {
      delete process.env.NEXT_PUBLIC_OAUTH_ENABLED;
      render(<AuthButton />);
      expect(screen.getByRole("button")).toBeDisabled();
    });
  });
});
