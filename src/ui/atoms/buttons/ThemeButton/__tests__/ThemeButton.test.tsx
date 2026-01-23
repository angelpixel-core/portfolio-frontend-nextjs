import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import themeModeReducer from "@/state/slices/themeMode/slice";
import ThemeButton from "../index";

// Create a mock store for testing
const createTestStore = (initialMode: "light" | "dark" = "light") =>
  configureStore({
    reducer: {
      themeMode: themeModeReducer,
    },
    preloadedState: {
      themeMode: { mode: initialMode },
    },
  });

const renderWithProvider = (
  ui: React.ReactElement,
  initialMode: "light" | "dark" = "light"
) => {
  const store = createTestStore(initialMode);
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  };
};

describe("ThemeButton", () => {
  describe("accessibility", () => {
    it("has role switch for toggle semantics", () => {
      renderWithProvider(<ThemeButton />);
      expect(screen.getByRole("switch")).toBeInTheDocument();
    });

    it("has aria-label describing the toggle action in light mode", () => {
      renderWithProvider(<ThemeButton />, "light");
      const toggle = screen.getByRole("switch");
      expect(toggle).toHaveAttribute("aria-label", "Switch to dark mode");
    });

    it("has aria-label describing the toggle action in dark mode", () => {
      renderWithProvider(<ThemeButton />, "dark");
      const toggle = screen.getByRole("switch");
      expect(toggle).toHaveAttribute("aria-label", "Switch to light mode");
    });

    it("has aria-checked reflecting current state (light = unchecked)", () => {
      renderWithProvider(<ThemeButton />, "light");
      const toggle = screen.getByRole("switch");
      expect(toggle).toHaveAttribute("aria-checked", "false");
    });

    it("has aria-checked reflecting current state (dark = checked)", () => {
      renderWithProvider(<ThemeButton />, "dark");
      const toggle = screen.getByRole("switch");
      expect(toggle).toHaveAttribute("aria-checked", "true");
    });

    it("is focusable", () => {
      renderWithProvider(<ThemeButton />);
      const toggle = screen.getByRole("switch");
      toggle.focus();
      expect(document.activeElement).toBe(toggle);
    });
  });

  describe("functionality", () => {
    it("toggles theme on click", () => {
      const { store } = renderWithProvider(<ThemeButton />, "light");
      const toggle = screen.getByRole("switch");

      fireEvent.click(toggle);

      expect(store.getState().themeMode.mode).toBe("dark");
    });

    it("toggles back on second click", () => {
      const { store } = renderWithProvider(<ThemeButton />, "light");
      const toggle = screen.getByRole("switch");

      fireEvent.click(toggle);
      fireEvent.click(toggle);

      expect(store.getState().themeMode.mode).toBe("light");
    });

    it("updates aria-label after toggle", () => {
      renderWithProvider(<ThemeButton />, "light");
      const toggle = screen.getByRole("switch");

      expect(toggle).toHaveAttribute("aria-label", "Switch to dark mode");

      fireEvent.click(toggle);

      expect(toggle).toHaveAttribute("aria-label", "Switch to light mode");
    });

    it("updates aria-checked after toggle", () => {
      renderWithProvider(<ThemeButton />, "light");
      const toggle = screen.getByRole("switch");

      expect(toggle).toHaveAttribute("aria-checked", "false");

      fireEvent.click(toggle);

      expect(toggle).toHaveAttribute("aria-checked", "true");
    });
  });
});
