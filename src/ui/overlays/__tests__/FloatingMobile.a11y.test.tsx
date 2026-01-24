import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockCloseMenu = jest.fn();
const mockCloseChat = jest.fn();

jest.mock("@/state/slices", () => ({
  useChatPanel: () => ({ isOpen: false, close: mockCloseChat }),
  useMenuPanel: () => ({ isOpen: true, close: mockCloseMenu }),
}));

// Mock useReducedMotion hook
jest.mock("@/hooks", () => ({
  useReducedMotion: () => false,
}));

// Use shared framer-motion mock
jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

import FloatingMobile from "../FloatingMobile";

describe("FloatingMobile Keyboard Accessibility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("ARIA attributes", () => {
    it("has role dialog and aria-modal", () => {
      render(
        <FloatingMobile id="menu">
          <button type="button">Action</button>
        </FloatingMobile>
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute("aria-modal", "true");
    });

    it("has aria-labelledby pointing to dialog title", () => {
      render(
        <FloatingMobile id="menu" title="Navigation Menu">
          <button type="button">Action</button>
        </FloatingMobile>
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-labelledby", "menu-dialog-title");
    });
  });

  describe("Escape key handling", () => {
    it("closes on Escape key press", () => {
      render(
        <FloatingMobile id="menu">
          <button type="button">Action</button>
        </FloatingMobile>
      );

      fireEvent.keyDown(document, { key: "Escape" });

      expect(mockCloseMenu).toHaveBeenCalled();
    });
  });

  describe("Focus management", () => {
    it("focuses first focusable element on render", () => {
      render(
        <FloatingMobile id="menu">
          <button type="button">First Button</button>
          <button type="button">Second Button</button>
        </FloatingMobile>
      );

      const firstButton = screen.getByRole("button", { name: "First Button" });
      expect(document.activeElement).toBe(firstButton);
    });

    it("traps focus within panel - Tab from last goes to first", () => {
      render(
        <FloatingMobile id="menu">
          <button type="button">First</button>
          <button type="button">Last</button>
        </FloatingMobile>
      );

      const firstButton = screen.getByRole("button", { name: "First" });
      const lastButton = screen.getByRole("button", { name: "Last" });

      lastButton.focus();
      fireEvent.keyDown(document, { key: "Tab" });

      expect(document.activeElement).toBe(firstButton);
    });

    it("traps focus within panel - Shift+Tab from first goes to last", () => {
      render(
        <FloatingMobile id="menu">
          <button type="button">First</button>
          <button type="button">Last</button>
        </FloatingMobile>
      );

      const firstButton = screen.getByRole("button", { name: "First" });
      const lastButton = screen.getByRole("button", { name: "Last" });

      firstButton.focus();
      fireEvent.keyDown(document, { key: "Tab", shiftKey: true });

      expect(document.activeElement).toBe(lastButton);
    });
  });
});
