import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock Redux state hooks
const mockMenuToggle = jest.fn();
const mockChatToggle = jest.fn();
const mockMarkEmailClipboard = jest.fn();
const mockResetEmailClipboard = jest.fn();

jest.mock("@/state/slices", () => ({
  useMenuPanel: () => ({ isOpen: false, toggle: mockMenuToggle }),
  useChatPanel: () => ({ isOpen: false, toggle: mockChatToggle }),
  useEmailClipboard: () => ({
    isCopied: false,
    markEmailClipboard: mockMarkEmailClipboard,
    resetEmailClipboard: mockResetEmailClipboard,
  }),
}));

// Mock icons
jest.mock("@/icons", () => ({
  CopyIcon: ({ className }: { className: string }) => (
    <svg data-testid="copy-icon" className={className} />
  ),
  CheckIcon: ({ className }: { className: string }) => (
    <svg data-testid="check-icon" className={className} />
  ),
}));

import MenuButton from "../MenuButton";
import CopyButton from "../CopyButton";

describe("Icon Buttons aria-label Accessibility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("MenuButton", () => {
    it("has aria-label when menu is closed", () => {
      render(<MenuButton />);

      const button = screen.getByRole("button", {
        name: /open navigation menu/i,
      });
      expect(button).toBeInTheDocument();
    });

    it("has aria-label when menu is open", () => {
      // Override mock for this test
      jest.doMock("@/state/slices", () => ({
        useMenuPanel: () => ({ isOpen: true, toggle: mockMenuToggle }),
        useChatPanel: () => ({ isOpen: false, toggle: mockChatToggle }),
        useEmailClipboard: () => ({
          isCopied: false,
          markEmailClipboard: mockMarkEmailClipboard,
          resetEmailClipboard: mockResetEmailClipboard,
        }),
      }));

      render(<MenuButton />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label");
    });

    it("has aria-expanded attribute reflecting open state", () => {
      render(<MenuButton />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("CopyButton", () => {
    it("has aria-label describing its purpose", () => {
      render(<CopyButton />);

      const button = screen.getByRole("button", {
        name: /copy email address to clipboard/i,
      });
      expect(button).toBeInTheDocument();
    });

    it("is accessible via button role", () => {
      render(<CopyButton />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label");
    });
  });
});
