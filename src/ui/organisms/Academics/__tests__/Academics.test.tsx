/**
 * Academics Organism Tests
 * Story 3.3: Academic Background
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Use shared framer-motion mock - must be before component imports
jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

// Mock useAcademics hook directly
const mockUseAcademics = jest.fn();
jest.mock("@/domains/academic", () => ({
  useAcademics: () => mockUseAcademics(),
}));

// Mock the History and TransitionerLi HOCs to simplify testing
jest.mock("@/atoms/hocs", () => ({
  History: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="history-container">{children}</div>
  ),
  TransitionerLi: ({ children }: { children: React.ReactNode }) => (
    <li data-testid="transitioner-li">{children}</li>
  ),
}));

import Academics from "../index";
import academicsMock from "@/domains/academic/model/mock";

describe("Academics organism (Story 3.3)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Loading state", () => {
    it("shows loading message while data is loading", () => {
      mockUseAcademics.mockReturnValue({
        data: [],
        isLoading: true,
        isError: false,
      });

      render(<Academics />);

      expect(
        screen.getByRole("heading", { name: /Education/i })
      ).toBeInTheDocument();
      expect(screen.getByText(/Loading education/i)).toBeInTheDocument();
    });
  });

  describe("Error state", () => {
    it("shows error message when fetch fails", () => {
      mockUseAcademics.mockReturnValue({
        data: [],
        isLoading: false,
        isError: true,
      });

      render(<Academics />);

      expect(screen.getByText(/Unable to load education/i)).toBeInTheDocument();
    });
  });

  describe("Success state", () => {
    it("renders all academic entries", () => {
      mockUseAcademics.mockReturnValue({
        data: academicsMock,
        isLoading: false,
        isError: false,
      });

      render(<Academics />);

      expect(
        screen.getByText(/Bachelor Of Science in Information Systems/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Cloud Platform Practitioner/i)
      ).toBeInTheDocument();
    });

    it("renders section with proper heading", () => {
      mockUseAcademics.mockReturnValue({
        data: academicsMock,
        isLoading: false,
        isError: false,
      });

      render(<Academics />);

      const heading = screen.getByRole("heading", {
        level: 2,
        name: /Education/i,
      });
      expect(heading).toBeInTheDocument();
    });

    it("renders section with accessibility attributes", () => {
      mockUseAcademics.mockReturnValue({
        data: academicsMock,
        isLoading: false,
        isError: false,
      });

      const { container } = render(<Academics />);

      const section = container.querySelector("section");
      expect(section).toHaveAttribute("aria-labelledby", "academics-heading");
      expect(section).toHaveAttribute("aria-label", "Educational background");
    });

    it("uses stable keys (academic.id) by rendering correct number of items", () => {
      mockUseAcademics.mockReturnValue({
        data: academicsMock,
        isLoading: false,
        isError: false,
      });

      const { container } = render(<Academics />);

      // If stable keys are used correctly, the list items should render
      const listItems = container.querySelectorAll(
        '[data-testid="transitioner-li"]'
      );
      expect(listItems).toHaveLength(2);
    });

    it("renders time and institution for each entry", () => {
      mockUseAcademics.mockReturnValue({
        data: academicsMock,
        isLoading: false,
        isError: false,
      });

      render(<Academics />);

      // Check time periods are displayed
      expect(screen.getByText(/March 2013 - Dec 2017/)).toBeInTheDocument();
      expect(screen.getByText(/Nov 2020 - Dec 2020/)).toBeInTheDocument();
    });
  });

  describe("Empty state", () => {
    it("shows error message when no academics", () => {
      mockUseAcademics.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
      });

      render(<Academics />);

      expect(screen.getByText(/Unable to load education/i)).toBeInTheDocument();
    });
  });
});
