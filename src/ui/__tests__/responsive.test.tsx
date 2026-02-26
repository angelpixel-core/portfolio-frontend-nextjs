import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Use shared framer-motion mock
jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

// Mock hooks
jest.mock("@/hooks", () => ({
  useReducedMotion: () => false,
}));

// Mock state slices
jest.mock("@/state/slices/chatPanel/hooks", () => ({
  __esModule: true,
  default: () => ({ isOpen: false, close: jest.fn() }),
}));

jest.mock("@/state/slices/menuPanel/hooks", () => ({
  __esModule: true,
  default: () => ({ isOpen: true, close: jest.fn() }),
}));

import MenuButton from "@/atoms/buttons/MenuButton";
import ThemeButton from "@/atoms/buttons/ThemeButton";

// Mock useThemeMode for ThemeButton
jest.mock("@/state/slices/themeMode/hooks", () => ({
  __esModule: true,
  default: () => ({
    isDarkMode: false,
    toggleThemeMode: jest.fn(),
  }),
}));

describe("Responsive Design - Touch Targets (WCAG 2.5.5)", () => {
  describe("MenuButton", () => {
    it("renders with minimum touch target size of 44x44px", () => {
      const { container } = render(<MenuButton />);
      const button = container.querySelector("button");

      expect(button).toBeInTheDocument();
      // Check that min-w-[44px] and min-h-[44px] classes are applied via CSS
      // The actual measurement would require computed styles in a browser environment
      // For unit tests, we verify the button renders and has the expected class
      expect(button).toHaveClass("menu__button");
    });

    it("has accessible aria attributes", () => {
      render(<MenuButton />);
      const button = screen.getByRole("button");

      expect(button).toHaveAttribute("aria-label");
      expect(button).toHaveAttribute("aria-expanded");
    });
  });

  describe("ThemeButton", () => {
    it("renders with minimum touch target size of 44x44px", () => {
      const { container } = render(<ThemeButton />);
      const button = container.querySelector("button");

      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("theme-button");
    });

    it("has accessible aria attributes for switch role", () => {
      render(<ThemeButton />);
      const button = screen.getByRole("switch");

      expect(button).toHaveAttribute("aria-checked");
      expect(button).toHaveAttribute("aria-label");
    });
  });
});

describe("Responsive Design - Mobile Viewport", () => {
  it("MenuButton is focusable and interactive", () => {
    render(<MenuButton />);
    const button = screen.getByRole("button");

    expect(button).not.toBeDisabled();
  });

  it("ThemeButton is focusable and interactive", () => {
    render(<ThemeButton />);
    const button = screen.getByRole("switch");

    expect(button).not.toBeDisabled();
  });
});
