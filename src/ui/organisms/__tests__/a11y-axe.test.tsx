import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";

// Extend jest matchers
expect.extend(toHaveNoViolations);

// Mock framer-motion
jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

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
  useReducedMotion: () => false,
}));

// Mock academic domain hook (used directly by Academics component)
// Story 3.4: Must include data or component returns null (graceful empty state)
jest.mock("@/domains/academic", () => ({
  useAcademics: () => ({
    data: [
      {
        id: 1,
        degree: "Bachelor Of Science",
        institution: "University",
        start_date: "2013",
        end_date: "2017",
      },
    ],
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
