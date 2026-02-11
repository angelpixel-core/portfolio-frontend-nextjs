/**
 * CopyButton Component Tests
 * Story 5.1: Email Contact Access
 * Story 5.5: Copy Contact to Clipboard (error handling)
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// Mock the state/slices hook
const mockMarkEmailClipboard = jest.fn();
const mockResetEmailClipboard = jest.fn();
const mockSetClipboardError = jest.fn();
const mockClearClipboardError = jest.fn();
let mockIsCopied = false;
let mockError: string | null = null;

jest.mock("@/state/slices/EmailClipboard/hooks", () => ({
  __esModule: true,
  default: () => ({
    isCopied: mockIsCopied,
    error: mockError,
    markEmailClipboard: mockMarkEmailClipboard,
    resetEmailClipboard: mockResetEmailClipboard,
    setClipboardError: mockSetClipboardError,
    clearClipboardError: mockClearClipboardError,
  }),
}));

// Mock the icons (direct path imports, no barrel)
jest.mock("@/atoms/icons/CopyIcon", () => ({
  __esModule: true,
  default: ({ className }: { className?: string }) => (
    <svg data-testid="copy-icon" className={className} aria-hidden="true" />
  ),
}));

jest.mock("@/atoms/icons/CheckIcon", () => ({
  __esModule: true,
  default: ({ className }: { className?: string }) => (
    <svg data-testid="check-icon" className={className} aria-hidden="true" />
  ),
}));

// Import after mocks
import CopyButton from "../index";

describe("CopyButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsCopied = false;
    mockError = null;

    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });

    // Create mock email element
    const mockEmailElement = document.createElement("a");
    mockEmailElement.id = "emailTextId";
    mockEmailElement.innerText = "test@example.com";
    document.body.appendChild(mockEmailElement);
  });

  afterEach(() => {
    const el = document.getElementById("emailTextId");
    if (el) el.remove();
  });

  describe("rendering", () => {
    it("renders copy button with accessible label", () => {
      render(<CopyButton />);

      const button = screen.getByRole("button", {
        name: "Copy email address to clipboard",
      });
      expect(button).toBeInTheDocument();
    });

    it("renders copy icon by default", () => {
      render(<CopyButton />);

      expect(screen.getByTestId("copy-icon")).toBeInTheDocument();
    });

    it("has type button attribute", () => {
      render(<CopyButton />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
    });
  });

  describe("copy functionality", () => {
    it("copies email to clipboard on click", async () => {
      render(<CopyButton />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
          "test@example.com"
        );
      });
    });

    it("calls markEmailClipboard on successful copy", async () => {
      render(<CopyButton />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockMarkEmailClipboard).toHaveBeenCalled();
      });
    });

    it("does nothing if emailTextId element not found", async () => {
      // Remove the mock element
      const el = document.getElementById("emailTextId");
      if (el) el.remove();

      render(<CopyButton />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    });
  });

  describe("copied state", () => {
    it("shows check icon when copied", () => {
      mockIsCopied = true;
      render(<CopyButton />);

      expect(screen.getByTestId("check-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("copy-icon")).not.toBeInTheDocument();
    });

    it("applies active class when copied", () => {
      mockIsCopied = true;
      render(<CopyButton />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("email_copy-button--active");
    });
  });

  describe("error handling", () => {
    it("sets error state when clipboard fails", async () => {
      (navigator.clipboard.writeText as jest.Mock).mockRejectedValue(
        new Error("Clipboard error")
      );

      render(<CopyButton />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockSetClipboardError).toHaveBeenCalledWith(
          "Unable to copy. Please select and copy manually."
        );
      });
    });

    it("displays error message when error state is set", () => {
      mockError = "Unable to copy. Please select and copy manually.";
      render(<CopyButton />);

      const errorMessage = screen.getByRole("alert");
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent(
        "Unable to copy. Please select and copy manually."
      );
    });

    it("error message is accessible with role alert", () => {
      mockError = "Test error message";
      render(<CopyButton />);

      const errorMessage = screen.getByRole("alert");
      expect(errorMessage).toBeInTheDocument();
    });

    it("does not display error message when no error", () => {
      mockError = null;
      render(<CopyButton />);

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("icons are aria-hidden", () => {
      render(<CopyButton />);

      const icon = screen.getByTestId("copy-icon");
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });

    it("button is keyboard focusable", () => {
      render(<CopyButton />);

      const button = screen.getByRole("button");
      expect(button).not.toHaveAttribute("tabindex", "-1");
    });

    // Native <button> elements automatically support Enter/Space key activation
    // This is browser-provided behavior, verified by:
    // 1. Button is focusable (test above)
    // 2. Button has no tabindex=-1 or disabled attribute
    // 3. Click handler works correctly (tested in copy functionality section)
    it("is a native button element supporting keyboard activation", () => {
      render(<CopyButton />);

      const button = screen.getByRole("button");
      // Verify it's an actual button element (not a div with role="button")
      expect(button.tagName.toLowerCase()).toBe("button");
      // Verify it's not disabled
      expect(button).not.toBeDisabled();
    });
  });
});
