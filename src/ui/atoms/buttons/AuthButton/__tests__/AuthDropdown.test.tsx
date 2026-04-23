import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { authClient } from "@/lib/auth-client";

jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useReducedMotion: () => false,
}));

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    signOut: jest.fn(),
  },
}));

import AuthDropdown from "../AuthDropdown";

const mockSignOut = authClient.signOut as jest.Mock;

describe("AuthDropdown", () => {
  const defaultProps = {
    user: { email: "john@test.com", name: "John Doe" },
    onLogout: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSignOut.mockResolvedValue({ ok: true });
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
    const settingsLink = screen.getByRole("menuitem", { name: /settings/i });
    expect(document.activeElement).toBe(settingsLink);
  });

  it("renders Admin link", () => {
    render(<AuthDropdown {...defaultProps} />);
    expect(screen.getByRole("menuitem", { name: /admin/i })).toHaveAttribute(
      "href",
      "/admin"
    );
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
    it("calls signOut when Sign Out is clicked", async () => {
      render(<AuthDropdown {...defaultProps} />);

      await act(async () => {
        fireEvent.click(screen.getByRole("menuitem", { name: /sign out/i }));
      });

      expect(mockSignOut).toHaveBeenCalledWith({});
    });

    it("disables Sign Out button during logout", async () => {
      let resolveLogout!: (_value: unknown) => void;
      mockSignOut.mockReturnValue(
        new Promise((resolve) => {
          resolveLogout = resolve;
        })
      );

      render(<AuthDropdown {...defaultProps} />);
      const button = screen.getByRole("menuitem", { name: /sign out/i });

      await act(async () => {
        fireEvent.click(button);
      });

      expect(button).toBeDisabled();

      await act(async () => {
        resolveLogout({ ok: true });
      });
    });

    it("calls onLogout and onClose on successful logout", async () => {
      mockSignOut.mockResolvedValue({ ok: true });

      render(<AuthDropdown {...defaultProps} />);

      await act(async () => {
        fireEvent.click(screen.getByRole("menuitem", { name: /sign out/i }));
      });

      expect(defaultProps.onLogout).toHaveBeenCalledTimes(1);
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it("shows error when signOut throws", async () => {
      mockSignOut.mockRejectedValue(new Error("Network error"));

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
      mockSignOut
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({ ok: true });

      render(<AuthDropdown {...defaultProps} />);

      await act(async () => {
        fireEvent.click(screen.getByRole("menuitem", { name: /sign out/i }));
      });

      expect(
        screen.getByText("An unexpected error occurred")
      ).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(screen.getByRole("menuitem", { name: /sign out/i }));
      });

      expect(
        screen.queryByText("An unexpected error occurred")
      ).not.toBeInTheDocument();
      expect(defaultProps.onLogout).toHaveBeenCalledTimes(1);
    });
  });
});
