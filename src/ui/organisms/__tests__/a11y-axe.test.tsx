import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";

// Extend jest matchers
expect.extend(toHaveNoViolations);

// Mock Redux state hooks
jest.mock("@/state/slices", () => ({
  useMenuPanel: () => ({ isOpen: false, toggle: jest.fn(), close: jest.fn() }),
  useChatPanel: () => ({ isOpen: false, toggle: jest.fn(), close: jest.fn() }),
  useTheme: () => ({ mode: "light", toggleMode: jest.fn() }),
  useEmailClipboard: () => ({
    isCopied: false,
    markEmailClipboard: jest.fn(),
    resetEmailClipboard: jest.fn(),
  }),
}));

// Mock all hooks from @/hooks
jest.mock("@/hooks", () => ({
  useNavigationItems: () => ({
    data: [
      { href: "/", name: "Home" },
      { href: "/projects", name: "Projects" },
    ],
    isLoading: false,
    isError: false,
  }),
  useContactPoints: () => ({
    data: [
      {
        id: "1",
        href: "https://github.com",
        icon: "github",
        provider: "github",
      },
    ],
    isLoading: false,
    isError: false,
  }),
  useJobExperiences: () => ({
    data: [],
    isLoading: false,
    isError: false,
  }),
}));

// Mock academic domain hook (used directly by Academics component)
jest.mock("@/domains/academic", () => ({
  useAcademics: () => ({
    data: [],
    isLoading: false,
    isError: false,
  }),
}));

// Import after mocks
import Experiences from "../Experiences";
import Academics from "../Academics";

describe("Organism Accessibility (jest-axe)", () => {
  describe("Experiences", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<Experiences />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Academics", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<Academics />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
