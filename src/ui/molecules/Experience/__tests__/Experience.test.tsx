/**
 * Experience Component Tests
 * Story 3.1: Work History Timeline
 * Story 3.2: Role Details & Responsibilities
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// Use shared framer-motion mock - must be before component imports
jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

// Mock useReducedMotion from hooks
jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useReducedMotion: () => false,
}));

// Mock the TransitionerLi HOC to simplify testing
jest.mock("@/atoms/hocs", () => ({
  TransitionerLi: ({ children }: { children: React.ReactNode }) => (
    <li data-testid="transitioner-li">{children}</li>
  ),
}));

import Experience from "../index";
import type { JobExperience } from "@/domains/job-experience";

describe("Experience molecule (Story 3.1)", () => {
  const baseProps: Pick<
    JobExperience,
    "id" | "position" | "company" | "companyLink" | "time" | "address" | "work"
  > = {
    id: 1,
    position: "FullStack Engineer",
    company: "Compass",
    companyLink: "https://compass.com",
    time: "Dec 2021 - Aug 2022",
    address: "New York, United States",
    work: [
      {
        description: "Code maintenance and enhancement",
        tags: ["code maintenance", "enhancement"],
      },
    ],
  };

  describe("Rendering", () => {
    it("renders position title", () => {
      render(<Experience {...baseProps} />);

      expect(
        screen.getByRole("heading", { level: 3, name: /FullStack Engineer/i })
      ).toBeInTheDocument();
    });

    it("renders company name with @ prefix", () => {
      render(<Experience {...baseProps} />);

      expect(screen.getByText(/@Compass/i)).toBeInTheDocument();
    });

    it("renders time period", () => {
      render(<Experience {...baseProps} />);

      expect(screen.getByText(/Dec 2021 - Aug 2022/i)).toBeInTheDocument();
    });

    it("renders address", () => {
      render(<Experience {...baseProps} />);

      expect(screen.getByText(/New York, United States/i)).toBeInTheDocument();
    });
  });

  describe("Company link", () => {
    it("renders as link with correct href", () => {
      render(<Experience {...baseProps} />);

      const link = screen.getByRole("link", { name: /@Compass/i });
      expect(link).toHaveAttribute("href", "https://compass.com");
    });

    it("opens in new tab with target blank", () => {
      render(<Experience {...baseProps} />);

      const link = screen.getByRole("link", { name: /@Compass/i });
      expect(link).toHaveAttribute("target", "_blank");
    });

    it("has security attributes for external link", () => {
      render(<Experience {...baseProps} />);

      const link = screen.getByRole("link", { name: /@Compass/i });
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Work tasks", () => {
    it("handles experience without work items", () => {
      const propsWithoutWork = {
        ...baseProps,
        work: undefined,
      };

      render(<Experience {...propsWithoutWork} />);

      // Should still render without error
      expect(
        screen.getByRole("heading", { level: 3, name: /FullStack Engineer/i })
      ).toBeInTheDocument();
    });
  });
});

describe("Experience molecule - Expand/Collapse (Story 3.2)", () => {
  const baseProps: Pick<
    JobExperience,
    "id" | "position" | "company" | "companyLink" | "time" | "address" | "work"
  > = {
    id: 2,
    position: "FullStack Engineer",
    company: "Compass",
    companyLink: "https://compass.com",
    time: "Dec 2021 - Aug 2022",
    address: "New York, United States",
    work: [
      {
        description: "Code maintenance and enhancement",
        tags: ["code maintenance", "enhancement"],
      },
      {
        description: "Database query optimization",
        tags: ["database", "performance"],
      },
    ],
  };

  describe("Expand/collapse toggle behavior", () => {
    it("shows expand button when work items exist", () => {
      render(<Experience {...baseProps} />);

      expect(
        screen.getByRole("button", { name: /show details/i })
      ).toBeInTheDocument();
    });

    it("does not show expand button when work items are empty", () => {
      const propsWithoutWork = { ...baseProps, work: undefined };
      render(<Experience {...propsWithoutWork} />);

      expect(
        screen.queryByRole("button", { name: /show details/i })
      ).not.toBeInTheDocument();
    });

    it("does not show expand button when work array is empty", () => {
      const propsWithEmptyWork = { ...baseProps, work: [] };
      render(<Experience {...propsWithEmptyWork} />);

      expect(
        screen.queryByRole("button", { name: /show details/i })
      ).not.toBeInTheDocument();
    });

    it("expands details section when button is clicked", () => {
      render(<Experience {...baseProps} />);

      const button = screen.getByRole("button", { name: /show details/i });
      fireEvent.click(button);

      expect(
        screen.getByText(/Code maintenance and enhancement/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Database query optimization/i)
      ).toBeInTheDocument();
    });

    it("collapses details section when button is clicked again", () => {
      render(<Experience {...baseProps} />);

      const button = screen.getByRole("button", { name: /show details/i });
      fireEvent.click(button); // expand
      fireEvent.click(screen.getByRole("button", { name: /hide details/i })); // collapse

      expect(
        screen.queryByText(/Code maintenance and enhancement/i)
      ).not.toBeInTheDocument();
    });

    it("changes button text based on expanded state", () => {
      render(<Experience {...baseProps} />);

      expect(screen.getByRole("button")).toHaveTextContent(/show details/i);

      fireEvent.click(screen.getByRole("button"));

      expect(screen.getByRole("button")).toHaveTextContent(/hide details/i);
    });
  });

  describe("Keyboard interaction", () => {
    it("toggles expand with Enter key", () => {
      render(<Experience {...baseProps} />);

      const button = screen.getByRole("button", { name: /show details/i });
      fireEvent.keyDown(button, { key: "Enter", code: "Enter" });

      expect(
        screen.getByText(/Code maintenance and enhancement/i)
      ).toBeInTheDocument();
    });

    it("toggles expand with Space key", () => {
      render(<Experience {...baseProps} />);

      const button = screen.getByRole("button", { name: /show details/i });
      fireEvent.keyDown(button, { key: " ", code: "Space" });

      expect(
        screen.getByText(/Code maintenance and enhancement/i)
      ).toBeInTheDocument();
    });
  });

  describe("Work items rendering as list", () => {
    it("renders work items as list items when expanded", () => {
      render(<Experience {...baseProps} />);

      fireEvent.click(screen.getByRole("button", { name: /show details/i }));

      const listItems = screen.getAllByRole("listitem");
      expect(listItems.length).toBeGreaterThanOrEqual(2);
    });

    it("displays all work descriptions", () => {
      render(<Experience {...baseProps} />);

      fireEvent.click(screen.getByRole("button", { name: /show details/i }));

      expect(
        screen.getByText(/Code maintenance and enhancement/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Database query optimization/i)
      ).toBeInTheDocument();
    });
  });

  describe("Technology tags display", () => {
    it("displays unique technology tags when expanded", () => {
      render(<Experience {...baseProps} />);

      fireEvent.click(screen.getByRole("button", { name: /show details/i }));

      expect(screen.getByText("code maintenance")).toBeInTheDocument();
      expect(screen.getByText("enhancement")).toBeInTheDocument();
      expect(screen.getByText("database")).toBeInTheDocument();
      expect(screen.getByText("performance")).toBeInTheDocument();
    });

    it("extracts unique tags without duplicates", () => {
      const propsWithDuplicateTags = {
        ...baseProps,
        work: [
          { description: "Task 1", tags: ["react", "typescript"] },
          { description: "Task 2", tags: ["react", "nodejs"] },
        ],
      };
      render(<Experience {...propsWithDuplicateTags} />);

      fireEvent.click(screen.getByRole("button", { name: /show details/i }));

      // Should only have one "react" tag
      const reactTags = screen.getAllByText("react");
      expect(reactTags).toHaveLength(1);
    });

    it("handles work items without tags gracefully", () => {
      const propsWithNoTags = {
        ...baseProps,
        work: [{ description: "Task without tags" }],
      };
      render(<Experience {...propsWithNoTags} />);

      fireEvent.click(screen.getByRole("button", { name: /show details/i }));

      expect(screen.getByText(/Task without tags/i)).toBeInTheDocument();
      // Should not throw error
    });
  });

  describe("Accessibility attributes", () => {
    it("has aria-expanded attribute set to false initially", () => {
      render(<Experience {...baseProps} />);

      const button = screen.getByRole("button", { name: /show details/i });
      expect(button).toHaveAttribute("aria-expanded", "false");
    });

    it("updates aria-expanded to true when expanded", () => {
      render(<Experience {...baseProps} />);

      const button = screen.getByRole("button", { name: /show details/i });
      fireEvent.click(button);

      expect(button).toHaveAttribute("aria-expanded", "true");
    });

    it("has aria-controls linking to expandable section", () => {
      render(<Experience {...baseProps} />);

      const button = screen.getByRole("button", { name: /show details/i });
      expect(button).toHaveAttribute("aria-controls", "experience-details-2");
    });

    it("expandable section has matching id", () => {
      render(<Experience {...baseProps} />);

      fireEvent.click(screen.getByRole("button", { name: /show details/i }));

      const detailsSection = document.getElementById("experience-details-2");
      expect(detailsSection).toBeInTheDocument();
    });
  });
});
