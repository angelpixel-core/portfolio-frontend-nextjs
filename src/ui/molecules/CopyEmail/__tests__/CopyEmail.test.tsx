/**
 * CopyEmail Component Tests
 * Story 5.1: Email Contact Access
 */

import React from "react";
import { render, screen } from "@testing-library/react";

// Mock EmailLink since it uses server-side env vars
jest.mock("../EmailLink", () => {
  return function MockEmailLink() {
    return (
      <a
        id="emailTextId"
        href="mailto:test@example.com"
        className="email_link"
        aria-label="Send email to test@example.com"
      >
        test@example.com
      </a>
    );
  };
});

// Mock CopyButton (direct path import, no barrel)
jest.mock("@/buttons/CopyButton", () => ({
  __esModule: true,
  default: () => (
    <button
      type="button"
      aria-label="Copy email address to clipboard"
      data-testid="copy-button"
    >
      Copy
    </button>
  ),
}));

// Import after mocks
import CopyEmail from "../index";

describe("CopyEmail", () => {
  describe("rendering", () => {
    it("renders email link with visible email address", () => {
      render(<CopyEmail />);

      expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });

    it("renders email link with mailto: href", () => {
      render(<CopyEmail />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "mailto:test@example.com");
    });

    it("renders copy button", () => {
      render(<CopyEmail />);

      expect(screen.getByTestId("copy-button")).toBeInTheDocument();
    });

    it("email link has proper accessible name", () => {
      render(<CopyEmail />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute(
        "aria-label",
        "Send email to test@example.com"
      );
    });
  });

  describe("accessibility", () => {
    it("email link is keyboard focusable", () => {
      render(<CopyEmail />);

      const link = screen.getByRole("link");
      expect(link).not.toHaveAttribute("tabindex", "-1");
    });

    it("copy button has accessible label", () => {
      render(<CopyEmail />);

      const button = screen.getByRole("button", {
        name: "Copy email address to clipboard",
      });
      expect(button).toBeInTheDocument();
    });
  });
});
