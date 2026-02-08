import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useReducedMotion: () => false,
}));

import AuthDropdown from "../AuthDropdown";

describe("AuthDropdown", () => {
  const defaultProps = {
    user: { email: "john@test.com", name: "John Doe" },
    onLogout: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
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

  it("calls onLogout when Sign Out is clicked", () => {
    render(<AuthDropdown {...defaultProps} />);
    fireEvent.click(screen.getByRole("menuitem", { name: /sign out/i }));
    expect(defaultProps.onLogout).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Sign Out is clicked", () => {
    render(<AuthDropdown {...defaultProps} />);
    fireEvent.click(screen.getByRole("menuitem", { name: /sign out/i }));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
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
});
