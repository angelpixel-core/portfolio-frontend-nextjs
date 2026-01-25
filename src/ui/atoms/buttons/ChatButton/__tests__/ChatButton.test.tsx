/**
 * ChatButton Component Tests
 * Story 5.4: Chat Panel Interaction
 * TDD: Tests written BEFORE implementation
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

// Import chatPanel reducer for store
import { chatPanelReducer } from "@/state/slices/chatPanel";

// Import component after mocks
import ChatButton from "../index";

// Helper to create a test store
const createTestStore = (initialChatPanelState = { isOpen: false }) => {
  return configureStore({
    reducer: {
      chatPanel: chatPanelReducer,
    },
    preloadedState: {
      chatPanel: initialChatPanelState,
    },
  });
};

// Helper to render with Redux provider
const renderWithRedux = (
  ui: React.ReactElement,
  { store = createTestStore() } = {}
) => {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  };
};

describe("ChatButton", () => {
  describe("rendering", () => {
    it("renders a button element", () => {
      renderWithRedux(<ChatButton />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("displays 'Say Hello!' text when panel is closed", () => {
      const store = createTestStore({ isOpen: false });
      renderWithRedux(<ChatButton />, { store });

      expect(screen.getByText(/say hello/i)).toBeInTheDocument();
    });

    it("displays 'Close' text when panel is open", () => {
      const store = createTestStore({ isOpen: true });
      renderWithRedux(<ChatButton />, { store });

      expect(screen.getByText(/close|cerrar/i)).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has aria-label when panel is closed", () => {
      const store = createTestStore({ isOpen: false });
      renderWithRedux(<ChatButton />, { store });

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Open chat panel");
    });

    it("has aria-label when panel is open", () => {
      const store = createTestStore({ isOpen: true });
      renderWithRedux(<ChatButton />, { store });

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Close chat panel");
    });

    it("has aria-expanded=false when panel is closed", () => {
      const store = createTestStore({ isOpen: false });
      renderWithRedux(<ChatButton />, { store });

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-expanded", "false");
    });

    it("has aria-expanded=true when panel is open", () => {
      const store = createTestStore({ isOpen: true });
      renderWithRedux(<ChatButton />, { store });

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-expanded", "true");
    });

    it("has aria-controls pointing to chat panel", () => {
      renderWithRedux(<ChatButton />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-controls", "chatPanelFloating");
    });
  });

  describe("interaction", () => {
    it("toggles panel state when clicked", () => {
      const store = createTestStore({ isOpen: false });
      renderWithRedux(<ChatButton />, { store });

      const button = screen.getByRole("button");

      // Initially closed
      expect(button).toHaveAttribute("aria-expanded", "false");

      // Click to open
      fireEvent.click(button);
      expect(button).toHaveAttribute("aria-expanded", "true");

      // Click to close
      fireEvent.click(button);
      expect(button).toHaveAttribute("aria-expanded", "false");
    });

    it("responds to Enter key (native button behavior)", () => {
      const store = createTestStore({ isOpen: false });
      renderWithRedux(<ChatButton />, { store });

      const button = screen.getByRole("button");
      button.focus();

      // Native buttons trigger click on Enter/Space - simulate with click
      fireEvent.click(button);

      expect(button).toHaveAttribute("aria-expanded", "true");
    });

    it("is keyboard focusable", () => {
      const store = createTestStore({ isOpen: false });
      renderWithRedux(<ChatButton />, { store });

      const button = screen.getByRole("button");

      // Button should be focusable (no tabindex=-1)
      expect(button).not.toHaveAttribute("tabindex", "-1");
    });
  });

  describe("styling", () => {
    it("has chat_button class", () => {
      renderWithRedux(<ChatButton />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("chat_button");
    });

    it("has chat_button--active class when panel is open", () => {
      const store = createTestStore({ isOpen: true });
      renderWithRedux(<ChatButton />, { store });

      const button = screen.getByRole("button");
      expect(button).toHaveClass("chat_button--active");
    });

    it("does not have chat_button--active class when panel is closed", () => {
      const store = createTestStore({ isOpen: false });
      renderWithRedux(<ChatButton />, { store });

      const button = screen.getByRole("button");
      expect(button).not.toHaveClass("chat_button--active");
    });
  });
});
