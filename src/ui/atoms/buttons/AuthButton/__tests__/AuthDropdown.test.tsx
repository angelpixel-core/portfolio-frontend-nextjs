import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { performLogout } from "@/services/auth/oauth";

jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useReducedMotion: () => false,
}));

jest.mock("@/services/auth/oauth", () => ({
  __esModule: true,
  performLogout: jest.fn(),
}));

import AuthDropdown from "../AuthDropdown";

const mockPerformLogout = performLogout as jest.Mock;

describe("AuthDropdown", () => {
  const defaultProps = {
    user: { email: "john@test.com", name: "John Doe" },
    onLogout: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockPerformLogout.mockResolvedValue({ success: true });
  });

  it("renders user name and email", () => {
    render(<AuthDropdown {...defaultProps} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@test.com")).toBeInTheDocument();
  });

  it("renders email as heading when no name provided", () => {
    render(
      <AuthDropdown {...defaultProps} user={{ email: "john@test.com" }} />
    );
    expect(screen.getByText("john@test.com")).toBeInTheDocument();
  });

  it("renders Sign Out button", () => {
    render(<AuthDropdown {...defaultProps} />);
    expect(
      screen.getByRole("menuitem", { name: /sign out/i })
    ).toBeInTheDocument();
  });

  it('has role="menu" on the container', () => {
    render(<AuthDropdown {...defaultProps} />);
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("focuses the first menuitem on mount", () => {
    render(<AuthDropdown {...defaultProps} />);
    const signOutButton = screen.getByRole("menuitem", { name: /sign out/i });
    expect(document.activeElement).toBe(signOutButton);
  });

  it("closes on Escape key", () => {
    render(<AuthDropdown {...defaultProps} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on click outside", () => {
    const { container } = render(
      <div>
        <div data-testid="outside">outside</div>
        <AuthDropdown {...defaultProps} />
      </div>
    );
    fireEvent.mouseDown(container.querySelector('[data-testid="outside"]')!);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("does NOT close when clicking the trigger button", () => {
    const triggerRef = React.createRef<HTMLButtonElement>();
    const { container } = render(
      <div>
        <button ref={triggerRef} data-testid="trigger">
          Trigger
        </button>
        <AuthDropdown {...defaultProps} triggerRef={triggerRef} />
      </div>
    );
    fireEvent.mouseDown(container.querySelector('[data-testid="trigger"]')!);
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  describe("async logout flow", () => {
    it("calls performLogout when Sign Out is clicked", async () => {
      render(<AuthDropdown {...defaultProps} />);

      await act(async () => {
        fireEvent.click(screen.getByRole("menuitem", { name: /sign out/i }));
      });

      expect(mockPerformLogout).toHaveBeenCalledTimes(1);
    });

    it("disables Sign Out button during logout", async () => {
      let resolveLogout!: (_value: { success: boolean }) => void;
      mockPerformLogout.mockReturnValue(
        new Promise((resolve) => {
          resolveLogout = resolve;
        })
      );

      render(<AuthDropdown {...defaultProps} />);
      const button = screen.getByRole("menuitem", { name: /sign out/i });

      // Click to start logout
      await act(async () => {
        fireEvent.click(button);
      });

      // Button should be disabled while waiting
      expect(button).toBeDisabled();

      // Resolve the logout
      await act(async () => {
        resolveLogout({ success: true });
      });
    });

    it("calls onLogout and onClose on successful logout", async () => {
      mockPerformLogout.mockResolvedValue({ success: true });

      render(<AuthDropdown {...defaultProps} />);

      await act(async () => {
        fireEvent.click(screen.getByRole("menuitem", { name: /sign out/i }));
      });

      expect(defaultProps.onLogout).toHaveBeenCalledTimes(1);
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it("does NOT call onLogout on failed logout and shows error", async () => {
      mockPerformLogout.mockResolvedValue({
        success: false,
        error: "Logout failed",
      });

      render(<AuthDropdown {...defaultProps} />);

      await act(async () => {
        fireEvent.click(screen.getByRole("menuitem", { name: /sign out/i }));
      });

      expect(defaultProps.onLogout).not.toHaveBeenCalled();
      expect(defaultProps.onClose).not.toHaveBeenCalled();
      expect(screen.getByText("Logout failed")).toBeInTheDocument();
    });

    it("re-enables button and shows error when performLogout throws", async () => {
      mockPerformLogout.mockRejectedValue(new Error("Network error"));

      render(<AuthDropdown {...defaultProps} />);
      const button = screen.getByRole("menuitem", { name: /sign out/i });

      await act(async () => {
        fireEvent.click(button);
      });

      expect(button).not.toBeDisabled();
      expect(defaultProps.onLogout).not.toHaveBeenCalled();
      expect(defaultProps.onClose).not.toHaveBeenCalled();
      expect(
        screen.getByText("An unexpected error occurred")
      ).toBeInTheDocument();
    });

    it("clears error on next logout attempt", async () => {
      mockPerformLogout
        .mockResolvedValueOnce({ success: false, error: "Logout failed" })
        .mockResolvedValueOnce({ success: true });

      render(<AuthDropdown {...defaultProps} />);

      // First attempt — fails
      await act(async () => {
        fireEvent.click(screen.getByRole("menuitem", { name: /sign out/i }));
      });

      expect(screen.getByText("Logout failed")).toBeInTheDocument();

      // Second attempt — succeeds
      await act(async () => {
        fireEvent.click(screen.getByRole("menuitem", { name: /sign out/i }));
      });

      expect(screen.queryByText("Logout failed")).not.toBeInTheDocument();
      expect(defaultProps.onLogout).toHaveBeenCalledTimes(1);
    });
  });
});
