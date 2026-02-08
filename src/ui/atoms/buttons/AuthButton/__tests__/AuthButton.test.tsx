import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

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

jest.mock("@/state/slices", () => ({
  useAuthPanel: () => mockUseAuthPanel(),
}));

jest.mock("@/services/auth", () => ({
  ...jest.requireActual("@/services/auth"),
  getInitials: jest.requireActual("@/services/auth").getInitials,
}));

jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useReducedMotion: () => false,
}));

import AuthButton from "../index";

describe("AuthButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthPanel.mockReturnValue({
      isOpen: false,
      isAuthenticated: false,
      user: null,
      toggleAuthPanel: mockToggleAuthPanel,
      logout: mockLogout,
    });
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

    it("does not have auth_button--active class when not authenticated", () => {
      render(<AuthButton />);
      expect(screen.getByRole("button")).not.toHaveClass("auth_button--active");
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

    it("has auth_button--active class when authenticated", () => {
      render(<AuthButton />);
      expect(screen.getByRole("button")).toHaveClass("auth_button--active");
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

    it("calls logout from dropdown Sign Out", () => {
      render(<AuthButton />);
      fireEvent.click(screen.getByRole("button"));
      fireEvent.click(screen.getByRole("menuitem", { name: /sign out/i }));
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it("closes dropdown after Sign Out", () => {
      render(<AuthButton />);
      fireEvent.click(screen.getByRole("button"));
      expect(screen.getByRole("menu")).toBeInTheDocument();
      fireEvent.click(screen.getByRole("menuitem", { name: /sign out/i }));
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
});
