/**
 * CopyButton Component Tests
 * Story 5.1: Email Contact Access
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// Mock the state/slices hook
const mockMarkEmailClipboard = jest.fn();
const mockResetEmailClipboard = jest.fn();
let mockIsCopied = false;

jest.mock("@/state/slices", () => ({
  useEmailClipboard: () => ({
    isCopied: mockIsCopied,
    markEmailClipboard: mockMarkEmailClipboard,
    resetEmailClipboard: mockResetEmailClipboard,
  }),
}));

// Mock the icons
jest.mock("@/icons", () => ({
  CopyIcon: ({ className }: { className?: string }) => (
    <svg data-testid="copy-icon" className={className} aria-hidden="true" />
  ),
  CheckIcon: ({ className }: { className?: string }) => (
    <svg data-testid="check-icon" className={className} aria-hidden="true" />
  ),
}));

// Import after mocks
import CopyButton from "../index";

describe("CopyButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsCopied = false;

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
    it("logs error when clipboard fails", async () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      (navigator.clipboard.writeText as jest.Mock).mockRejectedValue(
        new Error("Clipboard error")
      );

      render(<CopyButton />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          "Failed to copy to clipboard:",
          expect.any(Error)
        );
      });

      consoleSpy.mockRestore();
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
  });
});
