/**
 * Experience Component Tests
 * Story 3.1: Work History Timeline
 */

import React from "react";
import { render, screen } from "@testing-library/react";
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
  TransitionerLi: ({
    data,
    children,
  }: {
    data?: string;
    children: React.ReactNode;
  }) => (
    <li data-testid="transitioner-li">
      {children}
      {data && <p>{data}</p>}
    </li>
  ),
}));

import Experience from "../index";
import type { JobExperience } from "@/domains/job-experience";

describe("Experience molecule (Story 3.1)", () => {
  const baseProps: Pick<
    JobExperience,
    "position" | "company" | "companyLink" | "time" | "address" | "work"
  > = {
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
    it("renders work description as summary text", () => {
      render(<Experience {...baseProps} />);

      expect(
        screen.getByText(/Code maintenance and enhancement/i)
      ).toBeInTheDocument();
    });

    it("handles multiple work items", () => {
      const propsWithMultipleWork = {
        ...baseProps,
        work: [
          { description: "First task description" },
          { description: "Second task description" },
        ],
      };

      render(<Experience {...propsWithMultipleWork} />);

      // Work items are joined as a single string
      expect(
        screen.getByText(/First task description Second task description/i)
      ).toBeInTheDocument();
    });

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
